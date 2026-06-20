import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { ApplyForm } from '@/components/lamma/applications/ApplyForm';
import { gatheringsBySlug } from '@/data/gatherings';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const g = gatheringsBySlug[slug]; if (!g) return { title: 'Not found' };
  const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'application_form' });
  return { title: `${t('title')} — ${g.title[l]}`, description: g.description[l].slice(0, 160) };
}
export default async function ApplyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale); const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'application_form' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const tG = await getTranslations({ locale, namespace: 'gatherings' });
  const gathering = gatheringsBySlug[slug]; if (!gathering) notFound();
  const Sep = l === 'ar' ? ChevronLeft : ChevronRight;
  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><Link href="/gatherings" className="hover:text-clay">{tG('breadcrumbs')}</Link><Sep className="size-3" /><Link href={`/gatherings/${gathering.slug}`} className="hover:text-clay">{gathering.title[l].slice(0, 30)}</Link><Sep className="size-3" /><span className="text-ink">{t('title')}</span></nav>
      <header className="mb-8 border-b border-border pb-6"><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t('title')}</h1><p className="mt-2 text-sm text-ink/70 sm:text-base">{t('subtitle')}</p><p className="mt-3 font-display text-lg text-clay">{gathering.title[l]}</p></header>
      <ApplyForm gathering={gathering} />
    </Container>
  );
}
