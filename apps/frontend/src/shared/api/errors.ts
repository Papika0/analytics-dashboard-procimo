import { AxiosError } from 'axios';

/**
 * Error detail from API validation errors
 */
export interface ApiErrorDetail {
  path: string;
  message: string;
}

/**
 * Structured API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

/**
 * Error codes returned by the API
 */
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom error class for API errors with structured information
 */
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number | undefined;
  public readonly details: ApiErrorDetail[];
  public readonly isNetworkError: boolean;
  public readonly isTimeoutError: boolean;
  public readonly isValidationError: boolean;
  public readonly isServerError: boolean;

  constructor(
    message: string,
    code: ApiErrorCode,
    statusCode?: number,
    details: ApiErrorDetail[] = []
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isNetworkError = code === ApiErrorCode.NETWORK_ERROR;
    this.isTimeoutError = code === ApiErrorCode.TIMEOUT_ERROR;
    this.isValidationError = code === ApiErrorCode.VALIDATION_ERROR;
    this.isServerError = code === ApiErrorCode.INTERNAL_SERVER_ERROR;
  }

  /**
   * Get a user-friendly error title based on the error type
   */
  getTitle(): string {
    switch (this.code) {
      case ApiErrorCode.VALIDATION_ERROR:
        return 'Invalid Request';
      case ApiErrorCode.NETWORK_ERROR:
        return 'Connection Error';
      case ApiErrorCode.TIMEOUT_ERROR:
        return 'Request Timeout';
      case ApiErrorCode.INTERNAL_SERVER_ERROR:
        return 'Server Error';
      case ApiErrorCode.NOT_FOUND:
        return 'Not Found';
      default:
        return 'Error';
    }
  }

  /**
   * Get formatted error details as a string array for display
   */
  getFormattedDetails(): string[] {
    return this.details.map((detail) => {
      const fieldName = formatFieldName(detail.path);
      return fieldName ? `${fieldName}: ${detail.message}` : detail.message;
    });
  }
}

/**
 * Format field path to user-friendly name
 */
function formatFieldName(path: string): string {
  const fieldMappings: Record<string, string> = {
    startDate: 'Start Date',
    endDate: 'End Date',
    aggregationLevel: 'Aggregation Level',
  };

  return fieldMappings[path] || path;
}

/**
 * Parse an Axios error into a structured ApiError
 */
export function parseApiError(error: unknown): ApiError {
  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Timeout error
    if (axiosError.code === 'ECONNABORTED') {
      return new ApiError(
        'The request took too long to complete. Please try again.',
        ApiErrorCode.TIMEOUT_ERROR
      );
    }

    // Network error (no response)
    if (!axiosError.response) {
      return new ApiError(
        'Unable to connect to the server. Please check your internet connection and try again.',
        ApiErrorCode.NETWORK_ERROR
      );
    }

    const { status, data } = axiosError.response;

    // Parse structured error response from our API
    if (data?.error) {
      const { code, message, details } = data.error;
      const errorCode = mapErrorCode(code);

      // For validation errors, create a more descriptive message
      if (errorCode === ApiErrorCode.VALIDATION_ERROR && details?.length) {
        const detailMessages = details.map((d) => d.message).join('; ');
        return new ApiError(detailMessages || message, errorCode, status, details);
      }

      return new ApiError(message, errorCode, status, details);
    }

    // Handle common HTTP status codes with user-friendly messages
    return new ApiError(getHttpStatusMessage(status), getErrorCodeForStatus(status), status);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return new ApiError(error.message, ApiErrorCode.UNKNOWN_ERROR);
  }

  // Unknown error type
  return new ApiError(
    'An unexpected error occurred. Please try again.',
    ApiErrorCode.UNKNOWN_ERROR
  );
}

/**
 * Check if error is an Axios error
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Map API error code string to enum
 */
function mapErrorCode(code: string): ApiErrorCode {
  switch (code) {
    case 'VALIDATION_ERROR':
      return ApiErrorCode.VALIDATION_ERROR;
    case 'INTERNAL_SERVER_ERROR':
      return ApiErrorCode.INTERNAL_SERVER_ERROR;
    case 'NOT_FOUND':
      return ApiErrorCode.NOT_FOUND;
    default:
      return ApiErrorCode.UNKNOWN_ERROR;
  }
}

/**
 * Get error code based on HTTP status
 */
function getErrorCodeForStatus(status: number): ApiErrorCode {
  if (status >= 400 && status < 500) {
    return status === 404 ? ApiErrorCode.NOT_FOUND : ApiErrorCode.VALIDATION_ERROR;
  }
  if (status >= 500) {
    return ApiErrorCode.INTERNAL_SERVER_ERROR;
  }
  return ApiErrorCode.UNKNOWN_ERROR;
}

/**
 * Get user-friendly message for HTTP status codes
 */
function getHttpStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your input and try again.';
    case 401:
      return 'You are not authorized to access this resource.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 408:
      return 'The request timed out. Please try again.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
      return 'The server encountered an error. Please try again later.';
    case 502:
      return 'The server is temporarily unavailable. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    case 504:
      return 'The server took too long to respond. Please try again.';
    default:
      if (status >= 400 && status < 500) {
        return 'There was a problem with your request. Please try again.';
      }
      if (status >= 500) {
        return 'The server encountered an error. Please try again later.';
      }
      return 'An unexpected error occurred. Please try again.';
  }
}
