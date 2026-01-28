import { validateCodebaseStrings, validateCodebaseStringsAsync } from '../validator';
import { ValidatorInput } from '../types';

// Mock the langchain modules for async validator tests
jest.mock('langchain/chat_models/universal', () => ({
  initChatModel: jest.fn(),
}));

jest.mock('@langchain/core/messages', () => ({
  HumanMessage: jest.fn().mockImplementation((content) => ({ content, role: 'human' })),
  SystemMessage: jest.fn().mockImplementation((content) => ({ content, role: 'system' })),
}));

import { initChatModel } from 'langchain/chat_models/universal';
const mockInitChatModel = initChatModel as jest.MockedFunction<typeof initChatModel>;

describe('validateCodebaseStrings', () => {
  it('should validate using char_count checker and threshold decider', () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Hello world";' }
      ],
      checker: 'char_count',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].content).toBe('Hello world');
    expect(result.results[0].valid).toBe(true);
    expect(result.summary.pass).toBe(true);
  });

  it('should validate using char_count checker with custom options', () => {
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
        { path: 'test.js', content: 'const msg = "This is a very long string that exceeds the character limit";' }
      ],
      checker: 'char_count',
      checkerOptions: { maxChars: 20 },
      decider: 'noCritical'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].valid).toBe(false);
    expect(result.summary.pass).toBe(true); // noCritical only fails on CRITICAL messages
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
      checker: 'char_count',
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
        { path: 'good.js', content: 'const msg = "Short";' },
        { path: 'bad.js', content: 'const msg = "This is a very long message that exceeds the limit";' }
      ],
      checker: 'char_count',
      checkerOptions: { maxChars: 20 },
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
      checker: 'char_count',
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
      checker: 'char_count',
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
      checker: 'char_count',
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
          content: 'const a = "Short";\nconst b = "Medium length";\nconst c = "This is a very long string that exceeds the limit";'
        }
      ],
      checker: 'char_count',
      checkerOptions: { maxChars: 20 },
      decider: 'threshold',
      deciderOptions: { minValidRatio: 0.5 }
    };

    const result = validateCodebaseStrings(input);

    expect(result.results).toHaveLength(3);
    expect(result.results[0].valid).toBe(true);
    expect(result.results[1].valid).toBe(true);
    expect(result.results[2].valid).toBe(false);
    expect(result.summary.pass).toBe(true);
  });
});

describe('validateCodebaseStringsAsync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should work with sync checkers', async () => {
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "Hello world";' }
      ],
      checker: 'char_count',
      decider: 'threshold'
    };

    const result = await validateCodebaseStringsAsync(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].content).toBe('Hello world');
    expect(result.results[0].valid).toBe(true);
    expect(result.summary.pass).toBe(true);
  });

  it('should work with brand_style async checker', async () => {
    const mockModel = {
      invoke: jest.fn().mockResolvedValue({
        content: JSON.stringify({
          violations: [],
          confidence: 1.0,
        }),
      }),
    };
    mockInitChatModel.mockResolvedValue(mockModel as any);

    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "The customer completed the purchase.";' }
      ],
      checker: 'brand_style',
      checkerOptions: {
        styleGuide: 'Use "customer" not "user".',
      },
      decider: 'threshold'
    };

    const result = await validateCodebaseStringsAsync(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].valid).toBe(true);
    expect(result.summary.pass).toBe(true);
  });

  it('should handle brand_style violations', async () => {
    const mockModel = {
      invoke: jest.fn().mockResolvedValue({
        content: JSON.stringify({
          violations: [
            {
              type: 'terminology',
              severity: 'error',
              original: 'user',
              suggestion: 'customer',
              explanation: 'Use "customer" instead of "user"',
            },
          ],
          confidence: 0.95,
        }),
      }),
    };
    mockInitChatModel.mockResolvedValue(mockModel as any);

    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: 'const msg = "The user completed the purchase.";' }
      ],
      checker: 'brand_style',
      checkerOptions: {
        styleGuide: 'Use "customer" not "user".',
      },
      decider: 'threshold'
    };

    const result = await validateCodebaseStringsAsync(input);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].valid).toBe(false);
    expect(result.summary.pass).toBe(false);
  });

  it('should batch async checks to avoid API overload', async () => {
    const mockModel = {
      invoke: jest.fn().mockResolvedValue({
        content: JSON.stringify({ violations: [], confidence: 1.0 }),
      }),
    };
    mockInitChatModel.mockResolvedValue(mockModel as any);

    // Create a file with multiple strings
    const strings = Array.from({ length: 15 }, (_, i) => `"String ${i}"`).join(', ');
    const input: ValidatorInput = {
      files: [
        { path: 'test.js', content: `const msgs = [${strings}];` }
      ],
      checker: 'brand_style',
      checkerOptions: {
        styleGuide: 'Test style guide',
      },
      decider: 'threshold'
    };

    const result = await validateCodebaseStringsAsync(input);

    expect(result.results).toHaveLength(15);
    expect(result.summary.pass).toBe(true);
    // All strings should have been checked
    expect(mockModel.invoke).toHaveBeenCalledTimes(15);
  });

  it('should handle empty files array', async () => {
    const input: ValidatorInput = {
      files: [],
      checker: 'brand_style',
      checkerOptions: {
        styleGuide: 'Test style guide',
      },
      decider: 'threshold'
    };

    const result = await validateCodebaseStringsAsync(input);

    expect(result.results).toHaveLength(0);
    expect(result.summary.pass).toBe(true);
  });
});