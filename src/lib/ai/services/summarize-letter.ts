import { generateText } from '../llm-client';

export async function summarizeLetter(
  content: string,
  title: string,
  locale: 'ar' | 'en',
): Promise<string> {
  const prompt = `
لخّص المقال التالي في فقرة واحدة (50-80 كلمة) بأسلوب تحريري جذّاب يكفي لجعل القارئ يرغب بقراءة المقال كاملاً.

العنوان: ${title}

المقال:
${content.slice(0, 3000)}

الملخص يجب أن:
- يكون فقرة واحدة فقط
- يكشف عن جوهر المقال دون حرق النهاية
- يستخدم لغة شاعرية تحريرية
- يكون بلهجة ${locale === 'ar' ? 'عربية فصحى' : 'إنجليزية راقية'}
`;

  return generateText(prompt, {
    temperature: 0.4,
    maxTokens: 200,
    cacheKey: `letter-summary-${locale}-${title.slice(0, 30)}`,
    fallback: locale === 'ar'
      ? 'ملخص هذا المقال التحريري غير متاح حالياً. ننصح بقراءته كاملاً للاستمتاع بتفاصيله.'
      : 'Summary unavailable. We recommend reading the full article.',
  });
}
