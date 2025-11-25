/**
 * i18n Request Configuration
 * Server-side configuration for loading translations
 */

import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the requested locale from the URL
  const requested = await requestLocale;

  // Validate and fallback to default locale if invalid
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
