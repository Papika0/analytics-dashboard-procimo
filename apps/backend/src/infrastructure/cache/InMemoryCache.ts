import NodeCache from 'node-cache';
import { config } from '@shared/constants/config';

/**
 * InMemoryCache
 * Simple in-memory cache using node-cache library
 * Provides automatic TTL and statistics tracking
 */
export class InMemoryCache {
  private readonly cache: NodeCache;
  private hits: number = 0;
  private misses: number = 0;

  constructor(ttlSeconds?: number, checkPeriod?: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds || config.cacheTTL,
      checkperiod: checkPeriod || config.cacheCheckPeriod,
      useClones: false, // Performance optimization - don't clone objects
    });

    // Log cache events in development
    if (config.nodeEnv === 'development') {
      this.cache.on('set', (key) => {
        console.log(`[Cache] SET: ${key}`);
      });

      this.cache.on('expired', (key) => {
        console.log(`[Cache] EXPIRED: ${key}`);
      });

      this.cache.on('del', (key) => {
        console.log(`[Cache] DELETE: ${key}`);
      });
    }

    console.log(`✓ InMemoryCache initialized (TTL: ${config.cacheTTL}s)`);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const value = this.cache.get<T>(key);

    if (value !== undefined) {
      this.hits++;
      if (config.nodeEnv === 'development') {
        console.log(`[Cache] HIT: ${key}`);
      }
      return value;
    }

    this.misses++;
    if (config.nodeEnv === 'development') {
      console.log(`[Cache] MISS: ${key}`);
    }
    return null;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const success = this.cache.set(key, value, ttl || config.cacheTTL);

    if (!success) {
      console.error(`[Cache] Failed to set key: ${key}`);
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete a key
   */
  delete(key: string): void {
    this.cache.del(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.flushAll();
    this.hits = 0;
    this.misses = 0;
    console.log('[Cache] Cleared all entries');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const keys = this.cache.keys().length;
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;

    return {
      keys,
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Get detailed cache info
   */
  getInfo() {
    const stats = this.getStats();
    const cacheKeys = this.cache.keys();

    return {
      ...stats,
      cacheKeys: cacheKeys.slice(0, 10), // First 10 keys for debugging
      totalKeys: cacheKeys.length,
    };
  }
}
