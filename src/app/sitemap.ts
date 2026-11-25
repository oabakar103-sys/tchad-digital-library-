import type { MetadataRoute } from 'next';
import { listAllBooks, listCategories } from '@/lib/store';
import { SITE } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/catalogue', '/categories', '/a-propos', '/contact', '/faq', '/mentions-legales'];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : 0.7,
  }));

  const [books, categories] = await Promise.all([listAllBooks(), listCategories(false)]);

  const bookRoutes: MetadataRoute.Sitemap = books
    .filter((b) => b.status === 'published')
    .map((b) => ({
      url: `${SITE.url}/livre/${b.slug}`,
      lastModified: new Date(b.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE.url}/categories/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...bookRoutes, ...categoryRoutes];
}
