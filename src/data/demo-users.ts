import { z } from 'zod';

export const demoUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  nameLocalized: z.object({ ar: z.string(), en: z.string() }),
  avatarUrl: z.string(),
  bio: z.string(),
  bioLocalized: z.object({ ar: z.string(), en: z.string() }),
  gender: z.enum(['male', 'female']),
  nationality: z.string(),
  interests: z.array(z.string()),
  membershipTier: z.enum(['NEWCOMER', 'REGULAR', 'CURATOR', 'HOST']),
  hostedCount: z.number().int().nonnegative(),
  attendedCount: z.number().int().nonnegative(),
  password: z.string(),
});
export type DemoUser = z.infer<typeof demoUserSchema>;

export const demoUsers: DemoUser[] = [
  { id: 'user-noura', email: 'noura@lamma.demo', name: '{"ar":"نورة العنزي","en":"Noura Al-Anzi"}', nameLocalized: { ar: 'نورة العنزي', en: 'Noura Al-Anzi' }, avatarUrl: '/images/hosts/noura.jpg', bio: '{}', bioLocalized: { ar: 'مصمّمة جرافيك كويتية، أبحث عن تجارب أصيلة وحميمية بعيداً عن الازدحام.', en: 'Kuwaiti graphic designer seeking authentic intimate experiences away from the crowd.' }, gender: 'female', nationality: 'كويتية', interests: ['photography','art','design','books','culture'], membershipTier: 'REGULAR', hostedCount: 0, attendedCount: 5, password: 'demo' },
  { id: 'user-ahmad', email: 'ahmad@lamma.demo', name: '{"ar":"أحمد الكندري","en":"Ahmad Al-Kandari"}', nameLocalized: { ar: 'أحمد الكندري', en: 'Ahmad Al-Kandari' }, avatarUrl: '/images/hosts/abdullah.jpg', bio: '{}', bioLocalized: { ar: 'مهندس برمجيات، أحضر ورش العمل لأتعلم لا لأترفّه فقط.', en: 'Software engineer attending workshops to learn, not just to be entertained.' }, gender: 'male', nationality: 'كويتي', interests: ['technology','networking','books','music','photography'], membershipTier: 'CURATOR', hostedCount: 0, attendedCount: 12, password: 'demo' },
  { id: 'user-sara', email: 'sara@lamma.demo', name: '{"ar":"سارة المصري","en":"Sara Al-Masri"}', nameLocalized: { ar: 'سارة المصري', en: 'Sara Al-Masri' }, avatarUrl: '/images/hosts/amal.jpg', bio: '{}', bioLocalized: { ar: 'مديرة تسويق مصرية، جديدة في الكويت وأبحث عن بناء شبكة علاقات.', en: 'Egyptian marketing manager, new to Kuwait, looking to build a network.' }, gender: 'female', nationality: 'مصرية', interests: ['networking','culture','food','marketing','art'], membershipTier: 'NEWCOMER', hostedCount: 0, attendedCount: 1, password: 'demo' },
  { id: 'user-khaled', email: 'khaled@lamma.demo', name: '{"ar":"خالد المطيري","en":"Khaled Al-Mutairi"}', nameLocalized: { ar: 'خالد المطيري', en: 'Khaled Al-Mutairi' }, avatarUrl: '/images/hosts/mohammed.jpg', bio: '{}', bioLocalized: { ar: 'فنان تشكيلي كويتي، أنظم ورشاً فنية حميمية في استوديو الخاص.', en: 'Kuwaiti visual artist organizing intimate art workshops in my private studio.' }, gender: 'male', nationality: 'كويتي', interests: ['art','painting','pottery','culture','photography'], membershipTier: 'HOST', hostedCount: 3, attendedCount: 0, password: 'demo' },
];
export function getDemoUserById(id: string): DemoUser | undefined { return demoUsers.find((u) => u.id === id); }
