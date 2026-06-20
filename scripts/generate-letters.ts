/**
 * generate-letters.ts
 *
 * Generates the 3 long-form bilingual editorial Letters for Lamma Phase 0.
 * Uses z-ai-web-dev-sdk LLM to draft body content in both Arabic and English.
 *
 * Because the LLM consistently returns ~1000 words per call, we generate each
 * essay in TWO parts (opening movement + continuation movement) per language
 * and concatenate them. Parts for the same letter run in parallel to keep
 * total wall-clock time low.
 *
 * Run: `bun run scripts/generate-letters.ts`
 */

import ZAI from 'z-ai-web-dev-sdk';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface LetterSpec {
  slug: string;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  coverImageUrl: string;
  galleryUrls: string[];
  readTimeMinutes: number;
  publishedAt: string;
  topicSlug: string;
  authorHostHandle: string;
  gatheringSlug: string | null;
  theme: { ar: string; en: string };
  imagePaths: string[];
}

/* -------------------------------------------------------------------------- */
/*  Letter specs                                                              */
/* -------------------------------------------------------------------------- */

const letterSpecs: LetterSpec[] = [
  {
    slug: 'rhythm-echoes',
    title: {
      ar: 'أصداء الإيقاع: ليلةٌ ما زالت تدقّ',
      en: 'Echoes of Rhythm: A Night Still Beating',
    },
    subtitle: {
      ar: 'عن اللمة الثامنة — أمسية الإيقاع الكويتي التي اختتمت، وتركت في أيدينا انتظاراً.',
      en: 'On the eighth gathering — the Kuwaiti rhythm evening that ended, leaving our hands waiting.',
    },
    coverImageUrl: '/images/letters/letter-rhythm-echoes.jpg',
    galleryUrls: ['/images/gatherings/voices-rhythm-music.jpg'],
    readTimeMinutes: 11,
    publishedAt: '2025-12-02T08:00:00+03:00',
    topicSlug: 'new-voices',
    authorHostHandle: '@khaled_artist',
    gatheringSlug: 'voices-rhythm-music',
    theme: {
      ar: 'مقالٌ تأمليّ عن أمسية الإيقاع والإيقاع الكويتي التي اختتمت. اكتب عن الصمت الذي سبق النقرة الأولى، عن الطريقة التي يصير بها حلقةٌ من الغرباء جسداً واحداً يتنفّس بالإيقاع، عن صوت المرواس تحديداً وكيف يقفز بين الأيدي، عن الشاي الذي برد لأن أحداً لم يرد أن يكسر التعويذة، وعن المشي عائدين إلى البيت حيث بدت المدينة وكأنها أُعيد ضبطها على نغمٍ آخر.',
      en: 'A reflective essay on the completed Kuwaiti rhythm and percussion evening. Write about the silence before the first beat, the way a circle of strangers becomes a single breathing body through rhythm, the specific sound of the mirwas drum and how it leaps between hands, the tea that went cold because no one wanted to break the spell, and the walk home where the city felt re-tuned to a different key.',
    },
    imagePaths: [
      '/images/gatherings/voices-rhythm-music.jpg',
      '/images/letters/letter-rhythm-echoes.jpg',
      '/images/topics/new-voices.jpg',
    ],
  },
  {
    slug: 'the-lebanese-table',
    title: {
      ar: 'المائدة اللبنانية: ذاكرةٌ على طبق',
      en: 'The Lebanese Table: Memory on a Plate',
    },
    subtitle: {
      ar: 'عن لمةٍ خيالية سابقة في موضوع حكايات الطعام — مائدة لبنانية امتدّت من بيروت إلى الكويت.',
      en: 'On an imagined past gathering in the Food Stories topic — a Lebanese table that stretched from Beirut to Kuwait.',
    },
    coverImageUrl: '/images/letters/letter-lebanese-table.jpg',
    galleryUrls: ['/images/topics/food-stories.jpg'],
    readTimeMinutes: 9,
    publishedAt: '2025-11-18T08:00:00+03:00',
    topicSlug: 'food-stories',
    authorHostHandle: '@amal_sudani_chef',
    gatheringSlug: null,
    theme: {
      ar: 'مقالٌ عن لمةٍ لبنانيةٍ خياليةٍ سابقة أُقيمت في شقةٍ بالسالمية. اكتب عن جغرافيا مائدة المازّة (ترتيب الأطباق كأنها جملةٌ تُحكى من اليمين إلى اليسار)، عن دفتر وصفات جدّة المضيفة المكتوب بخط اليد الذي عبر ثلاثة حدود حتى استقر في الكويت، عن الجدل حول ما إذا كان التبولة سلطةً أم طريقةً في الرؤية، وعن كيف يمكن لوجبةٍ أن تكون فعلاً رفضٍ ضد التهجير.',
      en: 'An essay on a fictional, past Lebanese mezze gathering hosted in a Salmiya apartment. Write about the geography of a mezze table (the order of dishes as a kind of sentence, read from right to left), the host\'s grandmother\'s handwritten recipe book that traveled across three borders before settling in Kuwait, the debate over whether tabbouleh is a salad or a way of seeing, and how a meal can be an act of refusal against displacement.',
    },
    imagePaths: [
      '/images/topics/food-stories.jpg',
      '/images/letters/letter-lebanese-table.jpg',
    ],
  },
  {
    slug: 'old-salmiya-walking',
    title: {
      ar: 'السالمية القديمة: مشيٌ ضد النسيان',
      en: 'Old Salmiya: A Walk Against Forgetting',
    },
    subtitle: {
      ar: 'عن لمةٍ خيالية سابقة في موضوع ذاكرة المكان — جولةٍ مشية في شوارع السالمية التي لم تعد.',
      en: 'On an imagined past gathering in the Memory of Place topic — a walking tour through Salmiya streets that no longer are.',
    },
    coverImageUrl: '/images/letters/letter-old-salmiya.jpg',
    galleryUrls: ['/images/topics/memory-of-place.jpg'],
    readTimeMinutes: 10,
    publishedAt: '2025-10-30T08:00:00+03:00',
    topicSlug: 'memory-of-place',
    authorHostHandle: '@abdullah_kuwaiti_historian',
    gatheringSlug: null,
    theme: {
      ar: 'مقالٌ عن لمةٍ مشيةٍ خياليةٍ سابقة في شوارع السالمية القديمة. اكتب عن التآكل البطيء لروح الحيّ، عن الزاوية المحددة التي كان فيها مكتبةٌ شهيرةٌ ولم تعد، عن ممارسة المشي كفعلِ تذكّرٍ لا انتقال، عن التوتّر بين الحفظ والتقدّم، وعن الفعل الصغير المتمثّل في تدوين ما رأيته قبل أن يختفي.',
      en: 'An essay on a fictional, past walking gathering through old Salmiya. Write about the slow erosion of a neighbourhood\'s character, the specific corner where a famous bookshop used to be and is no longer, the practice of walking as remembering rather than moving, the tension between preservation and progress, and the small act of writing down what you saw before it disappears.',
    },
    imagePaths: [
      '/images/topics/memory-of-place.jpg',
      '/images/letters/letter-old-salmiya.jpg',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const MIN_WORDS = 1800;
const TARGET_MIN = 2000;
const TARGET_MAX = 3000;

function countWords(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~\-]/g, ' ')
    .split(/\s+/)
    .filter((w) => /\p{L}/u.test(w)).length;
}

/** Strip ```markdown fences and any leading "Here is..." / Arabic preamble. */
function cleanLLMOutput(raw: string): string {
  let t = raw.trim();
  // Remove code fences if present.
  const fenceMatch = t.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/);
  if (fenceMatch) t = fenceMatch[1].trim();
  // Drop common English preamble lines like "Here is the essay:".
  t = t.replace(/^(Here(?:'s| is)[\s\S]*?:\s*\n+)/i, '');
  // Drop common Arabic preambles like "بالتأكيد..." / "إليك...".
  t = t.replace(/^(بالتأكيد[^\n]*\n+|إليك[^\n]*\n+|بالطبع[^\n]*\n+)/, '');
  // Drop a leading "***" divider if the LLM used one after a preamble.
  t = t.replace(/^\s*\*{3}\s*\n+/, '');
  // Drop trailing conversational notes.
  t = t.replace(/\n+(?:Note:|ملاحظة:)[\s\S]*$/i, '');
  // Drop trailing summary remarks like "آمل أن..." / "I hope...".
  t = t.replace(/\n+(?:آمل[^\n]*|أتمنى[^\n]*|I hope[^\n]*|Hope[^\n]*)$/i, '');
  return t.trim();
}

/* -------------------------------------------------------------------------- */
/*  Prompt builders                                                           */
/* -------------------------------------------------------------------------- */

function buildSystemPrompt(lang: 'ar' | 'en'): string {
  if (lang === 'ar') {
    return [
      'أنت كاتبٌ أدبيٌّ محترف تكتب لمجلةٍ كويتيةٍ فاخرةٍ بأسلوب مجلات Cereal و Kinfolk.',
      'اكتب مقالاً تحريرياً أدبياً بالعربية الفصحى الدافئة، دون لهجةٍ محكيةٍ ثقيلة.',
      'المقال يجب أن يكون حسّياً، تأملياً، بطيء الإيقاع، يفتح اللحظة لا يلخّصها.',
      'استخدم عناوين فرعية (## و ###)، اقتباساتٍ (>)، ومراجعة صور بصيغة ![وصف](/images/...).',
      'لا تستخدم لغة تسويق، لا قوائم نقطية في المتن، لا "نحن متحمسون"، ولا تخاطب القارئ بمباشرةٍ دعائية.',
      'اجعل كل فقرةٍ تفتح ما بعدها؛ لا تكتب مقدمةً قصيرةً ثمّ تتسارع إلى الخاتمة.',
      'لا تذكر اسم المجلة أو اسم "لَمَّة" بشكلٍ صريحٍ في النص.',
    ].join(' ');
  }
  return [
    'You are a professional literary writer for a premium Kuwaiti magazine in the style of Cereal and Kinfolk.',
    'Write literary editorial prose in English.',
    'The prose must be sensory, contemplative, slow-paced, opening the moment rather than summarizing it.',
    'Use subheadings (## and ###), blockquotes (>), and image references in the form ![caption](/images/...).',
    'No marketing language, no bullet lists in the body, no "we are excited to", and no direct promotional address to the reader.',
    'Let each paragraph open what follows; do not write a brief intro and then rush to a conclusion.',
    'Do not mention the magazine name or "Lamma" explicitly in the text.',
  ].join(' ');
}

interface PartSpec {
  /** Which movement of the essay: 1 = opening, 2 = second movement, 3+ = further continuation. */
  part: number;
  /** For part >= 2: the previous text to continue from. */
  previousText?: string;
  /** Whether this is the final part (closes the essay). */
  isFinal?: boolean;
}

function buildUserPrompt(
  spec: LetterSpec,
  lang: 'ar' | 'en',
  partInfo: PartSpec,
): string {
  const imgs = spec.imagePaths.join(lang === 'ar' ? '، ' : ', ');
  const theme = lang === 'ar' ? spec.theme.ar : spec.theme.en;

  if (lang === 'ar') {
    const common = [
      `الموضوع الكلي للمقال:`,
      ``,
      theme,
      ``,
      `مسارات الصور المتاحة: ${imgs}.`,
    ];
    if (partInfo.part === 1) {
      return [
        ...common,
        ``,
        `اكتب الآن القسم الأول من المقال (الحركة الأولى): الافتتاح البطيء والنصف الأول من المتن.`,
        `القسم الأول يجب أن يكون 1000 إلى 1500 كلمة بالعربية.`,
        `- افتح بلحظةٍ حسّيةٍ بطيئة (صوت، رائحة، ضوء، ملمس).`,
        `- استخدم عنوان ## رئيسيٍّ واحد على الأقل، و### فرعياً أو اثنين.`,
        `- أدرج صورةً واحدةً على الأقل بصيغة ![وصف](/images/...).`,
        `- لا تختم القسم، بل توقّف عند منعطفٍ طبيعيٍّ يسمح بالاستمرار في القسم التالي.`,
        `- لا تكتب مقدمةً تعريفية خارج النص الأدبي، ولا خاتمة.`,
        `- لا تبدأ بـ"بالتأكيد" أو"إليك" أو أي جملةٍ تمهيدية؛ ابدأ مباشرةً بالنص الأدبي.`,
        `- أعد النص الأدبي فقط.`,
      ].join('\n');
    }
    const isFinal = partInfo.isFinal;
    const partWordTarget = isFinal ? '1000 إلى 1500 كلمة' : '1000 إلى 1500 كلمة';
    const partRole = isFinal
      ? `اكتب الآن القسم الأخير من المقال (الحركة الختامية): تعميقٌ أخير في الصورة والموضوع، ثمّ انفتاحٌ نحو خاتمةٍ تبقي شيئاً معلّقاً لا مشروحاً. اختم المقال بلحظةٍ حسّيةٍ مفتوحة، لا بجملةٍ تلخيصية.`
      : `اكتب الآن القسم التالي من المقال (حركةٌ جديدة): تعميقٌ في صورةٍ أو فكرةٍ من الموضوع، بمشاهد حسّيةٍ جديدة. لا تختم المقال بعد.`;
    return [
      ...common,
      ``,
      `ما يلي هو ما كُتب من المقال حتى الآن. أكمل المقال من حيث انتهى، دون إعادة كتابة ما سبق:`,
      ``,
      `--- بداية النص السابق ---`,
      partInfo.previousText ?? '',
      `--- نهاية النص السابق ---`,
      ``,
      partRole,
      `القسم يجب أن يكون ${partWordTarget} بالعربية.`,
      `- استخدم عنوان ## أو ### جديد.`,
      `- أدرج صورةً واحدةً على الأقل بصيغة ![وصف](/images/...).`,
      `- لا تكرر حرفياً ما ورد في الأقسام السابقة.`,
      `- لا تكتب مقدمةً أو خاتمةً خارج النص الأدبي.`,
      `- لا تبدأ بـ"بالتأكيد" أو"إليك" أو أي جملةٍ تمهيدية؛ ابدأ مباشرةً بالنص الأدبي.`,
      `- أعد النص الأدبي فقط.`,
    ].join('\n');
  }

  const common = [
    `The overall subject of the essay:`,
    ``,
    theme,
    ``,
    `Available image paths: ${imgs}.`,
  ];
  if (partInfo.part === 1) {
    return [
      ...common,
      ``,
      `Write the FIRST part of the essay (the opening movement): the slow opening and the first half of the body.`,
      `Part 1 should be 1000 to 1500 words in English.`,
      `- Open with a slow sensory moment (sound, smell, light, texture).`,
      `- Use at least one ## main heading, and one or two ### subheadings.`,
      `- Include at least one image reference as ![caption](/images/...).`,
      `- Do not conclude; stop at a natural turning point that allows continuation in the next part.`,
      `- Do not write a definitional preamble outside the literary text, and no conclusion.`,
      `- Do not begin with "Sure," or "Here is" or any introductory sentence; begin directly with the literary prose.`,
      `- Return only the literary prose.`,
    ].join('\n');
  }
  const isFinal = partInfo.isFinal;
  const partRole = isFinal
    ? `Write the FINAL part of the essay (the closing movement): a final deepening of image and subject, then an opening toward a close that leaves something suspended rather than explained. End the essay with an open sensory moment, not with a summarising sentence.`
    : `Write the NEXT part of the essay (a new movement): a deepening of an image or idea in the subject, with new sensory scenes. Do not conclude the essay yet.`;
  return [
    ...common,
    ``,
    `The following is what has been written of the essay so far. Continue the essay from where it ends, without rewriting what came before:`,
    ``,
    `--- BEGIN PREVIOUS TEXT ---`,
    partInfo.previousText ?? '',
    `--- END PREVIOUS TEXT ---`,
    ``,
    partRole,
    `This part should be 1000 to 1500 words in English.`,
    `- Use a new ## or ### heading.`,
    `- Include at least one image reference as ![caption](/images/...).`,
    `- Do not repeat verbatim what appeared in previous parts.`,
    `- Do not write a preamble or closing remark outside the literary text.`,
    `- Do not begin with "Sure," or "Here is" or any introductory sentence; begin directly with the literary prose.`,
    `- Return only the literary prose.`,
  ].join('\n');
}

/* -------------------------------------------------------------------------- */
/*  LLM call                                                                  */
/* -------------------------------------------------------------------------- */

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const MAX_RETRIES = 8;
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        thinking: { type: 'disabled' },
      });
      // Small delay after a successful call to be gentle on the API.
      await new Promise((r) => setTimeout(r, 1500));
      return completion.choices[0]?.message?.content ?? '';
    } catch (err) {
      lastErr = err;
      const msg = (err as Error)?.message ?? '';
      const isRateLimit = msg.includes('429') || msg.includes('Too many requests');
      const isServerError = /status 5\d\d/.test(msg);
      if (isRateLimit || isServerError) {
        // Exponential backoff with cap: 5s, 10s, 20s, 40s, 60s, 60s, 60s, 60s.
        const waitMs = Math.min(60000, 5000 * 2 ** attempt);
        console.log(`    [callLLM] attempt ${attempt + 1} failed (${isRateLimit ? '429' : '5xx'}); retrying in ${waitMs / 1000}s...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

/** Generate full content for one letter+language, using as many continuation
 *  parts as needed to reach TARGET_MIN (up to MAX_PARTS).
 *
 *  Each part is cached to disk as soon as it completes, so an interrupted run
 *  can resume from the last saved part. */
async function generateContent(
  spec: LetterSpec,
  lang: 'ar' | 'en',
): Promise<{ text: string; parts: number[] }> {
  const sys = buildSystemPrompt(lang);
  const MAX_PARTS = 5;
  const parts: string[] = [];
  const wordCounts: number[] = [];

  // Resume from any cached parts (named `content.<lang>.partN`).
  for (let p = 1; p <= MAX_PARTS; p++) {
    const cached = readCache(spec.slug, `content.${lang}.part${p}`);
    if (cached === null) break;
    parts.push(cached);
    wordCounts.push(countWords(cached));
    console.log(`    [${spec.slug}/${lang}] part${p} (cached): ${wordCounts[wordCounts.length - 1]} words`);
  }

  for (let partNum = parts.length + 1; partNum <= MAX_PARTS; partNum++) {
    const previousText = parts.length > 0 ? parts.join('\n\n') : undefined;
    const currentTotal = countWords(parts.join('\n\n'));
    const isFinal = partNum === MAX_PARTS || (partNum >= 2 && currentTotal >= TARGET_MIN);
    const raw = await callLLM(
      sys,
      buildUserPrompt(spec, lang, { part: partNum, previousText, isFinal }),
    );
    const cleaned = cleanLLMOutput(raw);
    const wc = countWords(cleaned);
    parts.push(cleaned);
    wordCounts.push(wc);
    // Save this part to disk immediately for resumability.
    writeCache(spec.slug, `content.${lang}.part${partNum}`, cleaned);
    console.log(`    [${spec.slug}/${lang}] part${partNum}: ${wc} words (running total: ${countWords(parts.join('\n\n'))})`);
    if (countWords(parts.join('\n\n')) >= TARGET_MIN && partNum >= 2) break;
  }

  const combined = parts.join('\n\n').trim();
  const combinedWc = countWords(combined);
  console.log(`    [${spec.slug}/${lang}] final combined: ${combinedWc} words`);

  // Save the combined content too, and clean up part files.
  writeCache(spec.slug, `content.${lang}`, combined);
  for (let p = 1; p <= parts.length; p++) {
    // Best-effort cleanup; ignore errors.
    try {
      const fp = cachePath(spec.slug, `content.${lang}.part${p}`);
      if (existsSync(fp)) writeFileSync(fp, '', 'utf8');
    } catch {
      /* ignore */
    }
  }

  return { text: combined, parts: wordCounts };
}

/* -------------------------------------------------------------------------- */
/*  Excerpt                                                                   */
/* -------------------------------------------------------------------------- */

async function generateExcerpt(spec: LetterSpec, lang: 'ar' | 'en'): Promise<string> {
  const theme = lang === 'ar' ? spec.theme.ar : spec.theme.en;
  const sys =
    lang === 'ar'
      ? 'أنت محرّرٌ أدبيٌّ تكتب مقاطع مقتطفاتٍ لمجلةٍ كويتية فاخرة. اكتب فقرةً واحدةً مستقلّةً، إيقاعها شعريٌّ حسّي، بطول 70 إلى 90 كلمة بالعربية الفصحى الدافئة. لا تذكر اسم المجلة. لا تضع عنواناً. لا تخاطب القارئ بلغة دعائية. تجنّب الجمل القصيرة المقتضبة؛ اجعل الفقرة تتمدّد وتتنفّس.'
      : 'You are a literary editor writing excerpt passages for a premium Kuwaiti magazine. Write a single standalone paragraph with a poetic, sensory cadence, 70 to 90 words in English. Do not mention the magazine. Do not include a heading. Do not address the reader with promotional language. Avoid terse clipped sentences; let the paragraph breathe and expand.';
  const user =
    lang === 'ar'
      ? `اكتب مقطعاً مقتطفاً (70-90 كلمة بالضبط، لا أقلّ من 70 ولا أكثر من 90) يحيل إلى الموضوع التالي، بأسلوبٍ يفتح اللحظة لا يلخّصها. اكتب فقرةً واحدةً متّصلةً فقط:\n\n${theme}`
      : `Write an excerpt (exactly 70-90 words, no fewer than 70, no more than 90) that gestures toward the following subject, in a style that opens the moment rather than summarizing it. Write one continuous paragraph only:\n\n${theme}`;
  // Try up to 2 times to land in the 60-80 word band (we ask 70-90 to overshoot).
  for (let i = 0; i < 2; i++) {
    const raw = await callLLM(sys, user);
    let t = cleanLLMOutput(raw).replace(/^>\s?/gm, '').trim();
    const wc = countWords(t);
    if (wc >= 60 && wc <= 90) return t;
    // If too short, ask to extend; if too long, ask to trim.
    const adjust =
      wc < 60
        ? lang === 'ar'
          ? `المقطع التالي قصيرٌ جداً (${wc} كلمة). أعد كتابته بطول 70-80 كلمة، مع إضافة تفاصيل حسّية:\n\n${t}`
          : `The following passage is too short (${wc} words). Rewrite it at 70-80 words, adding sensory detail:\n\n${t}`
        : lang === 'ar'
          ? `المقطع التالي طويلٌ (${wc} كلمة). اختصره إلى 70-80 كلمة مع الحفاظ على الإيقاع:\n\n${t}`
          : `The following passage is too long (${wc} words). Trim it to 70-80 words while keeping the cadence:\n\n${t}`;
    const adjRaw = await callLLM(
      lang === 'ar'
        ? 'أنت محرّرٌ أدبيٌّ. أعد كتابة المقطع بالطول المطلوب بدقّة.'
        : 'You are a literary editor. Rewrite the passage at the requested length precisely.',
      adjust,
    );
    t = cleanLLMOutput(adjRaw).replace(/^>\s?/gm, '').trim();
    if (countWords(t) >= 55) return t;
  }
  // Fallback: return last attempt.
  return '';
}

/* -------------------------------------------------------------------------- */
/*  Resumable cache                                                           */
/* -------------------------------------------------------------------------- */

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const cacheDir = join(projectRoot, 'scripts', '.letters-cache');

function cachePath(slug: string, key: string): string {
  return join(cacheDir, `${slug}.${key}.txt`);
}

function readCache(slug: string, key: string): string | null {
  const p = cachePath(slug, key);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

function writeCache(slug: string, key: string, content: string): void {
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cachePath(slug, key), content, 'utf8');
}

/* -------------------------------------------------------------------------- */
/*  File assembly                                                             */
/* -------------------------------------------------------------------------- */

function tsString(s: string): string {
  return JSON.stringify(s);
}

function assembleLettersFile(
  letters: Array<
    LetterSpec & {
      excerpt: { ar: string; en: string };
      content: { ar: string; en: string };
    }
  >,
): string {
  const items = letters
    .map((l) => {
      const lines: string[] = ['  {'];
      lines.push(`    slug: ${tsString(l.slug)},`);
      lines.push(`    title: { ar: ${tsString(l.title.ar)}, en: ${tsString(l.title.en)} },`);
      lines.push(`    subtitle: { ar: ${tsString(l.subtitle.ar)}, en: ${tsString(l.subtitle.en)} },`);
      lines.push(`    excerpt: { ar: ${tsString(l.excerpt.ar)}, en: ${tsString(l.excerpt.en)} },`);
      lines.push(`    content: { ar: ${tsString(l.content.ar)}, en: ${tsString(l.content.en)} },`);
      lines.push(`    coverImageUrl: ${tsString(l.coverImageUrl)},`);
      lines.push(`    galleryUrls: ${JSON.stringify(l.galleryUrls)},`);
      lines.push(`    readTimeMinutes: ${l.readTimeMinutes},`);
      lines.push(`    publishedAt: ${tsString(l.publishedAt)},`);
      lines.push(`    topicSlug: ${tsString(l.topicSlug)},`);
      lines.push(`    authorHostHandle: ${tsString(l.authorHostHandle)},`);
      lines.push(`    gatheringSlug: ${l.gatheringSlug === null ? 'null' : tsString(l.gatheringSlug)},`);
      lines.push('  },');
      return lines.join('\n');
    })
    .join('\n');

  return `/* eslint-disable */
/**
 * letters.ts — 3 long-form bilingual editorial Letters for Lamma Phase 0.
 *
 * Body content drafted by LLM (z-ai-web-dev-sdk) in two parts per language,
 * then curated into the Cereal / Kinfolk literary register. Each
 * \`content.ar\` and \`content.en\` is 2000–3000 words of Markdown.
 *
 * Auto-generated by \`scripts/generate-letters.ts\`. Re-run that script to
 * regenerate; do not hand-edit the body strings unless re-running.
 */

import { letterSchema, type Letter } from './types';

export const letters: Letter[] = [
${items}
];

export const lettersBySlug: Record<string, Letter> = Object.fromEntries(
  letters.map((l) => [l.slug, l]),
);

export function getLetter(slug: string): Letter | undefined {
  return lettersBySlug[slug];
}

// Validate at module load (fails fast in dev if data is malformed).
letters.forEach((l) => letterSchema.parse(l));
`;
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

async function main() {
  const outPath = join(projectRoot, 'src', 'data', 'letters.ts');
  const results: Array<{
    spec: LetterSpec;
    ar: { text: string; wordCount: number };
    en: { text: string; wordCount: number };
    excerptAr: string;
    excerptEn: string;
  }> = [];

  for (const spec of letterSpecs) {
    console.log(`\n=== Letter: ${spec.slug} ===`);

    // Generate each piece independently and cache immediately so the run is
    // resumable if interrupted mid-letter.
    const arText = readCache(spec.slug, 'content.ar') ?? (await (async () => {
      const r = await generateContent(spec, 'ar');
      writeCache(spec.slug, 'content.ar', r.text);
      return r.text;
    })());
    const enText = readCache(spec.slug, 'content.en') ?? (await (async () => {
      const r = await generateContent(spec, 'en');
      writeCache(spec.slug, 'content.en', r.text);
      return r.text;
    })());
    const excerptAr =
      readCache(spec.slug, 'excerpt.ar') ?? (await (async () => {
        const t = await generateExcerpt(spec, 'ar');
        writeCache(spec.slug, 'excerpt.ar', t);
        return t;
      })());
    const excerptEn =
      readCache(spec.slug, 'excerpt.en') ?? (await (async () => {
        const t = await generateExcerpt(spec, 'en');
        writeCache(spec.slug, 'excerpt.en', t);
        return t;
      })());

    results.push({
      spec,
      ar: { text: arText, wordCount: countWords(arText) },
      en: { text: enText, wordCount: countWords(enText) },
      excerptAr,
      excerptEn,
    });
  }

  // Assemble final letters array.
  const finalLetters = results.map((r) => ({
    ...r.spec,
    excerpt: { ar: r.excerptAr, en: r.excerptEn },
    content: { ar: r.ar.text, en: r.en.text },
  }));

  const fileContent = assembleLettersFile(finalLetters);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, fileContent, 'utf8');

  // Report.
  console.log('\n========== GENERATION REPORT ==========');
  console.log(`Output: ${outPath}\n`);
  for (const r of results) {
    const arWc = r.ar.wordCount;
    const enWc = r.en.wordCount;
    const arStatus = arWc >= TARGET_MIN ? 'OK' : arWc >= MIN_WORDS ? 'ACCEPTABLE' : 'TOO SHORT';
    const enStatus = enWc >= TARGET_MIN ? 'OK' : enWc >= MIN_WORDS ? 'ACCEPTABLE' : 'TOO SHORT';
    const exArWc = countWords(r.excerptAr);
    const exEnWc = countWords(r.excerptEn);
    console.log(
      `Letter: ${r.spec.slug}\n` +
        `  AR content: ${arWc} words [${arStatus}]\n` +
        `  EN content: ${enWc} words [${enStatus}]\n` +
        `  Excerpt AR: ${exArWc} words | EN: ${exEnWc} words\n` +
        `  readTimeMinutes: ${r.spec.readTimeMinutes} (en/220 ≈ ${Math.round(enWc / 220)})`,
    );
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('FATAL:', err);
  console.error('stack:', (err as Error)?.stack);
  process.exit(1);
});
