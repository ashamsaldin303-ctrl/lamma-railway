'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/lib/auth-store';
import { useApplicationsStore } from '@/lib/applications-store';
import { RequireAuth } from '@/components/lamma/auth/RequireAuth';
import { StepIndicator } from '@/components/lamma/applications/StepIndicator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Gathering } from '@/data/types';

export function ApplyForm({ gathering }: { gathering: Gathering }) {
  const t = useTranslations('application_form');
  const locale = useLocale() as 'ar' | 'en';
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { submit } = useApplicationsStore();
  const [step, setStep] = useState(1);
  const [motivation, setMotivation] = useState('');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  const submitForm = () => {
    if (!declaration || !user) return;
    const newApp = submit({ gatheringSlug: gathering.slug, gatheringTitle: JSON.stringify(gathering.title), userId: user.id, userEmail: user.email, userName: JSON.stringify(user.nameLocalized), motivation, customAnswers });
    router.push(`/gatherings/apply/${gathering.slug}/success?appId=${newApp.id}`);
  };

  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl">
        <StepIndicator current={step} total={4} />
        <div className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-border/60 sm:p-8">
          {step === 1 && (<div className="space-y-4"><div className="space-y-2"><Label htmlFor="motivation" className="font-display text-base font-semibold text-ink">{t('motivation')}</Label><p className="text-sm text-stone">{t('motivationHint')}</p><Textarea id="motivation" value={motivation} onChange={(e) => setMotivation(e.target.value)} rows={6} className="bg-paper" /><span className="text-xs text-stone">{motivation.length}/50</span></div></div>)}
          {step === 2 && gathering.applicationQuestions.length > 0 && (<div className="space-y-6">{gathering.applicationQuestions.map((q, i) => { const key = `q${i}`; return <div key={key} className="space-y-2"><Label className="font-display text-base font-semibold text-ink">{q[locale]} *</Label><Textarea value={customAnswers[key] ?? ''} onChange={(e) => setCustomAnswers((p) => ({ ...p, [key]: e.target.value }))} rows={4} className="bg-paper" /></div>; })}</div>)}
          {step === 2 && gathering.applicationQuestions.length === 0 && <p className="text-sm text-stone">{t('backgroundHint')}</p>}
          {step === 3 && <p className="text-sm text-stone">Logistics step — optional fields</p>}
          {step === 4 && (<div className="space-y-5"><h2 className="font-display text-xl font-semibold text-ink">{t('summary')}</h2><label className="flex items-start gap-3 rounded-lg bg-paper p-4 ring-1 ring-border/40"><input type="checkbox" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} className="mt-1 accent-clay" /><span className="text-sm leading-relaxed text-ink/80">{t('declaration')}</span></label></div>)}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(s - 1, 1))} disabled={step === 1} className="gap-1.5"><Arrow className="size-4 rotate-180" />{t('previous')}</Button>
          {step < 4 ? <Button onClick={() => setStep((s) => Math.min(s + 1, 4))} className="gap-1.5 bg-clay text-primary-foreground hover:bg-clay/90">{t('next')}<Arrow className="size-4" /></Button> : <Button onClick={submitForm} disabled={!declaration} className="bg-clay text-primary-foreground hover:bg-clay/90">{t('submit')}</Button>}
        </div>
      </div>
    </RequireAuth>
  );
}
