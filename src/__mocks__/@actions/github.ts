export const context = {
  payload: {} as Record<string, unknown>,
  repo: { owner: 'test-owner', repo: 'test-repo' }
};

export const getOctokit = jest.fn();
