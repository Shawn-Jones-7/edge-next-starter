/**
 * Custom 404 Not Found Page
 * App Router root-level not-found page
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
