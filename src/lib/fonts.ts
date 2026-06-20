import { Fraunces, Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from 'next/font/google';

/**
 * Lamma type system.
 *
 * - Fraunces: editorial serif for Latin display headings (Cereal / Kinfolk vibe)
 * - Inter: clean Latin body text
 * - IBM Plex Sans Arabic: Arabic display + body (carries the Kuwaiti warmth)
 * - JetBrains Mono: tabular numerals (prices, counts, times)
 *
 * Each font exposes a CSS variable consumed by globals.css @theme tokens.
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-en',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-en',
  display: 'swap',
});

export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

/** Combined className to apply on <html> / <body> to register all variables. */
export const fontVariables = [
  fraunces.variable,
  inter.variable,
  ibmPlexArabic.variable,
  jetbrainsMono.variable,
].join(' ');
