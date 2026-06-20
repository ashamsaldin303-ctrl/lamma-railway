import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ConciergeChat } from '@/components/lamma/ai/ConciergeChat';
import { Container } from '@/components/lamma/Container';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'concierge' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ConciergePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Container className="py-8">
      <div className="mx-auto max-w-3xl">
        <ConciergeChat />
      </div>
    </Container>
  );
}
