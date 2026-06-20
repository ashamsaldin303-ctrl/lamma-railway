import { setRequestLocale } from 'next-intl/server';
import { NotificationCenter } from '@/components/lamma/notifications/NotificationCenter';
import { Container } from '@/components/lamma/Container';

type Props = { params: Promise<{ locale: string }> };
export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Container className="py-8"><div className="mx-auto max-w-3xl"><NotificationCenter /></div></Container>;
}
