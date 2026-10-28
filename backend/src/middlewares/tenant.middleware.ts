import { Request, Response, NextFunction } from 'express';
import { prisma, isDatabaseAvailable } from '../config/db.js';
import { cache } from '../config/redis.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export interface TenantData {
  id: string;
  name: string;
  subdomain: string;
  customDomain: string | null;
  businessType: string;
  logo: string | null;
  bannerImage: string | null;
  announcementText: string | null;
  currency: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  themeConfig: string | null;
  settings?: any;
  subscription?: any;
  features?: any;
  merchantProfile?: any;
  isActive: boolean;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantData;
    }
  }
}

function getTenantPartitionFilePath(subdomain: string): string {
  const clean = subdomain.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const candidates = [
    path.resolve(process.cwd(), `backend/data/tenants/tenant_${clean}.json`),
    path.resolve(process.cwd(), `data/tenants/tenant_${clean}.json`),
    fileURLToPath(new URL(`../../data/tenants/tenant_${clean}.json`, import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function getMigratedJsonFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'backend/data/laravel_exported_data.json'),
    path.resolve(process.cwd(), 'data/laravel_exported_data.json'),
    fileURLToPath(new URL('../../data/laravel_exported_data.json', import.meta.url)),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const host = req.headers.host || '';
    const xTenantHeader = (req.headers['x-tenant-slug'] || req.headers['x-tenant-id']) as string | undefined;
    const queryTenant = req.query.tenant as string | undefined;

    let tenantIdentifier = xTenantHeader || queryTenant;

    if (!tenantIdentifier && host) {
      const hostname = host.split(':')[0]; // strip port
      // e.g. store1.localhost or store1.domain.com
      const parts = hostname.split('.');
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost' && parts[0] !== 'api') {
        tenantIdentifier = parts[0];
      }
    }

    if (!tenantIdentifier) {
      // Default fallback for development/demo if not explicitly passed
      tenantIdentifier = 'fashion';
    }

    const cleanSub = tenantIdentifier.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cacheKey = `tenant:${cleanSub}`;
    const cachedTenant = await cache.get(cacheKey);

    if (cachedTenant) {
      req.tenant = JSON.parse(cachedTenant);
      return next();
    }

    let tenant: any = null;

    // 1. Try PostgreSQL if available
    const dbOnline = await isDatabaseAvailable();
    if (dbOnline) {
      try {
        tenant = await prisma.tenant.findFirst({
          where: {
            OR: [
              { subdomain: cleanSub },
              { customDomain: cleanSub },
              { id: cleanSub },
            ],
            isActive: true,
          },
        });
      } catch {}
    }

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
      villa: 'aebanproperty',
      fashion_clothing: 'fashion',
      fashion: 'fashion',
      clothing: 'fashion',
      luxury_watches: 'apexwatches',
      watches: 'apexwatches',
      jewelry: 'royaldiamond',
      restaurant_cafe: 'chillibite',
      restaurant: 'chillibite',
      food: 'chillibite',
      pharmacy: 'pharmaexpress',
      medicine: 'pharmaexpress',
      pet_care: 'petshopbd',
      pet_food: 'petshopbd',
      beauty_salon: 'makeover',
      salon: 'makeover',
      agriculture_dairy: 'greenagro',
      agro: 'greenagro',
      furniture_decor: 'luxewood',
      furniture: 'luxewood',
      software_saas: 'devnexus',
      education_coaching: 'eduexcel',
      consulting_firm: 'advisorypro',
    };

    const targetSub = (!fs.existsSync(getTenantPartitionFilePath(cleanSub)) && CATEGORY_MAP[cleanSub]) 
      ? CATEGORY_MAP[cleanSub] 
      : cleanSub;

    // 2. Check dedicated tenant partition file (fast, self-contained)
    if (!tenant) {
      const partitionFile = getTenantPartitionFilePath(targetSub);
      if (fs.existsSync(partitionFile)) {
        try {
          const pData = JSON.parse(fs.readFileSync(partitionFile, 'utf-8'));
          const s = pData.settings || {};
          const resolvedBusinessType = pData.businessType || s.businessType || (
            targetSub === 'medicare' ? 'healthcare_service' :
            targetSub === 'aebanproperty' ? 'real_estate' :
            targetSub === 'smartvolt' || targetSub.includes('electric') ? 'electronics' :
            targetSub === 'bestlaptop' ? 'laptop_computer' :
            targetSub === 'apexwatches' ? 'luxury_watches' :
            targetSub === 'royaldiamond' ? 'jewelry' :
            targetSub === 'petshopbd' ? 'pet_care' :
            targetSub === 'chillibite' ? 'restaurant_cafe' :
            targetSub === 'pharmaexpress' ? 'pharmacy' :
            targetSub === 'makeover' ? 'beauty_salon' :
            targetSub === 'greenagro' ? 'agriculture_dairy' :
            targetSub === 'luxewood' ? 'furniture_decor' :
            targetSub === 'devnexus' ? 'software_saas' :
            'fashion_clothing'
          );

          tenant = {
            id: pData.tenantId || cleanSub,
            name: s.name || pData.name || cleanSub,
            subdomain: cleanSub,
            customDomain: s.customDomain || pData.customDomain || null,
            businessType: resolvedBusinessType,
            logo: s.logo || null,
            bannerImage: s.bannerImage || null,
            announcementText: s.announcementText || null,
            currency: s.currency || 'BDT',
            phone: s.phone || null,
            email: s.email || null,
            address: s.address || null,
            themeConfig: s.themeConfig ? (typeof s.themeConfig === 'string' ? s.themeConfig : JSON.stringify(s.themeConfig)) : null,
            settings: s,
            subscription: pData.subscription || null,
            features: pData.features || null,
            merchantProfile: pData.merchantProfile || null,
            isActive: pData.isActive !== undefined ? Boolean(pData.isActive) : true,
          };
        } catch {}
      }
    }

    // 3. Check migrated Laravel dataset
    if (!tenant) {
      try {
        const filePath = getMigratedJsonFilePath();
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(raw);
          const found = parsed.tenants.find(
            (t: any) => t.subdomain === cleanSub || t.id === cleanSub || (t.domains && t.domains.includes(cleanSub))
          );
          if (found) {
            tenant = {
              id: found.id,
              name: found.name,
              subdomain: found.subdomain,
              customDomain: found.domains?.[0] || null,
              businessType: found.businessType || 'fashion_clothing',
              logo: null,
              bannerImage: null,
              announcementText: null,
              currency: 'BDT',
              phone: found.phone || null,
              email: found.email || null,
              address: found.address || null,
              themeConfig: null,
              isActive: true,
            };
          }
        }
      } catch {}
    }

    // 4. Fallback for default demo tenants if not yet saved on disk
    if (!tenant) {
      if (cleanSub === 'fashion' || cleanSub === 'default') {
        tenant = {
          id: 'fashion',
          name: 'Gulshan Fashion & Boutique',
          subdomain: 'fashion',
          customDomain: null,
          businessType: 'fashion_clothing',
          logo: null,
          bannerImage: null,
          announcementText: '🎉 Special Launch Offer! Free express delivery across the country on all orders',
          currency: 'BDT',
          phone: '+880 1711-223344',
          email: 'info@gulshanfashion.com',
          address: 'Road 11, Block D, Gulshan 1, Dhaka',
          themeConfig: JSON.stringify({ primaryColor: '#e11d48', accentColor: '#4f46e5' }),
          isActive: true,
        };
      } else if (cleanSub === 'medicare') {
        tenant = {
          id: 'medicare',
          name: 'MediCare Specialized Health Clinic',
          subdomain: 'medicare',
          customDomain: null,
          businessType: 'healthcare_service',
          logo: null,
          bannerImage: null,
          announcementText: '🏥 Senior doctor consultations: Guaranteed 1-hour confirmed time slot booking',
          currency: 'BDT',
          phone: '+880 1912-345678',
          email: 'care@medicareclinic.com',
          address: 'House 42, Road 7, Dhanmondi, Dhaka',
          themeConfig: JSON.stringify({ primaryColor: '#059669', accentColor: '#0284c7' }),
          isActive: true,
        };
      }
    }

    if (tenant) {
      req.tenant = tenant;
      await cache.set(cacheKey, JSON.stringify(tenant), 600); // 10 minutes cache
    }

    next();
  } catch (error) {
    console.error('Tenant identification error:', error);
    next();
  }
}

export function requireTenant(req: Request, res: Response, next: NextFunction): void {
  if (!req.tenant) {
    res.status(404).json({
      success: false,
      message: 'Tenant store not found or is currently inactive',
    });
    return;
  }
  next();
}
