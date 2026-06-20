'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/lib/auth-store';
import { useHostGatheringsStore } from '@/lib/host-gatherings-store';
import { getUserHost } from '@/lib/host-helpers';
import { topics } from '@/data/topics';
import { RequireAuth } from '@/components/lamma/auth/RequireAuth';
import { StepIndicator } from '@/components/lamma/applications/StepIndicator';
import { AIActionButton } from '@/components/lamma/ai/AIActionButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import type { GatheringFormat, LocalizedString } from '@/data/types';

const FORMATS: GatheringFormat[] = ['MEN_ONLY', 'WOMEN_ONLY', 'FAMILY', 'MIXED'];

interface FormData { titleAr: string; titleEn: string; topicSlug: string; format: GatheringFormat; coverImage: string; startDate: string; endDate: string; prayerAware: boolean; venueNameAr: string; venueNameEn: string; venueAddressAr: string; venueAddressEn: string; hideLocation: boolean; capacityMin: number; capacityMax: number; priceKwd: number; isFree: boolean; applicationsOpen: string; applicationsClose: string; descriptionAr: string; descriptionEn: string; questions: Array<{ ar: string; en: string }>; declaration: boolean; }
const INITIAL: FormData = { titleAr: '', titleEn: '', topicSlug: '', format: 'MIXED', coverImage: '/images/gatherings/memory-mubarakiya-walk.jpg', startDate: '', endDate: '', prayerAware: true, venueNameAr: '', venueNameEn: '', venueAddressAr: '', venueAddressEn: '', hideLocation: false, capacityMin: 5, capacityMax: 20, priceKwd: 0, isFree: true, applicationsOpen: '', applicationsClose: '', descriptionAr: '', descriptionEn: '', questions: [], declaration: false };

function slugify(text: string): string { return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60); }

export function NewGatheringForm() {
  const t = useTranslations('host.newGathering');
  const tF = useTranslations('formats');
  const locale = useLocale() as 'ar' | 'en';
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { create } = useHostGatheringsStore();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const update = (field: keyof FormData, value: unknown) => setData((p) => ({ ...p, [field]: value as never }));
  const host = hasHydrated && user ? getUserHost(user.id) : null;
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submitForm = () => {
    if (!data.declaration || !user || !host) return;
    const slug = `${slugify(data.titleEn)}-${Date.now().toString(36)}`;
    const loc = (ar: string, en: string): LocalizedString => ({ ar, en });
    create({ slug, hostHandle: host.handle, title: loc(data.titleAr, data.titleEn), description: loc(data.descriptionAr, data.descriptionEn), coverImageUrl: data.coverImage, galleryUrls: [], startDate: new Date(data.startDate).toISOString(), endDate: new Date(data.endDate).toISOString(), isPrayerAware: data.prayerAware, venueName: loc(data.venueNameAr, data.venueNameEn), venueAddress: loc(data.venueAddressAr, data.venueAddressEn), venueLat: 29.3759, venueLng: 47.9774, venueNotes: loc('', ''), isLocationRevealed: !data.hideLocation, format: data.format, capacityMin: data.capacityMin, capacityMax: data.capacityMax, priceKwd: data.isFree ? 0 : data.priceKwd, isFree: data.isFree, applicationQuestions: data.questions, applicationsOpenAt: new Date(data.applicationsOpen).toISOString(), applicationsCloseAt: new Date(data.applicationsClose).toISOString(), topicSlug: data.topicSlug, whoShouldAttend: [], whatToExpect: [] });
    toast({ title: t('successTitle'), description: t('successDescription') });
    router.push('/dashboard/host/gatherings');
  };

  return (
    <RequireAuth>
      <div className="mx-auto max-w-2xl">
        <StepIndicator current={step} total={5} namespace="host.newGathering" />
        <div className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-border/60 sm:p-8">
          {step === 1 && (<div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="titleAr">{t('titleAr')} *</Label><Input id="titleAr" value={data.titleAr} onChange={(e) => update('titleAr', e.target.value)} className="bg-paper" /></div><div className="space-y-2"><Label htmlFor="titleEn">{t('titleEn')} *</Label><Input id="titleEn" value={data.titleEn} onChange={(e) => update('titleEn', e.target.value)} className="bg-paper" /></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>{t('topic')} *</Label><Select value={data.topicSlug} onValueChange={(v) => update('topicSlug', v)}><SelectTrigger className="bg-paper"><SelectValue placeholder="..." /></SelectTrigger><SelectContent>{topics.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name[locale]}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>{t('format')} *</Label><Select value={data.format} onValueChange={(v) => update('format', v as GatheringFormat)}><SelectTrigger className="bg-paper"><SelectValue /></SelectTrigger><SelectContent>{FORMATS.map((f) => <SelectItem key={f} value={f}>{tF(f)}</SelectItem>)}</SelectContent></Select></div></div>
            <div className="space-y-2"><Label htmlFor="coverImage">{t('coverImage')}</Label><Input id="coverImage" value={data.coverImage} onChange={(e) => update('coverImage', e.target.value)} className="bg-paper" placeholder="/images/..." /></div>
          </div>)}
          {step === 2 && (<div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="startDate">{t('startDate')} *</Label><Input id="startDate" type="datetime-local" value={data.startDate} onChange={(e) => update('startDate', e.target.value)} className="bg-paper" /></div><div className="space-y-2"><Label htmlFor="endDate">{t('endDate')} *</Label><Input id="endDate" type="datetime-local" value={data.endDate} onChange={(e) => update('endDate', e.target.value)} className="bg-paper" /></div></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.prayerAware} onChange={(e) => update('prayerAware', e.target.checked)} className="accent-clay" />{t('prayerAware')}</label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="venueNameAr">{t('venueName')} (AR) *</Label><Input id="venueNameAr" value={data.venueNameAr} onChange={(e) => update('venueNameAr', e.target.value)} className="bg-paper" /></div><div className="space-y-2"><Label htmlFor="venueNameEn">{t('venueName')} (EN)</Label><Input id="venueNameEn" value={data.venueNameEn} onChange={(e) => update('venueNameEn', e.target.value)} className="bg-paper" /></div></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="venueAddressAr">{t('venueAddress')} (AR) *</Label><Input id="venueAddressAr" value={data.venueAddressAr} onChange={(e) => update('venueAddressAr', e.target.value)} className="bg-paper" /></div><div className="space-y-2"><Label htmlFor="venueAddressEn">{t('venueAddress')} (EN)</Label><Input id="venueAddressEn" value={data.venueAddressEn} onChange={(e) => update('venueAddressEn', e.target.value)} className="bg-paper" /></div></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.hideLocation} onChange={(e) => update('hideLocation', e.target.checked)} className="accent-clay" />{t('hideLocation')}</label>
          </div>)}
          {step === 3 && (<div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="capacityMin">{t('capacityMin')}</Label><Input id="capacityMin" type="number" min={1} value={data.capacityMin} onChange={(e) => update('capacityMin', Number(e.target.value))} className="bg-paper" /></div><div className="space-y-2"><Label htmlFor="capacityMax">{t('capacityMax')}</Label><Input id="capacityMax" type="number" min={5} max={80} value={data.capacityMax} onChange={(e) => update('capacityMax', Number(e.target.value))} className="bg-paper" /></div></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.isFree} onChange={(e) => update('isFree', e.target.checked)} className="accent-clay" />{t('isFree')}</label>
            {!data.isFree && <div className="space-y-2"><Label htmlFor="price">{t('price')}</Label><Input id="price" type="number" step="0.001" min={0} value={data.priceKwd} onChange={(e) => update('priceKwd', Number(e.target.value))} className="bg-paper" /></div>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="applicationsOpen">{t('applicationsOpen')} *</Label><Input id="applicationsOpen" type="datetime-local" value={data.applicationsOpen} onChange={(e) => update('applicationsOpen', e.target.value)} className="bg-paper" /></div><div className="space-y-2"><Label htmlFor="applicationsClose">{t('applicationsClose')} *</Label><Input id="applicationsClose" type="datetime-local" value={data.applicationsClose} onChange={(e) => update('applicationsClose', e.target.value)} className="bg-paper" /></div></div>
          </div>)}
          {step === 4 && (<div className="space-y-4">
            <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="descriptionAr">{t('description')} (AR)</Label><AIActionButton endpoint="/api/v1/ai/enhance-description" payload={{ title: data.titleAr, topic: data.topicSlug, format: data.format, currentDescription: data.descriptionAr, locale: 'ar' }} onResult={(result) => update('descriptionAr', result)} label={locale === 'ar' ? 'تحسين بالـ AI' : 'Enhance with AI'} /></div><Textarea id="descriptionAr" value={data.descriptionAr} onChange={(e) => update('descriptionAr', e.target.value)} rows={5} className="bg-paper" /></div>
            <div className="space-y-2"><Label htmlFor="descriptionEn">{t('description')} (EN)</Label><Textarea id="descriptionEn" value={data.descriptionEn} onChange={(e) => update('descriptionEn', e.target.value)} rows={5} className="bg-paper" /></div>
            <div className="space-y-3"><div className="flex items-center justify-between"><Label>{t('applicationQuestions')}</Label><AIActionButton endpoint="/api/v1/ai/suggest-questions" payload={{ title: data.titleAr, topic: data.topicSlug, format: data.format, locale: 'ar' }} extract={(data) => Array.isArray(data.questions) ? JSON.stringify(data.questions) : undefined} onResult={(result) => { try { const qs = JSON.parse(result); if (Array.isArray(qs)) update('questions', qs.map((q: { question: { ar: string; en: string } }) => q.question)); } catch {} }} label={locale === 'ar' ? 'اقترح أسئلة' : 'Suggest questions'} /></div>
              {data.questions.map((q, i) => (<div key={i} className="flex gap-2 rounded-lg bg-paper p-3 ring-1 ring-border/40"><div className="grid flex-1 grid-cols-2 gap-2"><Input value={q.ar} placeholder="AR" onChange={(e) => { const qs = [...data.questions]; qs[i] = { ...qs[i], ar: e.target.value }; update('questions', qs); }} className="bg-card" /><Input value={q.en} placeholder="EN" onChange={(e) => { const qs = [...data.questions]; qs[i] = { ...qs[i], en: e.target.value }; update('questions', qs); }} className="bg-card" /></div><Button type="button" variant="ghost" size="icon" onClick={() => update('questions', data.questions.filter((_, j) => j !== i))}><X className="size-4" /></Button></div>))}
              <Button type="button" variant="outline" size="sm" onClick={() => update('questions', [...data.questions, { ar: '', en: '' }])} className="gap-1"><Plus className="size-3.5" />{t('addQuestion')}</Button>
            </div>
          </div>)}
          {step === 5 && (<div className="space-y-5"><h2 className="font-display text-xl font-semibold text-ink">{t('steps.5')}</h2>
            <div className="space-y-3 rounded-lg bg-paper p-4 ring-1 ring-border/40"><p><span className="text-stone">{t('titleAr')}:</span> {data.titleAr}</p><p><span className="text-stone">{t('titleEn')}:</span> {data.titleEn}</p><p><span className="text-stone">{t('topic')}:</span> {topics.find((t) => t.slug === data.topicSlug)?.name[locale]}</p><p><span className="text-stone">{t('capacityMax')}:</span> {data.capacityMax}</p></div>
            <label className="flex items-start gap-3 rounded-lg bg-paper p-4 ring-1 ring-border/40"><input type="checkbox" checked={data.declaration} onChange={(e) => update('declaration', e.target.checked)} className="mt-1 accent-clay" /><span className="text-sm leading-relaxed text-ink/80">{t('declaration')}</span></label>
          </div>)}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 1} className="gap-1.5"><Arrow className="size-4 rotate-180" />{locale === 'ar' ? 'السابق' : 'Previous'}</Button>
          {step < 5 ? <Button onClick={next} className="gap-1.5 bg-clay text-primary-foreground hover:bg-clay/90">{locale === 'ar' ? 'التالي' : 'Next'}<Arrow className="size-4" /></Button> : <Button onClick={submitForm} disabled={!data.declaration} className="bg-clay text-primary-foreground hover:bg-clay/90">{t('submit')}</Button>}
        </div>
      </div>
    </RequireAuth>
  );
}
