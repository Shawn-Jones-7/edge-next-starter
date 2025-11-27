// Import vitest globals (expect is used globally in tests)
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

vi.mock('@cloudflare/next-on-pages', () => ({
  getRequestContext: () => ({
    env: {},
    request: null,
    waitUntil: () => undefined,
  }),
}));

// Clean up React components after each test
afterEach(() => {
  cleanup();
});
