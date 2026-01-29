import { AggregatedData } from './AggregatedData';
import { DomainException } from '../exceptions/DomainException';
import { AggregatedDataPoint } from '@analytics-dashboard/shared-types';

/**
 * AggregatedDataCollection
 * Represents a collection of aggregated data points
 * Provides domain operations on the collection
 */
export class AggregatedDataCollection {
  private readonly _data: AggregatedData[];

  constructor(data: AggregatedData[]) {
    this.validate(data);
    // Sort by date ascending
    this._data = [...data].sort((a, b) => a.date.localeCompare(b.date));
  }

  get data(): readonly AggregatedData[] {
    return [...this._data];
  }

  get length(): number {
    return this._data.length;
  }

  get isEmpty(): boolean {
    return this._data.length === 0;
  }

  // Domain queries
  getTotalSum(): number {
    return this._data.reduce((sum, item) => sum + item.total, 0);
  }

  getGrandAverage(): number {
    const totalCount = this._data.reduce((sum, item) => sum + item.count, 0);
    return totalCount > 0 ? this.getTotalSum() / totalCount : 0;
  }

  getMaxValue(): number {
    if (this.isEmpty) return 0;
    return Math.max(...this._data.map((item) => item.total));
  }

  getMinValue(): number {
    if (this.isEmpty) return 0;
    return Math.min(...this._data.map((item) => item.total));
  }

  // Get data within a specific date range
  filterByDateRange(startDate: string, endDate: string): AggregatedDataCollection {
    const filtered = this._data.filter((item) => item.date >= startDate && item.date <= endDate);
    return new AggregatedDataCollection(filtered);
  }

  // Get top N by total value
  getTopN(n: number): AggregatedDataCollection {
    const sorted = [...this._data].sort((a, b) => b.total - a.total);
    return new AggregatedDataCollection(sorted.slice(0, n));
  }

  // Convert to DTO array
  toDTO(): AggregatedDataPoint[] {
    return this._data.map((item) => item.toDTO());
  }

  // Factory methods
  static empty(): AggregatedDataCollection {
    return new AggregatedDataCollection([]);
  }

  static fromDTOs(dtos: AggregatedDataPoint[]): AggregatedDataCollection {
    const data = dtos.map((dto) => AggregatedData.fromDTO(dto));
    return new AggregatedDataCollection(data);
  }

  // Add a new data point
  add(item: AggregatedData): AggregatedDataCollection {
    return new AggregatedDataCollection([...this._data, item]);
  }

  // Merge with another collection
  merge(other: AggregatedDataCollection): AggregatedDataCollection {
    const merged = [...this._data, ...other._data];
    return new AggregatedDataCollection(merged);
  }

  // Validation
  private validate(data: AggregatedData[]): void {
    if (!Array.isArray(data)) {
      throw new DomainException('Data must be an array');
    }

    // Check for duplicate dates
    const dates = data.map((item) => item.date);
    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      throw new DomainException('Collection contains duplicate dates');
    }
  }

  toString(): string {
    return `AggregatedDataCollection(length=${this.length}, totalSum=${this.getTotalSum()})`;
  }
}
