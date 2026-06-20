import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/lamma/Container';
import { Compass } from 'lucide-react';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-sand"><Compass className="size-8 text-clay" /></div>
        <h1 className="mb-3 font-display text-4xl font-semibold text-ink">{t('title')}</h1>
        <p className="mb-8 leading-relaxed text-stone">{t('description')}</p>
        <Link href="/gatherings" className="inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-clay/90">{t('cta')}</Link>
      </div>
    </Container>
  );
}
