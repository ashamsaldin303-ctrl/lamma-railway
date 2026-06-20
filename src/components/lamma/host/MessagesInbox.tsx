'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useConversationsStore } from '@/lib/conversations-store';
import { useAuthStore } from '@/lib/auth-store';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/utils';

export function MessagesInbox() {
  const t = useTranslations('host.messages');
  const locale = useLocale() as 'ar' | 'en';
  const { user, hasHydrated } = useAuthStore();
  const { getConversationsByHost, getMessages, sendMessage, markRead } = useConversationsStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = hasHydrated && user ? getConversationsByHost(user.id) : [];
  const messages = selectedId ? getMessages(selectedId) : [];

  useEffect(() => { if (selectedId) markRead(selectedId); }, [selectedId, messages.length, markRead]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => { if (!input.trim() || !selectedId) return; sendMessage(selectedId, input.trim(), true); setInput(''); };
  const selectedConv = conversations.find((c) => c.id === selectedId);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-semibold text-ink">{t('title')}</h1>
      <p className="mb-6 text-stone">{t('subtitle' as never) as string || (locale === 'ar' ? 'تواصل مباشر مع المتقدمين' : 'Direct messaging with applicants')}</p>
      <div className="grid h-[70vh] gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col overflow-hidden"><div className="border-b border-stone/10 p-3"><p className="text-sm font-medium text-ink">{t('conversations' as never) as string || (locale === 'ar' ? 'المحادثات' : 'Conversations')}</p></div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? <div className="p-8 text-center text-stone"><MessageSquare className="mx-auto mb-2 size-8 opacity-30" /><p className="text-sm">{t('empty')}</p></div> : conversations.map((conv) => (
              <button key={conv.id} onClick={() => setSelectedId(conv.id)} className={cn('flex w-full items-start gap-3 border-b border-stone/5 p-3 text-start transition-colors hover:bg-sand', selectedId === conv.id && 'bg-sand/50')}>
                <Avatar className="size-10 shrink-0">{conv.attendeeAvatar && <AvatarImage src={conv.attendeeAvatar} alt="" />}<AvatarFallback>{conv.attendeeName.charAt(0)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><div className="flex items-baseline justify-between gap-2"><p className="truncate text-sm font-medium text-ink">{conv.attendeeName}</p><span className="shrink-0 text-xs text-stone">{formatRelative(conv.lastMessageAt, locale)}</span></div><p className="mt-0.5 truncate text-xs text-stone">{conv.gatheringTitle}</p>{conv.unreadCount > 0 && <span className="mt-1 inline-block rounded-full bg-clay px-1.5 py-0.5 text-xs text-paper tabular">{conv.unreadCount}</span>}</div>
              </button>
            ))}
          </div>
        </Card>
        <Card className="flex flex-col">
          {!selectedId ? <div className="flex flex-1 items-center justify-center text-stone"><div className="text-center"><MessageSquare className="mx-auto mb-3 size-12 opacity-30" /><p>{t('selectConversation' as never) as string || (locale === 'ar' ? 'اختر محادثة' : 'Select a conversation')}</p></div></div> : (
            <>
              <div className="flex items-center gap-3 border-b border-stone/10 p-3"><Avatar className="size-10">{selectedConv?.attendeeAvatar && <AvatarImage src={selectedConv.attendeeAvatar} alt="" />}<AvatarFallback>{selectedConv?.attendeeName.charAt(0)}</AvatarFallback></Avatar><div className="flex-1"><p className="font-medium text-ink">{selectedConv?.attendeeName}</p><p className="text-xs text-stone">{selectedConv?.gatheringTitle}</p></div></div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex', msg.isFromHost ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[75%] rounded-2xl p-3', msg.isFromHost ? 'rounded-tr-sm bg-clay text-paper' : 'rounded-tl-sm bg-sand')}><p className="text-sm">{msg.content}</p><p className={cn('mt-1 text-xs tabular', msg.isFromHost ? 'text-paper/70' : 'text-stone')}>{new Date(msg.timestamp).toLocaleTimeString(locale === 'ar' ? 'ar-KW' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</p></div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2 border-t border-stone/10 p-3"><Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('messagePlaceholder' as never) as string || (locale === 'ar' ? 'اكتب رسالة...' : 'Type a message...')} onKeyDown={(e) => e.key === 'Enter' && handleSend()} /><Button onClick={handleSend} disabled={!input.trim()} className="bg-clay text-paper hover:bg-clay/90"><Send className="size-4" /></Button></div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
