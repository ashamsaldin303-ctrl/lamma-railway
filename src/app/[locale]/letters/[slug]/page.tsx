import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { TopicPill } from '@/components/lamma/TopicPill';
import { LetterContent } from '@/components/lamma/letters/LetterContent';
import { LetterSummary } from '@/components/lamma/ai/LetterSummary';
import { LetterCard } from '@/components/lamma/LetterCard';
import { letters, lettersBySlug } from '@/data/letters';
import { getTopic } from '@/data/topics';
import { getHost } from '@/data/hosts';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/format';

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return letters.flatMap((x) => (['ar','en'] as const).map((locale) => ({ locale, slug: x.slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const letter = lettersBySlug[slug]; if (!letter) return { title: 'Not found' };
  const l = locale as 'ar' | 'en';
  return { title: letter.title[l], description: letter.excerpt[l], openGraph: { type: 'article', publishedTime: letter.publishedAt, images: [{ url: letter.coverImageUrl }] } };
}
export default async function LetterReaderPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale); const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'letters' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const letter = lettersBySlug[slug]; if (!letter) notFound();
  const topic = getTopic(letter.topicSlug); const host = getHost(letter.authorHostHandle);
  const moreLetters = letters.filter((x) => x.slug !== letter.slug).slice(0, 2);
  const title = letter.title[l]; const content = letter.content[l]; const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <article>
      <Container className="pt-8"><nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><Link href="/letters" className="hover:text-clay">{t('breadcrumbs')}</Link><Sep className="size-3" /><span className="line-clamp-1 max-w-[12rem] text-ink">{title}</span></nav></Container>
      <header className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
        {topic && <div className="mb-6 flex justify-center"><TopicPill topic={topic} size="md" /></div>}
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-4 text-lg italic text-stone">{letter.subtitle[l]}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-stone">
          {host && <Link href={`/hosts/${host.handle.replace('@','')}`} className="flex items-center gap-2 transition-colors hover:text-clay"><div className="relative size-8 overflow-hidden rounded-full bg-secondary"><Image src={host.avatarUrl} alt="" fill sizes="32px" className="object-cover" /></div><span className="font-medium text-ink">{host.displayName[l]}</span></Link>}
          <span aria-hidden>·</span><span>{formatDate(letter.publishedAt, l)}</span><span aria-hidden>·</span><span className="flex items-center gap-1 tabular"><Clock className="size-3.5" />{letter.readTimeMinutes} {t('minRead')}</span>
        </div>
      </header>
      <div className="relative mx-auto aspect-[21/9] max-h-[50vh] w-full overflow-hidden bg-secondary"><Image src={letter.coverImageUrl} alt={title} fill priority sizes="100vw" className="object-cover" /></div>
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl"><LetterSummary letterSlug={letter.slug} content={content} title={title} locale={l} /></div>
        <div className="mt-8"><LetterContent content={content} /></div>
        {host && <div className="mx-auto mt-12 max-w-2xl border-t border-border pt-8 flex items-start gap-4 rounded-2xl bg-paper p-6 ring-1 ring-border/60"><div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-secondary"><Image src={host.avatarUrl} alt="" fill sizes="64px" className="object-cover" /></div><div className="flex-1"><p className="mb-1 text-xs uppercase tracking-wider text-stone">{t('aboutAuthor')}</p><h3 className="mb-2 font-display text-xl font-semibold text-ink"><Link href={`/hosts/${host.handle.replace('@','')}`} className="transition-colors hover:text-clay">{host.displayName[l]}</Link></h3><p className="line-clamp-3 text-sm text-ink/70">{host.bio[l]}</p></div></div>}
        {moreLetters.length > 0 && <div className="mx-auto mt-16 max-w-5xl"><h2 className="mb-6 font-display text-2xl font-semibold text-ink">{t('moreLetters')}</h2><div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{moreLetters.map((x) => <LetterCard key={x.slug} letter={x} />)}</div></div>}
      </Container>
    </article>
  );
}
