/**
 * DomainException
 * Base exception for all domain-related errors
 * These represent business rule violations
 */
export class DomainException extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainException';
    this.code = code;
    this.timestamp = new Date();

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
