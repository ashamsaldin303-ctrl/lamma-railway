import { generateText } from '../llm-client';
import { computeMatchScore, findSimilarAttendees, findSharedInterests } from '@/lib/matching/engine';
import type { DemoUser } from '@/data/demo-users';
import type { Gathering } from '@/data/gatherings';

interface InsightInput {
  applicant: DemoUser;
  gathering: Gathering;
  locale: 'ar' | 'en';
}

export async function generateReviewInsight(input: InsightInput): Promise<string> {
  const { applicant, gathering, locale } = input;

  const matchScore = computeMatchScore(applicant, gathering);
  const similarAttendees = findSimilarAttendees(applicant, gathering.slug, 3);
  const sharedInterests = similarAttendees.length > 0
    ? findSharedInterests(applicant, similarAttendees[0].user)
    : [];

  const prompt = `
أعطِ صاحب التجمع رؤية ذكية ومختصرة (جملتان كحد أقصى) عن هذا المتقدم:

معلومات المتقدم:
- الاسم: ${applicant.nameLocalized[locale]}
- الاهتمامات: ${applicant.interests.join('، ')}
- مستوى العضوية: ${applicant.membershipTier}
- عدد اللمات السابقة: ${applicant.attendedCount}
- نتيجة المطابقة: ${matchScore}%

اللمة: ${gathering.title[locale]} (${gathering.topicSlug})
- الحاضرون المشابهون: ${similarAttendees.length} أشخاص
- أبرز اهتمام مشترك: ${sharedInterests[0] ?? 'لا يوجد'}

تعليمات:
- جملتان فقط (20-30 كلمة)
- ابدأ بتقييم عام ("متقدّم واعد" / "يحتاج مراجعة")
- اذكر ميزة واحدة محددة
- ${locale === 'ar' ? 'بأسلوب مهني مباشر' : 'in a professional, direct tone'}

مثال: "متقدّم واعد يشارك 3 اهتمامات مع الحاضرين المقبولين. خبرته في التصوير قد تثري النقاشات."
`;

  return generateText(prompt, {
    temperature: 0.5,
    maxTokens: 100,
    cacheKey: `review-insight-${applicant.id}-${gathering.slug}-${locale}`,
    fallback: locale === 'ar'
      ? `متقدم بنتيجة مطابقة ${matchScore}%. يرجى مراجعة الدافع والخلفية بعناية.`
      : `Applicant with ${matchScore}% match. Please review motivation and background carefully.`,
  });
}
