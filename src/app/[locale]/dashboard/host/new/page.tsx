import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NewGatheringForm } from '@/components/lamma/host/NewGatheringForm';
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'host.newGathering' });
  return { title: t('title'), description: t('title') };
}
export default async function NewGatheringPage({ params }: Props) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'host.newGathering' });
  return <div><header className="mb-6"><h1 className="font-display text-3xl font-semibold text-ink">{t('title')}</h1></header><NewGatheringForm /></div>;
}
