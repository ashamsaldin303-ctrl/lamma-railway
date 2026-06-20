import { setRequestLocale } from 'next-intl/server';
import { MessagesInbox } from '@/components/lamma/host/MessagesInbox';
type Props = { params: Promise<{ locale: string }> };
export default async function HostMessagesPage({ params }: Props) {
  const { locale } = await params; setRequestLocale(locale);
  return <MessagesInbox />;
}
