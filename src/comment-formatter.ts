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

  let comment = `## 🌊 StringRay Results\n\n`;
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

  comment += `---\n*🌊 Posted by [StringRay](https://github.com/ddnetters/stringray)*`;

  return comment;
}
