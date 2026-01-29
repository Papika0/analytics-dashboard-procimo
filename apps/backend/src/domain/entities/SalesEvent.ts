import { SalesEventDTO } from '@analytics-dashboard/shared-types';
import { DomainException } from '../exceptions/DomainException';

/**
 * SalesEvent Entity
 * Represents a single sales transaction or event in the system
 * This is an immutable entity - once created, it cannot be modified
 */
export class SalesEvent {
  private readonly _id: string;
  private readonly _timestamp: Date;
  private readonly _value: number;

  constructor(id: string, timestamp: Date, value: number) {
    this.validateId(id);
    this.validateTimestamp(timestamp);
    this.validateValue(value);

    this._id = id;
    this._timestamp = timestamp;
    this._value = value;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get timestamp(): Date {
    return new Date(this._timestamp); // Return a copy to maintain immutability
  }

  get value(): number {
    return this._value;
  }

  // Factory method to create from DTO
  static fromDTO(dto: SalesEventDTO): SalesEvent {
    return new SalesEvent(dto.id, new Date(dto.timestamp), dto.value);
  }

  // Convert to DTO for serialization
  toDTO(): SalesEventDTO {
    return {
      id: this._id,
      timestamp: this._timestamp.toISOString(),
      value: this._value,
    };
  }

  // Domain logic: Check if event occurred within a date range
  isWithinRange(startDate: Date, endDate: Date): boolean {
    return this._timestamp >= startDate && this._timestamp <= endDate;
  }

  // Domain logic: Check if event occurred on a specific date
  occurredOnDate(date: Date): boolean {
    return (
      this._timestamp.getFullYear() === date.getFullYear() &&
      this._timestamp.getMonth() === date.getMonth() &&
      this._timestamp.getDate() === date.getDate()
    );
  }

  // Private validation methods
  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new DomainException('SalesEvent ID cannot be empty');
    }
  }

  private validateTimestamp(timestamp: Date): void {
    if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
      throw new DomainException('Invalid timestamp for SalesEvent');
    }

    // Business rule: Events cannot be from the future
    if (timestamp > new Date()) {
      throw new DomainException('SalesEvent timestamp cannot be in the future');
    }
  }

  private validateValue(value: number): void {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new DomainException('SalesEvent value must be a valid number');
    }

    // Business rule: Sales value cannot be negative
    if (value < 0) {
      throw new DomainException('SalesEvent value cannot be negative');
    }
  }

  // Equality check (by ID)
  equals(other: SalesEvent): boolean {
    if (!(other instanceof SalesEvent)) {
      return false;
    }
    return this._id === other._id;
  }

  // String representation for debugging
  toString(): string {
    return `SalesEvent(id=${this._id}, timestamp=${this._timestamp.toISOString()}, value=${this._value})`;
  }
}
