import { Checker } from './base-checker';
import { CheckResult } from '../types';

export class GrammarChecker implements Checker {
  check(content: string, _options?: Record<string, any>): CheckResult {
    const issues: string[] = [];
    
    if (content.length < 3) {
      return { valid: true, message: 'OK' };
    }
    
    if (!content.match(/^[A-Z]/)) {
      issues.push('should start with capital letter');
    }
    
    if (content.includes('  ')) {
      issues.push('contains double spaces');
    }
    
    if (content.match(/\w\w\w\w\w+/)) {
      const words = content.split(/\s+/);
      for (const word of words) {
        if (word.length > 15) {
          issues.push('contains very long words');
          break;
        }
      }
    }
    
    if (content.match(/(teh|recieve|seperate|definately)/i)) {
      issues.push('CRITICAL spelling error detected');
    }
    
    return {
      valid: issues.length === 0,
      message: issues.length === 0 ? 'OK' : issues.join(', ')
    };
  }
}
