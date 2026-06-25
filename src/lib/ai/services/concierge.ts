import { generateText } from '../llm-client';
import { recommendGatheringsForUser, type MatchableUser } from '@/lib/matching/engine';
import { gatherings } from '@/data/gatherings';
import { topics } from '@/data/topics';

interface ConciergeContext {
  user: MatchableUser | null;
  locale: 'ar' | 'en';
}

export async function askConcierge(question: string, context: ConciergeContext): Promise<string> {
  const { user, locale } = context;

  let userContext = '';
  if (user) {
    const recs = recommendGatheringsForUser(user, { limit: 3 });
    userContext = `
معلومات المستخدم:
- الاسم: ${user.nameLocalized[locale]}
- الاهتمامات: ${user.interests.join('، ')}
- مستوى العضوية: ${user.membershipTier}
- عدد اللمات السابقة: ${'attendedCount' in user ? (user as { attendedCount: number }).attendedCount : 0}

توصيات مخصصة للمستخدم:
${recs.map(({ gathering, score }) => `- ${gathering.title[locale]} (نتيجة المطابقة: ${score}%)`).join('\n')}
`.trim();
  }

  const availableGatherings = gatherings
    .filter((g) => g.status === 'APPLICATIONS_OPEN' || g.status === 'PUBLISHED')
    .map((g) => `- ${g.title[locale]} | ${g.topicSlug} | ${g.format} | ${g.isFree ? 'مجاني' : g.priceKwd + ' KWD'} | سعة ${g.capacityMax} شخص`)
    .join('\n');

  const prompt = `
سؤال المستخدم: "${question}"

${userContext}

اللمات المتاحة حالياً:
${availableGatherings}

المواضيع التحريرية المتاحة:
${topics.map((t) => `- ${t.slug}: ${t.name[locale]}`).join('\n')}

تعليمات:
- اجب بناءً على اللمات المتاحة فقط
- إن لم تجد لمة مناسبة، اشرح ذلك بأسلوب لطيف واقترح بديلاً
- إن كان السؤال عاماً، أعطِ معلومات عن لَمَّة كمنصة
- لا تختلق لمات غير موجودة
- اجب بأسلوب تحريري راقٍ يحترم الثقافة الكويتية
- اجب بإيجاز (3-5 جمل كحد أقصى)
${locale === 'ar' ? '\nأجب باللغة العربية الفصحى.' : '\nRespond in English.'}
`;

  const systemPrompt = locale === 'ar'
    ? 'أنت "لامّة"، مساعدة ذكية لمنصة لَمَّة الكويتية للتجمعات الحميمية. تجيبين بإيجاز وأسلوب راقٍ. تحترمين الثقافة الكويتية ومواقيت الصلاة.'
    : 'You are "Lamma", an AI assistant for the Lamma Kuwaiti intimate gatherings platform. You respond briefly with elegant editorial tone, respecting Kuwaiti culture.';

  return generateText(prompt, {
    systemPrompt,
    temperature: 0.6,
    maxTokens: 400,
    cacheKey: user ? undefined : `concierge-${locale}-${question.slice(0, 50)}`,
  });
}
