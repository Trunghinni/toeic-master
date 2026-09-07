import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toeicmaster.vn';
  const routes = [
    '',
    '/login',
    '/register',
    '/roadmap',
    '/vocabulary',
    '/grammar',
    '/skills',
    '/tests',
    '/speaking',
    '/writing',
    '/social',
    '/subscription',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
