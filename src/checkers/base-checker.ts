import { CheckResult } from '../types';

export interface Checker {
  check(content: string, options?: Record<string, any>): CheckResult;
}
