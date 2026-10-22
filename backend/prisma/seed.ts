import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Fashion Store Tenant
  const fashionPassword = await bcrypt.hash('admin123', 10);
  const fashionTenant = await prisma.tenant.upsert({
    where: { subdomain: 'fashion' },
    update: {},
    create: {
      name: 'গুলশান ফ্যাশন ও বুটিক (Gulshan Fashion)',
      subdomain: 'fashion',
      businessType: 'fashion_clothing',
      phone: '01811-223344',
      email: 'info@gulshanfashion.com',
      address: 'রোড ১১, বনানী, ঢাকা-১২১৩',
      currency: 'BDT',
      themeConfig: JSON.stringify({
        primaryColor: '#e11d48',
        fontFamily: 'Inter',
        heroTitle: 'উৎসবের নতুন কালেকশন ২০২৬',
        heroSubtitle: 'প্রিমিয়াম শাড়ি, থ্রি-পিস ও পাঞ্জাবি কালেকশনে ৫০% পর্যন্ত ছাড়!',
      }),
      users: {
        create: {
          name: 'তানভীর আহমেদ',
          email: 'admin@gulshanfashion.com',
          password: fashionPassword,
          role: 'TENANT_ADMIN',
          phone: '01811-223344',
        },
      },
    },
  });

  // Fashion Categories
  const sareeCategory = await prisma.category.upsert({
    where: { tenantId_slug: { tenantId: fashionTenant.id, slug: 'saree' } },
    update: {},
    create: {
      tenantId: fashionTenant.id,
      name: 'জামদানি ও সিল্ক শাড়ি',
      slug: 'saree',
      sortOrder: 1,
    },
  });

  const panjabiCategory = await prisma.category.upsert({
    where: { tenantId_slug: { tenantId: fashionTenant.id, slug: 'panjabi' } },
    update: {},
    create: {
      tenantId: fashionTenant.id,
      name: 'প্রিমিয়াম কাবলি ও পাঞ্জাবি',
      slug: 'panjabi',
      sortOrder: 2,
    },
  });

  // Fashion Products
  await prisma.item.upsert({
    where: { tenantId_slug: { tenantId: fashionTenant.id, slug: 'royal-jamdani-saree' } },
    update: {},
    create: {
      tenantId: fashionTenant.id,
      categoryId: sareeCategory.id,
      title: 'রয়্যাল ঢাকাই জামদানি শাড়ি (৮৪ কাউন্ট)',
      slug: 'royal-jamdani-saree',
      shortDescription: 'খাঁটি সুতি সুতা ও জারি সুতোয় নিখুঁত হাতে বোনা ট্র্যাডিশনাল ঢাকাই জামদানি।',
      description: 'শতভাগ আরামদায়ক এবং যেকোনো বিয়ে বা ঘরোয়া অনুষ্ঠানের জন্য অতুলনীয় অভিজাত লুক। সাথে ম্যাচিং ব্লাউজ পিস অন্তর্ভুক্ত।',
      itemType: 'PHYSICAL_PRODUCT',
      price: 6500,
      comparePrice: 8500,
      stockQuantity: 15,
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      ]),
      variants: {
        create: [
          { title: 'রানি গোলাপি', price: 6500, stockQuantity: 8, attributes: JSON.stringify({ Color: 'Pink' }) },
          { title: 'রয়েল ব্লু', price: 6500, stockQuantity: 7, attributes: JSON.stringify({ Color: 'Blue' }) },
        ],
      },
    },
  });

  await prisma.item.upsert({
    where: { tenantId_slug: { tenantId: fashionTenant.id, slug: 'platinum-cotton-panjabi' } },
    update: {},
    create: {
      tenantId: fashionTenant.id,
      categoryId: panjabiCategory.id,
      title: 'প্ল্যাটিনাম কটন এক্সক্লুসিভ সেমি-লং পাঞ্জাবি',
      slug: 'platinum-cotton-panjabi',
      shortDescription: '১০০% ফাইন কটন ও নিখুঁত কারুকাজ সমৃদ্ধ ডিজাইনার পাঞ্জাবি।',
      description: 'গ্রীষ্মের গরমেও অত্যন্ত আরামদায়ক ও ব্রিদেবল ফেব্রিক। স্লিম ফিট কাটিং।',
      itemType: 'PHYSICAL_PRODUCT',
      price: 2850,
      comparePrice: 3500,
      stockQuantity: 40,
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80',
      ]),
      variants: {
        create: [
          { title: 'Size: 40 / White', price: 2850, stockQuantity: 15, attributes: JSON.stringify({ Size: '40', Color: 'White' }) },
          { title: 'Size: 42 / White', price: 2850, stockQuantity: 15, attributes: JSON.stringify({ Size: '42', Color: 'White' }) },
          { title: 'Size: 44 / Black', price: 2850, stockQuantity: 10, attributes: JSON.stringify({ Size: '44', Color: 'Black' }) },
        ],
      },
    },
  });

  // 2. Healthcare Service Tenant (Appointment Booking)
  const healthTenant = await prisma.tenant.upsert({
    where: { subdomain: 'medicare' },
    update: {},
    create: {
      name: 'মেডিকেয়ার স্পেশালাইজড ডেন্টাল ও হেলথ ক্লিনিক',
      subdomain: 'medicare',
      businessType: 'healthcare_service',
      phone: '01711-998877',
      email: 'appointment@medicarebd.com',
      address: 'ধানমন্ডি ২৭, ঢাকা',
      currency: 'BDT',
      themeConfig: JSON.stringify({
        primaryColor: '#059669',
        fontFamily: 'Inter',
        heroTitle: 'আধুনিক চিকিৎসা ও অভিজ্ঞ চিকিৎসকদের পরামর্শ',
        heroSubtitle: 'সিরিয়াল নেওয়ার ঝামেলা ছাড়াই সহজে ১ ঘণ্টার স্লটে বুকিং সম্পন্ন করুন',
      }),
    },
  });

  const dentalCategory = await prisma.category.upsert({
    where: { tenantId_slug: { tenantId: healthTenant.id, slug: 'dental' } },
    update: {},
    create: {
      tenantId: healthTenant.id,
      name: 'ডেন্টাল ও ওরাল কেয়ার',
      slug: 'dental',
    },
  });

  const docService = await prisma.item.upsert({
    where: { tenantId_slug: { tenantId: healthTenant.id, slug: 'senior-dental-consultation' } },
    update: {},
    create: {
      tenantId: healthTenant.id,
      categoryId: dentalCategory.id,
      title: 'সিনিয়র ডেন্টাল স্পেশালিস্ট কনসালটেশন ও চেকআপ',
      slug: 'senior-dental-consultation',
      shortDescription: 'বিসিএস ও এফসিপিএস ডেন্টাল সার্জন দ্বারা ডিজিটাল এক্স-রে সহ পূর্ণাঙ্গ চেকআপ।',
      description: 'দাঁতের ব্যথা, ফিলিং, স্কেলিং ও রুট ক্যানেলের আধুনিক সমাধান। ভিজিট ফি ৫০০ টাকা।',
      itemType: 'SERVICE_APPOINTMENT',
      price: 500,
      durationMinutes: 60,
      maxCapacityPerSlot: 2,
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      ]),
    },
  });

  // Pre-seed some appointment slots for today & tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  for (const date of [today, tomorrow]) {
    await prisma.bookingSlot.upsert({
      where: {
        tenantId_itemId_date_startTime: {
          tenantId: healthTenant.id,
          itemId: docService.id,
          date,
          startTime: '10:00',
        },
      },
      update: {},
      create: {
        tenantId: healthTenant.id,
        itemId: docService.id,
        date,
        startTime: '10:00',
        endTime: '11:00',
        capacity: 2,
        bookedCount: 0,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
