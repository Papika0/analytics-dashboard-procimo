import { startOfWeek, startOfMonth, format, parseISO } from 'date-fns';
import { AggregationLevel } from '../value-objects/AggregationLevel';

/**
 * DateAggregationService
 * Domain service for date-related aggregation logic
 * This is pure domain logic with no infrastructure dependencies
 */
export class DateAggregationService {
  /**
   * Get the aggregation key for a given date based on aggregation level
   */
  static getAggregationKey(date: Date, level: AggregationLevel): string {
    if (level.isDaily()) {
      return format(date, 'yyyy-MM-dd');
    }

    if (level.isWeekly()) {
      // Get the Monday of the week
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return format(weekStart, 'yyyy-MM-dd');
    }

    if (level.isMonthly()) {
      return format(date, 'yyyy-MM');
    }

    throw new Error('Invalid aggregation level');
  }

  /**
   * Check if two dates belong to the same aggregation period
   */
  static isSamePeriod(date1: Date, date2: Date, level: AggregationLevel): boolean {
    const key1 = this.getAggregationKey(date1, level);
    const key2 = this.getAggregationKey(date2, level);
    return key1 === key2;
  }

  /**
   * Get the start date of an aggregation period
   */
  static getPeriodStart(dateKey: string, level: AggregationLevel): Date {
    const date = parseISO(dateKey);

    if (level.isDaily()) {
      return date;
    }

    if (level.isWeekly()) {
      return startOfWeek(date, { weekStartsOn: 1 });
    }

    if (level.isMonthly()) {
      return startOfMonth(date);
    }

    throw new Error('Invalid aggregation level');
  }
}
