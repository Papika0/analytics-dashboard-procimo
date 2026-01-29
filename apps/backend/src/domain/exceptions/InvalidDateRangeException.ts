import { DomainException } from './DomainException';

export class InvalidDateRangeException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_DATE_RANGE');
    this.name = 'InvalidDateRangeException';
  }
}
