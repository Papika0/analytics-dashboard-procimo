import { format, parseISO, isValid, startOfWeek, startOfMonth, differenceInDays } from 'date-fns';

/**
 * DateUtils
 * Utility functions for date manipulation
 */
export class DateUtils {
  /**
   * Format date to YYYY-MM-DD
   */
  static formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  /**
   * Format date to YYYY-MM
   */
  static formatMonth(date: Date): string {
    return format(date, 'yyyy-MM');
  }

  /**
   * Parse date string safely
   */
  static parseDate(dateStr: string): Date {
    const date = parseISO(dateStr);
    if (!isValid(date)) {
      throw new Error(`Invalid date string: ${dateStr}`);
    }
    return date;
  }

  /**
   * Get week start date (Monday)
   */
  static getWeekStart(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  /**
   * Get month start date
   */
  static getMonthStart(date: Date): Date {
    return startOfMonth(date);
  }

  /**
   * Check if date string is valid
   */
  static isValidDateString(dateStr: string): boolean {
    if (!dateStr) return false;

    // Check format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) return false;

    // Check if it's a real date
    const date = parseISO(dateStr);
    return isValid(date);
  }

  /**
   * Calculate days between two dates
   */
  static daysBetween(start: Date, end: Date): number {
    return differenceInDays(end, start);
  }

  /**
   * Get date range info
   */
  static getDateRangeInfo(start: Date, end: Date) {
    const days = this.daysBetween(start, end);
    const weeks = Math.ceil(days / 7);
    const months = Math.ceil(days / 30);

    return {
      days,
      weeks,
      months,
      isLessThanWeek: days < 7,
      isLessThanMonth: days < 30,
      isLessThanYear: days < 365,
    };
  }
}
