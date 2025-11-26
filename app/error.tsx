/**
 * Custom 500 Error Page
 * App Router root-level error page
 */

'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">500</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          We&apos;re sorry, but something unexpected happened.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
