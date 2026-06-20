import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { LetterCard } from '@/components/lamma/LetterCard';
import { TopicPill } from '@/components/lamma/TopicPill';
import { letters } from '@/data/letters';
import { getTopic } from '@/data/topics';
import { getHost } from '@/data/hosts';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatRelative } from '@/lib/format';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'letters' });
  return { title: t('title'), description: t('subtitle') };
}
export default async function LettersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale); const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'letters' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const sorted = [...letters].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const featured = sorted[0]; const rest = sorted.slice(1);
  const featuredTopic = getTopic(featured.topicSlug); const featuredHost = getHost(featured.authorHostHandle);
  const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><span className="text-ink">{t('breadcrumbs')}</span></nav>
      <header className="mb-10 border-b border-border pb-6"><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">{t('title')}</h1><p className="mt-2 text-base text-stone sm:text-lg">{t('subtitle')}</p><p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">{t('description')}</p></header>
      <section className="mb-12">
        <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-clay">{t('featured')}</p>
        <Link href={`/letters/${featured.slug}`} className="group block overflow-hidden rounded-2xl bg-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] lg:flex">
          <div className="relative aspect-[21/9] overflow-hidden bg-secondary lg:w-1/2"><Image src={featured.coverImageUrl} alt={featured.title[l]} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /></div>
          <div className="flex flex-1 flex-col justify-center p-6 lg:p-10">
            {featuredTopic && <div className="mb-4"><TopicPill topic={featuredTopic} size="md" /></div>}
            <h2 className="font-display text-2xl font-semibold text-ink transition-colors group-hover:text-clay sm:text-3xl">{featured.title[l]}</h2>
            <p className="mt-2 text-sm italic text-stone">{featured.subtitle[l]}</p>
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink/70">{featured.excerpt[l]}</p>
            <div className="mt-6 flex items-center gap-3 text-xs text-stone">{featuredHost && <span className="font-medium text-ink">{featuredHost.displayName[l]}</span>}<span aria-hidden>·</span><span className="flex items-center gap-1 tabular"><Clock className="size-3" />{featured.readTimeMinutes} {t('minRead')}</span><span aria-hidden>·</span><span>{formatRelative(featured.publishedAt, l)}</span></div>
          </div>
        </Link>
      </section>
      {rest.length > 0 && <section><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{rest.map((x) => <LetterCard key={x.slug} letter={x} />)}</div></section>}
    </Container>
  );
}
