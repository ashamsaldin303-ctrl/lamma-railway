import { hostSchema, type Host } from './types';

/**
 * Five Lamma hosts — a blend of Kuwaiti and expat, men and women,
 * verified curators and a rising unverified voice.
 */
export const hosts: Host[] = [
  {
    handle: '@abdullah_kuwaiti_historian',
    displayName: {
      ar: 'عبدالله الماردي',
      en: 'Abdullah Al-Mardi',
    },
    bio: {
      ar: 'مؤرّخ كويتي قضى عشرين سنةً يوثّق ما يندثر من مدينته. يؤمن أن السوق كتابٌ مفتوح، وأن كل بابٍ خشبيٍّ يحفظ اسم صاحبه الأول. يستضيف لماتٍ مشيٍ في أحياء الكويت القديمة، يقرأ مع رفاقه جدراناً ولافتاتٍ قبل أن يبتلعها الزجاج. درّس التاريخ في الجامعة ثم تركها لأن القاعة الكبيرة تُفسد الحوار. يكتب عموداً أسبوعياً في جريدةٍ محلية، ويحمل دفتراً جلدياً لا يفارقه.',
      en: 'A Kuwaiti historian who has spent twenty years documenting what disappears from his city. He believes a souq is an open book, and that every wooden door keeps its first owner\'s name. He hosts walking gatherings in Kuwait\'s old neighbourhoods, reading walls and signs with his companions before glass swallows them. He taught history at the university, then left because the large hall ruins conversation. He writes a weekly column in a local paper, and carries a leather notebook he never leaves behind.',
    },
    avatarUrl: '/images/hosts/abdullah.jpg',
    coverUrl: '/images/hosts/abdullah-cover.jpg',
    isVerified: true,
    verifiedAt: '2025-09-01T00:00:00+03:00',
    specialties: [
      { ar: 'تاريخ الكويت الحديث', en: 'Modern Kuwaiti history' },
      { ar: 'المشي التأملي', en: 'Contemplative walking' },
      { ar: 'أرشيف الصور', en: 'Photo archives' },
    ],
    topicSlugs: ['memory-of-place', 'after-work'],
    totalGatherings: 14,
    totalAttendees: 312,
    avgRating: 4.9,
    responseTimeHours: 6,
    instagram: 'https://instagram.com/abdullah_mardi',
  },
  {
    handle: '@noura_photographer',
    displayName: {
      ar: 'نورة السبيتي',
      en: 'Noura Al-Subaity',
    },
    bio: {
      ar: 'مصوّرة فنية كويتية، تعمل بالفيلم وحده. ترى في الضوء المتسلّل من شباكٍ نصف مفتوح لحظةً تستحقّ الانتظار. تستضيف ورش تصويرٍ صغيرة في مستودعٍ حوّلته في الشويخ، تعلّم فيها أن ننتظر الظلّ قبل أن نلتقط. عُرضت صورها في بينالي الشارقة، لكنها تفضّل لمةً من خمسة أشخاص على معرضٍ من خمسمئة. تكتب يومياتها بالقلم على هامش طبعاتها، وتؤمن أن الصورة الجيدة سؤالٌ لا جواب.',
      en: 'A Kuwaiti art photographer who works only in film. She sees in light slipping through a half-open window a moment worth waiting for. She hosts small photography workshops in a warehouse she converted in Shuwaikh, where she teaches us to wait for the shadow before we shoot. Her work showed at the Sharjah Biennial, but she prefers a gathering of five to an opening of five hundred. She writes her diary by pen in the margins of her prints, and believes a good photograph is a question, not an answer.',
    },
    avatarUrl: '/images/hosts/noura.jpg',
    coverUrl: '/images/hosts/noura-cover.jpg',
    isVerified: true,
    verifiedAt: '2025-08-15T00:00:00+03:00',
    specialties: [
      { ar: 'التصوير الفيلمي', en: 'Film photography' },
      { ar: 'دراسة الضوء الطبيعي', en: 'Natural light study' },
      { ar: 'الطباعة اليدوية', en: 'Hand printing' },
    ],
    topicSlugs: ['light-and-shadow', 'memory-of-place'],
    totalGatherings: 9,
    totalAttendees: 108,
    avgRating: 4.8,
    responseTimeHours: 12,
    instagram: 'https://instagram.com/noura.film',
  },
  {
    handle: '@amal_sudani_chef',
    displayName: {
      ar: 'آمال دفع الله',
      en: 'Amal Dafallah',
    },
    bio: {
      ar: 'طاهية سودانية تعيش في الكويت منذ عشر سنين. تعجن ذاكرة بلدها في كل مائدةٍ تمدّها. تعلّمت الطبخ عن جدّتها في الخرطوم، وحملت دفتر وصفاتها المخطوط عبر ثلاث حدود. تستضيف لمات طعامٍ نسائية في شقتها في السالمية، تقدّم فيها الكسرة والفول والمولح، وتروي حكاية كل طبقٍ كأنها تفتح صندوقاً قديماً. لم تدرس في مدرسة طبخٍ قط، وتقول إن اليد أصدقُ من الشهادة. تبحث عن وصفةٍ تضيع في كل لمة.',
      en: 'A Sudanese chef who has lived in Kuwait for ten years. She kneads the memory of her country into every table she lays. She learned to cook from her grandmother in Khartoum, and carried her handwritten recipe book across three borders. She hosts women\'s food gatherings in her Salmiya apartment, serving kisra and fool and mulah, telling the story of each dish as if opening an old box. She never attended a cooking school, and says the hand is more honest than the certificate. She hunts for a lost recipe in every gathering.',
    },
    avatarUrl: '/images/hosts/amal.jpg',
    coverUrl: '/images/hosts/amal-cover.jpg',
    isVerified: false,
    verifiedAt: null,
    specialties: [
      { ar: 'المطبخ السوداني', en: 'Sudanese cuisine' },
      { ar: 'الوصفات المهاجرة', en: 'Migrating recipes' },
      { ar: 'الطبخ الجماعي', en: 'Collective cooking' },
    ],
    topicSlugs: ['food-stories'],
    totalGatherings: 6,
    totalAttendees: 71,
    avgRating: 4.9,
    responseTimeHours: 18,
    instagram: 'https://instagram.com/amal.kitchen',
  },
  {
    handle: '@khaled_artist',
    userId: 'user-khaled',
    displayName: {
      ar: 'خالد المطيري',
      en: 'Khaled Al-Mutairi',
    },
    bio: {
      ar: 'فنان تشكيلي كويتي، يرسم بالزيت منذ خمسة عشر عاماً. حوّل استوديوه في كيفان إلى ملتقى صغير لمن يحبون اللون ولا يجرؤون على البداية. يؤمن أن الورشة الحقيقية لا تُعلّم التقنية بل تُعلّم الجرأة. يستضيف لماتٍ فنية صغيرة (10-15 شخصاً)، يقدّم فيها المواد ويترك المشاركين يخربون الورقة قبل أن يُجيدوها. عرض أعماله في بينالية الكويت، لكنه يفضّل ورشةً من خمسة على معرضٍ من خمسمئة.',
      en: 'A Kuwaiti visual artist who has painted in oils for fifteen years. He turned his studio in Keifan into a small meeting place for those who love color but dare not begin. He believes a true workshop does not teach technique — it teaches courage. He hosts small art gatherings (10-15 people), where he provides the materials and lets participants ruin the paper before they master it. His work has shown at the Kuwait Biennial, but he prefers a workshop of five to an opening of five hundred.',
    },
    avatarUrl: '/images/hosts/mohammed.jpg',
    coverUrl: '/images/hosts/mohammed-cover.jpg',
    isVerified: true,
    verifiedAt: '2025-10-10T00:00:00+03:00',
    specialties: [
      { ar: 'الرسم الزيتي', en: 'Oil painting' },
      { ar: 'الفخار', en: 'Pottery' },
      { ar: 'الورش الفنية', en: 'Art workshops' },
    ],
    topicSlugs: ['light-and-shadow', 'new-voices'],
    totalGatherings: 11,
    totalAttendees: 245,
    avgRating: 4.7,
    responseTimeHours: 8,
    instagram: 'https://instagram.com/khaled.artist',
  },
  {
    handle: '@fatima_literary',
    displayName: {
      ar: 'فاطمة البحر',
      en: 'Fatima Al-Bahr',
    },
    bio: {
      ar: 'ناقدة أدبية كويتية، تقرأ بطريقةٍ تجعل الكتاب يبدو كأنه يُكتب الآن. درّست الأدب المقارن سنواتٍ طويلة، ثم تركت التدريس لتأسّس أقدم نادئ كتابٍ في الكويت. تؤمن أن السؤال "ماذا أراد الكاتب؟" سؤالٌ كسول، وأن الأحقّ هو: "ما الذي تركه فينا؟". تستضيف نوادي كتابٍ شهريّة، تختار فيها روايةً واحدة نقرأها معاً على مدى أسبوعين، ثم نجلس لفكّكها لا لاختصارها. شعرها بالزمن بطيءٌ، وكلماتها قليلةٌ لكنها محسوبة.',
      en: 'A Kuwaiti literary critic who reads in a way that makes a book feel as if it is being written right now. She taught comparative literature for many years, then left teaching to found Kuwait\'s oldest book club. She believes the question "what did the author want?" is a lazy one, and that the truer question is: "what did it leave inside us?" She hosts monthly book clubs, choosing a single novel we read together over two weeks, then sit to unpack it rather than summarise it. Her sense of time is slow, her words few but weighed.',
    },
    avatarUrl: '/images/hosts/fatima.jpg',
    coverUrl: '/images/hosts/fatima-cover.jpg',
    isVerified: true,
    verifiedAt: '2025-07-20T00:00:00+03:00',
    specialties: [
      { ar: 'الأدب المقارن', en: 'Comparative literature' },
      { ar: 'نادي الكتاب', en: 'Book clubs' },
      { ar: 'النقد التأملي', en: 'Contemplative criticism' },
    ],
    topicSlugs: ['soul-of-books', 'new-voices'],
    totalGatherings: 18,
    totalAttendees: 401,
    avgRating: 4.9,
    responseTimeHours: 24,
    instagram: 'https://instagram.com/fatima.bahr',
  },
];

export const hostsByHandle: Record<string, Host> = Object.fromEntries(
  hosts.map((h) => [h.handle, h]),
);

export function getHost(handle: string): Host | undefined {
  return hostsByHandle[handle];
}

hosts.forEach((h) => hostSchema.parse(h));
