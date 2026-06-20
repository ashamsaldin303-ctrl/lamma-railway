import { generateJSON } from '../llm-client';

export interface SuggestedQuestion {
  id: string;
  question: { ar: string; en: string };
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

export async function suggestApplicationQuestions(
  gatheringInfo: { title: string; topic: string; format: string },
  locale: 'ar' | 'en',
): Promise<SuggestedQuestion[]> {
  const prompt = `
اقترح 3-4 أسئلة مخصصة لطلب الحضور على هذه اللمة:

معلومات اللمة:
- العنوان: ${gatheringInfo.title}
- الموضوع: ${gatheringInfo.topic}
- الصيغة: ${gatheringInfo.format}

تعليمات:
- الأسئلة يجب أن تساعد صاحب التجمع في تقييم ملاءمة المتقدم
- تجنب الأسئلة العامة (الاسم، البريد)
- ركّز على الدافع، الخلفية، التوقعات
- نوع السؤال: text (إجابة قصيرة)، textarea (إجابة طويلة)، select (اختيار)

أرجع النتيجة بصيغة JSON صالحة فقط:
{
  "questions": [
    {
      "id": "q1",
      "question": { "ar": "...", "en": "..." },
      "type": "textarea",
      "required": true
    }
  ]
}
`;

  const result = await generateJSON<{ questions: SuggestedQuestion[] }>(prompt, {
    temperature: 0.8,
    maxTokens: 600,
    fallback: '[]',
  });

  return result?.questions ?? [];
}
