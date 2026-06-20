import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MatchesPage } from '@/components/lamma/matching/MatchesPage';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'matching.page' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function DashboardMatchesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MatchesPage />;
}
