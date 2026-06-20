import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { GatheringsClient } from '@/components/lamma/gatherings/GatheringsClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gatherings' });
  return { title: t('listingTitle'), description: t('listingSubtitle') };
}
export default async function GatheringsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'gatherings' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;
  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><span className="text-ink">{t('breadcrumbs')}</span></nav>
      <header className="mb-8 border-b border-border pb-6"><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t('listingTitle')}</h1><p className="mt-2 text-sm text-ink/70 sm:text-base">{t('listingSubtitle')}</p></header>
      <GatheringsClient />
    </Container>
  );
}
