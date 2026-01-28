// src/pr-commenter.ts
import * as github from '@actions/github';
import * as core from '@actions/core';

const COMMENT_MARKER = '<!-- stringly-typed-comment -->';

export async function postOrUpdateComment(body: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.warning('GITHUB_TOKEN not available. Skipping PR comment.');
    return;
  }

  const context = github.context;

  if (!context.payload.pull_request) {
    core.debug('Not a pull request. Skipping comment.');
    return;
  }

  const octokit = github.getOctokit(token);
  const { owner, repo } = context.repo;
  const prNumber = context.payload.pull_request.number;

  const markedBody = `${COMMENT_MARKER}\n${body}`;

  // Find existing Stringly-Typed comment using pagination to handle busy PRs
  const existingComment = await findExistingComment(octokit, owner, repo, prNumber);

  if (existingComment) {
    // Update existing comment
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: markedBody
    });
    core.info(`Updated PR comment #${existingComment.id}`);
  } else {
    // Create new comment
    const { data: newComment } = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: markedBody
    });
    core.info(`Created PR comment #${newComment.id}`);
  }
}

type Octokit = ReturnType<typeof github.getOctokit>;

async function findExistingComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number
): Promise<{ id: number } | undefined> {
  // Use pagination to iterate through all comments on the PR
  const iterator = octokit.paginate.iterator(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100
  });

  for await (const { data: comments } of iterator) {
    const found = comments.find(
      (c: { body?: string | null }) => c.body?.includes(COMMENT_MARKER)
    );
    if (found) {
      return { id: found.id };
    }
  }

  return undefined;
}
