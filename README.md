# 🌙 لَمَّة (Lamma) — Railway Edition

> **منصة كويتية لتجمعات حميمية مُنتقاة.** نتعامل مع الفعاليات كحوارٍ، لا كمعاملة.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

## 🚀 النشر على Railway

هذه النسخة مُحضّرة خصيصاً للنشر على Railway. كل ما تحتاجه هو:

### الطريقة السريعة (5 دقائق)

1. **انقر زر Deploy أعلاه** أو اذهب إلى https://railway.app/new
2. اختر هذا الـ repo: `Akrout111/lamma-railway`
3. اضغط **Deploy**
4. انتظر 5-8 دقائق لبناء الـ Docker image
5. اضبط الـ domain في Railway → Settings → Networking
6. اذهب إلى `https://your-app.up.railway.app` 🎉

### الطريقة اليدوية (للتحكم الكامل)

1. **Create New Project** على Railway
2. **Deploy from GitHub repo** → اختر `Akrout111/lamma-railway`
3. أضف Variables (انظر `.env.example`):

```bash
# الحد الأدنى المطلوب:
DATABASE_URL="file:./db/custom.db"  # SQLite (افتراضي)
NODE_ENV="production"
NEXTAUTH_URL="https://your-app.up.railway.app"
NEXTAUTH_SECRET=""  # اتركه فارغاً مؤقتاً

# اختياري (للميزات المتقدمة):
ZAI_API_KEY=""  # للميزات الذكية (LLM + image generation)
```

4. اضغط **Deploy**
5. في **Settings → Networking**, فعّل **Generate Domain**
6. انتظر حتى يصبح الـ status **Healthy**

## ✨ الميزات

- **Discovery Layer** — تصفّح اللمات، أصحاب التجمعات، المواضيع، الرسائل
- **AI Concierge** — مساعد ذكي بـ LLM حقيقي
- **Smart Matching** — TF-IDF + explainable AI
- **Live Companion** — رفيق لحظي (WebSocket + Socket.io)
- **Host Dashboard** — مراجعة الطلبات + analytics + messaging
- **Prayer-aware scheduling** — احترام مواقيت الصلاة
- **Bilingual AR/EN** — مع دعم RTL/LTR كامل
- **PWA** — قابل للتثبيت + offline support
- **SEO** — sitemap + robots + JSON-LD

## 🛠️ Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Frontend | Next.js 16 + React 19 + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Prisma 6 + SQLite (dev) / PostgreSQL (prod) |
| Realtime | Socket.io (port 3003, internal) |
| AI | z-ai-web-dev-sdk (LLM + image generation) |
| Hosting | Railway |

## 📂 بنية المشروع

```
├── src/
│   ├── app/[locale]/        # صفحات ثنائية اللغة
│   ├── components/lamma/    # مكونات UI
│   ├── lib/                 # stores, AI, matching, utils
│   ├── data/                # بيانات seed (mock)
│   └── i18n/                # next-intl config
├── messages/                # ترجمات (ar.json + en.json)
├── mini-services/
│   └── live-companion/      # WebSocket service (port 3003)
├── prisma/                  # Prisma schema
├── public/                  # 52 صورة AI + PWA assets
├── Dockerfile               # Multi-stage (4 stages)
├── railway.json             # Railway config (healthcheck 300s)
└── .env.example             # كل المتغيرات الممكنة
```

## 🔧 الإعداد المحلي (Local Dev)

```bash
# 1. تثبيت الاعتمادات
bun install

# 2. تثبيت اعتمادات Live Companion
cd mini-services/live-companion && bun install && cd ..

# 3. إعداد Prisma
bun run db:generate
bun run db:push

# 4. (اختياري) توليد الصور بالـ AI
bun run gen:images

# 5. تشغيل خادم التطوير (Terminal 1)
bun run dev

# 6. تشغيل Live Companion (Terminal 2)
bun run live:start
```

افتح http://localhost:3000

## 🌐 اللغات

- `ar` (default, RTL) — على `/`
- `en` (LTR) — على `/en`

## 👥 المستخدمون التجريبيون

| Email | Password | الدور |
|-------|----------|------|
| noura@lamma.demo | demo | Regular attendee |
| ahmad@lamma.demo | demo | Curator |
| sara@lamma.demo | demo | Newcomer |
| khaled@lamma.demo | demo | Host |

## 📊 الـ Health Check

```bash
curl https://your-app.up.railway.app/api/v1/health
# {
#   "status": "ok",
#   "db": "connected",
#   "database": "sqlite" | "postgresql",
#   "service": "lamma",
#   "version": "1.0.0-railway"
# }
```

## 🚦 استكشاف الأخطاء

### الـ deploy يفشل في healthcheck

1. اقرأ logs: `railway logs`
2. تحقّق من `DATABASE_URL` (إن كان `$` في كلمة المرور، استبدله بـ `%24`)
3. استخدم Transaction pooler (port 6543) مع Supabase، وليس direct connection (port 5432)

### `Can't reach database server`

Railway لا يدعم IPv6. استخدم Transaction pooler من Supabase:
```
postgresql://postgres.lamma:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Live Companion لا يعمل

الـ Live Companion يعمل على port 3003 داخلياً. لا يُ exposed خارجياً.
للوصول إليه، استخدم Railway service منفصل أو اضبط proxy في `Caddyfile`.

### صفحة بيضاء بعد deploy

1. افتح DevTools → Console
2. تحقّق من `NEXTAUTH_URL` (يجب أن يطابق الـ domain الفعلي)
3. تحقّق من missing env vars في logs

## 🔒 الأمان

- ✅ لا أسرار في الكود
- ✅ `.env` في `.gitignore`
- ✅ المستخدم غير root في Dockerfile
- ✅ Healthcheck آمن (لا يكشف تفاصيل DB للعامة)

## 📝 الترخيص

MIT — انظر [LICENSE](LICENSE)

## 🇰🇼 صُنع في الكويت

> "نحن لا نبني تطبيقات CRUD. نحن نبني منتجات ثقافية."
