import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const defaultTenant = 'smartvolt';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/?tenant=${defaultTenant}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/checkout?tenant=${defaultTenant}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking?tenant=${defaultTenant}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy?tenant=${defaultTenant}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-and-conditions?tenant=${defaultTenant}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy?tenant=${defaultTenant}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(`${apiUrl}/catalog/items?tenant=${defaultTenant}`, {
      headers: { 'x-tenant-slug': defaultTenant },
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    if (data?.success && Array.isArray(data.data)) {
      const productRoutes: MetadataRoute.Sitemap = data.data.map((item: any) => ({
        url: `${baseUrl}/products/${item.slug || item.id}?tenant=${defaultTenant}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      }));

      return [...staticRoutes, ...productRoutes];
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }

  return staticRoutes;
}
