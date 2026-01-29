import { AggregationLevel as AggregationLevelEnum } from '@analytics-dashboard/shared-types';
import { DomainException } from '../exceptions/DomainException';

/**
 * AggregationLevel Value Object
 * Encapsulates the aggregation level with domain logic
 */
export class AggregationLevel {
  private readonly _level: AggregationLevelEnum;

  constructor(level: AggregationLevelEnum | string) {
    this.validate(level);
    this._level = level as AggregationLevelEnum;
  }

  get value(): AggregationLevelEnum {
    return this._level;
  }

  // Domain queries
  isDaily(): boolean {
    return this._level === AggregationLevelEnum.DAILY;
  }

  isWeekly(): boolean {
    return this._level === AggregationLevelEnum.WEEKLY;
  }

  isMonthly(): boolean {
    return this._level === AggregationLevelEnum.MONTHLY;
  }

  // Get appropriate date format for this aggregation level
  getDateFormat(): string {
    switch (this._level) {
      case AggregationLevelEnum.DAILY:
        return 'yyyy-MM-dd';
      case AggregationLevelEnum.WEEKLY:
        return 'yyyy-MM-dd'; // Week start date
      case AggregationLevelEnum.MONTHLY:
        return 'yyyy-MM';
    }
  }

  // Get appropriate grouping unit
  getGroupingUnit(): 'day' | 'week' | 'month' {
    switch (this._level) {
      case AggregationLevelEnum.DAILY:
        return 'day';
      case AggregationLevelEnum.WEEKLY:
        return 'week';
      case AggregationLevelEnum.MONTHLY:
        return 'month';
    }
  }

  // Factory method
  static fromString(level: string): AggregationLevel {
    return new AggregationLevel(level);
  }

  // Validation
  private validate(level: string): void {
    if (!level) {
      throw new DomainException('Aggregation level cannot be empty');
    }

    const validLevels = Object.values(AggregationLevelEnum);
    if (!validLevels.includes(level as AggregationLevelEnum)) {
      throw new DomainException(
        `Invalid aggregation level: ${level}. Must be one of: ${validLevels.join(', ')}`
      );
    }
  }

  equals(other: AggregationLevel): boolean {
    if (!(other instanceof AggregationLevel)) {
      return false;
    }
    return this._level === other._level;
  }

  toString(): string {
    return this._level;
  }

  toJSON(): AggregationLevelEnum {
    return this._level;
  }
}
