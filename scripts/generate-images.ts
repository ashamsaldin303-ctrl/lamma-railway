/**
 * Lamma Phase 0 — Image generation script
 *
 * Generates all editorial images (52 total) for the Lamma platform via the
 * z-ai-web-dev-sdk and writes them as JPEG files under public/images.
 *
 * Idempotent: skips files that already exist and are larger than 5KB.
 * Concurrency = 3 with up to 3 retries per image (2s/4s/8s backoff).
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'node:fs';
import path from 'node:path';

// ---------- Style suffix (appended to every prompt) ----------
// Verbatim from the Lamma Phase 0 image-gen task spec.
const STYLE_SUFFIX =
  ', editorial photography, natural soft lighting, warm earthy tones, intimate atmosphere, kinfolk magazine aesthetic, subtle film grain, 35mm, NO text, NO watermark, NO logo, avoid stock photo look, avoid neon, avoid blue/indigo/purple/violet tones';

// ---------- Sizes ----------
// NOTE: The task spec lists `1440x720` and `720x1440` as supported, but the
// upstream Z-AI API rejects them with HTTP 400 because 720 is not a multiple
// of 32 (API requires both dims ∈ [512, 2880], divisible by 32, and ≤ 2^22 px
// total). The closest valid 16:9-ish size is `1344x768` (aspect 1.75, very
// close to true 16:9 = 1.778). We substitute it for every "16:9" cover slot.
const SIZES = {
  topicCover: '864x1152', // 4:5
  hostAvatar: '1024x1024', // 1:1
  hostCover: '1344x768', // ~16:9 (was 1440x720, rejected by API)
  gatheringCover: '1344x768', // ~16:9 (was 1440x720, rejected by API)
  gatheringGallery: '864x1152', // 4:5
  letterCover: '1344x768', // ~16:9 (was 1440x720, rejected by API)
  ogSocial: '1344x768', // ~16:9 (was 1440x720, rejected by API)
} as const;

type ImageSize = (typeof SIZES)[keyof typeof SIZES];

interface ImageSpec {
  path: string;
  prompt: string;
  size: ImageSize;
}

const PROJECT_ROOT = process.cwd();
const IMG_ROOT = path.join(PROJECT_ROOT, 'public', 'images');

function img(...segments: string[]): string {
  return path.join(IMG_ROOT, ...segments);
}

// ============================================================
// MANIFEST
// ============================================================
const manifest: ImageSpec[] = [];

// --- A. Topic covers (864x1152) ---
const topics: Array<{ slug: string; prompt: string }> = [
  {
    slug: 'memory-of-place',
    prompt:
      'Intimate editorial photograph of an old Kuwaiti souq alley at golden hour, warm sandstone walls, soft long shadows, a single distant figure walking, weathered wooden doors, dust suspended in light',
  },
  {
    slug: 'food-stories',
    prompt:
      'Overhead editorial photograph of a handmade ceramic bowl of stew on a linen-covered table, warm natural window light, hands kneading dough in soft focus background, steam rising, earthy terracotta tones',
  },
  {
    slug: 'light-and-shadow',
    prompt:
      'Editorial photograph of strong afternoon sunlight casting geometric shadows through a mashrabiya wooden screen onto a clay plaster wall, a vintage film camera resting on a wooden surface, deep contrast, warm tones',
  },
  {
    slug: 'new-voices',
    prompt:
      'Editorial photograph of a single open notebook with handwritten Arabic poetry on a dark wooden table, a vintage microphone in soft focus, warm single light source, intimate stage atmosphere',
  },
  {
    slug: 'soul-of-books',
    prompt:
      'Editorial photograph of a worn hardcover book lying open on a wool blanket, a cup of black coffee beside it, soft window light, warm sepia tones, quiet reading nook',
  },
  {
    slug: 'after-work',
    prompt:
      'Editorial photograph of a dimly lit small table for two with two half-filled tea glasses and an open sketchbook, evening warm lamp light, blurred city window behind, intimate after-work mood',
  },
];
for (const t of topics) {
  manifest.push({
    path: img('topics', `${t.slug}.jpg`),
    prompt: t.prompt,
    size: SIZES.topicCover,
  });
}

// --- B. Host avatars (1024x1024) ---
const hostAvatars: Array<{ name: string; prompt: string }> = [
  {
    name: 'abdullah',
    prompt:
      'Editorial portrait of a 45-year-old Kuwaiti male historian with a warm calm smile, wearing a traditional white dishdasha, soft natural window light, dark neutral warm background, dignified',
  },
  {
    name: 'noura',
    prompt:
      'Editorial portrait of a 33-year-old Kuwaiti female art photographer with expressive eyes, wearing a soft earth-toned hijab, holding a vintage film camera, soft window light, warm neutral background',
  },
  {
    name: 'amal',
    prompt:
      'Editorial portrait of a 40-year-old Sudanese female chef with a warm genuine smile, wearing a deep teal apron over earth-toned clothing, soft kitchen window light, warm neutral background',
  },
  {
    name: 'mohammed',
    prompt:
      'Editorial portrait of a 38-year-old Kuwaiti male poet with thoughtful eyes, wearing a charcoal grey kandura, soft side window light, dark warm background, contemplative mood',
  },
  {
    name: 'fatima',
    prompt:
      'Editorial portrait of a 50-year-old Kuwaiti female literary critic with silver-streaked hair, wearing earth-toned elegant clothing, soft window light, warm bookshelf background in soft focus',
  },
];
for (const h of hostAvatars) {
  manifest.push({
    path: img('hosts', `${h.name}.jpg`),
    prompt: h.prompt,
    size: SIZES.hostAvatar,
  });
}

// --- C. Host covers (1440x720) ---
const hostCovers: Array<{ name: string; prompt: string }> = [
  {
    name: 'abdullah',
    prompt:
      'Wide editorial photograph of old Kuwaiti archival maps and historical photographs spread on a dark wooden desk, warm desk lamp light, a magnifying glass, intimate historian workspace',
  },
  {
    name: 'noura',
    prompt:
      'Wide editorial photograph of a photography studio with prints drying on a line, soft window light, film negatives on a lightbox glowing warm, earthy tones, creative mess',
  },
  {
    name: 'amal',
    prompt:
      'Wide editorial photograph of a warm home kitchen with copper pots, fresh herbs hanging, a wooden table with flour dusted, soft afternoon light, Sudanese home cooking atmosphere',
  },
  {
    name: 'mohammed',
    prompt:
      "Wide editorial photograph of a quiet poet's writing corner, an open leather notebook, a glass of tea, soft evening light through a window, warm intimate mood",
  },
  {
    name: 'fatima',
    prompt:
      'Wide editorial photograph of a personal library with floor-to-ceiling warm wooden bookshelves, a reading armchair, soft lamp light, stacks of annotated books, scholarly warmth',
  },
];
for (const h of hostCovers) {
  manifest.push({
    path: img('hosts', `${h.name}-cover.jpg`),
    prompt: h.prompt,
    size: SIZES.hostCover,
  });
}

// --- D. Gathering covers (1440x720) ---
const gatherings: Array<{ slug: string; prompt: string }> = [
  {
    slug: 'memory-mubarakiya-walk',
    prompt:
      'Wide editorial photograph of Souq Al-Mubarakiya in Kuwait at golden hour, warm stone textures, intimate alley, soft shadows, no faces visible, 35mm film aesthetic',
  },
  {
    slug: 'food-sudanese-table',
    prompt:
      'Wide editorial photograph of an intimate Sudanese home-cooked meal spread on a low wooden table, colorful ceramic bowls, fresh bread, warm candle light, hands of women sharing food',
  },
  {
    slug: 'light-shuwaikh-photography',
    prompt:
      'Wide editorial photograph of a small photography workshop in a converted Shuwaikh warehouse, soft light through large windows, vintage cameras on a table, a few participants silhouetted',
  },
  {
    slug: 'voices-poets-evening',
    prompt:
      'Wide editorial photograph of an intimate evening poetry gathering, a single poet at a wooden podium with a warm spotlight, small audience in soft shadow, dark warm room',
  },
  {
    slug: 'books-cities-of-salt',
    prompt:
      'Wide editorial photograph of a book club circle, well-worn copies of a novel on wooden chairs, warm lamp light, tea glasses, intimate literary salon',
  },
  {
    slug: 'afterwork-engineers',
    prompt:
      'Wide editorial photograph of a small after-work gathering of engineers around a low table with sketchpads and tea, warm evening light through a large window, relaxed intimate mood',
  },
  {
    slug: 'memory-old-towers',
    prompt:
      'Wide editorial photograph of the Kuwait Towers at blue-hour transitioning to warm dusk, soft warm horizon, a few small figures in the foreground for scale, nostalgic editorial mood',
  },
  {
    slug: 'voices-rhythm-music',
    prompt:
      'Wide editorial photograph of a Kuwaiti percussion music evening, traditional drums on a rug, warm lantern light, hands of musicians in motion, intimate circle',
  },
];
for (const g of gatherings) {
  manifest.push({
    path: img('gatherings', `${g.slug}.jpg`),
    prompt: g.prompt,
    size: SIZES.gatheringCover,
  });
}

// --- E. Gathering gallery (864x1152) — 8 gatherings × 3 images = 24 ---
// Each slug gets gallery-1, gallery-2, gallery-3 with the per-slug details below.
const galleryDetails: Record<
  string,
  { theme: string; g1: string; g2: string; g3: string }
> = {
  'memory-mubarakiya-walk': {
    theme: 'old Kuwaiti souq',
    g1: 'weathered brass spice scales and jars of saffron and cardamom',
    g2: "an elderly vendor's hands arranging dried limes",
    g3: 'narrow souq alley at late afternoon with hanging lanterns',
  },
  'food-sudanese-table': {
    theme: 'Sudanese home cooking',
    g1: 'a clay bowl of foul medames topped with olive oil and sesame',
    g2: 'hands tearing kisra bread to scoop stew',
    g3: 'the full low table set for sharing, warm candle light',
  },
  'light-shuwaikh-photography': {
    theme: 'photography workshop',
    g1: 'a vintage 35mm camera and rolls of film on a wooden table',
    g2: 'hands adjusting a manual focus lens',
    g3: 'the warehouse studio space with prints on the wall, soft window light',
  },
  'voices-poets-evening': {
    theme: 'Kuwaiti poetry evening',
    g1: 'an open notebook with handwritten Arabic verse and a glass of tea',
    g2: "a poet's hands gesturing while reciting",
    g3: 'the dim intimate venue with warm lanterns and soft audience shadows',
  },
  'books-cities-of-salt': {
    theme: 'book club on Cities of Salt',
    g1: 'a worn paperback novel with margin notes in pencil',
    g2: 'hands holding the book open, a finger marking a line',
    g3: 'the reading circle with tea glasses and books on wooden chairs',
  },
  'afterwork-engineers': {
    theme: 'engineers networking',
    g1: 'a mechanical pencil and graph-paper sketch on a wooden table',
    g2: 'hands turning a prototype over, examining detail',
    g3: 'the small gathering around a low table with tea and sketches, warm evening light',
  },
  'memory-old-towers': {
    theme: 'old Kuwait Towers nostalgia',
    g1: 'a vintage postcard of the Kuwait Towers on a wooden desk',
    g2: 'hands holding an old photograph of the towers',
    g3: 'the towers at warm dusk from a distance with palm silhouettes',
  },
  'voices-rhythm-music': {
    theme: 'Kuwaiti rhythm music',
    g1: 'a traditional mirwas drum resting on a woven rug',
    g2: "a musician's hands striking a drumhead in motion",
    g3: 'the circle of musicians with lantern light and instruments, intimate warm atmosphere',
  },
};

for (const slug of Object.keys(galleryDetails)) {
  const d = galleryDetails[slug];
  manifest.push({
    path: img('gatherings', `${slug}-gallery-1.jpg`),
    prompt: `Close-up editorial detail photograph related to ${d.theme}: ${d.g1}, warm natural light, shallow depth of field, intimate texture`,
    size: SIZES.gatheringGallery,
  });
  manifest.push({
    path: img('gatherings', `${slug}-gallery-2.jpg`),
    prompt: `Editorial photograph of hands and objects related to ${d.theme}: ${d.g2}, warm tones, 35mm, candid intimate moment`,
    size: SIZES.gatheringGallery,
  });
  manifest.push({
    path: img('gatherings', `${slug}-gallery-3.jpg`),
    prompt: `Wide environmental editorial photograph capturing the atmosphere of ${d.theme}: ${d.g3}, soft warm light, no faces clearly visible, mood over subject`,
    size: SIZES.gatheringGallery,
  });
}

// --- F. Letter covers (1440x720) ---
const letters: Array<{ slug: string; prompt: string }> = [
  {
    slug: 'letter-rhythm-echoes',
    prompt:
      'Wide editorial photograph evoking the afterglow of a Kuwaiti percussion evening, a single drum resting on a rug in warm lantern light, empty circle of cushions, quiet intimate aftermath',
  },
  {
    slug: 'letter-lebanese-table',
    prompt:
      'Wide editorial photograph of a remembered Lebanese mezze table, small dishes of hummus and tabbouleh and olives, soft window light, an empty chair, nostalgic warm mood',
  },
  {
    slug: 'letter-old-salmiya',
    prompt:
      'Wide editorial photograph evoking old Salmiya, a quiet residential street at golden hour with low white houses and a single palm, warm nostalgic light, no people',
  },
];
for (const l of letters) {
  manifest.push({
    path: img('letters', `${l.slug}.jpg`),
    prompt: l.prompt,
    size: SIZES.letterCover,
  });
}

// --- G. OG social image (1440x720) ---
manifest.push({
  path: img('og', 'lamma-og.jpg'),
  prompt:
    'Wide editorial photograph representing the spirit of intimate Kuwaiti gatherings: a warm wooden table set for a small evening meal, tea glasses, soft lamp light, an open notebook, earthy warm tones, no people, no text',
  size: SIZES.ogSocial,
});

// Sanity check — should be 52.
console.log(`[manifest] total images = ${manifest.length}`);

// ============================================================
// Helpers
// ============================================================
const MIN_BYTES = 5 * 1024; // 5KB threshold for "valid existing file"

function fileExistsNonEmpty(p: string): boolean {
  try {
    const stat = fs.statSync(p);
    return stat.isFile() && stat.size > MIN_BYTES;
  } catch {
    return false;
  }
}

function ensureDir(p: string): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateOne(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  spec: ImageSpec,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const fullPrompt = `${spec.prompt}${STYLE_SUFFIX}`;
  // Per spec: up to 3 retries with 2s/4s/8s backoff on failure.
  // We extend the backoff substantially on HTTP 429 (rate-limit) responses
  // to avoid getting banned by the upstream API under concurrent load.
  const backoffs = [2000, 4000, 8000];
  const maxAttempts = backoffs.length + 1; // 1 initial + 3 retries = 4 total
  let lastError: unknown = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await zai.images.generations.create({
        prompt: fullPrompt,
        size: spec.size as any,
      });
      const base64 = response?.data?.[0]?.base64;
      if (!base64) {
        throw new Error('empty base64 in response');
      }
      const buffer = Buffer.from(base64, 'base64');
      if (buffer.length < MIN_BYTES) {
        throw new Error(`generated buffer too small: ${buffer.length} bytes`);
      }
      ensureDir(spec.path);
      fs.writeFileSync(spec.path, buffer);
      return { ok: true };
    } catch (err) {
      lastError = err;
      const isRateLimit =
        err instanceof Error && /429|Too many requests/i.test(err.message);
      // On rate-limit errors, sleep at least 30s to let the quota recover.
      const sleepMs =
        isRateLimit && attempt < backoffs.length
          ? Math.max(backoffs[attempt], 30000)
          : backoffs[attempt] ?? 8000;
      if (attempt < maxAttempts - 1) {
        await sleep(sleepMs);
      }
    }
  }
  const msg = lastError instanceof Error ? lastError.message : String(lastError);
  return { ok: false, error: msg };
}

// ============================================================
// Worker pool (concurrency = 3)
// ============================================================
// Default concurrency = 3 per spec. Override with LAMMA_IMG_CONCURRENCY env
// var (e.g. set to 1 if the upstream API returns 429 rate-limit errors).
const CONCURRENCY = Number.parseInt(
  process.env.LAMMA_IMG_CONCURRENCY ?? '3',
  10,
);

async function main(): Promise<void> {
  // Filter out already-generated files.
  const todo: ImageSpec[] = [];
  let skipped = 0;
  for (const spec of manifest) {
    if (fileExistsNonEmpty(spec.path)) {
      skipped++;
    } else {
      todo.push(spec);
    }
  }

  console.log(
    `[plan] total=${manifest.length} todo=${todo.length} already-present=${skipped} concurrency=${CONCURRENCY}`,
  );

  const zai = await ZAI.create();

  let generated = 0;
  let failed = 0;
  const failedPaths: Array<{ path: string; error: string }> = [];
  let queueIdx = 0;
  const total = manifest.length;

  // Use manifest index for stable [i/total] reporting.
  // Build a map of relative path -> manifest index for friendly numbering.
  const indexPath = new Map<string, number>();
  manifest.forEach((s, i) => indexPath.set(s.path, i + 1));

  async function worker(workerId: number): Promise<void> {
    while (true) {
      const idx = queueIdx++;
      if (idx >= todo.length) return;
      const spec = todo[idx];
      const num = indexPath.get(spec.path) ?? idx + 1;
      const rel = path.relative(PROJECT_ROOT, spec.path);
      const result = await generateOne(zai, spec);
      if (result.ok) {
        generated++;
        console.log(`[${num}/${total}] ✓ generated ${rel}`);
      } else {
        failed++;
        failedPaths.push({ path: rel, error: result.error });
        console.log(`[${num}/${total}] ✗ failed ${rel}: ${result.error}`);
      }
    }
  }

  const workers: Promise<void>[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(i));
  }
  await Promise.all(workers);

  console.log('\n================ SUMMARY ================');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (already present): ${skipped}`);
  console.log(`Failed: ${failed}`);
  if (failedPaths.length > 0) {
    console.log('\nFailed paths:');
    for (const f of failedPaths) {
      console.log(`  - ${f.path}\n      ↳ ${f.error}`);
    }
  }
  console.log('=========================================');
}

main().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
