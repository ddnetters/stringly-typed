import { Decider } from './base-decider';
import { ValidationResult, ValidationSummary } from '../types';

export class ThresholdDecider implements Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary {
    const minValidRatio = options?.minValidRatio ?? 0.8;
    
    if (results.length === 0) {
      return { pass: true, reason: 'No strings to validate' };
    }
    
    const validCount = results.filter(r => r.valid).length;
    const validRatio = validCount / results.length;
    
    if (validRatio >= minValidRatio) {
      return {
        pass: true,
        reason: `${validCount}/${results.length} strings valid (${(validRatio * 100).toFixed(1)}%)`
      };
    }
    
    return {
      pass: false,
      reason: `Only ${validCount}/${results.length} strings valid (${(validRatio * 100).toFixed(1)}%), required ${(minValidRatio * 100)}%`
    };
  }
}
