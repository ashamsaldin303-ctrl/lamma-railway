import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ApplicationsList } from '@/components/lamma/dashboard/ApplicationsList';
type Props = { params: Promise<{ locale: string }> };
export default async function MyApplicationsPage({ params }: Props) {
  const { locale } = await params; setRequestLocale(locale);
  return <ApplicationsList />;
}
