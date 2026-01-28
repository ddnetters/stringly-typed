# Deciders

Deciders determine whether the overall validation passes or fails based on the results from all checked strings. They implement different strategies for making this decision.

## Threshold Decider

The threshold decider requires a minimum percentage of strings to be valid for the overall validation to pass.

### Usage

```yaml
decider: 'threshold'
decider-options: '{"minValidRatio": 0.8}'
```

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minValidRatio` | number | 0.8 | Minimum ratio of valid strings (0.0 - 1.0) |

### Examples

#### Default Threshold (80%)

```javascript
// 4 out of 5 strings valid = 80% ✅ PASS
results = [
  { valid: true, message: "OK" },      // ✅
  { valid: true, message: "OK" },      // ✅  
  { valid: true, message: "OK" },      // ✅
  { valid: false, message: "Error" },  // ❌
  { valid: true, message: "OK" }       // ✅
]
// Result: { pass: true, reason: "4/5 strings valid (80.0%)" }
```

```javascript
// 3 out of 5 strings valid = 60% ❌ FAIL
results = [
  { valid: true, message: "OK" },      // ✅
  { valid: false, message: "Error" },  // ❌
  { valid: true, message: "OK" },      // ✅
  { valid: false, message: "Error" },  // ❌
  { valid: true, message: "OK" }       // ✅
]
// Result: { pass: false, reason: "Only 3/5 strings valid (60.0%), required 80%" }
```

#### Custom Thresholds

```yaml
# Stricter validation (95%)
decider-options: '{"minValidRatio": 0.95}'

# More lenient (50%)  
decider-options: '{"minValidRatio": 0.5}'

# Perfect validation required (100%)
decider-options: '{"minValidRatio": 1.0}'
```

### Edge Cases

```javascript
// No strings to validate
results = []
// Result: { pass: true, reason: "No strings to validate" }

// Single string
results = [{ valid: true, message: "OK" }]
// Result: { pass: true, reason: "1/1 strings valid (100.0%)" }
```

## No Critical Decider

Fails the validation if any result contains "CRITICAL" in the message, regardless of the number of valid strings.

### Usage

```yaml
decider: 'noCritical'
decider-options: '{}'  # No configuration needed
```

### Examples

#### All Valid, No Critical Issues ✅

```javascript
results = [
  { valid: true, message: "OK" },
  { valid: false, message: "Minor grammar issue" },
  { valid: true, message: "OK" }
]
// Result: { pass: true, reason: "No critical issues found" }
```

#### Critical Issue Present ❌

```javascript
results = [
  { valid: true, message: "OK" },
  { valid: false, message: "CRITICAL spelling error detected" },
  { valid: true, message: "OK" }
]
// Result: { pass: false, reason: "Found 1 critical issue(s)" }
```

#### Multiple Critical Issues ❌

```javascript
results = [
  { valid: false, message: "CRITICAL: Security violation" },
  { valid: true, message: "OK" },
  { valid: false, message: "CRITICAL spelling error detected" }
]
// Result: { pass: false, reason: "Found 2 critical issue(s)" }
```

### Use Cases

- **Documentation**: Fail on serious spelling errors
- **Security**: Fail on security-related issues
- **Code Quality**: Fail on critical code issues
- **Compliance**: Fail on compliance violations

## Custom Decider

Allows you to define custom decision logic using JavaScript expressions.

### Usage

```yaml
decider: 'custom'
decider-options: |
  {
    "logic": "results.filter(r => r.valid).length >= 10"
  }
```

### Configuration

| Option | Type | Description |
|--------|------|-------------|
| `logic` | string | JavaScript expression for decision logic |

### Logic Expression

The `logic` expression receives a `results` parameter containing the array of validation results.

#### Result Object Structure

```typescript
interface ValidationResult {
  file: string;      // File path
  line: number;      // Line number
  start: number;     // Start position
  end: number;       // End position  
  content: string;   // String content
  valid: boolean;    // Validation result
  message: string;   // Validation message
}
```

#### Boolean Return

Return `true` to pass, `false` to fail:

```javascript
// Minimum valid count
"results.filter(r => r.valid).length >= 10"

// All strings must be valid
"results.every(r => r.valid)"

// No failures in critical files
"!results.some(r => !r.valid && r.file.includes('critical'))"

// At least 50% valid
"results.filter(r => r.valid).length / results.length >= 0.5"
```

#### Object Return

Return an object with `pass` and `reason` properties:

```javascript
// Custom success message
"({ pass: results.length > 0, reason: 'Custom validation completed successfully' })"

// Detailed failure reason
"({ pass: results.every(r => r.valid), reason: results.every(r => r.valid) ? 'All checks passed' : 'Some validations failed' })"
```

### Examples

#### Minimum Valid Count

```yaml
decider-options: |
  {
    "logic": "results.filter(r => r.valid).length >= 5"
  }
```

#### File-Specific Rules

```yaml
decider-options: |
  {
    "logic": "!results.some(r => !r.valid && r.file.includes('src/critical/'))"
  }
```

#### Complex Business Logic

```yaml
decider-options: |
  {
    "logic": "({ pass: results.filter(r => r.file.endsWith('.md')).every(r => r.valid), reason: 'Documentation validation complete' })"
  }
```

#### Weighted Validation

```yaml
decider-options: |
  {
    "logic": "results.filter(r => r.valid || r.file.includes('test')).length / results.length >= 0.9"
  }
```

#### Progressive Validation

```yaml
decider-options: |
  {
    "logic": "results.length === 0 ? true : results.filter(r => r.valid).length / results.length >= Math.max(0.5, 1 - results.length * 0.1)"
  }
```

### Error Handling

Custom logic errors are caught and reported:

```javascript
// Invalid syntax
"invalid.syntax"  // Returns: { pass: false, reason: "Custom logic error: ..." }

// Runtime errors  
"results.undefinedMethod()"  // Returns: { pass: false, reason: "Custom logic error: ..." }
```

### Return Values

```typescript
// Boolean logic
{ pass: true, reason: "Custom check passed" }
{ pass: false, reason: "Custom check failed" }

// Object logic
{ pass: true, reason: "Custom success message" }
{ pass: false, reason: "Custom failure message" }

// Error cases
{ pass: false, reason: "Custom logic error: ReferenceError" }
{ pass: false, reason: "No custom logic provided" }
```

## Decider Factory

Create deciders programmatically:

```typescript
import { DeciderFactory } from './deciders';

const thresholdDecider = DeciderFactory.createDecider('threshold');
const summary = thresholdDecider.decide(results, { minValidRatio: 0.9 });
```

## Combining Strategies

### Multiple Decider Pipeline

Use multiple steps for complex decision logic:

```yaml
# Step 1: Check for critical issues
- name: Check critical issues
  id: critical
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'noCritical'

# Step 2: Check threshold if no critical issues
- name: Check threshold  
  if: steps.critical.outputs.pass == 'true'
  uses: ddnetters/string-validator-action@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'  
    decider: 'threshold'
    decider-options: '{"minValidRatio": 0.95}'
```

### Conditional Logic

```yaml
decider: 'custom'
decider-options: |
  {
    "logic": "results.some(r => r.message.includes('CRITICAL')) ? false : results.filter(r => r.valid).length / results.length >= 0.8"
  }
```

## Best Practices

### Threshold Decider
- Use 0.8-0.9 for most projects
- Lower thresholds (0.5-0.7) for legacy codebases
- Higher thresholds (0.95-1.0) for new projects
- Consider team capacity for fixing issues

### No Critical Decider
- Perfect for security-sensitive projects
- Use with grammar checker for documentation
- Combine with custom checkers for business rules
- Set clear guidelines for what constitutes "critical"

### Custom Decider
- Keep logic simple and testable
- Use object returns for better error messages
- Consider edge cases (empty results, all invalid, etc.)
- Document complex logic thoroughly

### Performance Considerations
- Threshold decider is fastest
- No critical decider has minimal overhead
- Custom decider performance depends on logic complexity
- Consider caching for expensive custom logic

## Next Steps

- [Complete Examples](examples.md)
- [API Reference](api.md)
- [Troubleshooting](troubleshooting.md)