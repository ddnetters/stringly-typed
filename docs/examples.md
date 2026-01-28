# Examples

Real-world usage examples for the String Validator GitHub Action.

## Basic Examples

### Documentation Validation

Validate markdown documentation for grammar and spelling:

```yaml
name: Validate Documentation
on: [push, pull_request]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate documentation
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'docs/**/*.md'
          checker: 'char_count'
          decider: 'noCritical'
```

### Code String Validation

Check strings in source code for length and format:

```yaml
name: Validate Code Strings
on: [push, pull_request]

jobs:
  code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate code strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/**/*.{js,ts,jsx,tsx}'
          checker: 'char_count'
          checker-options: '{"maxChars": 80}'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.9}'
```

### Brand Style Validation (AI-Powered)

Validate content against your brand style guide using LLM.

#### Using a Style Guide File (Recommended)

Create a `STYLE_GUIDE.md` file in your repository:

```markdown
# Acme Corp Brand Style Guide

## Voice & Tone
- Use active voice, not passive
- Be friendly but professional
- Keep sentences under 25 words

## Terminology
- Say "customers" not "users"
- Say "select" not "click"
- Say "start" not "initiate"

## Formatting
- Use sentence case for headings
- Avoid exclamation marks
```

Then reference it in your workflow:

```yaml
name: Brand Style Validation
on: [push, pull_request]

jobs:
  brand-style:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate brand style
        uses: ddnetters/string-validator-action@v1
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{js,ts,jsx,tsx}'
          checker: 'brand_style'
          style-guide-file: 'STYLE_GUIDE.md'
          checker-options: |
            {
              "model": "openai:gpt-4o-mini",
              "severityThreshold": "warning"
            }
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.9}'
```

#### Using Inline Style Guide

For simpler style guides, you can pass them inline:

```yaml
name: Brand Style Validation
on: [push, pull_request]

jobs:
  brand-style:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate brand style
        uses: ddnetters/string-validator-action@v1
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{js,ts,jsx,tsx}'
          checker: 'brand_style'
          checker-options: |
            {
              "styleGuide": "# Acme Corp Style Guide\n- Use active voice\n- Say 'customers' not 'users'\n- Keep sentences under 25 words\n- Avoid jargon and technical terms",
              "model": "openai:gpt-4o-mini",
              "severityThreshold": "warning"
            }
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.9}'
```

## Advanced Examples

### Multi-Stage Validation

Validate different file types with different rules:

```yaml
name: Multi-Stage Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - name: "Documentation"
            files: "docs/**/*.md"
            checker: "char_count"
            decider: "noCritical"
            
          - name: "Source Code"
            files: "src/**/*.{js,ts}"
            checker: "char_count"
            checker-options: '{"maxChars": 100}'
            decider: "threshold"
            decider-options: '{"minValidRatio": 0.85}'
            
          - name: "Configuration"
            files: "*.json"
            checker: "custom"
            checker-options: '{"logic": "content.length > 3 && content.length < 200"}'
            decider: "threshold"
            decider-options: '{"minValidRatio": 1.0}'
    
    steps:
      - uses: actions/checkout@v3
      - name: Validate ${{ matrix.name }}
        uses: ddnetters/stringly-typed@v1
        with:
          files: ${{ matrix.files }}
          checker: ${{ matrix.checker }}
          checker-options: ${{ matrix.checker-options || '{}' }}
          decider: ${{ matrix.decider }}
          decider-options: ${{ matrix.decider-options || '{}' }}
```

### Security-Focused Validation

Prevent secrets and sensitive information in strings:

```yaml
name: Security String Validation
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for secrets
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/**/*.{js,ts,json}'
          checker: 'custom'
          checker-options: |
            {
              "logic": "({ valid: !/(password|secret|token|key|api[_-]?key)/i.test(content), message: /(password|secret|token|key|api[_-]?key)/i.test(content) ? 'CRITICAL: Potential secret detected' : 'Secure' })"
            }
          decider: 'noCritical'
```

### Conditional Validation

Run validation only on changed files:

```yaml
name: Conditional Validation
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v39
        with:
          files: |
            src/**/*.{js,ts,jsx,tsx}
            docs/**/*.md
            
      - name: Validate changed files
        if: steps.changed-files.outputs.any_changed == 'true'
        uses: ddnetters/stringly-typed@v1
        with:
          files: ${{ steps.changed-files.outputs.all_changed_files }}
          checker: 'char_count'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.8}'
```

## Project-Specific Examples

### React Application

Validate strings in a React application:

```yaml
name: React String Validation
on: [push, pull_request]

jobs:
  react-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Validate component strings
      - name: Validate React components
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/components/**/*.{jsx,tsx}'
          checker: 'custom'
          checker-options: |
            {
              "logic": "!content.includes('TODO') && !content.includes('FIXME') && content.length > 0"
            }
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.95}'
          
      # Validate error messages
      - name: Validate error messages
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/utils/errors.js'
          checker: 'char_count'
          decider: 'noCritical'
          
      # Check string lengths for UI
      - name: Check UI string lengths
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/**/*.{jsx,tsx}'
          checker: 'char_count'
          checker-options: '{"maxChars": 50}'
          decider: 'custom'
          decider-options: |
            {
              "logic": "({ pass: results.filter(r => !r.valid).length <= 5, reason: 'Allow up to 5 long strings for UI flexibility' })"
            }
```

### Documentation Site

Validate a documentation website:

```yaml
name: Documentation Site Validation
on: [push, pull_request]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Validate main content
      - name: Validate documentation content
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'content/**/*.{md,mdx}'
          checker: 'char_count'
          decider: 'custom'
          decider-options: |
            {
              "logic": "({ pass: results.filter(r => !r.valid && !r.message.includes('CRITICAL')).length / results.length <= 0.1, reason: 'Allow minor grammar issues but no critical errors' })"
            }
            
      # Check heading lengths
      - name: Check heading lengths
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'content/**/*.md'
          checker: 'custom'
          checker-options: |
            {
              "logic": "content.startsWith('#') ? content.length <= 60 : true"
            }
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.9}'
          
      # Validate code examples
      - name: Validate code example comments
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'examples/**/*.js'
          checker: 'char_count'
          checker-options: '{"maxChars": 80}'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.8}'
```

### API Documentation

Validate OpenAPI/Swagger documentation:

```yaml
name: API Documentation Validation
on: [push, pull_request]

jobs:
  api-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate API descriptions
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'api/swagger.json'
          checker: 'custom'
          checker-options: |
            {
              "logic": "content.length >= 10 && content.length <= 200 && content.match(/^[A-Z]/) && !content.includes('TODO')"
            }
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.95}'
```

## Error Handling Examples

### Graceful Failure

Continue workflow even if validation fails:

```yaml
- name: Validate strings (non-blocking)
  uses: ddnetters/stringly-typed@v1
  continue-on-error: true
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
    
- name: Report validation results
  run: |
    if [ "${{ steps.validate.outcome }}" = "failure" ]; then
      echo "⚠️ String validation failed but continuing..."
    else
      echo "✅ String validation passed!"
    fi
```

### Custom Error Reporting

Report validation results to external systems:

```yaml
- name: Validate strings
  id: validate
  uses: ddnetters/stringly-typed@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
    
- name: Report to Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    text: |
      String validation failed!
      Results: ${{ steps.validate.outputs.summary }}
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Performance Examples

### Large Codebase Optimization

Optimize validation for large codebases:

```yaml
name: Optimized Large Codebase Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        chunk: [1, 2, 3, 4, 5]
    steps:
      - uses: actions/checkout@v3
      
      - name: Get file chunk
        id: files
        run: |
          all_files=$(find src -name "*.js" -o -name "*.ts" | sort)
          total_files=$(echo "$all_files" | wc -l)
          chunk_size=$((total_files / 5 + 1))
          start_line=$(((chunk - 1) * chunk_size + 1))
          end_line=$((chunk * chunk_size))
          
          chunk_files=$(echo "$all_files" | sed -n "${start_line},${end_line}p" | tr '\n' ',' | sed 's/,$//')
          echo "files=${chunk_files}" >> $GITHUB_OUTPUT
        env:
          chunk: ${{ matrix.chunk }}
          
      - name: Validate chunk ${{ matrix.chunk }}
        if: steps.files.outputs.files != ''
        uses: ddnetters/stringly-typed@v1
        with:
          files: ${{ steps.files.outputs.files }}
          checker: 'char_count'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.8}'
```

### Incremental Validation

Validate only new or modified strings:

```yaml
- name: Cache validation results
  uses: actions/cache@v3
  with:
    path: .string-validation-cache
    key: string-validation-${{ hashFiles('src/**/*.js') }}
    
- name: Incremental validation
  uses: ddnetters/stringly-typed@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
    # Custom logic to skip cached results
```

## Integration Examples

### Pre-commit Hook

Use as a pre-commit hook:

```bash
#!/bin/bash
# .git/hooks/pre-commit

npm run build
node dist/index.js \
  --files "$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|ts|md)$' | tr '\n' ',')" \
  --checker char_count \
  --decider threshold

if [ $? -ne 0 ]; then
  echo "❌ String validation failed. Commit aborted."
  exit 1
fi
```

### VS Code Integration

Create a VS Code task:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Validate Strings",
      "type": "shell",
      "command": "node",
      "args": [
        "dist/index.js",
        "--files", "src/**/*.{js,ts}",
        "--checker", "grammar",
        "--decider", "threshold"
      ],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### Custom CLI Wrapper

Create a custom CLI tool:

```javascript
#!/usr/bin/env node
// scripts/validate-strings.js

const { validateCodebaseStrings } = require('../dist');
const fs = require('fs');
const glob = require('glob');

const files = glob.sync(process.argv[2] || 'src/**/*.js').map(path => ({
  path,
  content: fs.readFileSync(path, 'utf8')
}));

const result = validateCodebaseStrings({
  files,
  checker: 'char_count',
  decider: 'threshold',
  deciderOptions: { minValidRatio: 0.8 }
});

if (result.summary.pass) {
  console.log('✅', result.summary.reason);
  process.exit(0);
} else {
  console.error('❌', result.summary.reason);
  console.error('Failed strings:');
  result.results
    .filter(r => !r.valid)
    .forEach(r => console.error(`  ${r.file}:${r.line} - ${r.message}`));
  process.exit(1);
}
```

### Brand Style Validation CLI

Create a CLI tool for AI-powered brand style validation:

```javascript
#!/usr/bin/env node
// scripts/validate-brand-style.js

const { validateCodebaseStringsAsync } = require('../dist');
const fs = require('fs');
const glob = require('glob');

async function main() {
  const files = glob.sync(process.argv[2] || 'src/**/*.js').map(path => ({
    path,
    content: fs.readFileSync(path, 'utf8')
  }));

  const styleGuide = fs.readFileSync('STYLE_GUIDE.md', 'utf8');

  const result = await validateCodebaseStringsAsync({
    files,
    checker: 'brand_style',
    checkerOptions: {
      styleGuide,
      model: 'openai:gpt-4o-mini',
      severityThreshold: 'warning'
    },
    decider: 'threshold',
    deciderOptions: { minValidRatio: 0.9 }
  });

  if (result.summary.pass) {
    console.log('✅', result.summary.reason);
    process.exit(0);
  } else {
    console.error('❌', result.summary.reason);
    console.error('\nStyle violations:');
    result.results
      .filter(r => !r.valid)
      .forEach(r => {
        console.error(`\n  ${r.file}:${r.line}`);
        console.error(`  Content: "${r.content}"`);
        if (r.details) {
          r.details.forEach(v => {
            console.error(`    [${v.severity}] ${v.type}: ${v.explanation}`);
            if (v.suggestion) console.error(`    Suggestion: ${v.suggestion}`);
          });
        }
      });
    process.exit(1);
  }
}

main().catch(console.error);
```

## Next Steps

- [Troubleshooting Guide](troubleshooting.md)
- [API Reference](api.md)
- [Contributing](../CONTRIBUTING.md)