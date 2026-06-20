import { setRequestLocale } from 'next-intl/server';
import { HostAnalytics } from '@/components/lamma/host/HostAnalytics';
type Props = { params: Promise<{ locale: string }> };
export default async function HostAnalyticsPage({ params }: Props) { const { locale } = await params; setRequestLocale(locale); return <HostAnalytics />; }
