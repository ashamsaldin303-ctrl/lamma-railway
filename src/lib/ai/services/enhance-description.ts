import { generateText } from '../llm-client';

interface EnhanceInput {
  title: string;
  topic: string;
  format: string;
  currentDescription: string;
  locale: 'ar' | 'en';
}

export async function enhanceDescription(input: EnhanceInput): Promise<string> {
  const { title, topic, format, currentDescription, locale } = input;

  const prompt = `
حسّن الوصف التحريري لهذه اللمة ليجعل القارئ يشعر بالحميمية والرغبة في الحضور.

معلومات اللمة:
- العنوان: ${title}
- الموضوع: ${topic}
- الصيغة: ${format}

الوصف الحالي:
"${currentDescription}"

تعليمات:
- اكتب وصفاً تحريفياً فاخراً (200-300 كلمة)
- استخدم إيقاعاً شعرياً دون تكلف
- ابدأ بجملة افتتاحية قوية
- اذكر تفصيلاً حسياً واحداً على الأقل (صوت، رائحة، ضوء)
- اربط اللمة بقيمتها الثقافية الكويتية
- اختم بدعوة ضمنية للحضور
- ${locale === 'ar' ? 'اكتب بالعربية الفصحى بأسلوب أدبي راقٍ' : 'Write in English with literary elegance'}
`;

  return generateText(prompt, {
    temperature: 0.7,
    maxTokens: 500,
    fallback: currentDescription,
  });
}
