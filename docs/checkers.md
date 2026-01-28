# Checkers

Checkers are responsible for validating individual strings extracted from your codebase. Each checker implements specific validation rules and returns a result indicating whether the string is valid.

## Character Count Checker

Validates string length against a maximum character limit.

### Usage

```yaml
checker: 'char_count'
checker-options: '{"maxChars": 100}'
```

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxChars` | number | 100 | Maximum allowed characters |

### Examples

```javascript
// With maxChars: 50
"Short text"                    // ✅ Valid (10 chars)
"This is a longer message"      // ✅ Valid (25 chars)
"This message exceeds the fifty character limit set"  // ❌ Invalid (53 chars)
```

### Return Values

```typescript
// Valid string
{ valid: true, message: "OK" }

// Invalid string
{ valid: false, message: "Too long (75 > 50)" }
```

## Custom Checker

Allows you to define custom validation logic using JavaScript expressions.

### Usage

```yaml
checker: 'custom'
checker-options: |
  {
    "logic": "content.length > 5 && !content.includes('TODO')"
  }
```

### Configuration

| Option | Type | Description |
|--------|------|-------------|
| `logic` | string | JavaScript expression for validation |

### Logic Expression

The `logic` expression receives a `content` parameter containing the string to validate.

#### Boolean Return

Return `true` for valid, `false` for invalid:

```javascript
// Length validation
"content.length >= 10"

// Content validation  
"!content.includes('TODO')"

// Pattern matching
"content.match(/^[A-Z]/)"

// Complex conditions
"content.length > 5 && content.length < 100 && !content.includes('password')"
```

#### Object Return

Return an object with `valid` and `message` properties:

```javascript
// Custom messages
"({ valid: content.length > 5, message: content.length <= 5 ? 'Too short' : 'OK' })"

// Conditional validation
"({ valid: !content.includes('SECRET'), message: content.includes('SECRET') ? 'CRITICAL: Contains secret' : 'Secure' })"
```

### Examples

#### Security Validation

```yaml
checker-options: |
  {
    "logic": "!content.toLowerCase().includes('password') && !content.toLowerCase().includes('secret')"
  }
```

#### Pattern Validation

```yaml
checker-options: |
  {
    "logic": "content.match(/^[A-Z][a-z\\s]*[.!?]$/) !== null"
  }
```

#### Business Rules

```yaml
checker-options: |
  {
    "logic": "({ valid: !content.includes('FIXME'), message: content.includes('FIXME') ? 'CRITICAL: Contains FIXME' : 'Clean code' })"
  }
```

#### Whitelist Validation

```yaml
checker-options: |
  {
    "logic": "['approved', 'allowed', 'permitted'].some(word => content.toLowerCase().includes(word))"
  }
```

### Error Handling

Custom logic errors are caught and reported:

```javascript
// Invalid syntax
"invalid.syntax.here"  // Returns: { valid: false, message: "Custom logic error: ..." }

// Runtime errors
"content.nonExistentMethod()"  // Returns: { valid: false, message: "Custom logic error: ..." }
```

### Return Values

```typescript
// Boolean logic
{ valid: true, message: "OK" }
{ valid: false, message: "Custom check failed" }

// Object logic  
{ valid: false, message: "Custom error message" }

// Error cases
{ valid: false, message: "Custom logic error: ReferenceError: undefined" }
{ valid: false, message: "No custom logic provided" }
```

## Brand Style Checker

The brand style checker uses LLM-powered validation via LangChain.js to check content against a brand style guide. This enables AI-powered validation for tone, terminology, and style compliance.

> **Note:** This is an async checker. Use `validateCodebaseStringsAsync()` instead of `validateCodebaseStrings()`.

### Usage

```yaml
checker: 'brand_style'
checker-options: |
  {
    "styleGuide": "# Acme Corp Style Guide\n- Use active voice\n- Say 'customers' not 'users'\n- Keep sentences under 25 words",
    "model": "openai:gpt-4o-mini",
    "severityThreshold": "warning"
  }
```

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `styleGuide` | string \| object | **required** | The brand style guide (text or structured config) |
| `model` | string | `openai:gpt-4o-mini` | LLM model in `provider:model` format |
| `severityThreshold` | string | `error` | What counts as invalid: `error`, `warning`, or `suggestion` |
| `temperature` | number | 0 | LLM temperature (0-1) |
| `timeout` | number | - | Request timeout in milliseconds |
| `enableCache` | boolean | true | Cache identical string checks |

### Model Providers

| Provider | Model Format | Environment Variable |
|----------|-------------|---------------------|
| OpenAI | `openai:gpt-4o-mini` | `OPENAI_API_KEY` |
| Anthropic | `anthropic:claude-sonnet-4-5-20250929` | `ANTHROPIC_API_KEY` |
| Google | `google:gemini-pro` | `GOOGLE_API_KEY` |

### Style Guide Formats

#### Simple Text Format

```yaml
checker-options: |
  {
    "styleGuide": "# Brand Guidelines\n- Use active voice\n- Say 'customers' not 'users'\n- Avoid jargon"
  }
```

#### Structured Config Format

```yaml
checker-options: |
  {
    "styleGuide": {
      "rules": [
        {
          "name": "Active Voice",
          "description": "Always use active voice instead of passive",
          "severity": "error"
        },
        {
          "name": "Sentence Length",
          "description": "Keep sentences under 25 words",
          "severity": "warning"
        }
      ],
      "terminology": [
        { "incorrect": "user", "correct": "customer" },
        { "incorrect": "click", "correct": "select" }
      ]
    }
  }
```

### Return Values

```typescript
interface CheckResult {
  valid: boolean;
  message: string;
  details?: StyleViolation[];  // Detailed violations
  confidence?: number;         // LLM confidence (0-1)
}

interface StyleViolation {
  type: 'tone' | 'terminology' | 'formatting' | 'grammar' | 'other';
  severity: 'error' | 'warning' | 'suggestion';
  original: string;
  suggestion?: string;
  explanation: string;
}

// Examples:
{ valid: true, message: "Content passes brand style check", confidence: 1.0 }
{ valid: false, message: "Brand style violations found: 1 error(s), 2 warning(s)", confidence: 0.95 }
```

### Error Handling

The checker handles common API errors gracefully:

| Error | Message |
|-------|---------|
| Missing API key | "Authentication failed. Please check your API key environment variable." |
| Rate limiting | "Rate limit exceeded. Please try again later." |
| Timeout | "Request timed out. Please try again." |
| Invalid response | "Failed to parse LLM response: ..." |

### Best Practices

- **Keep style guides focused** - Include only the most important rules
- **Use severity levels** - Mark critical violations as `error`, optional improvements as `suggestion`
- **Enable caching** - Identical strings won't incur redundant API calls
- **Set appropriate thresholds** - Use `severityThreshold: 'error'` for strict validation, `'suggestion'` for comprehensive feedback

## Checker Factory

Create checkers programmatically:

```typescript
import { CheckerFactory } from './checkers';

const charCountChecker = CheckerFactory.createChecker('char_count');
const result = charCountChecker.check('Hello world', { maxChars: 50 });

// For async checkers like brand_style
const brandChecker = CheckerFactory.createChecker('brand_style');
const asyncResult = await brandChecker.check('The user clicked the button', {
  styleGuide: 'Use "customer" not "user". Use "select" not "click".'
});
```

## Best Practices

### Character Count Checker  
- Set reasonable limits based on your UI constraints
- Use different limits for different file types
- Consider screen readers and accessibility

### Custom Checker
- Keep logic simple and readable
- Use object returns for better error messages
- Test complex logic thoroughly
- Avoid external dependencies in logic expressions

### Performance Tips
- Character count checker is most efficient for length checks
- Custom checker has overhead - use sparingly for complex rules
- Brand style checker requires API calls - enable caching for efficiency

## Next Steps

- [Decision Logic (Deciders)](deciders.md)
- [Complete Examples](examples.md)
- [API Reference](api.md)