import { ValidationResult, ValidationSummary } from '../types';

export interface Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary;
}
