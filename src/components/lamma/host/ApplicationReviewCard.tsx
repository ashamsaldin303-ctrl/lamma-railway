'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X, ListPlus, Eye, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/lamma/applications/StatusBadge';
import { AIReviewInsight } from '@/components/lamma/ai/AIReviewInsight';
import { useApplicationsStore, type Application } from '@/lib/applications-store';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';
import { localized } from '@/lib/use-localized';
import { formatRelative } from '@/lib/format';
import { getDemoUserById } from '@/data/demo-users';
import { gatheringsBySlug } from '@/data/gatherings';
import { computeMatchScore } from '@/lib/matching/engine';

export function ApplicationReviewCard({ application }: { application: Application }) {
  const t = useTranslations('host.applications');
  const locale = useLocale() as 'ar' | 'en';
  const { user } = useAuthStore();
  const { updateStatus } = useApplicationsStore();
  const { toast } = useToast();
  const applicantName = JSON.parse(application.userName) as { ar: string; en: string };
  const gatheringTitle = JSON.parse(application.gatheringTitle) as { ar: string; en: string };
  const applicantUser = getDemoUserById(application.userId);
  const avatarUrl = applicantUser?.avatarUrl ?? '/images/hosts/abdullah.jpg';
  const gatheringForScore = gatheringsBySlug[application.gatheringSlug];
  const matchScore = applicantUser && gatheringForScore ? computeMatchScore(applicantUser, gatheringForScore) : application.matchScore ?? 0;
  const matchColor = matchScore >= 80 ? 'bg-success' : matchScore >= 65 ? 'bg-saffron' : 'bg-stone';
  const matchLabel = matchScore >= 80 ? t('matchHigh') : matchScore >= 65 ? t('matchMedium') : t('matchLow');
  const isPending = application.status === 'PENDING';

  const handleAction = (action: 'APPROVED' | 'REJECTED' | 'WAITLISTED') => {
    if (!user) return;
    updateStatus(application.id, action, user.id);
    toast({ title: t(`actions.${action.toLowerCase()}.title` as 'actions.approved.title'), description: t(`actions.${action.toLowerCase()}.description` as 'actions.approved.description', { name: localized(applicantName, locale) }) });
  };

  return (
    <Card className="p-5 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start gap-4">
        <Avatar className="size-12"><AvatarImage src={avatarUrl} alt="" /><AvatarFallback>{localized(applicantName, locale).charAt(0)}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1"><h3 className="font-display text-lg font-semibold text-ink">{localized(applicantName, locale)}</h3><p className="text-xs text-stone">{application.userEmail}</p><p className="mt-1 text-xs text-stone">{t('forGathering')}: <span className="font-medium text-ink">{localized(gatheringTitle, locale)}</span></p></div>
        <StatusBadge status={application.status} size="sm" />
      </div>
      <div className="mb-4 rounded-lg bg-sand p-3">
        <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-1 text-xs text-stone"><span className="text-clay">●</span> {t('aiMatchScore')}</span><span className="font-display text-sm tabular">{matchScore}%</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-paper"><div className={`h-full ${matchColor} transition-all duration-500`} style={{ width: `${matchScore}%` }} /></div>
        <p className="mt-1.5 text-xs text-stone">{matchLabel}</p>
      </div>
      <div className="mb-4"><AIReviewInsight applicantId={application.userId} gatheringSlug={application.gatheringSlug} locale={locale} /></div>
      <div className="mb-4"><p className="mb-1 text-xs text-stone">{t('motivation')}</p><p className="line-clamp-2 text-sm text-ink/80">{application.motivation}</p></div>
      <p className="mb-4 flex items-center gap-1 text-xs text-stone"><Clock className="size-3" />{t('submittedAgo', { time: formatRelative(application.createdAt, locale) })}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm"><Eye className="me-1.5 size-3.5" />{t('viewDetails')}</Button>
        {isPending && (<><Button size="sm" className="bg-success text-paper hover:bg-success/90" onClick={() => handleAction('APPROVED')}><Check className="me-1.5 size-3.5" />{t('approve')}</Button><Button size="sm" variant="outline" className="border-teal text-teal hover:bg-teal/10" onClick={() => handleAction('WAITLISTED')}><ListPlus className="me-1.5 size-3.5" />{t('waitlist')}</Button><Button size="sm" variant="outline" className="border-error text-error hover:bg-error/10" onClick={() => handleAction('REJECTED')}><X className="me-1.5 size-3.5" />{t('reject')}</Button></>)}
      </div>
    </Card>
  );
}
