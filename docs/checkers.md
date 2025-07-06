# Checkers

Checkers are responsible for validating individual strings extracted from your codebase. Each checker implements specific validation rules and returns a result indicating whether the string is valid.

## Grammar Checker

The grammar checker validates basic grammar and spelling rules.

### Usage

```yaml
checker: 'grammar'
checker-options: '{}'  # No configuration needed
```

### Validation Rules

#### ✅ **Capitalization**
Strings should start with a capital letter:

```javascript
// ✅ Valid
"Hello world"
"This is correct"

// ❌ Invalid
"hello world"     // Missing capital
"this is wrong"   // Missing capital
```

#### ✅ **Spacing**
No double spaces allowed:

```javascript
// ✅ Valid
"Proper spacing here"
"One space between words"

// ❌ Invalid
"Double  spaces"      // Contains double space
"Multiple   spaces"   // Contains multiple spaces
```

#### ✅ **Word Length**
Words longer than 15 characters trigger warnings:

```javascript
// ✅ Valid
"Normal length words"
"Acceptable text"

// ❌ Invalid
"Supercalifragilisticexpialidocious"  // Too long
"Antidisestablishmentarianism"        // Too long
```

#### 🚨 **Critical Spelling Errors**
Specific misspellings trigger critical failures:

- `teh` → should be "the"
- `recieve` → should be "receive" 
- `seperate` → should be "separate"
- `definately` → should be "definitely"

```javascript
// 🚨 Critical Errors
"I recieve the message"     // CRITICAL: recieve
"We need to seperate this"  // CRITICAL: seperate
"This is definately wrong"  // CRITICAL: definately
"Fix teh issue"            // CRITICAL: teh
```

### Return Values

```typescript
interface CheckResult {
  valid: boolean;
  message: string;
}

// Examples:
{ valid: true, message: "OK" }
{ valid: false, message: "should start with capital letter" }
{ valid: false, message: "contains double spaces, CRITICAL spelling error detected" }
```

### Special Cases

- Strings shorter than 3 characters always pass
- Multiple issues are combined in the message
- Critical errors take precedence in messaging

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

## Checker Factory

Create checkers programmatically:

```typescript
import { CheckerFactory } from './checkers';

const grammarChecker = CheckerFactory.createChecker('grammar');
const result = grammarChecker.check('Hello world');
```

## Best Practices

### Grammar Checker
- Use for documentation and user-facing strings
- Combine with `noCritical` decider to fail on spelling errors
- Consider case-sensitivity of your content

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
- Grammar checker is fastest for simple validation
- Character count checker is most efficient for length checks
- Custom checker has overhead - use sparingly for complex rules

## Next Steps

- [Decision Logic (Deciders)](deciders.md)
- [Complete Examples](examples.md)
- [API Reference](api.md)