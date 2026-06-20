import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { TopicTabs } from '@/components/lamma/topics/TopicTabs';
import { topics, topicsBySlug } from '@/data/topics';
import { gatherings } from '@/data/gatherings';
import { letters } from '@/data/letters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return topics.flatMap((t) => (['ar','en'] as const).map((locale) => ({ locale, slug: t.slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = topicsBySlug[slug]; if (!topic) return { title: 'Not found' };
  const l = locale as 'ar' | 'en';
  return { title: topic.name[l], description: topic.description[l].slice(0, 160) };
}
export default async function TopicDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale); const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'topics' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const topic = topicsBySlug[slug]; if (!topic) notFound();
  const now = Date.now();
  const topicGatherings = gatherings.filter((g) => g.topicSlug === topic.slug);
  const upcoming = topicGatherings.filter((g) => new Date(g.startDate).getTime() > now && g.status !== 'CANCELLED');
  const past = topicGatherings.filter((g) => new Date(g.startDate).getTime() <= now);
  const topicLetters = letters.filter((x) => x.topicSlug === topic.slug);
  const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <>
      <section className="relative">
        <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden"><Image src={topic.coverImageUrl} alt={topic.name[l]} fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" /></div>
        <Container className="relative -mt-32 pb-4"><div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-6 block h-1.5 w-12 rounded-full" style={{ backgroundColor: topic.color }} />
          <h1 className="font-display text-4xl font-semibold text-paper sm:text-5xl md:text-6xl">{topic.name[l]}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-paper/90">{topic.description[l]}</p>
        </div></Container>
      </section>
      <Container className="py-8 sm:py-12">
        <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><Link href="/topics" className="hover:text-clay">{t('breadcrumbs')}</Link><Sep className="size-3" /><span className="text-ink">{topic.name[l]}</span></nav>
        <TopicTabs upcoming={upcoming} past={past} topicLetters={topicLetters} />
      </Container>
    </>
  );
}
