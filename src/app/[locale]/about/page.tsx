import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('manifesto') };
}
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale); const l = locale as 'ar' | 'en';
  const t = await getTranslations({ locale, namespace: 'about' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const Arrow = l === 'ar' ? ArrowLeft : ArrowRight; const Sep = l === 'ar' ? ChevronLeft : ChevronRight;
  const principles = [{ title: t('principle1Title'), desc: t('principle1Desc') }, { title: t('principle2Title'), desc: t('principle2Desc') }, { title: t('principle3Title'), desc: t('principle3Desc') }, { title: t('principle4Title'), desc: t('principle4Desc') }];
  const whyNow = [t('whyNow1'), t('whyNow2'), t('whyNow3'), t('whyNow4'), t('whyNow5')];
  const personas = [{ name: t('persona1Name'), desc: t('persona1Desc') }, { name: t('persona2Name'), desc: t('persona2Desc') }, { name: t('persona3Name'), desc: t('persona3Desc') }, { name: t('persona4Name'), desc: t('persona4Desc') }];

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><span className="text-ink">{t('breadcrumbs')}</span></nav>
      <section className="mx-auto max-w-4xl py-12 text-center sm:py-20"><h1 className="font-display text-6xl font-semibold text-ink sm:text-7xl md:text-8xl">{l === 'ar' ? 'لَمَّة' : 'Lamma'}</h1><p className="mt-4 font-display text-xl text-clay sm:text-2xl">{t('tagline')}</p><p className="mx-auto mt-8 max-w-2xl text-lg italic leading-relaxed text-ink/70">{t('manifesto')}</p></section>
      <section className="mx-auto max-w-3xl py-12"><h2 className="mb-8 font-display text-3xl font-semibold text-ink">{t('philosophy')}</h2><div className="space-y-8">{principles.map((p, i) => (<div key={i} className="flex gap-4"><span className="font-display text-3xl font-bold text-clay/30 tabular">{i + 1}</span><div><h3 className="font-display text-xl font-semibold text-ink">{p.title}</h3><p className="mt-2 leading-relaxed text-ink/70">{p.desc}</p></div></div>))}</div></section>
      <section className="mx-auto max-w-2xl border-t border-border py-12"><h2 className="mb-6 font-display text-3xl font-semibold text-ink">{t('story')}</h2><p className="text-lg leading-relaxed text-ink/80">{t('storyBody')}</p></section>
      <section className="mx-auto max-w-2xl border-t border-border py-12"><h2 className="mb-6 font-display text-3xl font-semibold text-ink">{t('whyNow')}</h2><ul className="space-y-4">{whyNow.map((item, i) => (<li key={i} className="flex items-start gap-3"><span className="mt-2 text-xs text-clay">●</span><span className="leading-relaxed text-ink/80">{item}</span></li>))}</ul></section>
      <section className="mx-auto max-w-4xl border-t border-border py-12"><h2 className="mb-8 font-display text-3xl font-semibold text-ink">{t('personas')}</h2><div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{personas.map((p, i) => (<div key={i} className="rounded-2xl bg-card p-6 ring-1 ring-border/60"><h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3><p className="mt-2 text-sm leading-relaxed text-ink/70">{p.desc}</p></div>))}</div></section>
      <section className="py-12 text-center"><Button asChild size="lg" className="gap-2 bg-clay text-primary-foreground hover:bg-clay/90"><Link href="/gatherings">{t('cta')}<Arrow className="size-4" /></Link></Button></section>
    </Container>
  );
}
