import { AggregatedDataPoint } from '@analytics-dashboard/shared-types';
import { DomainException } from '../exceptions/DomainException';
import { isValid, parseISO } from 'date-fns';

/**
 * AggregatedData Aggregate Root
 * Represents aggregated sales data for a specific time period
 */
export class AggregatedData {
  private readonly _date: string;
  private readonly _total: number;
  private readonly _count: number; // Number of events aggregated

  constructor(date: string, total: number, count: number = 1) {
    this.validateDate(date);
    this.validateTotal(total);
    this.validateCount(count);

    this._date = date;
    this._total = total;
    this._count = count;
  }

  get date(): string {
    return this._date;
  }

  get total(): number {
    return this._total;
  }

  get count(): number {
    return this._count;
  }

  // Calculate average value per event
  get average(): number {
    return this._count > 0 ? this._total / this._count : 0;
  }

  // Factory method
  static create(date: string, total: number, count?: number): AggregatedData {
    return new AggregatedData(date, total, count);
  }

  // Factory method from DTO
  static fromDTO(dto: AggregatedDataPoint): AggregatedData {
    return new AggregatedData(dto.date, dto.total);
  }

  // Convert to DTO
  toDTO(): AggregatedDataPoint {
    return {
      date: this._date,
      total: this._total,
    };
  }

  // Combine with another aggregated data (for merging)
  combine(other: AggregatedData): AggregatedData {
    if (this._date !== other._date) {
      throw new DomainException('Cannot combine AggregatedData with different dates');
    }

    return new AggregatedData(this._date, this._total + other._total, this._count + other._count);
  }

  // Create a formatted version with additional metadata
  toDetailedDTO() {
    return {
      date: this._date,
      total: this._total,
      count: this._count,
      average: this.average,
    };
  }

  // Validation methods
  private validateDate(date: string): void {
    if (!date || date.trim().length === 0) {
      throw new DomainException('Date cannot be empty');
    }

    // Validate date format (should be YYYY-MM-DD or YYYY-MM)
    const dateFormats = [/^\d{4}-\d{2}-\d{2}$/, /^\d{4}-\d{2}$/];
    const isValidFormat = dateFormats.some((format) => format.test(date));

    if (!isValidFormat) {
      throw new DomainException('Date must be in format YYYY-MM-DD or YYYY-MM');
    }

    // Additional validation: ensure it's a valid date
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      throw new DomainException(`Invalid date: ${date}`);
    }
  }

  private validateTotal(total: number): void {
    if (typeof total !== 'number' || isNaN(total)) {
      throw new DomainException('Total must be a valid number');
    }

    if (total < 0) {
      throw new DomainException('Total cannot be negative');
    }
  }

  private validateCount(count: number): void {
    if (typeof count !== 'number' || isNaN(count) || count < 1) {
      throw new DomainException('Count must be a positive number');
    }
  }

  equals(other: AggregatedData): boolean {
    if (!(other instanceof AggregatedData)) {
      return false;
    }
    return this._date === other._date && this._total === other._total;
  }

  toString(): string {
    return `AggregatedData(date=${this._date}, total=${this._total}, count=${this._count}, avg=${this.average.toFixed(2)})`;
  }
}
