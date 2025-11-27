import path from 'node:path';

import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Explicitly set the workspace root to prevent loading packages from parent directories
  // This fixes the MissingSecret error caused by next-auth in parent node_modules
  outputFileTracingRoot: path.join(__dirname, './'),

  // Disable static optimization to avoid prerender errors with @react-email
  poweredByHeader: false,
  compress: true,

  // Ensure compatibility with Cloudflare Pages
  images: {
    // Disable image optimization for Cloudflare (use Cloudflare Image Resizing)
    unoptimized: true,
  },

  // Enable experimental features for Cloudflare
  experimental: {
    // Runtime configuration for Cloudflare Workers
    ppr: false, // Disable Partial Prerendering
  },

  // Disable static page generation
  output: 'standalone',

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'better-sqlite3'];
    }

    // Fix for Cloudflare Workers: exclude Node.js built-in modules
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      async_hooks: false,
    };

    // Block @react-email imports completely by making them return an empty module
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-email/render': false,
      '@react-email/components': false,
      'react-email': false,
    };

    // Ignore warnings for @react-email modules
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@react-email/,
      },
    ];

    return config;
  },
};

export default withNextIntl(nextConfig);
