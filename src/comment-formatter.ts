import { ValidatorOutput, ValidationResult } from './types';

const MAX_CONTENT_LENGTH = 50;
const MAX_ISSUES_PER_FILE = 10;
const MAX_FILES = 10;

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|');
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

    const issueCount = fileResults.length;

    // Collapsible section per file
    comment += `<details>\n`;
    comment += `<summary><code>${file}</code> (${issueCount} issue${issueCount > 1 ? 's' : ''})</summary>\n\n`;

    // Table header
    comment += `| Line | Content | Issue |\n`;
    comment += `|------|---------|-------|\n`;

    // Table rows
    const displayResults = fileResults.slice(0, MAX_ISSUES_PER_FILE);
    for (const result of displayResults) {
      const content = escapeHtml(truncate(result.content, MAX_CONTENT_LENGTH));
      const message = escapeHtml(result.message);
      comment += `| ${result.line} | \`${content}\` | ${message} |\n`;
    }

    if (fileResults.length > MAX_ISSUES_PER_FILE) {
      const remaining = fileResults.length - MAX_ISSUES_PER_FILE;
      comment += `| ... | *${remaining} more* | |\n`;
    }

    comment += `\n</details>\n\n`;
    fileCount++;
  }

  comment += `---\n*🎯 Posted by [Stringly-Typed](https://github.com/ddnetters/stringly-typed)*`;

  return comment;
}
