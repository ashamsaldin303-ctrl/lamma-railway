import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

/**
 * Loads the correct message bundle for the active locale.
 * Falls back to the default locale if the request locale is missing/invalid.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale | undefined;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
