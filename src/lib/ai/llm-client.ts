import ZAI from 'z-ai-web-dev-sdk';

/**
 * Lamma LLM Client — unified wrapper around z-ai-web-dev-sdk.
 *
 * Features:
 * - In-memory caching (30min TTL) for idempotent requests
 * - Graceful fallback on failure (no crashes)
 * - generateText() and generateJSON() helpers
 * - Locale-aware prompt builder
 *
 * PROD-ONLY: replace with OpenAI client + API key management.
 * The interface (generateText, generateJSON, withLocale) stays identical.
 */

let zaiClient: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getClient() {
  if (!zaiClient) {
    zaiClient = await ZAI.create();
  }
  return zaiClient;
}

// In-memory cache (session-scoped). PROD-ONLY: replace with Redis/Upstash.
const cache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) return entry.value;
  cache.delete(key);
  return null;
}

function setCached(key: string, value: string): void {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL });
}

export interface LLMOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  cacheKey?: string;
  fallback?: string;
}

export async function generateText(prompt: string, options: LLMOptions = {}): Promise<string> {
  const {
    systemPrompt = 'أنت مساعد ذكي لمنصة "لَمَّة" الكويتية للتجمعات الحميمية. تجيب بإيجاز وبأسلوب راقٍ يحترم الثقافة الكويتية.',
    temperature = 0.7,
    maxTokens = 500,
    cacheKey,
    fallback = 'عذراً، تعذّر توليد الرد حالياً. حاول مرة أخرى لاحقاً.',
  } = options;

  if (cacheKey) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  try {
    const client = await getClient();
  const response = await client.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const result = response.choices[0]?.message?.content ?? fallback;

    if (cacheKey && result !== fallback) {
      setCached(cacheKey, result);
    }

    return result;
  } catch {
    return fallback;
  }
}

export async function generateJSON<T>(prompt: string, options: LLMOptions = {}): Promise<T | null> {
  const result = await generateText(prompt, {
    ...options,
    systemPrompt: options.systemPrompt ?? 'أنت مساعد ذكي. أرجع النتيجة بصيغة JSON صحيحة فقط، بدون نص إضافي أو markdown.',
  });

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as T;
    return JSON.parse(result) as T;
  } catch {
    return null;
  }
}

export function withLocale(locale: 'ar' | 'en', prompt: string): string {
  return locale === 'ar'
    ? `${prompt}\n\nأجب باللغة العربية الفصحى بأسلوب راقٍ.`
    : `${prompt}\n\nRespond in English with an elegant editorial tone.`;
}
