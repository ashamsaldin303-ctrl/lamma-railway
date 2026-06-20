import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { TopicPill } from '@/components/lamma/TopicPill';
import { PrayerTimeBadge } from '@/components/lamma/PrayerTimeBadge';
import { GatheringCard } from '@/components/lamma/GatheringCard';
import { SimilarAttendeesPreview } from '@/components/lamma/matching/SimilarAttendeesPreview';
import { ApplicationCTA } from '@/components/lamma/gatherings/detail/ApplicationCTA';
import { CapacityCard } from '@/components/lamma/gatherings/detail/CapacityCard';
import { LocationCard } from '@/components/lamma/gatherings/detail/LocationCard';
import { DetailHostCard } from '@/components/lamma/gatherings/detail/DetailHostCard';
import { gatherings, gatheringsBySlug } from '@/data/gatherings';
import { getTopic } from '@/data/topics';
import { getHost } from '@/data/hosts';
import { checkPrayerConflict, getPrayerTimeForDate } from '@/data/prayer-times';
import { formatDateRange, formatKwd } from '@/lib/format';
import { CalendarDays, MapPin, Check, Users } from 'lucide-react';

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return gatherings.flatMap((g) => (['ar','en'] as const).map((locale) => ({ locale, slug: g.slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const g = gatheringsBySlug[slug]; if (!g) return { title: 'Not found' };
  const l = locale as 'ar' | 'en';
  return { title: g.title[l], description: g.description[l].slice(0, 160), openGraph: { title: g.title[l], images: [{ url: g.coverImageUrl }] } };
}
export default async function GatheringDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale); const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'gatherings' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const gathering = gatheringsBySlug[slug]; if (!gathering) notFound();
  const topic = getTopic(gathering.topicSlug); const host = getHost(gathering.hostHandle);
  const conflict = checkPrayerConflict(new Date(gathering.startDate), new Date(gathering.endDate));
  const prayerDay = getPrayerTimeForDate(new Date(gathering.startDate));
  const prayerKey = (conflict.prayer ?? 'isha') as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  const prayerTime = prayerDay ? prayerDay[prayerKey] : undefined;
  const related = gatherings.filter((g) => g.topicSlug === gathering.topicSlug && g.slug !== gathering.slug).slice(0, 3);
  const priceLabel = gathering.isFree ? t('free') : `${formatKwd(gathering.priceKwd, l)} ${t('kwd')}`;
  const whoShouldAttend = gathering.whoShouldAttend ?? [];
  const whatToExpect = gathering.whatToExpect ?? [];

  return (
    <article>
      <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image src={gathering.coverImageUrl} alt={gathering.title[l]} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12"><div className="mx-auto w-full max-w-7xl">
          {topic && <div className="mb-4 flex flex-wrap gap-2"><TopicPill topic={topic} size="md" /></div>}
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl md:text-6xl">{gathering.title[l]}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-paper/90">
            <span className="flex items-center gap-2 text-sm"><CalendarDays className="size-4" />{formatDateRange(gathering.startDate, gathering.endDate, l)}</span>
            <span className="flex items-center gap-2 text-sm"><MapPin className="size-4" />{gathering.venueName[l]}</span>
            {gathering.isPrayerAware && <PrayerTimeBadge prayerKey={prayerKey} time={prayerTime} />}
          </div>
        </div></div>
      </header>
      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="text-lg leading-relaxed text-ink/85 first-letter:float-start first-letter:me-2 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-clay">{gathering.description[l]}</p>
            {whoShouldAttend.length > 0 && (<section className="mt-12"><h2 className="mb-4 font-display text-2xl font-semibold text-ink">{t('whoShouldAttend')}</h2><ul className="space-y-2.5">{whoShouldAttend.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-ink/80"><span className="mt-2 text-xs text-clay">●</span><span className="leading-relaxed">{item[l]}</span></li>))}</ul></section>)}
            {whatToExpect.length > 0 && (<section className="mt-12"><h2 className="mb-4 font-display text-2xl font-semibold text-ink">{t('whatToExpect')}</h2><ul className="space-y-2.5">{whatToExpect.map((item, i) => (<li key={i} className="flex items-start gap-2.5 text-ink/80"><Check className="mt-1 size-4 shrink-0 text-success" /><span className="leading-relaxed">{item[l]}</span></li>))}</ul></section>)}
            <section className="mt-12"><SimilarAttendeesPreview gathering={gathering} /></section>
            {gathering.galleryUrls.length > 0 && (<section className="mt-12"><h2 className="mb-4 font-display text-2xl font-semibold text-ink">{t('gallery')}</h2><div className="grid grid-cols-2 gap-4">{gathering.galleryUrls.map((url, i) => (<div key={i} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary"><Image src={url} alt="" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" /></div>))}</div></section>)}
            {related.length > 0 && (<section className="mt-12"><h2 className="mb-4 font-display text-2xl font-semibold text-ink">{t('related')}</h2><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((g) => <GatheringCard key={g.slug} gathering={g} />)}</div></section>)}
          </div>
          <aside className="space-y-6 lg:col-span-4">
            {host && <DetailHostCard host={host} />}
            <ApplicationCTA gathering={gathering} />
            <CapacityCard gathering={gathering} />
            <LocationCard gathering={gathering} />
            <Link href={`/gatherings/${gathering.slug}/live`} className="flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success transition-colors hover:bg-success/10">
              <span className="size-2 animate-pulse rounded-full bg-success" />
              {locale === 'ar' ? 'تجربة الرفيق اللحظي' : 'Try Live Companion'}
            </Link>
          </aside>
        </div>
      </Container>
    </article>
  );
}
