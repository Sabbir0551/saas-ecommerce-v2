import { Router, Request, Response } from 'express';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { requireTenant } from '../../middlewares/tenant.middleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORY_SCHEMAS, getCategorySchema } from '../../config/categorySchemas.js';

function getTenantPartitionFilePath(subdomain: string): string {
  const clean = subdomain.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const candidates = [
    path.resolve(process.cwd(), `backend/data/tenants/tenant_${clean}.json`),
    path.resolve(process.cwd(), `data/tenants/tenant_${clean}.json`),
    fileURLToPath(new URL(`../../../data/tenants/tenant_${clean}.json`, import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const router = Router();

// Get all category schemas
router.get('/schemas', async (_req: Request, res: Response) => {
  const schemasList = Object.values(CATEGORY_SCHEMAS).map(s => ({
    categoryKey: s.categoryKey,
    name_bn: s.name_bn,
    name_en: s.name_en,
    icon: s.icon,
    orderType: s.orderType,
    fieldsCount: s.fields.length,
  }));
  res.json({ success: true, data: schemasList });
});

// Get specific category schema
router.get('/schemas/:categoryKey', async (req: Request, res: Response) => {
  const { categoryKey } = req.params;
  const schema = getCategorySchema(categoryKey);
  res.json({ success: true, data: schema });
});

function getFallbackData(tenantIdentifier: string) {
  try {
    const cleanSub = tenantIdentifier.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const CATEGORY_MAP: Record<string, string> = {
      electronics: 'smartvolt',
      electric: 'smartvolt',
      electrical: 'smartvolt',
      laptop_computers: 'bestlaptop',
      laptop_computer: 'bestlaptop',
      laptops: 'bestlaptop',
      healthcare_service: 'medicare',
      healthcare: 'medicare',
      clinic: 'medicare',
      dental: 'medicare',
      real_estate: 'aebanproperty',
      property: 'aebanproperty',
      fashion_clothing: 'fashion',
      fashion: 'fashion',
      luxury_watches: 'apexwatches',
      watches: 'apexwatches',
      jewelry: 'royaldiamond',
      restaurant_cafe: 'chillibite',
      restaurant: 'chillibite',
      food: 'chillibite',
      pharmacy: 'pharmaexpress',
      pet_care: 'petshopbd',
      beauty_salon: 'makeover',
      agriculture_dairy: 'greenagro',
      furniture_decor: 'luxewood',
      software_saas: 'devnexus',
      education_coaching: 'eduexcel',
      consulting_firm: 'advisorypro',
    };

    const targetSub = (!fs.existsSync(getTenantPartitionFilePath(cleanSub)) && CATEGORY_MAP[cleanSub]) 
      ? CATEGORY_MAP[cleanSub] 
      : cleanSub;

    // 1. Check dedicated tenant partition first
    const partitionFile = getTenantPartitionFilePath(targetSub);
    if (fs.existsSync(partitionFile)) {
      try {
        const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
        if (pData.items && Array.isArray(pData.items)) {
          return {
            categories: (pData.categories || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              promoSlogan: c.promoSlogan,
              bannerImage: c.bannerImage,
              parentId: c.parentId || null,
              _count: { items: 0 },
            })),
            brands: pData.brands || [],
            items: pData.items.map((item: any) => ({
              ...item,
              tenantId: cleanSub,
              isActive: true,
              images: Array.isArray(item.images)
                ? item.images
                : [item.images || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
            })),
          };
        }
      } catch {}
    }

    // 2. Check laravel_exported_data.json
    const candidatePaths = [
      path.resolve(process.cwd(), 'data/laravel_exported_data.json'),
      path.resolve(process.cwd(), 'backend/data/laravel_exported_data.json'),
      new URL('../../../data/laravel_exported_data.json', import.meta.url),
      new URL('../../data/laravel_exported_data.json', import.meta.url),
    ];
    let raw: string | null = null;
    for (const p of candidatePaths) {
      try {
        if (typeof p === 'string' ? fs.existsSync(p) : fs.existsSync(p)) {
          raw = fs.readFileSync(p, 'utf-8');
          break;
        }
      } catch {}
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      const tenant = parsed.tenants.find(
        (t: any) => t.id === tenantIdentifier || t.subdomain === cleanSub
      );
      if (tenant) {
        return {
          categories: (tenant.categories || []).map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            _count: { items: 0 },
          })),
          brands: tenant.brands || [],
          items: (tenant.items || []).map((item: any) => ({
            ...item,
            tenantId: tenant.id,
            isActive: true,
            itemType: item.itemType || (tenant.businessType === 'healthcare_service' ? 'SERVICE_APPOINTMENT' : 'PHYSICAL_PRODUCT'),
            images: (item.images || []).map((img: string) => 
              img.startsWith('http') ? img : `/storage/${img.replace(/^\/+/, '')}`
            ),
          })),
        };
      }
    }
  } catch (err) {
    console.error('Fallback read error:', err);
  }
  return null;
}

// List products / services for the current tenant
router.get('/items', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  const { category, type, featured, search, limit = '100', page = '1' } = req.query;
  const take = parseInt(limit as string, 10);
  const skip = (parseInt(page as string, 10) - 1) * take;

  try {
    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      const where: any = {
        tenantId: tenant.id,
        isActive: true,
      };

      if (category) {
        where.category = { slug: category as string };
      }
      if (type) {
        where.itemType = type as string;
      }
      if (featured === 'true') {
        where.isFeatured = true;
      }
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { shortDescription: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.item.findMany({
          where,
          include: {
            category: { select: { id: true, name: true, slug: true } },
            brand: { select: { id: true, name: true, slug: true, logo: true } },
            variants: true,
          },
          orderBy: { createdAt: 'desc' },
          take,
          skip,
        }),
        prisma.item.count({ where }),
      ]);

      if (items.length > 0) {
        const formattedItems = items.map((item) => ({
          ...item,
          images: JSON.parse(item.images || '[]'),
        }));

        res.json({
          success: true,
          data: formattedItems,
          pagination: {
            total,
            page: parseInt(page as string, 10),
            limit: take,
            totalPages: Math.ceil(total / take),
          },
        });
        return;
      }
    }
  } catch (error) {
    // DB offline, proceed to fallback
  }

  // Fallback to dedicated partition or exported dataset
  const fallback = getFallbackData(tenant.subdomain || tenant.id);
  if (fallback && fallback.items.length > 0) {
    let filtered = [...fallback.items];

    // Category filter
    if (category) {
      const catSlug = (category as string).toLowerCase();
      filtered = filtered.filter(i => {
        const itemCatSlug = (i.category?.slug || i.categorySlug || '').toLowerCase();
        const itemCatName = (i.category?.name || i.category || '').toLowerCase();
        const itemCatId = (i.categoryId || '').toLowerCase();
        return itemCatSlug === catSlug || itemCatName === catSlug || itemCatId === catSlug || itemCatSlug.includes(catSlug);
      });
    }

    // Featured filter
    if (featured === 'true') {
      filtered = filtered.filter(i => i.isFeatured);
    }

    // Type filter
    if (type) {
      filtered = filtered.filter(i => i.itemType === type);
    }

    // Search filter
    if (search) {
      const s = (search as string).toLowerCase();
      filtered = filtered.filter(i => 
        i.title?.toLowerCase().includes(s) || i.shortDescription?.toLowerCase().includes(s)
      );
    }

    const paginated = filtered.slice(skip, skip + take);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total: filtered.length,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(filtered.length / take),
      },
    });
    return;
  }

  res.json({
    success: true,
    data: [],
    pagination: { total: 0, page: 1, limit: take, totalPages: 0 },
  });
});

// Get single product / service by slug
router.get('/items/:slug', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  const { slug } = req.params;

  try {
    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      const item = await prisma.item.findFirst({
        where: {
          tenantId: tenant.id,
          OR: [
            { slug },
            { id: slug },
          ],
        },
        include: {
          category: true,
          brand: true,
          variants: true,
          reviews: {
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (item && item.isActive) {
        res.json({
          success: true,
          data: {
            ...item,
            images: JSON.parse(item.images || '[]'),
          },
        });
        return;
      }
    }
  } catch (error) {
    // DB offline, proceed to fallback
  }

  // Fallback
  const fallback = getFallbackData(tenant.subdomain || tenant.id);
  if (fallback) {
    const found = fallback.items.find((i: any) => i.slug === slug || i.id === slug);
    if (found) {
      res.json({
        success: true,
        data: found,
      });
      return;
    }
  }

  res.status(404).json({ success: false, message: 'Product or Service not found' });
});

// Add new product / service to a category
router.post('/items', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  const {
    title,
    categoryId,
    brandId,
    price,
    comparePrice,
    stockQuantity = 10,
    itemType = 'PHYSICAL_PRODUCT',
    shortDescription,
    description,
    images = [],
    isFeatured = false,
    sku,
    specifications,
    customAttributes,
    variants,
    badge,
  } = req.body;

  if (!title || price === undefined) {
    res.status(400).json({ success: false, message: 'Product title and price are required' });
    return;
  }

  const cleanSub = (tenant.subdomain || tenant.id).toLowerCase().replace(/[^a-z0-9_]/g, '');
  const slug = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
  const imageList = Array.isArray(images) ? images : (images ? [images] : []);

  // Find category details if categoryId is provided
  let categoryObj: any = null;
  const partitionPath = getTenantPartitionFilePath(cleanSub);
  let partitionData: any = null;
  if (fs.existsSync(partitionPath)) {
    try {
      partitionData = JSON.parse(fs.readFileSync(partitionPath, 'utf-8'));
      if (partitionData.categories) {
        categoryObj = partitionData.categories.find((c: any) => c.id === categoryId || c.slug === categoryId || c.name === categoryId);
      }
    } catch {}
  }

  // Subscription Status & Product Quota Gatekeeper
  if (tenant.subscription && tenant.subscription.status === 'suspended') {
    res.status(403).json({
      success: false,
      message: 'Store subscription is currently suspended or past due. Please contact Super-Admin to reactivate.',
    });
    return;
  }

  const maxAllowedProducts = tenant.features?.maxProducts || 500;
  const currentProductsCount = Array.isArray(partitionData?.items) ? partitionData.items.length : 0;
  if (currentProductsCount >= maxAllowedProducts) {
    res.status(403).json({
      success: false,
      message: `Product limit reached (${currentProductsCount}/${maxAllowedProducts} items). Please upgrade your subscription tier in 'Subscription & Limits' to add more items.`,
    });
    return;
  }

  let brandObj: any = null;
  if (partitionData?.brands && brandId) {
    brandObj = partitionData.brands.find((b: any) => b.id === brandId || b.slug === brandId || b.name === brandId);
  }

  const cleanCustomAttributes = typeof customAttributes === 'object' && customAttributes !== null ? customAttributes : {};

  const newItem: any = {
    id: `item_${cleanSub}_${Date.now()}`,
    tenantId: tenant.id,
    categoryId: categoryObj?.id || categoryId || null,
    category: categoryObj ? { id: categoryObj.id, name: categoryObj.name, slug: categoryObj.slug, promoSlogan: categoryObj.promoSlogan } : null,
    brandId: brandObj?.id || brandId || null,
    brand: brandObj ? { id: brandObj.id, name: brandObj.name, slug: brandObj.slug, logo: brandObj.logo } : null,
    title,
    slug,
    shortDescription: shortDescription || title,
    description: description || `<p>${shortDescription || title}</p>`,
    price: Number(price),
    comparePrice: comparePrice ? Number(comparePrice) : null,
    stockQuantity: Number(stockQuantity),
    itemType,
    images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    isFeatured: Boolean(isFeatured),
    isActive: true,
    sku: sku || `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    specifications: specifications || null,
    customAttributes: cleanCustomAttributes,
    variants: Array.isArray(variants) ? variants : (typeof variants === 'string' && variants.trim() ? variants.split(',').map((v: string) => v.trim()).filter(Boolean) : null),
    badge: badge || null,
    createdAt: new Date().toISOString(),
  };

  // 1. Try Prisma DB if online
  try {
    await prisma.item.create({
      data: {
        tenantId: tenant.id,
        categoryId: categoryObj?.id || undefined,
        brandId: brandObj?.id || undefined,
        title,
        slug,
        shortDescription,
        description,
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : null,
        stockQuantity: Number(stockQuantity),
        itemType,
        images: JSON.stringify(newItem.images),
        isFeatured: Boolean(isFeatured),
        isActive: true,
        sku: newItem.sku,
        customAttributes: cleanCustomAttributes,
      },
    });
  } catch {}


  // 2. Persist to dedicated tenant partition (ensure folder & structure exist)
  const partDir = path.dirname(partitionPath);
  if (!fs.existsSync(partDir)) fs.mkdirSync(partDir, { recursive: true });

  if (!partitionData) {
    if (fs.existsSync(partitionPath)) {
      try { partitionData = JSON.parse(fs.readFileSync(partitionPath, 'utf-8')); } catch {}
    }
  }
  if (!partitionData) {
    partitionData = {
      tenant: { id: tenant.id, name: tenant.name, subdomain: cleanSub },
      categories: [],
      brands: [],
      items: [],
    };
  }
  if (!partitionData.items) partitionData.items = [];
  partitionData.items.unshift(newItem);
  fs.writeFileSync(partitionPath, JSON.stringify(partitionData, null, 2));

  // 3. Persist to laravel_exported_data.json
  const exportCandidates = [
    path.resolve(process.cwd(), 'data/laravel_exported_data.json'),
    path.resolve(process.cwd(), 'backend/data/laravel_exported_data.json'),
  ];
  for (const expPath of exportCandidates) {
    if (fs.existsSync(expPath)) {
      try {
        const raw = fs.readFileSync(expPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === cleanSub);
        if (target) {
          if (!target.items) target.items = [];
          target.items.unshift(newItem);
          fs.writeFileSync(expPath, JSON.stringify(parsed, null, 4));
        }
      } catch {}
    }
  }

  res.status(201).json({
    success: true,
    message: 'Product added successfully to category!',
    data: newItem,
  });
});

// Update product / item
router.put('/items/:id', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  const { id } = req.params;
  const {
    title,
    categoryId,
    brandId,
    price,
    comparePrice,
    stockQuantity,
    itemType,
    shortDescription,
    description,
    images,
    isFeatured,
    sku,
    specifications,
    customAttributes,
    variants,
    badge,
    videoUrl,
  } = req.body;

  const cleanSub = (tenant.subdomain || tenant.id).toLowerCase().replace(/[^a-z0-9_]/g, '');
  const partitionPath = getTenantPartitionFilePath(cleanSub);
  let partitionData: any = null;
  let categoryObj: any = null;
  let brandObj: any = null;

  if (fs.existsSync(partitionPath)) {
    try {
      partitionData = JSON.parse(fs.readFileSync(partitionPath, 'utf-8'));
      if (partitionData.categories && categoryId) {
        categoryObj = partitionData.categories.find(
          (c: any) => c.id === categoryId || c.slug === categoryId || c.name === categoryId
        );
      }
      if (partitionData.brands && brandId) {
        brandObj = partitionData.brands.find(
          (b: any) => b.id === brandId || b.slug === brandId || b.name === brandId
        );
      }
    } catch {}
  }

  // 1. Update in Prisma if online
  try {
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (categoryObj?.id || categoryId) updateData.categoryId = categoryObj?.id || categoryId;
    if (brandObj?.id || brandId) updateData.brandId = brandObj?.id || brandId;
    if (price !== undefined) updateData.price = Number(price);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? Number(comparePrice) : null;
    if (stockQuantity !== undefined) updateData.stockQuantity = Number(stockQuantity);
    if (itemType !== undefined) updateData.itemType = itemType;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = JSON.stringify(Array.isArray(images) ? images : [images]);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (sku !== undefined) updateData.sku = sku;
    if (customAttributes !== undefined) updateData.customAttributes = customAttributes;

    await prisma.item.updateMany({
      where: { id, tenantId: tenant.id },
      data: updateData,
    });
  } catch {}

  // 2. Update in dedicated tenant partition
  let updatedItem: any = null;
  if (fs.existsSync(partitionPath)) {
    try {
      if (!partitionData) partitionData = JSON.parse(fs.readFileSync(partitionPath, 'utf-8'));
      if (partitionData.items && Array.isArray(partitionData.items)) {
        const idx = partitionData.items.findIndex(
          (item: any) => item.id === id || item.slug === id
        );
        if (idx !== -1) {
          const it = partitionData.items[idx];
          if (title !== undefined) it.title = title;
          if (categoryId !== undefined) {
            it.categoryId = categoryObj?.id || categoryId || null;
            it.category = categoryObj
              ? { id: categoryObj.id, name: categoryObj.name, slug: categoryObj.slug, promoSlogan: categoryObj.promoSlogan }
              : null;
          }
          if (brandId !== undefined) {
            it.brandId = brandObj?.id || brandId || null;
            it.brand = brandObj
              ? { id: brandObj.id, name: brandObj.name, slug: brandObj.slug, logo: brandObj.logo }
              : null;
          }
          if (price !== undefined) it.price = Number(price);
          if (comparePrice !== undefined) it.comparePrice = comparePrice ? Number(comparePrice) : null;
          if (stockQuantity !== undefined) it.stockQuantity = Number(stockQuantity);
          if (itemType !== undefined) it.itemType = itemType;
          if (shortDescription !== undefined) it.shortDescription = shortDescription;
          if (description !== undefined) it.description = description;
          if (images !== undefined) {
            it.images = Array.isArray(images) ? images : (images ? [images] : it.images);
          }
          if (isFeatured !== undefined) it.isFeatured = Boolean(isFeatured);
          if (sku !== undefined) it.sku = sku;
          if (specifications !== undefined) it.specifications = specifications;
          if (customAttributes !== undefined) it.customAttributes = customAttributes;
          if (variants !== undefined) {
            it.variants = Array.isArray(variants)
              ? variants
              : (typeof variants === 'string' && variants.trim()
                  ? variants.split(',').map((v: string) => v.trim()).filter(Boolean)
                  : null);
          }
          if (badge !== undefined) it.badge = badge;
          if (videoUrl !== undefined) it.videoUrl = videoUrl;
          it.updatedAt = new Date().toISOString();

          updatedItem = it;
          fs.writeFileSync(partitionPath, JSON.stringify(partitionData, null, 2));
        }
      }
    } catch (err) {
      console.error('Error updating partition item:', err);
    }
  }

  // 3. Update in laravel_exported_data.json
  const exportCandidates = [
    path.resolve(process.cwd(), 'data/laravel_exported_data.json'),
    path.resolve(process.cwd(), 'backend/data/laravel_exported_data.json'),
  ];
  for (const expPath of exportCandidates) {
    if (fs.existsSync(expPath)) {
      try {
        const raw = fs.readFileSync(expPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === cleanSub);
        if (target && target.items) {
          const idx = target.items.findIndex((item: any) => item.id === id || item.slug === id);
          if (idx !== -1 && updatedItem) {
            target.items[idx] = { ...target.items[idx], ...updatedItem };
            fs.writeFileSync(expPath, JSON.stringify(parsed, null, 4));
          }
        }
      } catch {}
    }
  }

  if (!updatedItem) {
    res.status(404).json({ success: false, message: 'Product not found to update' });
    return;
  }

  res.json({
    success: true,
    message: 'Product updated successfully!',
    data: updatedItem,
  });
});

router.patch('/items/:id', async (req: Request, res: Response, next: any) => {
  // Delegate patch to put handler
  return (router as any).handle(req, res, next);
});

// Delete product / item
router.delete('/items/:id', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  const { id } = req.params;
  const cleanSub = (tenant.subdomain || tenant.id).toLowerCase().replace(/[^a-z0-9_]/g, '');

  try {
    await prisma.item.deleteMany({
      where: { id, tenantId: tenant.id },
    });
  } catch {}

  // 1. Delete from dedicated tenant partition
  const partitionPath = path.resolve(process.cwd(), `data/tenants/tenant_${cleanSub}.json`);
  if (fs.existsSync(partitionPath)) {
    try {
      const pData = JSON.parse(fs.readFileSync(partitionPath, 'utf-8'));
      if (pData.items) {
        pData.items = pData.items.filter((item: any) => item.id !== id && item.slug !== id);
        fs.writeFileSync(partitionPath, JSON.stringify(pData, null, 2));
      }
    } catch {}
  }

  // 2. Delete from laravel_exported_data.json
  const exportCandidates = [
    path.resolve(process.cwd(), 'data/laravel_exported_data.json'),
    path.resolve(process.cwd(), 'backend/data/laravel_exported_data.json'),
  ];
  for (const expPath of exportCandidates) {
    if (fs.existsSync(expPath)) {
      try {
        const raw = fs.readFileSync(expPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const target = parsed.tenants.find((t: any) => t.id === tenant.id || t.subdomain === cleanSub);
        if (target && target.items) {
          target.items = target.items.filter((item: any) => item.id !== id && item.slug !== id);
          fs.writeFileSync(expPath, JSON.stringify(parsed, null, 4));
        }
      } catch {}
    }
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// List categories
router.get('/categories', requireTenant, async (req: Request, res: Response) => {
  const tenant = req.tenant!;
  try {
    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      const categories = await prisma.category.findMany({
        where: { tenantId: tenant.id },
        include: {
          _count: { select: { items: true } },
        },
        orderBy: { sortOrder: 'asc' },
      });

      if (categories.length > 0) {
        res.json({ success: true, data: categories });
        return;
      }
    }
  } catch (error) {
    // DB offline, proceed to fallback
  }

  const fallback = getFallbackData(tenant.subdomain || tenant.id);
  res.json({ success: true, data: fallback?.categories || [] });
});

export default router;

