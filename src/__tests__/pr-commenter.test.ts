import { postOrUpdateComment } from '../pr-commenter';
import * as github from '@actions/github';
import * as core from '@actions/core';

// Get references to the mocked functions
const mockGetOctokit = github.getOctokit as jest.Mock;
const mockContext = github.context;
const mockWarning = core.warning as jest.Mock;
const mockDebug = core.debug as jest.Mock;
const mockInfo = core.info as jest.Mock;

describe('postOrUpdateComment', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    // Reset context
    mockContext.payload = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('warns and returns early when GITHUB_TOKEN is not available', async () => {
    delete process.env.GITHUB_TOKEN;

    await postOrUpdateComment('test body');

    expect(mockWarning).toHaveBeenCalledWith('GITHUB_TOKEN not available. Skipping PR comment.');
    expect(mockGetOctokit).not.toHaveBeenCalled();
  });

  it('returns early when not a pull request event', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    mockContext.payload = {}; // No pull_request

    await postOrUpdateComment('test body');

    expect(mockDebug).toHaveBeenCalledWith('Not a pull request. Skipping comment.');
  });

  it('creates a new comment when no existing comment found', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    mockContext.payload = { pull_request: { number: 123 } };

    const mockCreateComment = jest.fn().mockResolvedValue({ data: { id: 456 } });
    const mockPaginateIterator = jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: () => ({
        next: jest.fn()
          .mockResolvedValueOnce({ value: { data: [] }, done: false })
          .mockResolvedValueOnce({ done: true })
      })
    });

    mockGetOctokit.mockReturnValue({
      rest: {
        issues: {
          listComments: jest.fn(),
          createComment: mockCreateComment,
          updateComment: jest.fn()
        }
      },
      paginate: {
        iterator: mockPaginateIterator
      }
    });

    await postOrUpdateComment('test body');

    expect(mockCreateComment).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      issue_number: 123,
      body: expect.stringContaining('test body')
    });
    expect(mockInfo).toHaveBeenCalledWith('Created PR comment #456');
  });

  it('updates existing comment when marker comment found', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    mockContext.payload = { pull_request: { number: 123 } };

    const mockUpdateComment = jest.fn().mockResolvedValue({});
    const existingComment = {
      id: 789,
      body: '<!-- stringly-typed-comment -->\nold content'
    };
    const mockPaginateIterator = jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: () => ({
        next: jest.fn()
          .mockResolvedValueOnce({ value: { data: [existingComment] }, done: false })
          .mockResolvedValueOnce({ done: true })
      })
    });

    mockGetOctokit.mockReturnValue({
      rest: {
        issues: {
          listComments: jest.fn(),
          createComment: jest.fn(),
          updateComment: mockUpdateComment
        }
      },
      paginate: {
        iterator: mockPaginateIterator
      }
    });

    await postOrUpdateComment('new content');

    expect(mockUpdateComment).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      comment_id: 789,
      body: expect.stringContaining('new content')
    });
    expect(mockInfo).toHaveBeenCalledWith('Updated PR comment #789');
  });

  it('finds comment across multiple pages', async () => {
    process.env.GITHUB_TOKEN = 'test-token';
    mockContext.payload = { pull_request: { number: 123 } };

    const mockUpdateComment = jest.fn().mockResolvedValue({});
    const existingComment = {
      id: 999,
      body: '<!-- stringly-typed-comment -->\nfound on page 2'
    };

    // Simulate finding the comment on the second page
    const mockPaginateIterator = jest.fn().mockReturnValue({
      [Symbol.asyncIterator]: () => ({
        next: jest.fn()
          .mockResolvedValueOnce({ value: { data: [{ id: 1, body: 'other comment' }] }, done: false })
          .mockResolvedValueOnce({ value: { data: [existingComment] }, done: false })
          .mockResolvedValueOnce({ done: true })
      })
    });

    mockGetOctokit.mockReturnValue({
      rest: {
        issues: {
          listComments: jest.fn(),
          createComment: jest.fn(),
          updateComment: mockUpdateComment
        }
      },
      paginate: {
        iterator: mockPaginateIterator
      }
    });

    await postOrUpdateComment('updated content');

    expect(mockUpdateComment).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      comment_id: 999,
      body: expect.stringContaining('updated content')
    });
  });
});
