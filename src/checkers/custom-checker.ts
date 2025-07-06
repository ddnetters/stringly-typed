import { Checker } from './base-checker';
import { CheckResult } from '../types';

export class CustomChecker implements Checker {
  check(content: string, options?: Record<string, any>): CheckResult {
    const logic = options?.logic;
    
    if (!logic || typeof logic !== 'string') {
      return { valid: false, message: 'No custom logic provided' };
    }
    
    try {
      const checkFunction = new Function('content', `return ${logic}`);
      const result = checkFunction(content);
      
      if (typeof result === 'boolean') {
        return { valid: result, message: result ? 'OK' : 'Custom check failed' };
      }
      
      if (typeof result === 'object' && result !== null) {
        return {
          valid: result.valid ?? false,
          message: result.message ?? 'Custom check completed'
        };
      }
      
      return { valid: false, message: 'Invalid custom logic result' };
    } catch (error) {
      return { valid: false, message: `Custom logic error: ${error}` };
    }
  }
}
