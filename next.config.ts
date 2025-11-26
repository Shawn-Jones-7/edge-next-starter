import path from 'node:path';

import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Explicitly set the workspace root to prevent loading packages from parent directories
  // This fixes the MissingSecret error caused by next-auth in parent node_modules
  outputFileTracingRoot: path.join(__dirname, './'),

  // Enable experimental features for Cloudflare
  experimental: {
    // Runtime configuration for Cloudflare Workers
  },

  // Ensure compatibility with Cloudflare Pages
  images: {
    // Disable image optimization for Cloudflare (use Cloudflare Image Resizing)
    unoptimized: true,
  },

  // Webpack configuration
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'better-sqlite3'];
    }

    // Fix for Cloudflare Workers: exclude Node.js built-in modules
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Polyfill or exclude async_hooks for edge runtime
      async_hooks: false,
      // Ignore @react-email/render to prevent Html component import errors
      // We use custom HTML generation instead of React Email
      '@react-email/render': false,
    };

    // Add plugin to ignore optional @react-email/render imports from resend
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@react-email\/render/,
        contextRegExp: /resend/,
      })
    );

    return config;
  },
};

export default withNextIntl(nextConfig);
