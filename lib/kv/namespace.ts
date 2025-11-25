import { getCloudflareEnv } from '@/lib/db/client';

/**
 * Get KV namespace instance
 * Extracted to separate module to avoid circular dependency between analytics and cache
 */
export function getKVNamespace(): KVNamespace | null {
  const env = getCloudflareEnv();
  return env?.KV || null;
}
