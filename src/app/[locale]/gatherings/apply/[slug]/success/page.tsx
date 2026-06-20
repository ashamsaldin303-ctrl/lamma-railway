import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/lamma/Container';
import { gatheringsBySlug } from '@/data/gatherings';

type Props = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gatherings' });
  return { title: t('applySuccessTitle'), description: t('applySuccessSubtitle') };
}
export default async function ApplySuccessPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!gatheringsBySlug[slug]) notFound();
  const t = await getTranslations({ locale, namespace: 'gatherings' });
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 inline-flex size-20 items-center justify-center rounded-full bg-success/15"><span className="text-4xl">✓</span></div>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t('applySuccessTitle')}</h1>
        <p className="mt-3 text-stone">{t('applySuccessSubtitle')}</p>
      </div>
    </Container>
  );
}
