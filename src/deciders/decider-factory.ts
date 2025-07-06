import { Decider } from './base-decider';
import { ThresholdDecider } from './threshold-decider';
import { NoCriticalDecider } from './no-critical-decider';
import { CustomDecider } from './custom-decider';

export class DeciderFactory {
  static createDecider(type: "threshold" | "noCritical" | "custom"): Decider {
    switch (type) {
      case 'threshold':
        return new ThresholdDecider();
      case 'noCritical':
        return new NoCriticalDecider();
      case 'custom':
        return new CustomDecider();
      default:
        throw new Error(`Unknown decider type: ${type}`);
    }
  }
}
