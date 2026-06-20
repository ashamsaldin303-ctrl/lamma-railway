import { setRequestLocale } from 'next-intl/server';
import { HostApplications } from '@/components/lamma/host/HostApplications';
type Props = { params: Promise<{ locale: string }> };
export default async function HostApplicationsPage({ params }: Props) { const { locale } = await params; setRequestLocale(locale); return <HostApplications />; }
