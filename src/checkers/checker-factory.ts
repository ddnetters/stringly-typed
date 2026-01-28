import { Checker, AsyncChecker } from './base-checker';
import { CharCountChecker } from './char-count-checker';
import { CustomChecker } from './custom-checker';
import { BrandStyleChecker } from './brand-style-checker';

export class CheckerFactory {
  static createChecker(type: "char_count" | "custom" | "brand_style"): Checker | AsyncChecker {
    switch (type) {
      case 'char_count':
        return new CharCountChecker();
      case 'custom':
        return new CustomChecker();
      case 'brand_style':
        return new BrandStyleChecker();
      default:
        throw new Error(`Unknown checker type: ${type}`);
    }
  }
}
