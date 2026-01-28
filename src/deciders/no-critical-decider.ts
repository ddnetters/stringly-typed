import { Decider } from './base-decider';
import { ValidationResult, ValidationSummary } from '../types';

export class NoCriticalDecider implements Decider {
  decide(results: ValidationResult[], _options?: Record<string, any>): ValidationSummary {
    const criticalIssues = results.filter(r => r.message.includes('CRITICAL'));
    
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
