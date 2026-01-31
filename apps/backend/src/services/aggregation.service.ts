import { AggregationLevel, AggregatedDataPoint } from '@analytics-dashboard/shared-types';
import { DateUtils } from '@shared/utils/dateUtils';

/**
 * Raw sales event from mock data
 */
export interface SalesEvent {
  id: string;
  timestamp: Date;
  value: number;
}

/**
 * Aggregation Service
 * Handles data aggregation by daily, weekly, or monthly periods
 */
export class AggregationService {
  /**
   * Aggregate sales events by the specified level
   */
  static aggregate(
    events: SalesEvent[],
    startDate: Date,
    endDate: Date,
    level: AggregationLevel
  ): AggregatedDataPoint[] {
    // Filter events within date range
    const filteredEvents = events.filter(
      (event) => event.timestamp >= startDate && event.timestamp <= endDate
    );

    // Group events by aggregation key
    const grouped = new Map<string, number>();

    for (const event of filteredEvents) {
      const key = this.getAggregationKey(event.timestamp, level);
      const current = grouped.get(key) || 0;
      grouped.set(key, current + event.value);
    }

    // Convert to array and sort by date
    const result: AggregatedDataPoint[] = [];
    for (const [date, total] of grouped) {
      result.push({
        date,
        total: Math.round(total * 100) / 100, // Round to 2 decimal places
      });
    }

    // Sort by date ascending
    result.sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  /**
   * Get aggregation key for a date based on level
   */
  private static getAggregationKey(date: Date, level: AggregationLevel): string {
    switch (level) {
      case AggregationLevel.DAILY:
        return DateUtils.formatDate(date);

      case AggregationLevel.WEEKLY: {
        const weekStart = DateUtils.getWeekStart(date);
        return DateUtils.formatDate(weekStart);
      }

      case AggregationLevel.MONTHLY:
        return DateUtils.formatMonth(date);

      default:
        return DateUtils.formatDate(date);
    }
  }
}
