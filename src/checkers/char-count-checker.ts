import { Checker } from './base-checker';
import { CheckResult } from '../types';

export class CharCountChecker implements Checker {
  check(content: string, options?: Record<string, any>): CheckResult {
    const maxChars = options?.maxChars ?? 100;
    
    if (content.length > maxChars) {
      return {
        valid: false,
        message: `Too long (${content.length} > ${maxChars})`
      };
    }
    
    return { valid: true, message: 'OK' };
  }
}
