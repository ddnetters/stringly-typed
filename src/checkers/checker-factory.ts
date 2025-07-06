import { Checker } from './base-checker';
import { GrammarChecker } from './grammar-checker';
import { CharCountChecker } from './char-count-checker';
import { CustomChecker } from './custom-checker';

export class CheckerFactory {
  static createChecker(type: "grammar" | "char_count" | "custom"): Checker {
    switch (type) {
      case 'grammar':
        return new GrammarChecker();
      case 'char_count':
        return new CharCountChecker();
      case 'custom':
        return new CustomChecker();
      default:
        throw new Error(`Unknown checker type: ${type}`);
    }
  }
}
