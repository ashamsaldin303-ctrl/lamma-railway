'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  { ar: 'أي لمة تناسب اهتماماتي؟', en: 'Which gathering fits my interests?' },
  { ar: 'ما هي فلسفة لَمَّة؟', en: "What is Lamma's philosophy?" },
  { ar: 'هل هناك لمة موسيقية قادمة؟', en: 'Is there an upcoming music gathering?' },
  { ar: 'لمات مجانية هذا الشهر؟', en: 'Free gatherings this month?' },
];

export function ConciergeChat() {
  const t = useTranslations('concierge');
  const tAi = useTranslations('ai');
  const locale = useLocale() as 'ar' | 'en';
  const { user, hasHydrated } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userId: user?.id, locale }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: data.answer || t('errorFallback') },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'assistant', content: t('errorFallback') },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] max-h-[700px] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-xl border-b border-stone/20 bg-paper p-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-clay/10">
          <Sparkles className="size-5 text-clay" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">{t('title')}</h2>
          <p className="text-xs text-stone">{t('subtitle')}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="scroll-lamma flex-1 overflow-y-auto bg-sand/30 p-4">
        {messages.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-clay/10">
              <Sparkles className="size-8 text-clay" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-ink">{t('welcomeTitle')}</h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-stone">{t('welcomeSubtitle')}</p>
            <div className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="justify-start text-start"
                  onClick={() => send(q[locale])}
                >
                  {q[locale]}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full',
                    msg.role === 'user' ? 'bg-teal/10' : 'bg-clay/10',
                  )}
                >
                  {msg.role === 'user' ? (
                    <User className="size-4 text-teal" />
                  ) : (
                    <Sparkles className="size-4 text-clay" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl p-3',
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-teal text-paper'
                      : 'rounded-tl-sm border border-stone/20 bg-paper',
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-clay/10">
                  <Sparkles className="size-4 animate-pulse text-clay" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-stone/20 bg-paper p-3">
                  <div className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-stone" style={{ animationDelay: '0ms' }} />
                    <span className="size-2 animate-bounce rounded-full bg-stone" style={{ animationDelay: '150ms' }} />
                    <span className="size-2 animate-bounce rounded-full bg-stone" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="rounded-b-xl border-t border-stone/20 bg-paper p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="flex-1 resize-none"
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="self-end bg-clay text-paper hover:bg-clay/90"
            disabled={loading || !input.trim()}
          >
            <Send className="size-4" />
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-stone">{tAi('disclaimer')}</p>
      </div>
    </div>
  );
}
