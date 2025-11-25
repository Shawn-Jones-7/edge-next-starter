/**
 * Next.js Middleware with i18n support
 * Handles locale detection and routing
 */

import { routing } from '@/i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware(routing);

export const config = {
  // Match all paths except:
  // - api routes
  // - _next (static files)
  // - _vercel
  // - static files (images, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
