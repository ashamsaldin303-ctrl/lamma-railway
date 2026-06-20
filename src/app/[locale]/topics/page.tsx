import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { TopicCard } from '@/components/lamma/TopicCard';
import { topics } from '@/data/topics';
import { gatherings } from '@/data/gatherings';
import { letters } from '@/data/letters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'topics' });
  return { title: t('title'), description: t('subtitle') };
}
export default async function TopicsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'topics' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;
  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><span className="text-ink">{t('breadcrumbs')}</span></nav>
      <header className="mb-8 border-b border-border pb-6"><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t('title')}</h1><p className="mt-2 text-sm text-ink/70 sm:text-base">{t('subtitle')}</p></header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{topics.map((topic) => <TopicCard key={topic.slug} topic={topic} gatheringsCount={gatherings.filter((g) => g.topicSlug === topic.slug).length} lettersCount={letters.filter((x) => x.topicSlug === topic.slug).length} />)}</div>
    </Container>
  );
}
