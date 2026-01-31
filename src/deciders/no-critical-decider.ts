import { Decider } from './base-decider';
import { ValidationResult, ValidationSummary } from '../types';

export class NoCriticalDecider implements Decider {
  decide(results: ValidationResult[], _options?: Record<string, any>): ValidationSummary {
    // Check for critical issues in two ways:
    // 1. Legacy: message contains 'CRITICAL'
    // 2. Brand style checker: details array contains severity: 'error'
    const criticalIssues = results.filter(r => {
      // Legacy check for backward compatibility
      if (r.message.includes('CRITICAL')) {
        return true;
      }
      // Check details array for error-severity violations
      if (r.details && r.details.length > 0) {
        return r.details.some(d => d.severity === 'error');
      }
      return false;
    });

    if (criticalIssues.length === 0) {
      return {
        pass: true,
        reason: 'No critical issues found'
      };
    }

    return {
      pass: false,
      reason: `Found ${criticalIssues.length} critical issue(s)`
    };
  }
}
