import { generateJSON } from '../llm-client';
import { topics } from '@/data/topics';

export interface SearchFilters {
  topics: string[];
  formats: string[];
  priceRange: 'free' | 'paid' | 'all';
  keywords: string[];
}

export async function parseNaturalLanguageSearch(
  query: string,
  locale: 'ar' | 'en',
): Promise<SearchFilters> {
  const availableTopics = topics.map((t) => `${t.slug} (${t.name.ar} / ${t.name.en})`).join(', ');
  const availableFormats = 'MEN_ONLY, WOMEN_ONLY, FAMILY, MIXED';

  const prompt = `
حلّل استعلام البحث التالي واستخرج الفلاتر المناسبة:

استعلام المستخدم: "${query}"

المواضيع المتاحة: ${availableTopics}
الصيغ المتاحة: ${availableFormats}

تعليمات:
- استخرج المواضيع ذات الصلة (slug فقط من القائمة المتاحة)
- استخرج الصيغة المطلوبة (رجال/نساء → MEN_ONLY/WOMEN_ONLY، عائلات → FAMILY، مختلط → MIXED)
- حدد إن كان المستخدم يبحث عن مجاني أو مدفوع
- استخرج كلمات مفتاحية إضافية للبحث النصي

أرجع JSON صالح فقط:
{
  "topics": ["slug1", "slug2"],
  "formats": ["MIXED"],
  "priceRange": "free" | "paid" | "all",
  "keywords": ["كلمة1", "كلمة2"]
}

إن كان الاستعلام عاماً أو غير واضح، أرجع مصفوفات فارغة و priceRange="all".
`;

  const result = await generateJSON<SearchFilters>(prompt, {
    temperature: 0.2,
    maxTokens: 200,
    cacheKey: `nl-search-${locale}-${query.slice(0, 40)}`,
  });

  return result ?? { topics: [], formats: [], priceRange: 'all', keywords: [] };
}
