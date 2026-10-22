import { Router, Request, Response } from 'express';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { requireTenant } from '../../middlewares/tenant.middleware.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbProvisionService } from '../../services/db-provision.service.js';

function getFallbackDataFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'data/laravel_exported_data.json'),
    path.resolve(process.cwd(), 'backend/data/laravel_exported_data.json'),
    fileURLToPath(new URL('../../../data/laravel_exported_data.json', import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function getTenantPartitionFilePath(subdomain: string): string {
  const clean = subdomain.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const candidates = [
    path.resolve(process.cwd(), `data/tenants/tenant_${clean}.json`),
    path.resolve(process.cwd(), `backend/data/tenants/tenant_${clean}.json`),
    fileURLToPath(new URL(`../../../data/tenants/tenant_${clean}.json`, import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const router = Router();

// Get current tenant configuration & theme for storefront
router.get('/current', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    let modules: any[] = [];
    try {
      const dbOnline = await isDatabaseAvailable();
      if (dbOnline) {
        modules = await prisma.storeModule.findMany({
          where: { tenantId: tenant.id },
        });
      }
    } catch {}

    if (!modules || modules.length === 0) {
      modules = [
        { id: '1', tenantId: tenant.id, moduleKey: 'appointment_booking', isEnabled: tenant.businessType === 'healthcare_service' || tenant.businessType === 'beauty_salon' },
        { id: '2', tenantId: tenant.id, moduleKey: 'product_reviews', isEnabled: true },
        { id: '3', tenantId: tenant.id, moduleKey: 'dispute_system', isEnabled: true },
      ];
    }

    res.json({
      success: true,
      data: {
        ...tenant,
        themeConfig: tenant.themeConfig ? JSON.parse(tenant.themeConfig) : null,
        modules,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tenant configuration' });
  }
});

// Central Tenant Registration & Auto-provisioning
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, subdomain, businessType = 'fashion_clothing', adminName, email, password, phone } = req.body;

    if (!name || !subdomain || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const { getCategoryDefinition } = await import('../../config/categories.js');
    const { mailService } = await import('../../services/mail.service.js');
    const categoryDef = getCategoryDefinition(businessType);

    const hashedPassword = await bcrypt.hash(password, 10);
    let createdTenant: any = null;

    try {
      const existing = await prisma.tenant.findUnique({
        where: { subdomain: cleanSubdomain },
      });

      if (existing) {
        res.status(409).json({ success: false, message: 'Subdomain already taken. Please choose another.' });
        return;
      }

      const result = await prisma.$transaction(async (tx) => {
        const newTenant = await tx.tenant.create({
          data: {
            name,
            subdomain: cleanSubdomain,
            businessType,
            phone,
            email,
            currency: 'BDT',
            themeConfig: JSON.stringify({
              primaryColor: '#0ea5e9',
              fontFamily: 'Inter',
              heroTitle: categoryDef.heroTitle,
              heroSubtitle: categoryDef.heroSubtitle,
            }),
          },
        });

        const adminUser = await tx.user.create({
          data: {
            tenantId: newTenant.id,
            name: adminName || name,
            email,
            password: hashedPassword,
            phone,
            role: 'TENANT_ADMIN',
          },
        });

        // Seed category-specific default categories
        await tx.category.createMany({
          data: categoryDef.defaultCategories.map((catName, idx) => ({
            tenantId: newTenant.id,
            name: catName,
            slug: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            sortOrder: idx + 1,
          })),
        });

        // Seed store modules
        await tx.storeModule.createMany({
          data: [
            { tenantId: newTenant.id, moduleKey: 'appointment_booking', isEnabled: categoryDef.defaultModules.appointmentBooking },
            { tenantId: newTenant.id, moduleKey: 'product_reviews', isEnabled: categoryDef.defaultModules.productReviews },
            { tenantId: newTenant.id, moduleKey: 'dispute_system', isEnabled: categoryDef.defaultModules.disputeSystem },
          ],
        });

        return { tenant: newTenant, user: adminUser };
      });
      createdTenant = result.tenant;
    } catch (dbErr) {
      // Fallback file entry for offline database server
      const filePath = getFallbackDataFilePath();
      let data: any = { tenants: [] };
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
      
      const newEntry = {
        id: cleanSubdomain,
        name,
        subdomain: cleanSubdomain,
        businessType: categoryDef.id,
        archetype: categoryDef.archetype,
        domains: [`${cleanSubdomain}.localhost`],
        phone,
        email,
        categories: categoryDef.defaultCategories.map((c, i) => ({ id: `cat_${i+1}`, name: c, slug: c.toLowerCase().replace(/[^a-z0-9]/g, '-') })),
        brands: categoryDef.id === 'luxury_watches'
          ? [
              { id: 'brand_1', name: 'Rolex', slug: 'rolex', logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80' },
              { id: 'brand_2', name: 'Omega', slug: 'omega', logo: 'https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=120&q=80' },
              { id: 'brand_3', name: 'Patek Philippe', slug: 'patek-philippe', logo: null },
              { id: 'brand_4', name: 'Audemars Piguet', slug: 'audemars-piguet', logo: null },
              { id: 'brand_5', name: 'TAG Heuer', slug: 'tag-heuer', logo: null },
            ]
          : categoryDef.id === 'jewelry'
          ? [
              { id: 'brand_1', name: 'Cartier', slug: 'cartier', logo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=120&q=80' },
              { id: 'brand_2', name: 'Tanishq', slug: 'tanishq', logo: null },
              { id: 'brand_3', name: 'Tiffany & Co.', slug: 'tiffany-and-co', logo: null },
            ]
          : [
              { id: 'brand_1', name: 'Official Certified', slug: 'official-certified', logo: null },
              { id: 'brand_2', name: 'Signature Collection', slug: 'signature-collection', logo: null },
            ],
        items: categoryDef.sampleItems.map((item, i) => ({
          id: `item_${cleanSubdomain}_${i+1}`,
          title: item.title,
          slug: item.slug,
          shortDescription: item.shortDesc,
          description: `<p>${item.shortDesc}</p>`,
          price: item.price,
          comparePrice: item.comparePrice || null,
          stockQuantity: 20,
          itemType: item.itemType,
          images: [item.image],
        })),
      };

      data.tenants = [newEntry, ...(data.tenants || [])];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
      createdTenant = newEntry;
    }

    const initialCategories = categoryDef.defaultCategories.map((c, i) => ({ id: `cat_${i+1}`, name: c, slug: c.toLowerCase().replace(/[^a-z0-9]/g, '-') }));
    const initialBrands = categoryDef.id === 'luxury_watches'
      ? [
          { id: 'brand_1', name: 'Rolex', slug: 'rolex', logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80' },
          { id: 'brand_2', name: 'Omega', slug: 'omega', logo: 'https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=120&q=80' },
          { id: 'brand_3', name: 'Patek Philippe', slug: 'patek-philippe', logo: null },
          { id: 'brand_4', name: 'Audemars Piguet', slug: 'audemars-piguet', logo: null },
          { id: 'brand_5', name: 'TAG Heuer', slug: 'tag-heuer', logo: null },
        ]
      : categoryDef.id === 'jewelry'
      ? [
          { id: 'brand_1', name: 'Cartier', slug: 'cartier', logo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=120&q=80' },
          { id: 'brand_2', name: 'Tanishq', slug: 'tanishq', logo: null },
          { id: 'brand_3', name: 'Tiffany & Co.', slug: 'tiffany-and-co', logo: null },
        ]
      : [
          { id: 'brand_1', name: 'Official Certified', slug: 'official-certified', logo: null },
          { id: 'brand_2', name: 'Signature Collection', slug: 'signature-collection', logo: null },
        ];

    // 1. Dynamic Database Provisioning per Tenant with isolated partition seeding
    const dbConfig = await dbProvisionService.provisionTenantDatabase(
      cleanSubdomain,
      createdTenant.id || cleanSubdomain,
      {
        categories: initialCategories,
        brands: initialBrands,
        items: createdTenant.items || [],
        settings: {
          name,
          phone,
          email,
          currency: 'BDT',
          theme: 'modern_slate',
        },
      }
    );

    // 2. Dispatch Official Welcome Email with credentials and dedicated DB info
    const emailResult = await mailService.sendTenantWelcomeEmail({
      storeName: name,
      subdomain: cleanSubdomain,
      businessType: categoryDef.name,
      adminName: adminName || name,
      email,
      tempPassword: password,
      databaseName: dbConfig.dbName,
      engine: dbConfig.engine,
    });

    res.status(201).json({
      success: true,
      message: 'Store provisioned and activated successfully with dedicated database!',
      data: {
        tenantId: createdTenant.id,
        name: createdTenant.name,
        subdomain: createdTenant.subdomain,
        businessType,
        database: dbConfig,
        storeUrl: `http://localhost:3000/?tenant=${cleanSubdomain}`,
        adminUrl: `http://localhost:3000/admin/dashboard?tenant=${cleanSubdomain}`,
        emailNotification: emailResult,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Store registration failed' });
  }
});

// ==========================================
// CATEGORY MANAGEMENT (Tenant Admin)
// ==========================================

// Get All Categories
router.get('/categories', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    try {
      const dbOnline = await isDatabaseAvailable();
      if (dbOnline) {
        const categories = await prisma.category.findMany({
          where: { tenantId: tenant.id },
          include: { _count: { select: { items: true } } },
          orderBy: { sortOrder: 'asc' },
        });
        if (categories.length > 0) {
          res.json({ success: true, data: categories });
          return;
        }
      }
    } catch {}

    // Check dedicated tenant partition
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.categories && Array.isArray(pData.categories) && pData.categories.length > 0) {
          res.json({ success: true, data: pData.categories });
          return;
        }
      } catch {}
    }

    // Fallback file lookup
    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target && target.categories && target.categories.length > 0) {
        res.json({ success: true, data: target.categories });
        return;
      }
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Add Category
router.post('/categories', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { name, promoSlogan, bannerImage } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = {
      id: `cat_${Date.now()}`,
      name,
      slug,
      promoSlogan: promoSlogan || null,
      bannerImage: bannerImage || null,
    };

    try {
      await prisma.category.create({
        data: {
          tenantId: tenant.id,
          name,
          slug,
        },
      });
    } catch {}

    // Sync to dedicated tenant partition
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    const pDir = path.dirname(partitionFile);
    if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });

    let pData: any = null;
    if (fs.existsSync(partitionFile)) {
      try { pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8')); } catch {}
    }
    if (!pData) {
      pData = {
        tenant: { id: tenant.id, name: tenant.name, subdomain: tenant.subdomain },
        categories: [],
        brands: [],
        items: [],
      };
    }
    if (!pData.categories) pData.categories = [];
    pData.categories.push(newCat);
    fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));

    // Fallback in json
    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target) {
        if (!target.categories) target.categories = [];
        target.categories.push(newCat);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 4));
      }
    }

    res.status(201).json({ success: true, data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// Delete Category
router.delete('/categories/:id', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { id } = req.params;

    try {
      await prisma.category.deleteMany({
        where: { id, tenantId: tenant.id },
      });
    } catch {}

    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.categories) {
          pData.categories = pData.categories.filter((c: any) => c.id !== id && c.slug !== id);
          fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
        }
      } catch {}
    }

    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target && target.categories) {
        target.categories = target.categories.filter((c: any) => c.id !== id && c.slug !== id);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 4));
      }
    }

    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// ==========================================
// BRAND MANAGEMENT (Tenant Admin)
// ==========================================

// Get All Brands
router.get('/brands', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    try {
      const dbOnline = await isDatabaseAvailable();
      if (dbOnline) {
        const brands = await prisma.brand.findMany({
          where: { tenantId: tenant.id },
          include: { _count: { select: { items: true } } },
          orderBy: { name: 'asc' },
        });
        if (brands.length > 0) {
          res.json({ success: true, data: brands });
          return;
        }
      }
    } catch {}

    // Check dedicated tenant partition
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.brands && Array.isArray(pData.brands)) {
          res.json({ success: true, data: pData.brands });
          return;
        }
      } catch {}
    }

    // Fallback in json
    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target && target.brands) {
        res.json({ success: true, data: target.brands });
        return;
      }
    }

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch brands' });
  }
});

// Add Brand
router.post('/brands', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { name, logo } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Brand name is required' });
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newBrand = { id: `brand_${Date.now()}`, name, slug, logo: logo || null };

    try {
      await prisma.brand.create({
        data: {
          tenantId: tenant.id,
          name,
          slug,
          logo: logo || null,
        },
      });
    } catch {}

    // Sync to dedicated tenant partition
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (!pData.brands) pData.brands = [];
        pData.brands.push(newBrand);
        fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
      } catch {}
    }

    // Fallback file persistence
    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target) {
        if (!target.brands) target.brands = [];
        target.brands.push(newBrand);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 4));
      }
    }

    res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create brand' });
  }
});

// Delete Brand
router.delete('/brands/:id', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { id } = req.params;

    try {
      await prisma.brand.deleteMany({
        where: { id, tenantId: tenant.id },
      });
    } catch {}

    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.brands) {
          pData.brands = pData.brands.filter((b: any) => b.id !== id && b.slug !== id);
          fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
        }
      } catch {}
    }

    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target && target.brands) {
        target.brands = target.brands.filter((b: any) => b.id !== id && b.slug !== id);
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 4));
      }
    }

    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete brand' });
  }
});

// ==========================================
// STORE SETTINGS UPDATE (Tenant Admin)
// ==========================================
router.put('/settings', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { name, phone, email, address, announcementText, bannerImage, themeConfig } = req.body;

    try {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          name: name || undefined,
          phone: phone || undefined,
          email: email || undefined,
          address: address || undefined,
          announcementText: announcementText || undefined,
          bannerImage: bannerImage || undefined,
          themeConfig: themeConfig ? JSON.stringify(themeConfig) : undefined,
        },
      });
    } catch {}

    // Dedicated tenant partition update
    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (!pData.settings) pData.settings = {};
        if (name) pData.settings.name = name;
        if (phone) pData.settings.phone = phone;
        if (email) pData.settings.email = email;
        if (address) pData.settings.address = address;
        if (announcementText !== undefined) pData.settings.announcementText = announcementText;
        if (bannerImage) pData.settings.bannerImage = bannerImage;
        if (themeConfig) pData.settings.themeConfig = themeConfig;
        fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
      } catch {}
    }

    // Fallback file persistence
    const filePath = getFallbackDataFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === tenant.subdomain);
      if (target) {
        if (name) target.name = name;
        if (phone) target.phone = phone;
        if (email) target.email = email;
        if (address) target.address = address;
        if (announcementText !== undefined) target.announcementText = announcementText;
        if (bannerImage) target.bannerImage = bannerImage;
        if (themeConfig) target.themeConfig = themeConfig;
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 4));
        res.json({ success: true, message: 'Store settings updated successfully', data: target });
        return;
      }
    }

    res.json({ success: true, message: 'Store settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update store settings' });
  }
});

// ==========================================
// CATEGORY-WISE MEDIA & VIDEO GALLERY
// ==========================================

function parseVideoEmbedUrl(url: string, type: string): { embedUrl: string; thumbnail?: string } {
  if (!url) return { embedUrl: '' };

  if (type === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    } else if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([^&#]+)/);
      if (match) videoId = match[1];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('youtube.com/shorts/')[1].split('?')[0].split('&')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0].split('&')[0];
    }
    if (videoId) {
      return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
  }

  if (type === 'FACEBOOK' || url.includes('facebook.com') || url.includes('fb.watch')) {
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(url)}&show_text=false&width=560`,
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    };
  }

  return { embedUrl: url, thumbnail: url };
}

// Get Media items
router.get('/media', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { categoryId, type } = req.query;

    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    let mediaList: any[] = [];
    let pData: any = null;

    if (fs.existsSync(partitionFile)) {
      try {
        pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.media && Array.isArray(pData.media)) {
          mediaList = pData.media;
        }
      } catch {}
    }

    if (mediaList.length === 0) {
      // Default initial showcase media
      const isLeather = (tenant.subdomain || '').toLowerCase().includes('leather');
      const isWatch = (tenant.subdomain || '').toLowerCase().includes('watch');

      mediaList = [
        {
          id: `med_${Date.now()}_1`,
          title: isLeather
            ? 'Handcrafted Full-Grain Leather Craftsmanship & Quality Test'
            : isWatch
            ? 'Swiss Luxury Automatic Movement & Precision Assembly'
            : 'Exclusive Designer Collection & Fabric Review',
          categoryId: isLeather ? 'cat_1792501496055' : 'all',
          categoryName: isLeather ? 'Handcrafted Leather Bags' : 'Featured Collection',
          type: 'YOUTUBE',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0',
          thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
          createdAt: new Date().toISOString(),
        },
        {
          id: `med_${Date.now()}_2`,
          title: 'Customer Unboxing & Genuine Quality Review Live Video',
          categoryId: 'all',
          categoryName: 'General Highlights',
          type: 'FACEBOOK',
          url: 'https://www.facebook.com/facebook/videos/10153231379946729/',
          embedUrl: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F&show_text=false&width=560',
          thumbnail: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
          createdAt: new Date().toISOString(),
        },
      ];

      if (!pData) {
        pData = {
          tenantId: tenant.id,
          subdomain: tenant.subdomain,
          categories: [],
          brands: [],
          items: [],
          media: [],
        };
      }
      pData.media = mediaList;
      try {
        const pDir = path.dirname(partitionFile);
        if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });
        fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
      } catch {}
    }

    let filtered = [...mediaList];
    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter(
        (m) => m.categoryId === categoryId || m.categoryId === 'all'
      );
    }
    if (type && type !== 'all') {
      filtered = filtered.filter((m) => m.type === type);
    }

    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch media' });
  }
});

// Add Media item (Image, YouTube Video, Facebook Video)
router.post('/media', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { title, categoryId = 'all', categoryName = 'General', type = 'YOUTUBE', url, description } = req.body;

    if (!title || !url) {
      res.status(400).json({ success: false, message: 'Title and Media URL are required' });
      return;
    }

    const { embedUrl, thumbnail } = parseVideoEmbedUrl(url, type);

    const newMedia = {
      id: `med_${Date.now()}`,
      title,
      categoryId,
      categoryName,
      type,
      url,
      embedUrl,
      thumbnail: thumbnail || url,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    let pData: any = null;
    if (fs.existsSync(partitionFile)) {
      pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
    } else {
      pData = { tenantId: tenant.id, subdomain: tenant.subdomain, categories: [], brands: [], items: [], media: [] };
    }
    if (!pData.media) pData.media = [];
    pData.media.unshift(newMedia);
    fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));

    res.status(201).json({
      success: true,
      message: 'Media added successfully',
      data: newMedia,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create media item' });
  }
});

// Delete Media item
router.delete('/media/:id', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const { id } = req.params;

    const partitionFile = getTenantPartitionFilePath(tenant.subdomain);
    if (fs.existsSync(partitionFile)) {
      const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
      if (pData.media) {
        pData.media = pData.media.filter((m: any) => m.id !== id);
        fs.writeFileSync(partitionFile, JSON.stringify(pData, null, 2));
      }
    }

    res.json({ success: true, message: 'Media removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete media item' });
  }
});

// ==========================================
// DEDICATED DATABASE TELEMETRY
// ==========================================
router.get('/db-status', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenant = req.tenant!;
    const dbStatus = await dbProvisionService.getTenantDbStatus(tenant.subdomain);
    res.json({
      success: true,
      data: {
        ...dbStatus,
        tenantName: tenant.name,
        isolationLevel: 'Dedicated Database Isolation (Database-per-Tenant)',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch database status' });
  }
});

export default router;
