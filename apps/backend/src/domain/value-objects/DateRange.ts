import { DomainException } from '../exceptions/DomainException';
import { startOfDay, endOfDay, isAfter, isBefore, isEqual, differenceInDays } from 'date-fns';

/**
 * DateRange Value Object
 * Represents an immutable date range with validation rules
 * Value objects have no identity - they are defined by their values
 */
export class DateRange {
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.validate(startDate, endDate);

    // Normalize to start/end of day for consistent comparisons
    this._startDate = startOfDay(startDate);
    this._endDate = endOfDay(endDate);
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  // Factory methods for common date ranges
  static fromStrings(startDateStr: string, endDateStr: string): DateRange {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime())) {
      throw new DomainException(`Invalid start date: ${startDateStr}`);
    }

    if (isNaN(endDate.getTime())) {
      throw new DomainException(`Invalid end date: ${endDateStr}`);
    }

    return new DateRange(startDate, endDate);
  }

  static lastNDays(days: number): DateRange {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return new DateRange(startDate, endDate);
  }

  static lastNMonths(months: number): DateRange {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    return new DateRange(startDate, endDate);
  }

  // Domain logic methods
  contains(date: Date): boolean {
    return !isBefore(date, this._startDate) && !isAfter(date, this._endDate);
  }

  overlaps(other: DateRange): boolean {
    return (
      this.contains(other._startDate) ||
      this.contains(other._endDate) ||
      other.contains(this._startDate) ||
      other.contains(this._endDate)
    );
  }

  getDurationInDays(): number {
    return differenceInDays(this._endDate, this._startDate);
  }

  // Validation
  private validate(startDate: Date, endDate: Date): void {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new DomainException('Start date must be a valid date');
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      throw new DomainException('End date must be a valid date');
    }

    if (isAfter(startDate, endDate)) {
      throw new DomainException('Start date must be before or equal to end date');
    }

    // Business rule: Date range cannot exceed 2 years
    const maxDays = 365 * 2;
    if (differenceInDays(endDate, startDate) > maxDays) {
      throw new DomainException(`Date range cannot exceed ${maxDays} days (2 years)`);
    }

    // Business rule: Start date cannot be more than 10 years in the past
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    if (isBefore(startDate, tenYearsAgo)) {
      throw new DomainException('Start date cannot be more than 10 years in the past');
    }

    // Business rule: End date cannot be in the future
    const now = new Date();
    if (isAfter(endDate, now)) {
      throw new DomainException('End date cannot be in the future');
    }
  }

  // Value object equality (by value, not reference)
  equals(other: DateRange): boolean {
    if (!(other instanceof DateRange)) {
      return false;
    }
    return isEqual(this._startDate, other._startDate) && isEqual(this._endDate, other._endDate);
  }

  toString(): string {
    return `DateRange(${this._startDate.toISOString().split('T')[0]} to ${this._endDate.toISOString().split('T')[0]})`;
  }

  toJSON() {
    return {
      startDate: this._startDate.toISOString().split('T')[0],
      endDate: this._endDate.toISOString().split('T')[0],
    };
  }
}
