import { GrammarChecker, CharCountChecker, CustomChecker, CheckerFactory } from '../../checkers';

describe('GrammarChecker', () => {
  let checker: GrammarChecker;

  beforeEach(() => {
    checker = new GrammarChecker();
  });

  it('should pass for properly formatted text', () => {
    const result = checker.check('This is a proper sentence.');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('OK');
  });

  it('should fail for text not starting with capital', () => {
    const result = checker.check('this is not capitalized');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('should start with capital letter');
  });

  it('should fail for text with double spaces', () => {
    const result = checker.check('Text with  double spaces');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('contains double spaces');
  });

  it('should fail for text with very long words', () => {
    const result = checker.check('This has a supercalifragilisticexpialidocious word');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('contains very long words');
  });

  it('should flag critical spelling errors', () => {
    const result = checker.check('This has a teh spelling error');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('CRITICAL spelling error detected');
  });

  it('should pass for short strings', () => {
    const result = checker.check('Hi');
    expect(result.valid).toBe(true);
  });

  it('should combine multiple issues', () => {
    const result = checker.check('text with  double spaces and teh error');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('should start with capital letter');
    expect(result.message).toContain('contains double spaces');
    expect(result.message).toContain('CRITICAL spelling error detected');
  });
});

describe('CharCountChecker', () => {
  let checker: CharCountChecker;

  beforeEach(() => {
    checker = new CharCountChecker();
  });

  it('should pass for text within default limit', () => {
    const result = checker.check('Short text');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('OK');
  });

  it('should fail for text exceeding default limit', () => {
    const longText = 'a'.repeat(101);
    const result = checker.check(longText);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Too long');
  });

  it('should use custom maxChars option', () => {
    const result = checker.check('Short text', { maxChars: 5 });
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Too long');
  });

  it('should pass for text at exact limit', () => {
    const result = checker.check('a'.repeat(100));
    expect(result.valid).toBe(true);
  });
});

describe('CustomChecker', () => {
  let checker: CustomChecker;

  beforeEach(() => {
    checker = new CustomChecker();
  });

  it('should fail when no logic provided', () => {
    const result = checker.check('test');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('No custom logic provided');
  });

  it('should handle boolean return from custom logic', () => {
    const result = checker.check('test', { logic: 'true' });
    expect(result.valid).toBe(true);
    expect(result.message).toBe('OK');
  });

  it('should handle object return from custom logic', () => {
    const result = checker.check('test', { 
      logic: '({ valid: false, message: "Custom failure" })' 
    });
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Custom failure');
  });

  it('should handle custom logic with content parameter', () => {
    const result = checker.check('hello', { 
      logic: 'content.includes("hello")' 
    });
    expect(result.valid).toBe(true);
  });

  it('should handle custom logic errors', () => {
    const result = checker.check('test', { logic: 'invalid.syntax' });
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Custom logic error');
  });

  it('should handle invalid return types', () => {
    const result = checker.check('test', { logic: '"string"' });
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Invalid custom logic result');
  });
});

describe('CheckerFactory', () => {
  it('should create GrammarChecker', () => {
    const checker = CheckerFactory.createChecker('grammar');
    expect(checker).toBeInstanceOf(GrammarChecker);
  });

  it('should create CharCountChecker', () => {
    const checker = CheckerFactory.createChecker('char_count');
    expect(checker).toBeInstanceOf(CharCountChecker);
  });

  it('should create CustomChecker', () => {
    const checker = CheckerFactory.createChecker('custom');
    expect(checker).toBeInstanceOf(CustomChecker);
  });

  it('should throw error for unknown checker type', () => {
    expect(() => CheckerFactory.createChecker('unknown' as any)).toThrow();
  });
});