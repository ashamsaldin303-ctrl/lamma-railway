import { setRequestLocale } from 'next-intl/server';
import { HostGatherings } from '@/components/lamma/host/HostGatherings';
type Props = { params: Promise<{ locale: string }> };
export default async function HostGatheringsPage({ params }: Props) { const { locale } = await params; setRequestLocale(locale); return <HostGatherings />; }
