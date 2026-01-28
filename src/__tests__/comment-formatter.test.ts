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
    expect(comment).toContain('All strings passed validation');
  });

  it('formats failing results with collapsible section and table', () => {
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
    // Collapsible section
    expect(comment).toContain('<details>');
    expect(comment).toContain('</details>');
    expect(comment).toContain('<summary><code>src/app.ts</code>');
    expect(comment).toContain('(1 issue)');
    // Table structure
    expect(comment).toContain('| Line | Content | Issue |');
    expect(comment).toContain('| 5 |');
    expect(comment).toContain('Use "Select" not "Click"');
  });

  it('groups errors by file with separate collapsible sections', () => {
    const output: ValidatorOutput = {
      results: [
        { file: 'src/a.ts', line: 1, start: 0, end: 5, content: 'foo', valid: false, message: 'error 1' },
        { file: 'src/b.ts', line: 2, start: 0, end: 5, content: 'bar', valid: false, message: 'error 2' },
        { file: 'src/a.ts', line: 3, start: 0, end: 5, content: 'baz', valid: false, message: 'error 3' }
      ],
      summary: { pass: false, reason: '0/3 strings valid (0%)' }
    };

    const comment = formatPRComment(output);

    // Each file gets its own collapsible section
    expect(comment).toContain('<code>src/a.ts</code>');
    expect(comment).toContain('<code>src/b.ts</code>');
    // a.ts has 2 issues
    expect(comment).toContain('(2 issues)');
    // b.ts has 1 issue
    expect(comment).toContain('(1 issue)');
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

  it('escapes special characters in table', () => {
    const output: ValidatorOutput = {
      results: [
        { file: 'src/app.ts', line: 1, start: 0, end: 10, content: 'foo | bar', valid: false, message: 'Has <html> & pipes' }
      ],
      summary: { pass: false, reason: '0/1 strings valid (0%)' }
    };

    const comment = formatPRComment(output);

    // Pipes should be escaped for markdown tables
    expect(comment).toContain('\\|');
    // HTML should be escaped
    expect(comment).toContain('&lt;html&gt;');
    expect(comment).toContain('&amp;');
  });
});
