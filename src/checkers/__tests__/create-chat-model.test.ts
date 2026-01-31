import { createChatModel } from '../create-chat-model';

// Mock the langchain provider modules
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation((config) => ({
    _type: 'openai',
    ...config,
  })),
  AzureChatOpenAI: jest.fn().mockImplementation((config) => ({
    _type: 'azure',
    ...config,
  })),
}));

jest.mock('@langchain/anthropic', () => ({
  ChatAnthropic: jest.fn().mockImplementation((config) => ({
    _type: 'anthropic',
    ...config,
  })),
}));

jest.mock('@langchain/google-genai', () => ({
  ChatGoogleGenerativeAI: jest.fn().mockImplementation((config) => ({
    _type: 'google',
    ...config,
  })),
}));

jest.mock('@langchain/aws', () => ({
  ChatBedrockConverse: jest.fn().mockImplementation((config) => ({
    _type: 'bedrock',
    ...config,
  })),
}));

import { ChatOpenAI, AzureChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatBedrockConverse } from '@langchain/aws';

const MockChatOpenAI = ChatOpenAI as jest.MockedClass<typeof ChatOpenAI>;
const MockAzureChatOpenAI = AzureChatOpenAI as jest.MockedClass<typeof AzureChatOpenAI>;
const MockChatAnthropic = ChatAnthropic as jest.MockedClass<typeof ChatAnthropic>;
const MockChatGoogleGenerativeAI = ChatGoogleGenerativeAI as jest.MockedClass<typeof ChatGoogleGenerativeAI>;
const MockChatBedrockConverse = ChatBedrockConverse as jest.MockedClass<typeof ChatBedrockConverse>;

describe('createChatModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('OpenAI provider', () => {
    it('should create ChatOpenAI for openai provider', () => {
      createChatModel('openai', 'gpt-4o-mini', { temperature: 0 });

      expect(MockChatOpenAI).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        temperature: 0,
      });
    });

    it('should create ChatOpenAI with custom temperature', () => {
      createChatModel('openai', 'gpt-4o', { temperature: 0.7 });

      expect(MockChatOpenAI).toHaveBeenCalledWith({
        model: 'gpt-4o',
        temperature: 0.7,
      });
    });
  });

  describe('Anthropic provider', () => {
    it('should create ChatAnthropic for anthropic provider', () => {
      createChatModel('anthropic', 'claude-sonnet-4-5-20250929', { temperature: 0 });

      expect(MockChatAnthropic).toHaveBeenCalledWith({
        model: 'claude-sonnet-4-5-20250929',
        temperature: 0,
      });
    });
  });

  describe('Google provider', () => {
    it('should create ChatGoogleGenerativeAI for google provider', () => {
      createChatModel('google', 'gemini-1.5-pro', { temperature: 0 });

      expect(MockChatGoogleGenerativeAI).toHaveBeenCalledWith({
        model: 'gemini-1.5-pro',
        temperature: 0,
      });
    });

    it('should also accept google-genai as provider alias', () => {
      createChatModel('google-genai', 'gemini-1.5-flash', { temperature: 0.5 });

      expect(MockChatGoogleGenerativeAI).toHaveBeenCalledWith({
        model: 'gemini-1.5-flash',
        temperature: 0.5,
      });
    });
  });

  describe('Azure OpenAI provider', () => {
    it('should create AzureChatOpenAI for azure provider', () => {
      createChatModel('azure', 'gpt-4o-mini', { temperature: 0 });

      expect(MockAzureChatOpenAI).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        temperature: 0,
      });
    });

    it('should create AzureChatOpenAI with custom temperature', () => {
      createChatModel('azure', 'gpt-4o', { temperature: 0.5 });

      expect(MockAzureChatOpenAI).toHaveBeenCalledWith({
        model: 'gpt-4o',
        temperature: 0.5,
      });
    });
  });

  describe('AWS Bedrock provider', () => {
    it('should create ChatBedrockConverse for bedrock provider', () => {
      createChatModel('bedrock', 'anthropic.claude-3-haiku-20240307-v1:0', { temperature: 0 });

      expect(MockChatBedrockConverse).toHaveBeenCalledWith({
        model: 'anthropic.claude-3-haiku-20240307-v1:0',
        temperature: 0,
      });
    });

    it('should create ChatBedrockConverse with custom temperature', () => {
      createChatModel('bedrock', 'amazon.titan-text-lite-v1', { temperature: 0.3 });

      expect(MockChatBedrockConverse).toHaveBeenCalledWith({
        model: 'amazon.titan-text-lite-v1',
        temperature: 0.3,
      });
    });
  });

  describe('unsupported provider', () => {
    it('should throw error for unsupported provider', () => {
      expect(() => {
        createChatModel('unknown-provider', 'some-model', { temperature: 0 });
      }).toThrow('Unsupported provider: unknown-provider');
    });

    it('should include supported providers in error message', () => {
      expect(() => {
        createChatModel('cohere', 'some-model', { temperature: 0 });
      }).toThrow(/Supported providers.*openai.*anthropic.*google.*azure.*bedrock/);
    });
  });

  describe('default options', () => {
    it('should use default temperature of 0 when not specified', () => {
      createChatModel('openai', 'gpt-4o-mini', {});

      expect(MockChatOpenAI).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        temperature: 0,
      });
    });
  });
});
