import { Decider } from './base-decider';
import { ValidationResult, ValidationSummary } from '../types';

export class CustomDecider implements Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary {
    const logic = options?.logic;
    
    if (!logic || typeof logic !== 'string') {
      return { pass: false, reason: 'No custom logic provided' };
    }
    
    try {
      const deciderFunction = new Function('results', `return ${logic}`);
      const result = deciderFunction(results);
      
      if (typeof result === 'boolean') {
        return { pass: result, reason: result ? 'Custom check passed' : 'Custom check failed' };
      }
      
      if (typeof result === 'object' && result !== null) {
        return {
          pass: result.pass ?? false,
          reason: result.reason ?? 'Custom decision completed'
        };
      }
      
      return { pass: false, reason: 'Invalid custom logic result' };
    } catch (error) {
      return { pass: false, reason: `Custom logic error: ${error}` };
    }
  }
}
