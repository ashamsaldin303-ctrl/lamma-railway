import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/lamma/Container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  return { title: t('title'), description: t('subtitle') };
}
const CATEGORIES = [
  { id: 'general', items: ['q1','q2','q3','q4','q5'] },
  { id: 'gatherings', items: ['q6','q7','q8','q9','q10'] },
  { id: 'hosts', items: ['q11','q12','q13','q14'] },
  { id: 'payments', items: ['q15','q16','q17'] },
  { id: 'tech', items: ['q18','q19','q20'] },
] as const;

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'faq' });
  const tB = await getTranslations({ locale, namespace: 'breadcrumbs' });
  const Sep = locale === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <Container className="py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-stone"><Link href="/" className="hover:text-clay">{tB('home')}</Link><Sep className="size-3" /><span className="text-ink">{t('breadcrumbs')}</span></nav>
      <header className="mb-10 border-b border-border pb-6"><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{t('title')}</h1><p className="mt-2 text-sm text-ink/70 sm:text-base">{t('subtitle')}</p></header>
      <div className="mx-auto max-w-3xl space-y-10">
        {CATEGORIES.map((cat) => (
          <section key={cat.id}>
            <h2 className="mb-4 font-display text-xl font-semibold text-clay">{t(`categories.${cat.id}` as 'general')}</h2>
            <Accordion type="single" collapsible className="rounded-2xl bg-card px-2 ring-1 ring-border/60">
              {cat.items.map((itemKey, i) => (
                <AccordionItem key={itemKey} value={itemKey} className={i === cat.items.length - 1 ? 'border-b-0' : ''}>
                  <AccordionTrigger className="px-4 text-start font-display text-base font-medium text-ink hover:text-clay">{t(itemKey as 'q1')}</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-ink/70">{t(`a${itemKey.slice(1)}` as 'a1')}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
      <section className="mt-16 rounded-2xl bg-paper p-8 text-center ring-1 ring-border/60"><p className="mb-4 text-lg text-ink/80">{t('notFound')}</p><Button asChild variant="outline" className="gap-2 border-clay/40 text-clay hover:bg-clay/10"><a href="mailto:hello@lamma.kw"><Mail className="size-4" />{t('contactCta')}</a></Button></section>
    </Container>
  );
}
