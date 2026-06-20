'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Calendar, Inbox, BarChart3, MessageSquare, Plus, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApplicationsStore } from '@/lib/applications-store';
import { useAuthStore } from '@/lib/auth-store';
import { getUserHost } from '@/lib/host-helpers';

const navItems = [
  { href: '/dashboard/host/gatherings', icon: Calendar, key: 'gatherings' },
  { href: '/dashboard/host/applications', icon: Inbox, key: 'applications', badge: true },
  { href: '/dashboard/host/analytics', icon: BarChart3, key: 'analytics' },
  { href: '/dashboard/host/messages', icon: MessageSquare, key: 'messages' },
] as const;

export function HostSidebar() {
  const t = useTranslations('host.nav'); const tHost = useTranslations('host');
  const pathname = usePathname();
  const { user, hasHydrated } = useAuthStore();
  const { getByHost } = useApplicationsStore();
  const host = hasHydrated && user ? getUserHost(user.id) : null;
  const pendingCount = hasHydrated && user ? getByHost(user.id).filter((a) => a.status === 'PENDING').length : 0;

  return (
    <aside className="h-fit lg:sticky lg:top-24">
      <nav className="space-y-1">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone transition-colors hover:bg-sand"><Home className="size-4" />{t('userDashboard')}</Link>
        {navItems.map((item) => { const segment = item.href.split('/').pop()!; const isActive = pathname.includes(segment); const Icon = item.icon; return (
          <Link key={item.href} href={item.href} className={cn('flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'bg-clay/10 font-medium text-clay' : 'text-ink/70 hover:bg-sand')}>
            <span className="flex items-center gap-3"><Icon className="size-4" />{t(item.key)}</span>
            {'badge' in item && item.badge && pendingCount > 0 && <span className="rounded-full bg-clay px-2 py-0.5 text-xs text-paper tabular">{pendingCount}</span>}
          </Link>); })}
        <div className="mt-4 border-t border-stone/20 pt-4"><Link href="/dashboard/host/new" className="flex items-center gap-3 rounded-lg bg-clay px-3 py-2.5 text-sm text-paper transition-colors hover:bg-clay/90"><Plus className="size-4" />{t('newGathering')}</Link></div>
      </nav>
      {host && <div className="mt-6 rounded-lg bg-sand p-4"><p className="mb-2 text-xs text-stone">{tHost('hostingAs')}</p><p className="font-display text-sm">{host.handle}</p>{host.isVerified && <p className="mt-1 text-xs text-success">✓ {tHost('verified')}</p>}</div>}
    </aside>
  );
}
