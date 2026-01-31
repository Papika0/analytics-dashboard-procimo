import { AggregationService } from '../aggregation.service';
import { AggregationLevel } from '@analytics-dashboard/shared-types';

describe('AggregationService', () => {
  const mockEvents = [
    { id: '1', timestamp: new Date('2024-01-15T10:00:00Z'), value: 100 },
    { id: '2', timestamp: new Date('2024-01-15T14:00:00Z'), value: 150.55 },
    { id: '3', timestamp: new Date('2024-01-16T09:00:00Z'), value: 200 },
    { id: '4', timestamp: new Date('2024-01-22T12:00:00Z'), value: 300 },
    { id: '5', timestamp: new Date('2024-02-01T12:00:00Z'), value: 400 },
    { id: '6', timestamp: new Date('2024-02-15T08:00:00Z'), value: 250.333 },
  ];

  describe('daily aggregation', () => {
    it('should group events by day and sum values', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-01'),
        new Date('2024-02-28'),
        AggregationLevel.DAILY
      );

      const jan15 = result.find((r) => r.date === '2024-01-15');
      const jan16 = result.find((r) => r.date === '2024-01-16');

      expect(jan15?.total).toBe(250.55);
      expect(jan16?.total).toBe(200);
    });

    it('should sort results by date ascending', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-01'),
        new Date('2024-02-28'),
        AggregationLevel.DAILY
      );

      for (let i = 1; i < result.length; i++) {
        expect(result[i].date > result[i - 1].date).toBe(true);
      }
    });
  });

  describe('weekly aggregation', () => {
    it('should group events by ISO week (Monday start)', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-01'),
        new Date('2024-02-28'),
        AggregationLevel.WEEKLY
      );

      // Jan 15 (Monday) and Jan 16 (Tuesday) are in the same week
      // Jan 22 (Monday) starts a new week
      expect(result.length).toBeGreaterThanOrEqual(3);

      // Week of Jan 15 should include Jan 15 and Jan 16 events
      const weekJan15 = result.find((r) => r.date === '2024-01-15');
      expect(weekJan15?.total).toBe(450.55); // 100 + 150.55 + 200
    });
  });

  describe('monthly aggregation', () => {
    it('should group events by month and sum values', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-01'),
        new Date('2024-02-28'),
        AggregationLevel.MONTHLY
      );

      const jan = result.find((r) => r.date === '2024-01');
      const feb = result.find((r) => r.date === '2024-02');

      expect(jan?.total).toBe(750.55); // 100 + 150.55 + 200 + 300
      expect(feb?.total).toBe(650.33); // 400 + 250.333 rounded
    });

    it('should format dates as YYYY-MM', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-01'),
        new Date('2024-02-28'),
        AggregationLevel.MONTHLY
      );

      result.forEach((item) => {
        expect(item.date).toMatch(/^\d{4}-\d{2}$/);
      });
    });
  });

  describe('date range filtering', () => {
    it('should only include events within date range', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-15T00:00:00Z'),
        new Date('2024-01-16T23:59:59Z'),
        AggregationLevel.DAILY
      );

      expect(result.length).toBe(2);
      expect(result.find((r) => r.date === '2024-01-15')).toBeDefined();
      expect(result.find((r) => r.date === '2024-01-16')).toBeDefined();
      expect(result.find((r) => r.date === '2024-01-22')).toBeUndefined();
      expect(result.find((r) => r.date === '2024-02-01')).toBeUndefined();
    });

    it('should include events on boundary dates (inclusive)', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2024-01-15T00:00:00Z'),
        new Date('2024-01-15T23:59:59Z'),
        AggregationLevel.DAILY
      );

      expect(result.length).toBe(1);
      expect(result[0].date).toBe('2024-01-15');
      expect(result[0].total).toBe(250.55);
    });
  });

  describe('empty results', () => {
    it('should return empty array when no events in range', () => {
      const result = AggregationService.aggregate(
        mockEvents,
        new Date('2023-01-01'),
        new Date('2023-12-31'),
        AggregationLevel.DAILY
      );

      expect(result).toEqual([]);
    });

    it('should return empty array when events array is empty', () => {
      const result = AggregationService.aggregate(
        [],
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        AggregationLevel.DAILY
      );

      expect(result).toEqual([]);
    });
  });

  describe('value rounding', () => {
    it('should round totals to 2 decimal places', () => {
      const eventsWithDecimals = [
        { id: '1', timestamp: new Date('2024-01-15T10:00:00Z'), value: 100.111 },
        { id: '2', timestamp: new Date('2024-01-15T14:00:00Z'), value: 100.116 },
      ];

      const result = AggregationService.aggregate(
        eventsWithDecimals,
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        AggregationLevel.DAILY
      );

      // 100.111 + 100.116 = 200.227 -> rounds to 200.23
      expect(result[0].total).toBe(200.23);
    });
  });
});
