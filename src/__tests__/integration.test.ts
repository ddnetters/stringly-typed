import { validateCodebaseStrings } from '../validator';
import { ValidatorInput } from '../types';

describe('Integration Tests', () => {
  it('should handle real-world JavaScript codebase', () => {
    const input: ValidatorInput = {
      files: [
        {
          path: 'src/utils.js',
          content: `
            function greet(name) {
              return "Hello, " + name + "!";
            }

            const ERROR_MSG = "Something went wrong";
            const DEBUG_MSG = "Debug: processing user input";
          `
        },
        {
          path: 'src/constants.js',
          content: `
            const API_URL = "https://api.example.com";
            const TIMEOUT = 5000;
            const USER_AGENT = "MyApp/1.0";
          `
        }
      ],
      checker: 'char_count',
      decider: 'threshold',
      deciderOptions: { minValidRatio: 0.8 }
    };

    const result = validateCodebaseStrings(input);

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.summary.pass).toBe(true);

    const stringContents = result.results.map(r => r.content);
    expect(stringContents).toContain('Hello, ');
    expect(stringContents).toContain('Something went wrong');
    expect(stringContents).toContain('https://api.example.com');
  });

  it('should handle markdown documentation', () => {
    const input: ValidatorInput = {
      files: [
        {
          path: 'README.md',
          content: `
# Project Title

This is a sample project that demonstrates string validation.

## Installation

Run the following commands:

\`\`\`bash
npm install
npm start
\`\`\`

## Features

- String extraction from multiple file types
- Grammar checking with customizable rules
- Flexible validation criteria
          `
        }
      ],
      checker: 'char_count',
      checkerOptions: { maxChars: 200 },
      decider: 'threshold',
      deciderOptions: { minValidRatio: 0.9 }
    };

    const result = validateCodebaseStrings(input);

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.summary.pass).toBe(true);
  });

  it('should catch length issues in codebase', () => {
    const input: ValidatorInput = {
      files: [
        {
          path: 'src/messages.js',
          content: `
            const SUCCESS_MSG = "OK";
            const ERROR_MSG = "This is a very long error message that exceeds the character limit";
            const WARNING_MSG = "This warning message is also quite long and exceeds limits";
          `
        }
      ],
      checker: 'char_count',
      checkerOptions: { maxChars: 30 },
      decider: 'threshold',
      deciderOptions: { minValidRatio: 0.9 }
    };

    const result = validateCodebaseStrings(input);

    expect(result.summary.pass).toBe(false);
  });

  it('should handle mixed file types with custom validation', () => {
    const input: ValidatorInput = {
      files: [
        {
          path: 'package.json',
          content: JSON.stringify({
            name: "my-project",
            description: "A sample project for testing",
            version: "1.0.0"
          }, null, 2)
        },
        {
          path: 'src/config.js',
          content: `
            const config = {
              apiUrl: "https://api.example.com/v1",
              timeout: 30000,
              retries: 3
            };
          `
        }
      ],
      checker: 'custom',
      checkerOptions: {
        logic: 'content.length > 2 && !content.includes("badword")'
      },
      decider: 'custom',
      deciderOptions: {
        logic: '({ pass: results.filter(r => r.valid).length / results.length >= 0.5, reason: "Custom validation complete" })'
      }
    };

    const result = validateCodebaseStrings(input);

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.summary.pass).toBe(true);
  });

  it('should handle edge cases and malformed input', () => {
    const input: ValidatorInput = {
      files: [
        {
          path: 'test.js',
          content: 'const weird = "unclosed string\nconst normal = "proper string";'
        }
      ],
      checker: 'char_count',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results.length).toBeGreaterThan(0);
    expect(result.summary).toBeDefined();
    expect(typeof result.summary.pass).toBe('boolean');
  });

  it('should validate large codebase efficiently', () => {
    const files = Array.from({ length: 50 }, (_, i) => ({
      path: `file${i}.js`,
      content: `const msg${i} = "Message number ${i}";`
    }));

    const input: ValidatorInput = {
      files,
      checker: 'char_count',
      checkerOptions: { maxChars: 50 },
      decider: 'threshold',
      deciderOptions: { minValidRatio: 0.95 }
    };

    const start = Date.now();
    const result = validateCodebaseStrings(input);
    const duration = Date.now() - start;

    expect(result.results).toHaveLength(50);
    expect(duration).toBeLessThan(1000);
    expect(result.summary.pass).toBe(true);
  });

  it('should handle TypeScript files', () => {
    const input: ValidatorInput = {
      files: [
        {
          path: 'src/types.ts',
          content: `
            interface User {
              name: string;
              email: string;
            }

            const DEFAULT_USER: User = {
              name: "Anonymous User",
              email: "anonymous@example.com"
            };

            function validateUser(user: User): string {
              return user.name ? "Valid user" : "Invalid user data";
            }
          `
        }
      ],
      checker: 'char_count',
      decider: 'threshold'
    };

    const result = validateCodebaseStrings(input);

    expect(result.results.length).toBeGreaterThan(0);
    const stringContents = result.results.map(r => r.content);
    expect(stringContents).toContain('Anonymous User');
    expect(stringContents).toContain('Valid user');
  });
});