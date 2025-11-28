import { NextRequest } from 'next/server';

import { withApiHandler, withMiddleware } from '@/lib/api';
import { getKVNamespace } from '@/lib/cache/client';
import { getDatabase } from '@/lib/db/client';
import { getR2Bucket } from '@/lib/r2/client';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'ok' | 'unavailable';
    storage: 'ok' | 'unavailable';
    cache: 'ok' | 'unavailable';
  };
}

// eslint-disable-next-line require-await
export async function GET(request: NextRequest) {
  return withMiddleware(request, () =>
    // eslint-disable-next-line require-await
    withApiHandler(async () => {
      // Check availability of services
      const db = getDatabase();
      const r2 = getR2Bucket();
      const kv = getKVNamespace();

      const services = {
        database: db ? ('ok' as const) : ('unavailable' as const),
        storage: r2 ? ('ok' as const) : ('unavailable' as const),
        cache: kv ? ('ok' as const) : ('unavailable' as const),
      };

      // Determine overall health status
      const unavailableCount = Object.values(services).filter((s) => s === 'unavailable').length;
      let status: HealthStatus['status'];

      if (unavailableCount === 0) {
        status = 'healthy';
      } else if (unavailableCount < 3) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      const health: HealthStatus = {
        status,
        timestamp: new Date().toISOString(),
        services,
      };

      return health;
    })
  );
}
