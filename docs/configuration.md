# Configuration

## Action Inputs

### Required Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `checker` | Validation checker type | `char_count` |
| `decider` | Decision logic type | `threshold` |

### Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `files` | File pattern to validate | `**/*.{js,ts,md,json}` |
| `checker-options` | JSON options for checker | `{}` |
| `decider-options` | JSON options for decider | `{}` |

## File Patterns

### Glob Patterns

Use standard glob patterns to specify files:

```yaml
# Single file type
files: '**/*.js'

# Multiple file types
files: '**/*.{js,ts,jsx,tsx}'

# Specific directories
files: 'src/**/*.{js,md}'

# Exclude patterns
files: '**/*.js,!node_modules/**,!dist/**'
```

### Supported File Types

| Extension | Description | String Extraction |
|-----------|-------------|-------------------|
| `.js` | JavaScript | String literals |
| `.ts` | TypeScript | String literals |
| `.jsx` | React JavaScript | String literals |
| `.tsx` | React TypeScript | String literals |
| `.md` | Markdown | Content text |
| `.mdx` | MDX | Content text |
| `.json` | JSON | String values |
| `README*` | README files | Content text |

## Checker Configuration

### Character Count Checker

```yaml
checker: 'char_count'
checker-options: '{"maxChars": 100}'
```

**Options:**
- `maxChars` (number): Maximum characters allowed

### Custom Checker

```yaml
checker: 'custom'
checker-options: |
  {
    "logic": "content.length > 5 && !content.includes('TODO')"
  }
```

**Options:**
- `logic` (string): JavaScript expression returning boolean or object

**Custom Logic Examples:**

```javascript
// Simple boolean return
"content.length > 10"

// Object return with custom message
"({ valid: !content.includes('badword'), message: content.includes('badword') ? 'Contains prohibited word' : 'OK' })"

// Complex validation
"content.match(/^[A-Z]/) && content.length < 50 && !content.includes('TODO')"
```

## Decider Configuration

### Threshold Decider

```yaml
decider: 'threshold'
decider-options: '{"minValidRatio": 0.8}'
```

**Options:**
- `minValidRatio` (number): Minimum ratio of valid strings (0.0 - 1.0)

### No Critical Decider

```yaml
decider: 'noCritical'
decider-options: '{}'  # No options needed
```

Fails if any validation message contains "CRITICAL".

### Custom Decider

```yaml
decider: 'custom'
decider-options: |
  {
    "logic": "results.filter(r => r.valid).length >= 10"
  }
```

**Options:**
- `logic` (string): JavaScript expression with `results` array

**Custom Logic Examples:**

```javascript
// Minimum valid count
"results.filter(r => r.valid).length >= 10"

// No errors in specific files
"!results.some(r => !r.valid && r.file.includes('critical'))"

// Object return with custom reason
"({ pass: results.length > 0, reason: 'Custom validation complete' })"
```

## Complete Configuration Examples

### Strict Documentation Validation

```yaml
- name: Validate documentation
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'docs/**/*.md'
    checker: 'char_count'
    decider: 'noCritical'
```

### Length-Based Validation

```yaml
- name: Check string lengths
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.{js,ts}'
    checker: 'char_count'
    checker-options: '{"maxChars": 80}'
    decider: 'threshold'
    decider-options: '{"minValidRatio": 0.95}'
```

### Custom Business Rules

```yaml
- name: Business rule validation
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'custom'
    checker-options: |
      {
        "logic": "!content.includes('password') && !content.includes('secret') && content.length > 3"
      }
    decider: 'custom'
    decider-options: |
      {
        "logic": "({ pass: results.every(r => r.valid), reason: 'All security checks passed' })"
      }
```

## Environment Variables

Set global defaults using environment variables:

```yaml
env:
  STRING_VALIDATOR_MAX_CHARS: '100'
  STRING_VALIDATOR_MIN_RATIO: '0.8'
```

## Output Configuration

### Using Outputs

```yaml
- name: Validate strings
  id: validator
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'

- name: Process results
  run: |
    echo "Validation passed: ${{ steps.validator.outputs.pass }}"
    echo "Summary: ${{ steps.validator.outputs.summary }}"
```

### Available Outputs

| Output | Type | Description |
|--------|------|-------------|
| `pass` | boolean | Overall validation result |
| `summary` | JSON | Summary with pass/reason |
| `results` | JSON | Detailed results array |

## Advanced Configuration

### Matrix Strategy

Validate different file types separately:

```yaml
strategy:
  matrix:
    config:
      - files: 'src/**/*.js'
        checker: 'char_count'
      - files: 'docs/**/*.md' 
        checker: 'char_count'
        options: '{"maxChars": 200}'

steps:
  - uses: ddnetters/string-validator-action@v1
    with:
      files: ${{ matrix.config.files }}
      checker: ${{ matrix.config.checker }}
      checker-options: ${{ matrix.config.options || '{}' }}
```

### Conditional Execution

```yaml
- name: Validate strings
  if: github.event_name == 'pull_request'
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.{js,ts}'
    checker: 'char_count'
    decider: 'threshold'
```

## Configuration Validation

The action validates configuration at runtime:

```yaml
# This will fail with clear error message
checker-options: 'invalid json'

# This will warn about unknown options
checker-options: '{"unknownOption": true}'
```

## Next Steps

- [Available Checkers](checkers.md)
- [Decision Logic](deciders.md)
- [Usage Examples](examples.md)