import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { GatheringCard } from '@/components/lamma/GatheringCard';
import { LetterCard } from '@/components/lamma/LetterCard';
import { hosts, hostsByHandle } from '@/data/hosts';
import { gatherings } from '@/data/gatherings';
import { letters } from '@/data/letters';
import { BadgeCheck, Calendar, Star, Users, Clock } from 'lucide-react';

type Props = { params: Promise<{ locale: string; handle: string }> };

export function generateStaticParams() {
  return hosts.flatMap((h) =>
    (['ar', 'en'] as const).map((locale) => ({
      locale,
      handle: h.handle.replace('@', ''),
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, handle } = await params;
  const h = hostsByHandle[`@${handle}`];
  if (!h) return { title: 'Not found' };
  const l = locale as 'ar' | 'en';
  return {
    title: h.displayName[l],
    description: h.bio[l].slice(0, 160),
  };
}

export default async function HostDetailPage({ params }: Props) {
  const { locale, handle } = await params;
  setRequestLocale(locale);
  const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'hosts' });
  const host = hostsByHandle[`@${handle}`];
  if (!host) notFound();

  const hostGatherings = gatherings.filter((g) => g.hostHandle === host.handle);
  const now = Date.now();
  const upcoming = hostGatherings.filter(
    (g) => new Date(g.startDate).getTime() > now && g.status !== 'CANCELLED',
  );
  const past = hostGatherings.filter(
    (g) => new Date(g.startDate).getTime() <= now,
  );
  const hostLetters = letters
    .filter((x) => x.authorHostHandle === host.handle)
    .slice(0, 2);

  return (
    <article>
      <header className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src={host.coverUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        <Container className="absolute inset-0 flex items-end pb-8">
          <div className="flex items-end gap-5">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-secondary ring-4 ring-paper sm:size-28">
              <Image
                src={host.avatarUrl}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl font-semibold text-paper sm:text-4xl">
                  {host.displayName[l]}
                </h1>
                {host.isVerified && (
                  <BadgeCheck className="size-6 text-teal" />
                )}
              </div>
              <p className="mt-1 text-sm text-paper/80">{host.handle}</p>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <section>
              <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
                {t('viewProfile')}
              </h2>
              <p className="text-lg leading-relaxed text-ink/80">
                {host.bio[l]}
              </p>
            </section>

            {upcoming.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
                  {t('upcoming')}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {upcoming.map((g) => (
                    <GatheringCard key={g.slug} gathering={g} />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
                  {t('past')}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((g) => (
                    <GatheringCard key={g.slug} gathering={g} />
                  ))}
                </div>
              </section>
            )}

            {hostLetters.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
                  {t('hostLetters')}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {hostLetters.map((x) => (
                    <LetterCard key={x.slug} letter={x} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <section className="sticky top-24 rounded-2xl bg-card p-6 ring-1 ring-border/60">
              <h3 className="mb-4 font-display text-lg font-semibold text-ink">
                {t('stats')}
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-sm text-stone">
                    <Calendar className="size-3.5" />
                    {t('totalGatherings')}
                  </dt>
                  <dd className="font-display font-semibold text-ink tabular">
                    {host.totalGatherings}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-sm text-stone">
                    <Users className="size-3.5" />
                    {t('totalAttendeesLabel')}
                  </dt>
                  <dd className="font-display font-semibold text-ink tabular">
                    {host.totalAttendees}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-sm text-stone">
                    <Star className="size-3.5 fill-saffron text-saffron" />
                    {t('avgRatingLabel')}
                  </dt>
                  <dd className="font-display font-semibold text-ink tabular">
                    {host.avgRating?.toFixed(1) ?? '—'}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-sm text-stone">
                    <Clock className="size-3.5" />
                    {t('responseTimeLabel')}
                  </dt>
                  <dd className="font-display font-semibold text-ink tabular">
                    {t('hours', { count: host.responseTimeHours })}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </Container>
    </article>
  );
}
