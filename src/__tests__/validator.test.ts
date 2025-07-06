import { validateCodebaseStrings } from '../validator';
import { ValidatorInput } from '../types';

describe('validateCodebaseStrings', () => {
  it('should validate using grammar checker and threshold decider', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Hello world";' }
      ],
      checker: 'grammar',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].content).toBe('Hello world');
    expect(result.results[0].valid).toBe(true);
    expect(result.summary.pass).toBe(true);
  });

  it('should validate using char_count checker', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Very long message that exceeds character limit";' }
      ],
      checker: 'char_count',
      checkerOptions: { maxChars: 10 },
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].valid).toBe(false);
    expect(result.results[0].message).toContain('Too long');
    expect(result.summary.pass).toBe(false);
  });

  it('should validate using noCritical decider', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Text with teh error";' }
      ],
      checker: 'grammar',
      decider: 'noCritical'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].valid).toBe(false);
    expect(result.results[0].message).toContain('CRITICAL');
    expect(result.summary.pass).toBe(false);
    expect(result.summary.reason).toContain('Found 1 critical issue(s)');
  });

  it('should validate using custom checker', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "hello";' }
      ],
      checker: 'custom',
      checkerOptions: { logic: 'content.includes("hello")' },
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].valid).toBe(true);
    expect(result.summary.pass).toBe(true);
  });

  it('should validate using custom decider', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Test message";' }
      ],
      checker: 'grammar',
      decider: 'custom',
      deciderOptions: { logic: 'results.every(r => r.valid)' }
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.summary.pass).toBe(true);
  });

  it('should handle multiple files with mixed results', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'good.js', content: 'const msg = "Good message";' },
        { path: 'bad.js', content: 'const msg = "bad message";' }
      ],
      checker: 'grammar',
      decider: 'threshold',
      deciderOptions: { minValidRatio: 0.4 }
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(2);
    expect(result.results[0].valid).toBe(true);
    expect(result.results[1].valid).toBe(false);
    expect(result.summary.pass).toBe(true);
  });

  it('should handle empty files array', () => {
    const input: ValidatorInput = {
      files: [],
      checker: 'grammar',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(0);
    expect(result.summary.pass).toBe(true);
  });

  it('should handle markdown files', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'README.md', content: '# Title\n\nThis is documentation content.' }
      ],
      checker: 'grammar',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.some(r => r.content === 'This is documentation content.')).toBe(true);
  });

  it('should preserve all result fields', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Hello world";' }
      ],
      checker: 'grammar',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results[0]).toEqual({
      file: 'test.js',
      line: 1,
      start: 12,
      end: 25,
      content: 'Hello world',
      valid: true,
      message: 'OK'
    });
  });

  it('should handle complex validation scenarios', () => {
    const input: ValidatorInput = {
      files: [
        { 
          path: 'complex.js', 
          content: 'const a = "Good text";\nconst b = "bad text";\nconst c = "Text with teh error";' 
        }
      ],
      checker: 'grammar',
      decider: 'noCritical'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(3);
    expect(result.results[0].valid).toBe(true);
    expect(result.results[1].valid).toBe(false);
    expect(result.results[2].valid).toBe(false);
    expect(result.summary.pass).toBe(false);
  });
});