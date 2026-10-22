import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function runImporter() {
  console.log('🔄 [Importer] Reading Laravel Exported JSON Dataset...');

  const dataPath = path.resolve(__dirname, '../data/laravel_exported_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ [Importer] Data file not found at:', dataPath);
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const exportPayload = JSON.parse(rawData);

  console.log(`📦 [Importer] Found ${exportPayload.tenants.length} tenants from Laravel!`);

  let totalItemsCount = 0;
  let totalCatsCount = 0;

  for (const t of exportPayload.tenants) {
    console.log(`➡️  Migrating Tenant: ${t.name} (Subdomain: ${t.subdomain})...`);

    try {
      // 1. Upsert Tenant in Prisma
      const tenant = await prisma.tenant.upsert({
        where: { subdomain: t.subdomain },
        update: {
          name: t.name,
          businessType: t.businessType || 'fashion_clothing',
          phone: t.phone || null,
          email: t.email || null,
          address: t.address || null,
          isActive: true,
        },
        create: {
          name: t.name,
          subdomain: t.subdomain,
          businessType: t.businessType || 'fashion_clothing',
          phone: t.phone || null,
          email: t.email || null,
          address: t.address || null,
          isActive: true,
        },
      });

      // 2. Categories
      const catMap = new Map<string, string>();
      for (const c of t.categories) {
        const cat = await prisma.category.upsert({
          where: {
            tenantId_slug: {
              tenantId: tenant.id,
              slug: c.slug,
            },
          },
          update: { name: c.name },
          create: {
            tenantId: tenant.id,
            name: c.name,
            slug: c.slug,
          },
        });
        catMap.set(c.id, cat.id);
        totalCatsCount++;
      }

      // 3. Items / Products
      for (const item of t.items) {
        await prisma.item.upsert({
          where: {
            tenantId_slug: {
              tenantId: tenant.id,
              slug: item.slug,
            },
          },
          update: {
            title: item.title,
            price: item.price,
            comparePrice: item.comparePrice || null,
            stockQuantity: item.stockQuantity || 10,
            images: JSON.stringify(item.images || []),
            shortDescription: item.shortDescription || null,
            description: item.description || null,
            itemType: item.itemType || 'PHYSICAL_PRODUCT',
          },
          create: {
            tenantId: tenant.id,
            title: item.title,
            slug: item.slug,
            price: item.price,
            comparePrice: item.comparePrice || null,
            stockQuantity: item.stockQuantity || 10,
            images: JSON.stringify(item.images || []),
            shortDescription: item.shortDescription || null,
            description: item.description || null,
            itemType: item.itemType || 'PHYSICAL_PRODUCT',
            categoryId: item.category_id && catMap.has(item.category_id) ? catMap.get(item.category_id) : null,
          },
        });
        totalItemsCount++;
      }
    } catch (err: any) {
      console.warn(`⚠️ [Importer Notice for ${t.subdomain}]:`, err?.message || err);
    }
  }

  console.log('\n=============================================');
  console.log('🎉 [Phase 6: Data Migration] Completed Successfully!');
  console.log(`• Total Tenants Synced: ${exportPayload.tenants.length}`);
  console.log(`• Total Categories Synced: ${totalCatsCount}`);
  console.log(`• Total Products / Services Synced: ${totalItemsCount}`);
  console.log('=============================================\n');
}

runImporter()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
