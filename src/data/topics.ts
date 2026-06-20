import { topicSchema, type Topic } from './types';

/**
 * The six editorial topics that anchor Lamma's curation.
 * Each topic owns a signature color used across pills, section headers,
 * and gathering cards.
 */
export const topics: Topic[] = [
  {
    slug: 'memory-of-place',
    name: { ar: 'ذاكرة المكان', en: 'Memory of Place' },
    description: {
      ar: 'لمات تجمعنا حول الأماكن التي تحمل ذاكرة — سوقٍ قديم، حيٍّ تغيّر، مبنىً يوشك أن يُنسى. نمشي معاً، نستمع، وندوّن ما تبقّى من الحكاية قبل أن تمحوه الجدد. ليست جولة سياحية، بل قراءة بطيئة لمدينةٍ ما زالت تتنفس.',
      en: 'Gatherings held in places that carry memory — an old souq, a neighbourhood in flux, a building about to be forgotten. We walk together, we listen, and we record what remains of the story before the new erases it. Not a tourist tour, but a slow reading of a city that still breathes.',
    },
    color: '#B85C3E',
    coverImageUrl: '/images/topics/memory-of-place.jpg',
  },
  {
    slug: 'food-stories',
    name: { ar: 'حكايات الطعام', en: 'Food Stories' },
    description: {
      ar: 'مائدةٌ تُمدّ، وأيادٍ تعجن حكاية. في هذا الموضوع نأكل ما صنعته يدٌ تعرف اسم صاحبتها، ونصغي إلى وصفةٍ هاجرت من بلدٍ إلى بلدٍ حتى استقرّت في صحنٍ أمامنا. الطعام هنا ليس سلعة، بل سيرة.',
      en: 'A table is laid, and hands knead a story. In this topic we eat what a hand that knows its owner\'s name has made, and we listen to a recipe that migrated from country to country until it settled in a bowl before us. Here food is not a commodity, it is a biography.',
    },
    color: '#E8A93C',
    coverImageUrl: '/images/topics/food-stories.jpg',
  },
  {
    slug: 'light-and-shadow',
    name: { ar: 'الضوء والظل', en: 'Light & Shadow' },
    description: {
      ar: 'ورشٌ بصرية نتعلم فيها أن ننتظر اللحظة: الضوء حين ينثني على حائط، الظل حين يطول في العصر، الوجه حين يكشف ما لا تقوله الكلمات. نحمل كاميرا، لكننا نتعلّم أولاً كيف نحمل عينيناً.',
      en: 'Visual workshops where we learn to wait for the moment: light folding over a wall, shadow lengthening in the late afternoon, a face revealing what words do not. We carry a camera, but first we learn how to carry our eyes.',
    },
    color: '#2A5F5A',
    coverImageUrl: '/images/topics/light-and-shadow.jpg',
  },
  {
    slug: 'new-voices',
    name: { ar: 'أصوات جديدة', en: 'New Voices' },
    description: {
      ar: 'أمسياتٌ نُصغي فيها لمن يكتبون ويغنّون لأول مرة أمام ملأٍ يريد أن يسمع. لا نجوم جاهزون، بل أصواتٌ في طور التشكّل — قصيدةٌ أولى، لحنٌ ما زال رطباً، تجربةٌ تستحق شهوداً صبوراً.',
      en: 'Evenings where we listen to those writing and singing for the first time before an audience that wants to hear. No finished stars, but voices still taking shape — a first poem, a melody still wet, an experiment that deserves patient witness.',
    },
    color: '#4A7C59',
    coverImageUrl: '/images/topics/new-voices.jpg',
  },
  {
    slug: 'soul-of-books',
    name: { ar: 'روح الكتاب', en: 'Soul of Books' },
    description: {
      ar: 'نقرأ كتاباً واحداً معاً، ببطء، على مدى أسابيع، ثم نلتقي لنفكّكه لا لنلخّصه. ما الروح التي تحرّك هذا النص؟ ما السؤال الذي تركه فينا؟ نواجه الكتاب كما نواجه صديقاً: بمحبّةٍ وبتساؤل.',
      en: 'We read a single book together, slowly, over weeks, then meet to unpack it rather than summarise it. What is the soul that moves this text? What question did it leave inside us? We face the book as we face a friend: with love and with questioning.',
    },
    color: '#8B5A3C',
    coverImageUrl: '/images/topics/soul-of-books.jpg',
  },
  {
    slug: 'after-work',
    name: { ar: 'ما بعد العمل', en: 'After Work' },
    description: {
      ar: 'لمات مسائية تجمع أصحاب حِرفٍ متقاربة حول طاولةٍ صغيرة، لا لعقد صفقات، بل لتبادل السؤال: كيف صار عملك؟ وما الذي تتعلّمه من يديك كل يوم؟ حوارٌ هادئ يذيب العزلة التي يصنعها المكتب.',
      en: 'Evening gatherings that bring together people of adjacent crafts around a small table — not to close deals, but to exchange the question: how has your work become? And what do your hands learn each day? A quiet conversation that dissolves the isolation the office builds.',
    },
    color: '#1A1614',
    coverImageUrl: '/images/topics/after-work.jpg',
  },
];

export const topicsBySlug: Record<string, Topic> = Object.fromEntries(
  topics.map((t) => [t.slug, t]),
);

export function getTopic(slug: string): Topic | undefined {
  return topicsBySlug[slug];
}

// Validate at module load (fails fast in dev if data is malformed).
topics.forEach((t) => topicSchema.parse(t));
