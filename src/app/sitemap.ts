import type { MetadataRoute } from 'next';
import { gatherings } from '@/data/gatherings';
import { hosts } from '@/data/hosts';
import { topics } from '@/data/topics';
import { letters } from '@/data/letters';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://lamma.kw';
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/en`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/gatherings`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/en/gatherings`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/hosts`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/en/hosts`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/topics`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/en/topics`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/letters`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/en/letters`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/en/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/en/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
  const gatheringPages: MetadataRoute.Sitemap = gatherings.flatMap((g) => [
    { url: `${base}/gatherings/${g.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/en/gatherings/${g.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
  ]);
  const hostPages: MetadataRoute.Sitemap = hosts.flatMap((h) => [
    { url: `${base}/hosts/${h.handle.replace('@','')}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/en/hosts/${h.handle.replace('@','')}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]);
  const topicPages: MetadataRoute.Sitemap = topics.flatMap((t) => [
    { url: `${base}/topics/${t.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${base}/en/topics/${t.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ]);
  const letterPages: MetadataRoute.Sitemap = letters.flatMap((l) => [
    { url: `${base}/letters/${l.slug}`, lastModified: new Date(l.publishedAt), changeFrequency: 'yearly' as const, priority: 0.7 },
    { url: `${base}/en/letters/${l.slug}`, lastModified: new Date(l.publishedAt), changeFrequency: 'yearly' as const, priority: 0.7 },
  ]);
  return [...staticPages, ...gatheringPages, ...hostPages, ...topicPages, ...letterPages];
}
