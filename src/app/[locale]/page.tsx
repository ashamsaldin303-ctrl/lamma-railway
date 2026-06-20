import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { GatheringCard } from '@/components/lamma/GatheringCard';
import { HostCard } from '@/components/lamma/HostCard';
import { LetterCard } from '@/components/lamma/LetterCard';
import { TopicPill } from '@/components/lamma/TopicPill';
import { PrayerTimeBadge } from '@/components/lamma/PrayerTimeBadge';
import { NewsletterSignup } from '@/components/lamma/NewsletterSignup';
import { RecommendationsSection } from '@/components/lamma/matching/RecommendationsSection';
import { Button } from '@/components/ui/button';
import { letters } from '@/data/letters';
import { gatherings, upcomingGatherings } from '@/data/gatherings';
import { hosts } from '@/data/hosts';
import { topics } from '@/data/topics';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const l = locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'hero' });
  const tS = await getTranslations({ locale, namespace: 'sections' });

  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  // Hero letter — Letter 1 (the completed rhythm gathering).
  const heroLetter = letters.find((x) => x.slug === 'rhythm-echoes') ?? letters[0];
  // Featured gathering — Gathering #1 (Mubarakiya walk).
  const featured = gatherings.find((g) => g.slug === 'memory-mubarakiya-walk') ?? upcomingGatherings[0];

  const upcomingSlice = upcomingGatherings.filter((g) => g.slug !== featured.slug).slice(0, 3);
  const hostsSlice = hosts.slice(0, 4);
  const lettersSlice = letters.filter((x) => x.slug !== heroLetter.slug).slice(0, 2);

  return (
    <>
      {/* ============================================================
          HERO — editorial pull-quote from Letter 1
         ============================================================ */}
      <section className="relative overflow-hidden bg-sand">
        <Container className="grid grid-cols-1 gap-10 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-clay">
              {t('eyebrow')}
            </p>
            <Quote className="mt-6 h-8 w-8 text-clay/40" />
            <blockquote className="mt-4 font-display text-2xl font-medium leading-snug text-ink sm:text-3xl lg:text-4xl">
              {heroLetter.excerpt[l]}
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild className="gap-1.5 bg-clay text-primary-foreground hover:bg-clay/90">
                <Link href={`/letters/${heroLetter.slug}`}>
                  {t('readFullLetter')}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <div className="text-sm text-stone">
                <span>{t('byAuthor')} </span>
                <span className="font-medium text-ink">
                  {hosts.find((h) => h.handle === heroLetter.authorHostHandle)?.displayName[l]}
                </span>
              </div>
            </div>
          </div>

          {/* Hero letter cover */}
          <div className="lg:col-span-5">
            <Link
              href={`/letters/${heroLetter.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-[var(--shadow-card)] ring-1 ring-border/60"
            >
              <Image
                src={heroLetter.coverImageUrl}
                alt={heroLetter.title[l]}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent p-5">
                <h2 className="font-display text-xl font-semibold text-paper">
                  {heroLetter.title[l]}
                </h2>
                <p className="mt-1 text-sm text-paper/80">{heroLetter.subtitle[l]}</p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* ============================================================
          FEATURED GATHERING
         ============================================================ */}
      <section id="gatherings" className="bg-paper py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                {t('featuredGathering')}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                {featured.title[l]}
              </h2>
            </div>
            <Button asChild variant="ghost" className="gap-1.5 text-clay">
              <Link href="/gatherings">
                {tS('upcomingGatherings')}
                <Arrow className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Link href={`/gatherings/${featured.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded-2xl">
            <GatheringCard gathering={featured} variant="featured" />
          </Link>
          <div className="mt-3 flex items-center gap-2 text-xs text-stone">
            <PrayerTimeBadge />
            <span>{/* TODO: build full section in Phase 1 */}</span>
          </div>
        </Container>
      </section>

      {/* ============================================================
          UPCOMING GATHERINGS (placeholder — 3 cards)
          TODO(Phase 1): full gatherings listing + filters
         ============================================================ */}
      <section className="bg-sand py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                {tS('upcomingGatheringsHint')}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                {tS('upcomingGatherings')}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSlice.map((g) => (
              <Link key={g.slug} href={`/gatherings/${g.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded-2xl">
                <GatheringCard gathering={g} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          RECOMMENDATIONS (auth-gated — visible only to logged-in users)
         ============================================================ */}
      <RecommendationsSection />

      {/* ============================================================
          TOPICS (placeholder — 6 editorial topic pills)
          TODO(Phase 1): topic detail pages
         ============================================================ */}
      <section id="topics" className="bg-paper py-16 sm:py-20">
        <Container>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone">
              {tS('topicsHint')}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {tS('topics')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl bg-secondary p-4 ring-1 ring-border/60 transition-all hover:shadow-[var(--shadow-card)]"
              >
                <Image
                  src={topic.coverImageUrl}
                  alt={topic.name[l]}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="relative">
                  <TopicPill topic={topic} size="md" />
                </div>
                <div className="relative">
                  <h3 className="font-display text-lg font-semibold text-paper">
                    {topic.name[l]}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          HOSTS (placeholder — 4 host cards)
          TODO(Phase 1): hosts listing + profile pages
         ============================================================ */}
      <section id="hosts" className="bg-sand py-16 sm:py-20">
        <Container>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone">
              {tS('hostsHint')}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {tS('hosts')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {hostsSlice.map((h) => (
              <Link key={h.handle} href={`/hosts/${h.handle.replace('@', '')}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded-2xl">
                <HostCard host={h} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          LETTERS (placeholder — 2 letter cards)
          TODO(Phase 1): letter reader page
         ============================================================ */}
      <section id="letters" className="bg-paper py-16 sm:py-20">
        <Container>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone">
              {tS('lettersHint')}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {tS('letters')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {lettersSlice.map((x) => (
              <Link key={x.slug} href={`/letters/${x.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded-2xl">
                <LetterCard letter={x} />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          NEWSLETTER
         ============================================================ */}
      <NewsletterSignup />
    </>
  );
}
