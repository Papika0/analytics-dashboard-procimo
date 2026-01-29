/**
 * Shared Types for Analytics Dashboard
 * Used by both backend and frontend
 */

// ==================== Enums ====================

export enum AggregationLevel {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}

// ==================== Query Parameters ====================

export interface AnalyticsQueryParams {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  aggregationLevel: AggregationLevel;
}

// ==================== Domain Types ====================

export interface SalesEventDTO {
  id: string;
  timestamp: string; // ISO 8601 format
  value: number;
}

export interface AggregatedDataPoint {
  date: string; // Format depends on aggregation level
  total: number;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ResponseMetadata {
  cached: boolean;
  executionTimeMs: number;
  dataPoints: number;
  dateRange: {
    start: string;
    end: string;
  };
  aggregationLevel: AggregationLevel;
}

// ==================== Analytics Specific ====================

export interface AnalyticsDataResponse {
  data: AggregatedDataPoint[];
  metadata: ResponseMetadata;
}

// ==================== Type Guards ====================

export function isValidAggregationLevel(value: string): value is AggregationLevel {
  return Object.values(AggregationLevel).includes(value as AggregationLevel);
}

export function isValidDateString(value: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
}

// ==================== Validation Types ====================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}
