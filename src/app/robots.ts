import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://lamma.kw';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/api', '/gatherings/apply', '/admin'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
