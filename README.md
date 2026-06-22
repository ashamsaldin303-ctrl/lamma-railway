# 🌙 لَمَّة (Lamma) — Railway Edition (Phase B)

> **منصة كويتية لتجمعات حميمية مُنتقاة.** نتعامل مع الفعاليات كحوارٍ، لا كمعاملة.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

## 📌 المرحلة الحالية: Phase B

هذا الـ branch يستخدم **PostgreSQL (Supabase) + Clerk Auth** — جاهز للإنتاج الكامل.

| المكون | الحالة |
|--------|--------|
| Database | ✅ PostgreSQL (Supabase) + pgvector |
| Auth | ✅ Clerk (JWT + OAuth) |
| Migrations | ✅ `prisma migrate deploy` |
| AI | ✅ z-ai-web-dev-sdk (with fallback) |
| Live Companion | ✅ Socket.io (port 3003) |
| PWA | ✅ manifest + service worker |

---

## 🚀 النشر على Railway

### المتطلبات الأساسية

قبل النشر، تحتاج لإنشاء:

1. **Supabase project** → احصل على `DATABASE_URL` + `DIRECT_URL`
2. **Clerk application** → احصل على Clerk keys
3. **Migration أول** → لتطبيق الـ schema على Supabase

**التفاصيل الكاملة في:** [`PHASE-B-GUIDE.md`](./PHASE-B-GUIDE.md)

### النشر السريع (بعد إعداد Supabase + Clerk)

1. اذهب إلى https://railway.app/new
2. اختر هذا الـ repo: `Akrout111/lamma-railway`
3. أضف Variables (انظر `.env.example` للقائمة الكاملة)
4. اضغط **Deploy**
5. انتظر 5-8 دقائق
6. اضبط الـ domain في Railway → Settings → Networking

### المتغيرات الإلزامية

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.lamma:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lamma:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# Next.js
NODE_ENV="production"
NEXTAUTH_URL="https://your-app.up.railway.app"
NEXTAUTH_SECRET=""

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Live Companion
LIVE_COMPANION_PORT="3003"
```

**⚠️ تحذيرات:**
- لا تضع `$` في كلمات المرور (استخدم `%24` بدلاً منه)
- استخدم Transaction pooler (port 6543) وليس Direct connection (port 5432) لـ `DATABASE_URL`

---

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

---

## 🛠️ Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Frontend | Next.js 16 + React 19 + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Prisma 6 + PostgreSQL (Supabase) + pgvector |
| Auth | Clerk (JWT + OAuth + webhook) |
| Realtime | Socket.io (port 3003, internal) |
| AI | z-ai-web-dev-sdk (LLM + image generation) |
| Hosting | Railway |

---

## 🔧 الإعداد المحلي (Local Dev)

```bash
# 1. استنساخ المشروع
git clone https://github.com/Akrout111/lamma-railway.git
cd lamma-railway

# 2. تثبيت الاعتمادات
bun install
cd mini-services/live-companion && bun install && cd ..

# 3. إعداد البيئة
cp .env.example .env
# عدّل .env بـ Supabase + Clerk credentials

# 4. إعداد Prisma
bun ./node_modules/prisma/build/index.js generate
bun ./node_modules/prisma/build/index.js migrate dev --name init

# 5. (اختياري) Seed البيانات
bun run db:seed

# 6. تشغيل خادم التطوير (Terminal 1)
bun run dev

# 7. تشغيل Live Companion (Terminal 2)
bun run live:start
```

افتح http://localhost:3000

---

## 📂 بنية المشروع

```
├── src/
│   ├── app/[locale]/            # صفحات ثنائية اللغة
│   ├── app/sign-in/             # صفحة Clerk SignIn
│   ├── app/sign-up/             # صفحة Clerk SignUp
│   ├── app/api/webhooks/clerk/  # Clerk webhook handler
│   ├── components/lamma/        # مكونات UI
│   ├── lib/                     # stores, AI, matching, utils
│   ├── data/                    # بيانات seed (mock)
│   └── i18n/                    # next-intl config
├── messages/                    # ترجمات (ar.json + en.json)
├── mini-services/
│   └── live-companion/          # WebSocket service (port 3003)
├── prisma/                      # Prisma schema + migrations
├── public/                      # 52 صورة AI + PWA assets
├── Dockerfile                   # Multi-stage (4 stages)
├── railway.json                 # Railway config (healthcheck 300s)
├── PHASE-B-GUIDE.md             # دليل الترحيل الكامل
└── .env.example                 # كل المتغيرات الممكنة
```

---

## 🌐 اللغات

- `ar` (default, RTL) — على `/`
- `en` (LTR) — على `/en`

---

## 📊 الـ Health Check

```bash
curl https://your-app.up.railway.app/api/v1/health
# {
#   "status": "ok",
#   "db": "connected",
#   "dbDetail": "postgresql",
#   "service": "lamma",
#   "version": "1.0.0-railway"
# }
```

---

## 🚦 استكشاف الأخطاء

### `Can't reach database server`
استخدم Transaction pooler (port 6543) مع `?pgbouncer=true`، وليس Direct connection (port 5432).

### `Clerk webhook signature invalid`
تحقق من `CLERK_WEBHOOK_SECRET` في Railway يطابق Clerk Dashboard.

### `migration failed to apply cleanly`
فعّل pgvector في Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### صفحة بيضاء بعد deploy
تأكد أن `NEXTAUTH_URL` يطابق domain الفعلي.

---

## 📖 الوثائق الإضافية

- [`PHASE-B-GUIDE.md`](./PHASE-B-GUIDE.md) — دليل الترحيل من SQLite لـ PostgreSQL + Clerk
- [`.env.example`](./.env.example) — كل المتغيرات الممكنة

---

## 📝 الترخيص

MIT — انظر [LICENSE](LICENSE)

## 🇰🇼 صُنع في الكويت

> "نحن لا نبني تطبيقات CRUD. نحن نبني منتجات ثقافية."
