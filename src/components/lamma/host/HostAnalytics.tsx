'use client';
import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore } from '@/lib/applications-store';
import { getUserHost, getHostGatherings } from '@/lib/host-helpers';
import { localized } from '@/lib/use-localized';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const C = { clay: '#B85C3E', saffron: '#E8A93C', teal: '#2A5F5A', success: '#4A7C59', stone: '#8B8478', paper: '#FBF8F2', ink: '#1A1614' };

export function HostAnalytics() {
  const t = useTranslations('host.analytics');
  const locale = useLocale() as 'ar' | 'en';
  const { user, hasHydrated } = useAuthStore();
  const { getByHost } = useApplicationsStore();
  const host = hasHydrated && user ? getUserHost(user.id) : null;
  const hostGatherings = host ? getHostGatherings(host.handle) : [];
  const apps = hasHydrated && user ? getByHost(user.id) : [];
  const stats = useMemo(() => ({ totalGatherings: hostGatherings.length, totalApplications: apps.length, totalApproved: apps.filter((a) => a.status === 'APPROVED').length, avgRating: (host?.avgRating ?? 0).toFixed(1) }), [apps, hostGatherings, host]);
  const overTimeData = useMemo(() => [1,2,3,4,5,6].map((m, i) => { const monthApps = apps.filter((a) => { const d = new Date(a.createdAt); return d.getMonth() === (new Date().getMonth() - 5 + i + 12) % 12; }); return { month: `${m}`, pending: monthApps.filter((a) => a.status === 'PENDING').length, approved: monthApps.filter((a) => a.status === 'APPROVED').length, rejected: monthApps.filter((a) => a.status === 'REJECTED').length }; }), [apps]);
  const acceptanceData = useMemo(() => hostGatherings.map((g) => { const gApps = apps.filter((a) => a.gatheringSlug === g.slug); return { name: localized(g.title, locale).slice(0, 20), approved: gApps.filter((a) => a.status === 'APPROVED').length, pending: gApps.filter((a) => a.status === 'PENDING').length, rejected: gApps.filter((a) => a.status === 'REJECTED').length }; }), [hostGatherings, apps, locale]);
  const topGatheringsData = useMemo(() => hostGatherings.map((g) => { const gApps = apps.filter((a) => a.gatheringSlug === g.slug); const approved = gApps.filter((a) => a.status === 'APPROVED').length; return { name: localized(g.title, locale).slice(0, 25), fill: g.capacityMax > 0 ? Math.round((approved / g.capacityMax) * 100) : 0 }; }).sort((a, b) => b.fill - a.fill).slice(0, 5), [hostGatherings, apps, locale]);
  const matchDistData = useMemo(() => ['60-69','70-79','80-89','90-100'].map((b) => { const [lo, hi] = b.split('-').map(Number); return { range: b, count: apps.filter((a) => { const s = a.matchScore ?? 0; return s >= lo && s <= hi; }).length }; }), [apps]);
  if (!hasHydrated || !user || !host) return null;
  const ts = { backgroundColor: C.paper, border: `1px solid ${C.stone}33`, borderRadius: '8px', color: C.ink, fontSize: '12px' };

  return (
    <div>
      <header className="mb-6"><h1 className="font-display text-3xl font-semibold text-ink">{t('title')}</h1></header>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[{ label: t('totalGatherings'), value: stats.totalGatherings, color: 'text-clay' }, { label: t('totalApplications'), value: stats.totalApplications, color: 'text-teal' }, { label: t('totalApproved'), value: stats.totalApproved, color: 'text-success' }, { label: t('avgRating'), value: stats.avgRating, color: 'text-saffron' }].map((s, i) => (
          <div key={i} className="rounded-2xl bg-card p-5 ring-1 ring-border/60"><p className={`font-display text-3xl font-bold tabular ${s.color}`}>{s.value}</p><p className="mt-1 text-xs text-stone">{s.label}</p></div>
        ))}
      </div>
      <section className="mb-8 rounded-2xl bg-card p-6 ring-1 ring-border/60"><h2 className="mb-4 font-display text-lg font-semibold text-ink">{t('applicationsOverTime')}</h2><ResponsiveContainer width="100%" height={260}><BarChart data={overTimeData}><CartesianGrid strokeDasharray="3 3" stroke={C.stone} opacity={0.2} /><XAxis dataKey="month" tick={{ fontSize: 12, fill: C.stone }} /><YAxis tick={{ fontSize: 12, fill: C.stone }} allowDecimals={false} /><Tooltip contentStyle={ts} /><Legend wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="pending" stackId="a" fill={C.saffron} name="Pending" /><Bar dataKey="approved" stackId="a" fill={C.success} name="Approved" /><Bar dataKey="rejected" stackId="a" fill={C.clay} name="Rejected" /></BarChart></ResponsiveContainer></section>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-card p-6 ring-1 ring-border/60"><h2 className="mb-4 font-display text-lg font-semibold text-ink">{t('acceptanceRate')}</h2><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={acceptanceData} dataKey="approved" nameKey="name" cx="50%" cy="50%" outerRadius={90}>{acceptanceData.map((_, i) => <Cell key={i} fill={[C.clay, C.teal, C.saffron, C.success][i % 4]} />)}</Pie><Tooltip contentStyle={ts} /></PieChart></ResponsiveContainer></section>
        <section className="rounded-2xl bg-card p-6 ring-1 ring-border/60"><h2 className="mb-4 font-display text-lg font-semibold text-ink">{t('topGatherings')}</h2><ResponsiveContainer width="100%" height={260}><BarChart data={topGatheringsData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke={C.stone} opacity={0.2} /><XAxis type="number" tick={{ fontSize: 12, fill: C.stone }} domain={[0, 100]} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: C.stone }} width={120} /><Tooltip contentStyle={ts} /><Bar dataKey="fill" fill={C.clay} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></section>
      </div>
      <section className="rounded-2xl bg-card p-6 ring-1 ring-border/60"><h2 className="mb-4 font-display text-lg font-semibold text-ink">{t('matchScoreDistribution')}</h2><ResponsiveContainer width="100%" height={220}><AreaChart data={matchDistData}><defs><linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.clay} stopOpacity={0.6} /><stop offset="100%" stopColor={C.clay} stopOpacity={0.05} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={C.stone} opacity={0.2} /><XAxis dataKey="range" tick={{ fontSize: 12, fill: C.stone }} /><YAxis tick={{ fontSize: 12, fill: C.stone }} allowDecimals={false} /><Tooltip contentStyle={ts} /><Area type="monotone" dataKey="count" stroke={C.clay} fill="url(#matchGrad)" strokeWidth={2} /></AreaChart></ResponsiveContainer></section>
    </div>
  );
}
