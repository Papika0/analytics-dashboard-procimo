import { config } from '@shared/constants/config';
import { randomUUID } from 'crypto';

/**
 * Simple sales event interface
 */
export interface SalesEvent {
  id: string;
  timestamp: Date;
  value: number;
}

/**
 * MockDataGenerator
 * Generates realistic mock sales data for testing and development
 */
export class MockDataGenerator {
  private static instance: MockDataGenerator;
  private readonly cachedEvents: SalesEvent[] = [];

  private constructor() {
    this.generateEvents();
  }

  static getInstance(): MockDataGenerator {
    if (!MockDataGenerator.instance) {
      MockDataGenerator.instance = new MockDataGenerator();
    }
    return MockDataGenerator.instance;
  }

  /**
   * Get all generated events
   */
  getEvents(): SalesEvent[] {
    return [...this.cachedEvents];
  }

  /**
   * Generate mock sales events
   */
  private generateEvents(): void {
    const { mockDataSize, mockDataMonths } = config;
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - mockDataMonths);

    console.log(`Generating ${mockDataSize} mock sales events...`);
    const startTime = Date.now();

    for (let i = 0; i < mockDataSize; i++) {
      const event = this.generateRandomEvent(startDate, now);
      this.cachedEvents.push(event);
    }

    // Sort by timestamp for better querying
    this.cachedEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const endTime = Date.now();
    console.log(`✓ Generated ${mockDataSize} events in ${endTime - startTime}ms`);
    console.log(
      `  Date range: ${this.cachedEvents[0].timestamp.toISOString().split('T')[0]} to ${this.cachedEvents[this.cachedEvents.length - 1].timestamp.toISOString().split('T')[0]}`
    );
  }

  /**
   * Generate a single random sales event
   */
  private generateRandomEvent(startDate: Date, endDate: Date): SalesEvent {
    const timestamp = this.randomDateBetween(startDate, endDate);
    const value = this.generateRealisticValue(timestamp);
    const id = randomUUID();

    return { id, timestamp, value };
  }

  /**
   * Generate random date between two dates
   */
  private randomDateBetween(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  /**
   * Generate realistic sales values with patterns
   * - Higher values on weekdays
   * - Lower values on weekends
   * - Seasonal variations
   * - Some random spikes
   */
  private generateRealisticValue(date: Date): number {
    const baseValue = 100;
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    // Weekend modifier (lower sales on weekends)
    const weekendModifier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0;

    // Seasonal modifier (higher in Q4, lower in summer)
    const seasonalModifier = this.getSeasonalModifier(month);

    // Random variation (±30%)
    const randomVariation = 0.7 + Math.random() * 0.6;

    // Occasional spikes (5% chance of 2-3x value)
    const spikeModifier = Math.random() < 0.05 ? 2 + Math.random() : 1;

    const value = baseValue * weekendModifier * seasonalModifier * randomVariation * spikeModifier;

    // Round to 2 decimal places
    return Math.round(value * 100) / 100;
  }

  /**
   * Get seasonal modifier based on month
   */
  private getSeasonalModifier(month: number): number {
    // January-March: Post-holiday slump
    if (month >= 0 && month <= 2) return 0.85;

    // April-May: Spring increase
    if (month >= 3 && month <= 4) return 1.0;

    // June-August: Summer slowdown
    if (month >= 5 && month <= 7) return 0.8;

    // September-October: Back to school/autumn
    if (month >= 8 && month <= 9) return 1.1;

    // November-December: Holiday season
    return 1.3;
  }

  /**
   * Get statistics about the generated data
   */
  getStatistics() {
    if (this.cachedEvents.length === 0) {
      return null;
    }

    const values = this.cachedEvents.map((e) => e.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: this.cachedEvents.length,
      total: Math.round(total * 100) / 100,
      average: Math.round(average * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      dateRange: {
        start: this.cachedEvents[0].timestamp.toISOString().split('T')[0],
        end: this.cachedEvents[this.cachedEvents.length - 1].timestamp.toISOString().split('T')[0],
      },
    };
  }
}
