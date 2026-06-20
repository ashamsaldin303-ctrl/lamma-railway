import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { gatheringsBySlug } from '@/data/gatherings';
import { RequireAuth } from '@/components/lamma/auth/RequireAuth';
import { LiveCompanion } from '@/components/lamma/live/LiveCompanion';

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function LivePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const gathering = gatheringsBySlug[slug];
  if (!gathering) notFound();
  return <RequireAuth><LiveCompanion gathering={gathering} /></RequireAuth>;
}
