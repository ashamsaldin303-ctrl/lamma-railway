import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: "standalone",

  // Production: never ignore TS errors. Fix them instead.
  typescript: {
    ignoreBuildErrors: false,
  },

  // Production: enable strict mode for early bug detection.
  reactStrictMode: true,

  // Compress responses (Railway terminates SSL, this saves bandwidth).
  compress: true,

  // Power-efficient logging.
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Allow Railway preview URLs (they look like *.up.railway.app).
  // Without this, Next.js 16 blocks cross-origin requests from preview URLs.
  allowedDevOrigins: [
    'https://*.up.railway.app',
    'https://*.railway.app',
  ],

  // AI-generated images live in /public/images and are served locally.
  // If you later use Cloudinary or external images, add their domains here.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },

  // Experimental: reduce serverless cold starts on Railway.
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default withNextIntl(nextConfig);
