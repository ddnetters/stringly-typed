import { BrandStyleChecker } from '../brand-style-checker';
import { isAsyncChecker } from '../base-checker';
import { BrandStyleOptions } from '../../types';

// Mock the createChatModel factory
jest.mock('../create-chat-model', () => ({
  createChatModel: jest.fn(),
}));

jest.mock('@langchain/core/messages', () => ({
  HumanMessage: jest.fn().mockImplementation((content) => ({ content, role: 'human' })),
  SystemMessage: jest.fn().mockImplementation((content) => ({ content, role: 'system' })),
}));

import { createChatModel } from '../create-chat-model';

const mockCreateChatModel = createChatModel as jest.MockedFunction<typeof createChatModel>;

describe('BrandStyleChecker', () => {
  let checker: BrandStyleChecker;

  beforeEach(() => {
    checker = new BrandStyleChecker();
    jest.clearAllMocks();
  });

  describe('isAsyncChecker', () => {
    it('should be identified as an async checker', () => {
      expect(isAsyncChecker(checker)).toBe(true);
    });
  });

  describe('check without styleGuide', () => {
    it('should return error when styleGuide is not provided', async () => {
      const result = await checker.check('some content');

      expect(result.valid).toBe(false);
      expect(result.message).toContain('styleGuide option is required');
    });

    it('should return error when options is empty object', async () => {
      const result = await checker.check('some content', {} as BrandStyleOptions);

      expect(result.valid).toBe(false);
      expect(result.message).toContain('styleGuide option is required');
    });
  });

  describe('check with valid styleGuide', () => {
    const styleGuide = 'Use "customer" not "user". Use active voice.';

    beforeEach(() => {
      const mockModel = {
        invoke: jest.fn(),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);
    });

    it('should return valid when no violations found', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            violations: [],
            confidence: 1.0,
          }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('The customer completed the purchase.', {
        styleGuide,
      });

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Content passes brand style check');
      expect(result.confidence).toBe(1.0);
      expect(result.details).toEqual([]);
    });

    it('should return invalid when violations found', async () => {
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
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('The user completed the purchase.', {
        styleGuide,
      });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('Brand style violations found');
      expect(result.message).toContain('1 error(s)');
      expect(result.confidence).toBe(0.95);
      expect(result.details).toHaveLength(1);
      expect(result.details![0].type).toBe('terminology');
    });

    it('should pass when only suggestions exist and threshold is error', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            violations: [
              {
                type: 'tone',
                severity: 'suggestion',
                original: 'completed',
                suggestion: 'finished',
                explanation: 'Consider using simpler language',
              },
            ],
            confidence: 0.9,
          }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('The customer completed the purchase.', {
        styleGuide,
        severityThreshold: 'error',
      });

      expect(result.valid).toBe(true);
      expect(result.details).toHaveLength(1); // Still reports the suggestion
    });

    it('should fail when warnings exist and threshold is warning', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({
            violations: [
              {
                type: 'tone',
                severity: 'warning',
                original: 'completed',
                suggestion: 'finished',
                explanation: 'Consider using simpler language',
              },
            ],
            confidence: 0.9,
          }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('The customer completed the purchase.', {
        styleGuide,
        severityThreshold: 'warning',
      });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('0 error(s), 1 warning(s)');
    });
  });

  describe('model configuration', () => {
    const styleGuide = 'Test style guide';

    it('should use default model when not specified', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test', { styleGuide });

      expect(mockCreateChatModel).toHaveBeenCalledWith('openai', 'gpt-4o-mini', {
        temperature: 0,
      });
    });

    it('should parse provider:model format correctly', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test', {
        styleGuide,
        model: 'anthropic:claude-sonnet-4-5-20250929',
      });

      expect(mockCreateChatModel).toHaveBeenCalledWith('anthropic', 'claude-sonnet-4-5-20250929', {
        temperature: 0,
      });
    });

    it('should use custom temperature', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test', {
        styleGuide,
        temperature: 0.5,
      });

      expect(mockCreateChatModel).toHaveBeenCalledWith('openai', 'gpt-4o-mini', {
        temperature: 0.5,
      });
    });
  });

  describe('caching', () => {
    const styleGuide = 'Test style guide';

    it('should cache results by default', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test content', { styleGuide });
      await checker.check('test content', { styleGuide });

      // Should only call the model once
      expect(mockModel.invoke).toHaveBeenCalledTimes(1);
    });

    it('should not cache when enableCache is false', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test content', { styleGuide, enableCache: false });
      await checker.check('test content', { styleGuide, enableCache: false });

      expect(mockModel.invoke).toHaveBeenCalledTimes(2);
    });

    it('should have different cache keys for different content', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('content A', { styleGuide });
      await checker.check('content B', { styleGuide });

      expect(mockModel.invoke).toHaveBeenCalledTimes(2);
    });

    it('should clear cache when clearCache is called', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test content', { styleGuide });
      checker.clearCache();
      await checker.check('test content', { styleGuide });

      expect(mockModel.invoke).toHaveBeenCalledTimes(2);
    });

    it('should not cache failed results', async () => {
      const mockModel = {
        invoke: jest
          .fn()
          .mockResolvedValueOnce({ content: 'This is not valid JSON' })
          .mockResolvedValueOnce({ content: 'This is not valid JSON' })
          .mockResolvedValueOnce({ content: 'This is not valid JSON' })
          .mockResolvedValueOnce({
            content: JSON.stringify({ violations: [], confidence: 1.0 }),
          }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      // First call: all 3 retries fail
      const result1 = await checker.check('test content', { styleGuide });
      expect(result1.valid).toBe(false);

      // Second call: should retry again (not use cached failure), succeeds
      const result2 = await checker.check('test content', { styleGuide });
      expect(result2.valid).toBe(true);

      // 3 attempts for first call + 1 attempt for second call = 4 total
      expect(mockModel.invoke).toHaveBeenCalledTimes(4);
    });
  });

  describe('error handling', () => {
    const styleGuide = 'Test style guide';

    it('should handle authentication errors', async () => {
      const mockModel = {
        invoke: jest.fn().mockRejectedValue(new Error('401 Unauthorized')),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('Authentication failed');
    });

    it('should handle rate limit errors', async () => {
      const mockModel = {
        invoke: jest.fn().mockRejectedValue(new Error('429 rate limit exceeded')),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('Rate limit exceeded');
    });

    it('should handle timeout errors', async () => {
      const mockModel = {
        invoke: jest.fn().mockRejectedValue(new Error('timeout')),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('timed out');
    });

    it('should handle invalid JSON response', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: 'This is not JSON',
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('Failed to parse LLM response');
    });

    it('should handle JSON in markdown code blocks', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: '```json\n{"violations": [], "confidence": 1.0}\n```',
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(true);
    });

    it('should handle unknown errors', async () => {
      const mockModel = {
        invoke: jest.fn().mockRejectedValue('string error'),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('unknown error');
    });

    it('should retry on malformed JSON and succeed on valid response', async () => {
      const mockModel = {
        invoke: jest
          .fn()
          .mockResolvedValueOnce({
            content: 'This is not valid JSON at all',
          })
          .mockResolvedValueOnce({
            content: JSON.stringify({ violations: [], confidence: 1.0 }),
          }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(true);
      expect(mockModel.invoke).toHaveBeenCalledTimes(2);
    });

    it('should retry up to MAX_RETRIES times before failing', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: 'This is not valid JSON',
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(false);
      expect(result.message).toContain('Failed to parse LLM response');
      // MAX_RETRIES = 2, so total attempts = 3 (initial + 2 retries)
      expect(mockModel.invoke).toHaveBeenCalledTimes(3);
    });

    it('should succeed on third attempt after two malformed responses', async () => {
      const mockModel = {
        invoke: jest
          .fn()
          .mockResolvedValueOnce({
            content: 'malformed response 1',
          })
          .mockResolvedValueOnce({
            content: 'malformed response 2',
          })
          .mockResolvedValueOnce({
            content: JSON.stringify({ violations: [], confidence: 0.9 }),
          }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      const result = await checker.check('test', { styleGuide });

      expect(result.valid).toBe(true);
      expect(result.confidence).toBe(0.9);
      expect(mockModel.invoke).toHaveBeenCalledTimes(3);
    });
  });

  describe('StyleGuideConfig formatting', () => {
    it('should format structured style guide config', async () => {
      const mockModel = {
        invoke: jest.fn().mockResolvedValue({
          content: JSON.stringify({ violations: [], confidence: 1.0 }),
        }),
      };
      mockCreateChatModel.mockReturnValue(mockModel as any);

      await checker.check('test', {
        styleGuide: {
          rules: [
            {
              name: 'Active Voice',
              description: 'Always use active voice',
              severity: 'error',
            },
          ],
          terminology: [
            {
              incorrect: 'user',
              correct: 'customer',
              context: 'when referring to people using the product',
            },
          ],
        },
      });

      // Verify the system message contains the formatted style guide
      const invokeCall = mockModel.invoke.mock.calls[0][0];
      const systemMessage = invokeCall[0];
      expect(systemMessage.content).toContain('Active Voice');
      expect(systemMessage.content).toContain('Always use active voice');
      expect(systemMessage.content).toContain('Use "customer" instead of "user"');
    });
  });
});
