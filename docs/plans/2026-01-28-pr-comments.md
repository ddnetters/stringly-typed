# PR Comments Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add optional automatic PR comments that surface Stringly-Typed validation results directly in pull requests.

**Architecture:** New `comment` input controls behavior (`on-failure` | `always` | `never`). A comment formatter generates markdown from `ValidatorOutput`. The action uses `@actions/github` to post/update comments on PRs.

**Tech Stack:** `@actions/github` for GitHub API, existing `ValidatorOutput` types, markdown formatting.

---

### Task 1: Add @actions/github dependency

**Files:**
- Modify: `package.json`

**Step 1: Install dependency**

Run: `npm install @actions/github`

**Step 2: Verify installation**

Run: `npm ls @actions/github`
Expected: `@actions/github@x.x.x`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @actions/github for PR comments"
```

---

### Task 2: Add comment input to action.yml

**Files:**
- Modify: `action.yml`

**Step 1: Add the comment input**

Add after `decider-options` input:

```yaml
  comment:
    description: 'PR comment behavior: on-failure, always, or never'
    required: false
    default: 'on-failure'
```

**Step 2: Commit**

```bash
git add action.yml
git commit -m "feat: add comment input to action.yml"
```

---

### Task 3: Create comment formatter module

**Files:**
- Create: `src/comment-formatter.ts`
- Create: `src/__tests__/comment-formatter.test.ts`

**Step 1: Write the failing test**

```typescript
// src/__tests__/comment-formatter.test.ts
import { formatPRComment } from '../comment-formatter';
import { ValidatorOutput } from '../types';

describe('formatPRComment', () => {
  it('formats passing results', () => {
    const output: ValidatorOutput = {
      results: [
        { file: 'src/app.ts', line: 1, start: 0, end: 10, content: 'Hello', valid: true, message: 'OK' }
      ],
      summary: { pass: true, reason: '1/1 strings valid (100%)' }
    };

    const comment = formatPRComment(output);

    expect(comment).toContain('## 🎯 Stringly-Typed Results');
    expect(comment).toContain('✅');
    expect(comment).toContain('1/1 strings valid');
  });

  it('formats failing results with details', () => {
    const output: ValidatorOutput = {
      results: [
        { file: 'src/app.ts', line: 5, start: 0, end: 20, content: 'Click here', valid: false, message: 'Use "Select" not "Click"' },
        { file: 'src/app.ts', line: 10, start: 0, end: 10, content: 'Welcome', valid: true, message: 'OK' }
      ],
      summary: { pass: false, reason: '1/2 strings valid (50%)' }
    };

    const comment = formatPRComment(output);

    expect(comment).toContain('## 🎯 Stringly-Typed Results');
    expect(comment).toContain('❌');
    expect(comment).toContain('src/app.ts');
    expect(comment).toContain('Line 5');
    expect(comment).toContain('Use "Select" not "Click"');
  });

  it('groups errors by file', () => {
    const output: ValidatorOutput = {
      results: [
        { file: 'src/a.ts', line: 1, start: 0, end: 5, content: 'foo', valid: false, message: 'error 1' },
        { file: 'src/b.ts', line: 2, start: 0, end: 5, content: 'bar', valid: false, message: 'error 2' },
        { file: 'src/a.ts', line: 3, start: 0, end: 5, content: 'baz', valid: false, message: 'error 3' }
      ],
      summary: { pass: false, reason: '0/3 strings valid (0%)' }
    };

    const comment = formatPRComment(output);

    // Should have file headers
    expect(comment).toContain('`src/a.ts`');
    expect(comment).toContain('`src/b.ts`');
  });

  it('truncates long content in output', () => {
    const longContent = 'A'.repeat(100);
    const output: ValidatorOutput = {
      results: [
        { file: 'src/app.ts', line: 1, start: 0, end: 100, content: longContent, valid: false, message: 'Too long' }
      ],
      summary: { pass: false, reason: '0/1 strings valid (0%)' }
    };

    const comment = formatPRComment(output);

    expect(comment).not.toContain(longContent);
    expect(comment).toContain('...');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern=comment-formatter`
Expected: FAIL - Cannot find module '../comment-formatter'

**Step 3: Write the implementation**

```typescript
// src/comment-formatter.ts
import { ValidatorOutput, ValidationResult } from './types';

const MAX_CONTENT_LENGTH = 50;
const MAX_ISSUES_PER_FILE = 5;
const MAX_FILES = 10;

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

function groupByFile(results: ValidationResult[]): Map<string, ValidationResult[]> {
  const grouped = new Map<string, ValidationResult[]>();
  for (const result of results) {
    const existing = grouped.get(result.file) || [];
    existing.push(result);
    grouped.set(result.file, existing);
  }
  return grouped;
}

export function formatPRComment(output: ValidatorOutput): string {
  const { results, summary } = output;
  const icon = summary.pass ? '✅' : '❌';
  const status = summary.pass ? 'Passed' : 'Failed';

  let comment = `## 🎯 Stringly-Typed Results\n\n`;
  comment += `${icon} **${status}:** ${summary.reason}\n\n`;

  const invalidResults = results.filter(r => !r.valid);

  if (invalidResults.length === 0) {
    comment += `All strings passed validation.\n`;
    return comment;
  }

  comment += `### Issues Found\n\n`;

  const grouped = groupByFile(invalidResults);
  let fileCount = 0;

  for (const [file, fileResults] of grouped) {
    if (fileCount >= MAX_FILES) {
      const remaining = grouped.size - MAX_FILES;
      comment += `\n*...and ${remaining} more file(s)*\n`;
      break;
    }

    comment += `#### \`${file}\`\n\n`;

    const displayResults = fileResults.slice(0, MAX_ISSUES_PER_FILE);
    for (const result of displayResults) {
      const content = truncate(result.content, MAX_CONTENT_LENGTH);
      comment += `- **Line ${result.line}:** \`${content}\`\n`;
      comment += `  - ${result.message}\n`;
    }

    if (fileResults.length > MAX_ISSUES_PER_FILE) {
      const remaining = fileResults.length - MAX_ISSUES_PER_FILE;
      comment += `- *...and ${remaining} more issue(s) in this file*\n`;
    }

    comment += `\n`;
    fileCount++;
  }

  comment += `---\n*🎯 Posted by [Stringly-Typed](https://github.com/ddnetters/stringly-typed)*`;

  return comment;
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- --testPathPattern=comment-formatter`
Expected: PASS

**Step 5: Commit**

```bash
git add src/comment-formatter.ts src/__tests__/comment-formatter.test.ts
git commit -m "feat: add PR comment formatter"
```

---

### Task 4: Create PR commenter module

**Files:**
- Create: `src/pr-commenter.ts`

**Step 1: Write the implementation**

```typescript
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

  // Find existing Stringly-Typed comment
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber
  });

  const existingComment = comments.find(c => c.body?.includes(COMMENT_MARKER));

  if (existingComment) {
    // Update existing comment
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: markedBody
    });
    core.info(`💬 Updated PR comment #${existingComment.id}`);
  } else {
    // Create new comment
    const { data: newComment } = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: markedBody
    });
    core.info(`💬 Created PR comment #${newComment.id}`);
  }
}
```

**Step 2: Commit**

```bash
git add src/pr-commenter.ts
git commit -m "feat: add PR commenter module"
```

---

### Task 5: Integrate commenting into action.ts

**Files:**
- Modify: `src/action.ts`

**Step 1: Update action.ts**

Add imports at top:
```typescript
import { formatPRComment } from './comment-formatter';
import { postOrUpdateComment } from './pr-commenter';
```

Add after getting other inputs (around line 13):
```typescript
const commentMode = core.getInput('comment') || 'on-failure';
```

Add after setting outputs and before the pass/fail logging (around line 70):
```typescript
// Post PR comment if configured
if (commentMode !== 'never') {
  const shouldComment = commentMode === 'always' || (commentMode === 'on-failure' && !result.summary.pass);
  if (shouldComment) {
    const commentBody = formatPRComment(result);
    await postOrUpdateComment(commentBody);
  }
}
```

**Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 3: Build and verify**

Run: `npm run build`
Expected: Successful compilation

**Step 4: Commit**

```bash
git add src/action.ts
git commit -m "feat: integrate PR commenting into action"
```

---

### Task 6: Update README with comment documentation

**Files:**
- Modify: `README.md`

**Step 1: Add comment input to quickstart workflow**

Update the workflow example to include:
```yaml
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

**Step 2: Add comment configuration section**

Add after the "Example Output" section:

```markdown
---

## PR Comments

Stringly-Typed can automatically comment on pull requests with validation results.

| Value | Behavior |
|-------|----------|
| `on-failure` | Comment only when validation fails (default) |
| `always` | Comment on every PR run |
| `never` | Disable PR comments |

```yaml
- uses: ddnetters/stringly-typed@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    comment: 'on-failure'
```
```

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add PR comment documentation"
```

---

### Task 7: Update action.yml outputs and add GITHUB_TOKEN note

**Files:**
- Modify: `action.yml`

**Step 1: Add note about GITHUB_TOKEN**

Add a comment or update description to mention GITHUB_TOKEN requirement for comments.

**Step 2: Commit**

```bash
git add action.yml
git commit -m "docs: add GITHUB_TOKEN note for PR comments"
```

---

### Task 8: Create draft PR

**Step 1: Push branch**

Run: `git push -u origin feat/pr-comments`

**Step 2: Create draft PR**

Run:
```bash
gh pr create --draft --title "feat: add optional PR comments for validation results" --body "## Summary
- Add \`comment\` input: \`on-failure\` (default), \`always\`, \`never\`
- Format validation results as markdown
- Post/update comments on PRs via GitHub API
- Requires \`GITHUB_TOKEN\` for commenting

## Test plan
- [ ] Unit tests for comment formatter
- [ ] Manual test on a PR with failing validation
- [ ] Manual test with \`comment: never\`
- [ ] Verify comment updates on re-run"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add @actions/github dependency |
| 2 | Add `comment` input to action.yml |
| 3 | Create comment formatter with tests |
| 4 | Create PR commenter module |
| 5 | Integrate into action.ts |
| 6 | Update README |
| 7 | Update action.yml with GITHUB_TOKEN note |
| 8 | Create draft PR |
