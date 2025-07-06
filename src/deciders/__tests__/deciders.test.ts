import { ThresholdDecider, NoCriticalDecider, CustomDecider, DeciderFactory } from '../../deciders';
import { ValidationResult } from '../../types';

const createValidationResult = (valid: boolean, message: string): ValidationResult => ({
  file: 'test.js',
  line: 1,
  start: 0,
  end: 10,
  content: 'test',
  valid,
  message
});

describe('ThresholdDecider', () => {
  let decider: ThresholdDecider;

  beforeEach(() => {
    decider = new ThresholdDecider();
  });

  it('should pass when no results provided', () => {
    const result = decider.decide([]);
    expect(result.pass).toBe(true);
    expect(result.reason).toContain('No strings to validate');
  });

  it('should pass when ratio meets default threshold', () => {
    const results = [
      createValidationResult(true, 'OK'),
      createValidationResult(true, 'OK'),
      createValidationResult(true, 'OK'),
      createValidationResult(false, 'Error'),
      createValidationResult(true, 'OK')
    ];
    
    const result = decider.decide(results);
    expect(result.pass).toBe(true);
    expect(result.reason).toContain('4/5 strings valid (80.0%)');
  });

  it('should fail when ratio below default threshold', () => {
    const results = [
      createValidationResult(true, 'OK'),
      createValidationResult(false, 'Error'),
      createValidationResult(false, 'Error'),
      createValidationResult(false, 'Error'),
      createValidationResult(false, 'Error')
    ];
    
    const result = decider.decide(results);
    expect(result.pass).toBe(false);
    expect(result.reason).toContain('Only 1/5 strings valid (20.0%), required 80%');
  });

  it('should use custom threshold', () => {
    const results = [
      createValidationResult(true, 'OK'),
      createValidationResult(false, 'Error')
    ];
    
    const result = decider.decide(results, { minValidRatio: 0.4 });
    expect(result.pass).toBe(true);
  });

  it('should handle edge case with single result', () => {
    const results = [createValidationResult(true, 'OK')];
    const result = decider.decide(results);
    expect(result.pass).toBe(true);
    expect(result.reason).toContain('1/1 strings valid (100.0%)');
  });
});

describe('NoCriticalDecider', () => {
  let decider: NoCriticalDecider;

  beforeEach(() => {
    decider = new NoCriticalDecider();
  });

  it('should pass when no critical issues found', () => {
    const results = [
      createValidationResult(true, 'OK'),
      createValidationResult(false, 'Minor error')
    ];
    
    const result = decider.decide(results);
    expect(result.pass).toBe(true);
    expect(result.reason).toContain('No critical issues found');
  });

  it('should fail when critical issues found', () => {
    const results = [
      createValidationResult(true, 'OK'),
      createValidationResult(false, 'CRITICAL error detected')
    ];
    
    const result = decider.decide(results);
    expect(result.pass).toBe(false);
    expect(result.reason).toContain('Found 1 critical issue(s)');
  });

  it('should count multiple critical issues', () => {
    const results = [
      createValidationResult(false, 'CRITICAL error 1'),
      createValidationResult(false, 'CRITICAL error 2'),
      createValidationResult(true, 'OK')
    ];
    
    const result = decider.decide(results);
    expect(result.pass).toBe(false);
    expect(result.reason).toContain('Found 2 critical issue(s)');
  });

  it('should handle empty results', () => {
    const result = decider.decide([]);
    expect(result.pass).toBe(true);
    expect(result.reason).toContain('No critical issues found');
  });
});

describe('CustomDecider', () => {
  let decider: CustomDecider;

  beforeEach(() => {
    decider = new CustomDecider();
  });

  it('should fail when no logic provided', () => {
    const result = decider.decide([]);
    expect(result.pass).toBe(false);
    expect(result.reason).toContain('No custom logic provided');
  });

  it('should handle boolean return from custom logic', () => {
    const result = decider.decide([], { logic: 'true' });
    expect(result.pass).toBe(true);
    expect(result.reason).toBe('Custom check passed');
  });

  it('should handle object return from custom logic', () => {
    const result = decider.decide([], { 
      logic: '({ pass: false, reason: "Custom failure" })' 
    });
    expect(result.pass).toBe(false);
    expect(result.reason).toBe('Custom failure');
  });

  it('should handle custom logic with results parameter', () => {
    const results = [createValidationResult(true, 'OK')];
    const result = decider.decide(results, { 
      logic: 'results.length > 0' 
    });
    expect(result.pass).toBe(true);
  });

  it('should handle custom logic errors', () => {
    const result = decider.decide([], { logic: 'invalid.syntax' });
    expect(result.pass).toBe(false);
    expect(result.reason).toContain('Custom logic error');
  });

  it('should handle invalid return types', () => {
    const result = decider.decide([], { logic: '"string"' });
    expect(result.pass).toBe(false);
    expect(result.reason).toContain('Invalid custom logic result');
  });

  it('should handle complex custom logic', () => {
    const results = [
      createValidationResult(true, 'OK'),
      createValidationResult(false, 'Error'),
      createValidationResult(true, 'OK')
    ];
    
    const result = decider.decide(results, { 
      logic: 'results.filter(r => r.valid).length >= 2' 
    });
    expect(result.pass).toBe(true);
  });
});

describe('DeciderFactory', () => {
  it('should create ThresholdDecider', () => {
    const decider = DeciderFactory.createDecider('threshold');
    expect(decider).toBeInstanceOf(ThresholdDecider);
  });

  it('should create NoCriticalDecider', () => {
    const decider = DeciderFactory.createDecider('noCritical');
    expect(decider).toBeInstanceOf(NoCriticalDecider);
  });

  it('should create CustomDecider', () => {
    const decider = DeciderFactory.createDecider('custom');
    expect(decider).toBeInstanceOf(CustomDecider);
  });

  it('should throw error for unknown decider type', () => {
    expect(() => DeciderFactory.createDecider('unknown' as any)).toThrow();
  });
});