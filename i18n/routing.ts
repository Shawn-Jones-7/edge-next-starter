/**
 * i18n Routing Configuration
 * Defines supported locales and routing behavior for next-intl
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Supported locales
  locales: ['en', 'zh'],

  // Default locale when no locale is specified
  defaultLocale: 'en',

  // Always show locale prefix in URL (e.g., /en/about, /zh/about)
  localePrefix: 'always',
});

// Type helper for locale
export type Locale = (typeof routing.locales)[number];
