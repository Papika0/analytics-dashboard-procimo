import { DomainException } from './DomainException';

export class InvalidAggregationLevelException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_AGGREGATION_LEVEL');
    this.name = 'InvalidAggregationLevelException';
  }
}
