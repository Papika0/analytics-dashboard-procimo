import { CacheKeyGenerator } from '../cacheKeyGenerator';
import { AggregationLevel } from '@analytics-dashboard/shared-types';

describe('CacheKeyGenerator', () => {
  describe('generate', () => {
    it('should generate cache key from query parameters', () => {
      const key = CacheKeyGenerator.generate({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        aggregationLevel: AggregationLevel.DAILY,
      });

      expect(key).toBe('analytics:2024-01-01:2024-12-31:daily');
    });

    it('should normalize aggregation level to lowercase', () => {
      // Test that uppercase level string gets normalized
      const key = CacheKeyGenerator.generate({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aggregationLevel: 'DAILY' as any,
      });

      expect(key).toBe('analytics:2024-01-01:2024-12-31:daily');
    });

    it('should strip time component from ISO date strings', () => {
      const key = CacheKeyGenerator.generate({
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        aggregationLevel: AggregationLevel.MONTHLY,
      });

      expect(key).toBe('analytics:2024-01-01:2024-12-31:monthly');
    });

    it('should produce identical keys for semantically identical queries', () => {
      const key1 = CacheKeyGenerator.generate({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        aggregationLevel: AggregationLevel.WEEKLY,
      });

      const key2 = CacheKeyGenerator.generate({
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        aggregationLevel: 'weekly' as any,
      });

      expect(key1).toBe(key2);
    });
  });

  describe('parse', () => {
    it('should parse cache key back to parameters', () => {
      const params = CacheKeyGenerator.parse('analytics:2024-01-01:2024-12-31:monthly');

      expect(params).toEqual({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        aggregationLevel: 'monthly',
      });
    });

    it('should return null for invalid key format', () => {
      expect(CacheKeyGenerator.parse('invalid:key')).toBeNull();
      expect(CacheKeyGenerator.parse('wrong:2024-01-01:2024-12-31:daily')).toBeNull();
      expect(CacheKeyGenerator.parse('')).toBeNull();
    });

    it('should return null for key with wrong number of parts', () => {
      expect(CacheKeyGenerator.parse('analytics:2024-01-01:2024-12-31')).toBeNull();
      expect(CacheKeyGenerator.parse('analytics:2024-01-01:2024-12-31:daily:extra')).toBeNull();
    });
  });

  describe('generatePattern', () => {
    it('should generate wildcard pattern when no params provided', () => {
      const pattern = CacheKeyGenerator.generatePattern();

      expect(pattern).toBe('analytics:*');
    });

    it('should generate pattern with specific startDate', () => {
      const pattern = CacheKeyGenerator.generatePattern({ startDate: '2024-01-01' });

      expect(pattern).toBe('analytics:2024-01-01:*:*');
    });

    it('should generate pattern with specific aggregationLevel', () => {
      const pattern = CacheKeyGenerator.generatePattern({
        aggregationLevel: AggregationLevel.MONTHLY,
      });

      expect(pattern).toBe('analytics:*:*:monthly');
    });

    it('should generate pattern with multiple params', () => {
      const pattern = CacheKeyGenerator.generatePattern({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });

      expect(pattern).toBe('analytics:2024-01-01:2024-12-31:*');
    });
  });

  describe('round-trip consistency', () => {
    it('should generate and parse consistently', () => {
      const original = {
        startDate: '2024-06-15',
        endDate: '2024-09-30',
        aggregationLevel: AggregationLevel.WEEKLY,
      };

      const key = CacheKeyGenerator.generate(original);
      const parsed = CacheKeyGenerator.parse(key);

      expect(parsed).toEqual({
        startDate: '2024-06-15',
        endDate: '2024-09-30',
        aggregationLevel: 'weekly',
      });
    });
  });
});
