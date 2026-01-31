import { AggregationLevel, AnalyticsQueryParams } from '@analytics-dashboard/shared-types';

/**
 * CacheKeyGenerator
 * Generates consistent cache keys from query parameters
 * Critical for cache hit rate - must be deterministic
 */
export class CacheKeyGenerator {
  private static readonly PREFIX = 'analytics';

  /**
   * Generate cache key from query parameters
   * Format: analytics:{startDate}:{endDate}:{aggregationLevel}
   */
  static generate(params: AnalyticsQueryParams): string {
    const { startDate, endDate, aggregationLevel } = params;

    // Normalize inputs to ensure consistent keys
    const normalizedStart = this.normalizeDate(startDate);
    const normalizedEnd = this.normalizeDate(endDate);
    const normalizedLevel = aggregationLevel.toLowerCase();

    return `${this.PREFIX}:${normalizedStart}:${normalizedEnd}:${normalizedLevel}`;
  }

  /**
   * Parse cache key back to parameters (for debugging)
   */
  static parse(key: string): AnalyticsQueryParams | null {
    const parts = key.split(':');

    if (parts.length !== 4 || parts[0] !== this.PREFIX) {
      return null;
    }

    return {
      startDate: parts[1],
      endDate: parts[2],
      aggregationLevel: parts[3] as AggregationLevel,
    };
  }

  /**
   * Normalize date string to YYYY-MM-DD format
   */
  private static normalizeDate(dateStr: string): string {
    // Remove any time component if present
    return dateStr.split('T')[0];
  }

  /**
   * Generate pattern for cache invalidation
   */
  static generatePattern(partialParams?: Partial<AnalyticsQueryParams>): string {
    if (!partialParams) {
      return `${this.PREFIX}:*`;
    }

    const { startDate, endDate, aggregationLevel } = partialParams;
    const parts = [this.PREFIX];

    parts.push(startDate ? this.normalizeDate(startDate) : '*');
    parts.push(endDate ? this.normalizeDate(endDate) : '*');
    parts.push(aggregationLevel ? aggregationLevel.toLowerCase() : '*');

    return parts.join(':');
  }
}
