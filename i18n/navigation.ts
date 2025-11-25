/**
 * i18n Navigation Utilities
 * Lightweight wrappers around Next.js navigation APIs with locale support
 */

import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// Export navigation utilities that automatically handle locale
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
