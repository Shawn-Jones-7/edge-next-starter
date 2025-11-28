// Import vitest globals (expect is used globally in tests)
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';

vi.mock('@opennextjs/cloudflare', () => ({
  getCloudflareContext: () =>
    Promise.resolve({
      env: {},
      ctx: {
        waitUntil: vi.fn(),
      },
    }),
}));

// Clean up React components after each test
afterEach(() => {
  cleanup();
});
