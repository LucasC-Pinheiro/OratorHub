/**
 * Cache service for managing client-side caching of Supabase queries
 * Helps reduce unnecessary API calls and improves performance
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
};

type CacheStore = Map<string, CacheEntry<unknown>>;

const cache: CacheStore = new Map();

/**
 * Default cache TTL in milliseconds
 */
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if a cache entry is still valid
 */
function isValid<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Get a value from cache
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (isValid(entry)) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

/**
 * Set a value in cache
 */
export function setCached<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Invalidate a specific cache entry
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate all cache entries that match a pattern
 */
export function invalidateCachePattern(pattern: string | RegExp): void {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Generate a cache key for talks
 */
export function talksCacheKey(
  prefix: string,
  options?: Record<string, unknown>
): string {
  const optionsStr = options ? JSON.stringify(options) : "";
  return `talks:${prefix}:${optionsStr}`;
}

/**
 * Generate a cache key for stats
 */
export function statsCacheKey(): string {
  return "talks:stats";
}

/**
 * Generate a cache key for theme search
 */
export function themeCacheKey(theme: string): string {
  return `talks:theme:${theme.toLowerCase()}`;
}
