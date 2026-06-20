'use client';

import { useEffect, useState, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PrayerTimeBadge } from '@/components/lamma/PrayerTimeBadge';
import { localized } from '@/lib/use-localized';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { checkPrayerConflict, getPrayerTimeForDate } from '@/data/prayer-times';
import { Send, Heart, Star, Users, Clock, MessageSquare, Quote } from 'lucide-react';
import type { Gathering } from '@/data/types';

interface Attendee { socketId: string; userId: string; userName: string; avatarUrl?: string; joinedAt: number; isHost: boolean; }
interface LiveMessage { id: string; userId: string; userName: string; avatarUrl?: string; content: string; timestamp: number; isSystem: boolean; }
interface LiveMoment { id: string; userId: string; userName: string; type: 'highlight' | 'quote' | 'photo-placeholder'; content: string; hearts: number; timestamp: number; }

export function LiveCompanion({ gathering }: { gathering: Gathering }) {
  const t = useTranslations('live');
  const locale = useLocale() as 'ar' | 'en';
  const { user, hasHydrated } = useAuthStore();

  const prayerConflict = checkPrayerConflict(new Date(gathering.startDate), new Date(gathering.endDate));
  const prayerDay = getPrayerTimeForDate(new Date(gathering.startDate));
  const prayerKey = (prayerConflict.prayer ?? 'isha') as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  const prayerTime = prayerDay ? prayerDay[prayerKey] : undefined;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [moments, setMoments] = useState<LiveMoment[]>([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'moments' | 'attendees'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasHydrated || !user) return;
    const newSocket = io('/?XTransformPort=3003', { transports: ['websocket'] });
    setSocket(newSocket);
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('gathering:join', { gatheringSlug: gathering.slug, userId: user.id, userName: localized(user.nameLocalized, locale), avatarUrl: user.avatarUrl, isHost: user.membershipTier === 'HOST' });
    });
    newSocket.on('disconnect', () => setConnected(false));
    newSocket.on('gathering:state', (state: { attendees: Attendee[]; messages: LiveMessage[]; moments: LiveMoment[] }) => {
      setAttendees(state.attendees); setMessages(state.messages); setMoments(state.moments);
    });
    newSocket.on('message:new', (msg: LiveMessage) => setMessages((p) => [...p, msg]));
    newSocket.on('attendee:join', (a: Attendee) => setAttendees((p) => p.find((x) => x.userId === a.userId) ? p : [...p, a]));
    newSocket.on('attendee:leave', ({ userId }: { userId: string }) => setAttendees((p) => p.filter((a) => a.userId !== userId)));
    newSocket.on('moment:new', (m: LiveMoment) => setMoments((p) => [m, ...p]));
    newSocket.on('moment:hearted', ({ momentId, hearts }: { momentId: string; hearts: number }) => setMoments((p) => p.map((m) => m.id === momentId ? { ...m, hearts } : m)));
    newSocket.on('typing:start', ({ userId, userName }: { userId: string; userName: string }) => setTypingUsers((p) => new Map(p).set(userId, userName)));
    newSocket.on('typing:stop', ({ userId }: { userId: string }) => setTypingUsers((p) => { const n = new Map(p); n.delete(userId); return n; }));
    return () => { newSocket.close(); };
  }, [hasHydrated, user, gathering.slug, locale]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { const start = new Date(gathering.startDate).getTime(); const iv = setInterval(() => setElapsedMs(Date.now() - start), 1000); return () => clearInterval(iv); }, [gathering.startDate]);

  const sendMessage = () => { if (!input.trim() || !socket) return; socket.emit('message:send', { content: input.trim() }); setInput(''); socket.emit('typing:stop'); };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value); if (!socket) return; socket.emit('typing:start'); if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); typingTimeoutRef.current = setTimeout(() => socket.emit('typing:stop'), 2000); };
  const createMoment = (type: 'highlight' | 'quote') => { const content = type === 'highlight' ? prompt(locale === 'ar' ? 'صف اللحظة المميزة...' : 'Describe the highlight...') : prompt(locale === 'ar' ? 'اكتب الاقتباس...' : 'Type the quote...'); if (!content || !socket) return; socket.emit('moment:create', { type, content }); };
  const heartMoment = (id: string) => { if (socket) socket.emit('moment:heart', { momentId: id }); };
  const fmt = (ms: number) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };

  if (!hasHydrated || !user) return null;

  return (
    <div className="mx-auto max-w-6xl py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={`/gatherings/${gathering.slug}`} className="mb-1 inline-block text-xs text-stone hover:text-clay">← {t('backToGathering')}</Link>
          <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">{localized(gathering.title, locale)}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-stone">
            <span className={cn('flex items-center gap-1.5', connected ? 'text-success' : 'text-stone')}><span className={cn('size-2 rounded-full', connected ? 'animate-pulse bg-success' : 'bg-stone')} />{connected ? t('live') : t('connecting')}</span>
            <span className="flex items-center gap-1.5"><Clock className="size-3.5" /><span className="tabular">{fmt(elapsedMs)}</span></span>
            <span className="flex items-center gap-1.5"><Users className="size-3.5" />{attendees.length} {t('hereNow')}</span>
          </div>
        </div>
        <PrayerTimeBadge prayerKey={prayerKey} time={prayerTime} />
      </div>

      <div className="mb-4 inline-flex h-10 items-center justify-center rounded-lg bg-sand p-1">
        {([['chat', t('chat'), MessageSquare], ['moments', t('moments'), Star], ['attendees', t('attendees'), Users]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setActiveTab(id)} className={cn('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all', activeTab === id ? 'bg-paper font-medium text-ink shadow-sm' : 'text-stone hover:text-ink')}><Icon className="size-3.5" />{label}</button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div>
          {activeTab === 'chat' && (
            <Card className="flex h-[60vh] flex-col">
              <div className="scroll-lamma flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex gap-2', msg.isSystem && 'justify-center')}>
                    {msg.isSystem ? <p className="text-xs italic text-stone">{msg.content}</p> : (
                      <>
                        <Avatar className="size-8 shrink-0">{msg.avatarUrl && <AvatarImage src={msg.avatarUrl} alt="" />}<AvatarFallback className="text-xs">{msg.userName.charAt(0)}</AvatarFallback></Avatar>
                        <div className="min-w-0 flex-1"><div className="flex items-baseline gap-2"><span className="text-sm font-medium text-ink">{msg.userName}</span><span className="text-xs text-stone tabular">{new Date(msg.timestamp).toLocaleTimeString(locale === 'ar' ? 'ar-KW' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</span></div><p className="break-words text-sm text-ink/80">{msg.content}</p></div>
                      </>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {typingUsers.size > 0 && <div className="px-4 pb-2 text-xs italic text-stone">{Array.from(typingUsers.values()).join('، ')} {t('typing')}</div>}
              <div className="flex gap-2 border-t border-stone/20 p-3">
                <Input value={input} onChange={handleInput} placeholder={t('messagePlaceholder')} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} disabled={!connected} />
                <Button onClick={sendMessage} disabled={!input.trim() || !connected} className="bg-clay text-paper hover:bg-clay/90"><Send className="size-4" /></Button>
              </div>
            </Card>
          )}

          {activeTab === 'moments' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => createMoment('highlight')}><Star className="me-1.5 size-3.5" />{t('addHighlight')}</Button>
                <Button variant="outline" size="sm" onClick={() => createMoment('quote')}><Quote className="me-1.5 size-3.5" />{t('addQuote')}</Button>
              </div>
              {moments.length === 0 ? <Card className="p-8 text-center text-stone"><Star className="mx-auto mb-2 size-8 opacity-30" /><p className="text-sm">{t('noMomentsYet')}</p></Card> : moments.map((m) => (
                <Card key={m.id} className="p-4"><div className="flex items-start gap-3">
                  <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', m.type === 'highlight' ? 'bg-saffron/15 text-saffron' : 'bg-clay/15 text-clay')}>{m.type === 'highlight' ? <Star className="size-5" /> : <Quote className="size-5" />}</div>
                  <div className="flex-1"><p className="mb-1 text-sm font-medium text-ink">{m.userName}</p><p className={cn('text-base', m.type === 'quote' && 'font-display italic')}>{m.type === 'quote' ? `«${m.content}»` : m.content}</p>
                    <div className="mt-2 flex items-center justify-between"><span className="text-xs text-stone tabular">{new Date(m.timestamp).toLocaleTimeString(locale === 'ar' ? 'ar-KW' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</span><button onClick={() => heartMoment(m.id)} className="flex items-center gap-1 text-xs text-stone transition-colors hover:text-clay"><Heart className="size-3.5" /><span className="tabular">{m.hearts}</span></button></div>
                  </div>
                </div></Card>
              ))}
            </div>
          )}

          {activeTab === 'attendees' && (
            <Card className="p-4"><h3 className="mb-3 font-display text-lg font-semibold text-ink">{t('whosHere')}</h3><div className="space-y-2">{attendees.map((a) => (
              <div key={a.userId} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sand">
                <div className="relative"><Avatar className="size-10">{a.avatarUrl && <AvatarImage src={a.avatarUrl} alt="" />}<AvatarFallback>{a.userName.charAt(0)}</AvatarFallback></Avatar><span className="absolute -bottom-0.5 -end-0.5 size-3 rounded-full bg-success ring-2 ring-paper" /></div>
                <div className="flex-1"><p className="flex items-center gap-1.5 text-sm font-medium text-ink">{a.userName}{a.isHost && <span className="rounded bg-clay/15 px-1.5 py-0.5 text-xs text-clay">{t('host')}</span>}</p><p className="text-xs text-stone">{t('joinedAgo', { time: Math.round((Date.now() - a.joinedAt) / 60000) })}</p></div>
              </div>
            ))}</div></Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-4"><div className="mb-3 flex items-center gap-2"><Users className="size-4 text-teal" /><h3 className="font-display text-sm">{t('attendeesCount', { count: attendees.length })}</h3></div><div className="flex flex-wrap gap-2">{attendees.slice(0, 8).map((a) => <Avatar key={a.userId} className="size-8 ring-2 ring-paper">{a.avatarUrl && <AvatarImage src={a.avatarUrl} alt="" />}<AvatarFallback className="text-xs">{a.userName.charAt(0)}</AvatarFallback></Avatar>)}</div></Card>
          <Card className="bg-sand/50 p-4"><div className="mb-2 flex items-center gap-2"><Clock className="size-4 text-clay" /><h3 className="font-display text-sm">{t('prayerReminder')}</h3></div><p className="text-xs text-stone">{t('prayerReminderHint')}</p></Card>
        </div>
      </div>
    </div>
  );
}
