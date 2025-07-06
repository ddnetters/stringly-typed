# API Reference

Complete TypeScript API documentation for the String Validator.

## Main Function

### `validateCodebaseStrings`

The primary function that orchestrates the entire validation process.

```typescript
function validateCodebaseStrings(input: ValidatorInput): ValidatorOutput
```

**Parameters:**
- `input`: [ValidatorInput](#validatorinput) - Configuration and files to validate

**Returns:**
- [ValidatorOutput](#validatoroutput) - Validation results and summary

**Example:**
```typescript
import { validateCodebaseStrings } from './validator';

const result = validateCodebaseStrings({
  files: [
    { path: 'src/app.js', content: 'const msg = "Hello world";' }
  ],
  checker: 'grammar',
  decider: 'threshold',
  deciderOptions: { minValidRatio: 0.8 }
});

console.log(result.summary.pass); // boolean
```

## Type Interfaces

### `ValidatorInput`

Configuration object for the validation process.

```typescript
interface ValidatorInput {
  files: { path: string; content: string }[];
  checker: "grammar" | "char_count" | "custom";
  checkerOptions?: Record<string, any>;
  decider: "threshold" | "noCritical" | "custom";
  deciderOptions?: Record<string, any>;
}
```

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `files` | `FileInput[]` | ✅ | Array of files to validate |
| `checker` | `CheckerType` | ✅ | Type of checker to use |
| `checkerOptions` | `Record<string, any>` | ❌ | Configuration for the checker |
| `decider` | `DeciderType` | ✅ | Type of decider to use |
| `deciderOptions` | `Record<string, any>` | ❌ | Configuration for the decider |

#### `FileInput`

```typescript
interface FileInput {
  path: string;    // File path (relative or absolute)
  content: string; // File content as string
}
```

### `ValidatorOutput`

Result object containing validation results and summary.

```typescript
interface ValidatorOutput {
  results: ValidationResult[];
  summary: ValidationSummary;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `results` | `ValidationResult[]` | Detailed results for each string |
| `summary` | `ValidationSummary` | Overall validation summary |

### `ValidationResult`

Individual string validation result.

```typescript
interface ValidationResult {
  file: string;    // File path where string was found
  line: number;    // Line number (1-based)
  start: number;   // Start character position (0-based)
  end: number;     // End character position (0-based)
  content: string; // The actual string content
  valid: boolean;  // Whether the string passed validation
  message: string; // Validation message or error description
}
```

**Example:**
```typescript
{
  file: "src/app.js",
  line: 1,
  start: 12,
  end: 25,
  content: "Hello world",
  valid: true,
  message: "OK"
}
```

### `ValidationSummary`

Overall validation summary.

```typescript
interface ValidationSummary {
  pass: boolean; // Whether overall validation passed
  reason: string; // Human-readable reason for the result
}
```

**Examples:**
```typescript
// Success
{ pass: true, reason: "4/5 strings valid (80.0%)" }

// Failure  
{ pass: false, reason: "Found 2 critical issue(s)" }
```

### `StringMatch`

Represents an extracted string before validation.

```typescript
interface StringMatch {
  file: string;    // File path
  line: number;    // Line number (1-based)
  start: number;   // Start position (0-based)
  end: number;     // End position (0-based)
  content: string; // String content
}
```

### `CheckResult`

Result from a checker's validation.

```typescript
interface CheckResult {
  valid: boolean;  // Whether the string is valid
  message: string; // Validation message
}
```

## String Extractor

### `StringExtractor`

Class responsible for extracting strings from files.

```typescript
class StringExtractor {
  extractStrings(files: { path: string; content: string }[]): StringMatch[]
}
```

**Methods:**

#### `extractStrings(files)`

Extracts all strings from the provided files.

**Parameters:**
- `files`: Array of file objects with `path` and `content`

**Returns:**
- `StringMatch[]`: Array of extracted strings with position information

**Example:**
```typescript
import { StringExtractor } from './string-extractor';

const extractor = new StringExtractor();
const matches = extractor.extractStrings([
  { path: 'test.js', content: 'const msg = "Hello";' }
]);

console.log(matches[0].content); // "Hello"
```

## Checkers

### `Checker` Interface

Base interface for all checkers.

```typescript
interface Checker {
  check(content: string, options?: Record<string, any>): CheckResult;
}
```

### `CheckerFactory`

Factory class for creating checker instances.

```typescript
class CheckerFactory {
  static createChecker(type: "grammar" | "char_count" | "custom"): Checker
}
```

**Methods:**

#### `createChecker(type)`

Creates a checker instance of the specified type.

**Parameters:**
- `type`: Type of checker to create

**Returns:**
- `Checker`: Instance of the requested checker

**Throws:**
- `Error`: If unknown checker type is provided

### `GrammarChecker`

Validates basic grammar rules.

```typescript
class GrammarChecker implements Checker {
  check(content: string, options?: Record<string, any>): CheckResult
}
```

**Validation Rules:**
- Capitalization at start
- No double spaces  
- Word length limits
- Critical spelling error detection

### `CharCountChecker`

Validates string length.

```typescript
class CharCountChecker implements Checker {
  check(content: string, options?: Record<string, any>): CheckResult
}
```

**Options:**
- `maxChars` (number): Maximum allowed characters (default: 100)

### `CustomChecker`

Validates using custom JavaScript logic.

```typescript
class CustomChecker implements Checker {
  check(content: string, options?: Record<string, any>): CheckResult
}
```

**Options:**
- `logic` (string): JavaScript expression for validation

## Deciders

### `Decider` Interface

Base interface for all deciders.

```typescript
interface Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary;
}
```

### `DeciderFactory`

Factory class for creating decider instances.

```typescript
class DeciderFactory {
  static createDecider(type: "threshold" | "noCritical" | "custom"): Decider
}
```

**Methods:**

#### `createDecider(type)`

Creates a decider instance of the specified type.

**Parameters:**
- `type`: Type of decider to create

**Returns:**
- `Decider`: Instance of the requested decider

**Throws:**
- `Error`: If unknown decider type is provided

### `ThresholdDecider`

Requires minimum percentage of valid strings.

```typescript
class ThresholdDecider implements Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary
}
```

**Options:**
- `minValidRatio` (number): Minimum ratio of valid strings (default: 0.8)

### `NoCriticalDecider`

Fails if any critical issues are found.

```typescript
class NoCriticalDecider implements Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary
}
```

**Behavior:**
- Searches for "CRITICAL" in validation messages
- Fails if any critical issues are found
- Passes if no critical issues are found

### `CustomDecider`

Uses custom JavaScript logic for decisions.

```typescript
class CustomDecider implements Decider {
  decide(results: ValidationResult[], options?: Record<string, any>): ValidationSummary
}
```

**Options:**
- `logic` (string): JavaScript expression for decision logic

## Error Handling

### Error Types

All functions may throw standard JavaScript errors:

```typescript
try {
  const result = validateCodebaseStrings(input);
} catch (error) {
  if (error instanceof Error) {
    console.error('Validation failed:', error.message);
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Unknown checker type` | Invalid checker type | Use 'grammar', 'char_count', or 'custom' |
| `Unknown decider type` | Invalid decider type | Use 'threshold', 'noCritical', or 'custom' |
| `Custom logic error` | Invalid JavaScript in custom logic | Fix JavaScript syntax |
| `No custom logic provided` | Missing logic in custom checker/decider | Provide valid logic string |

## Usage Examples

### Basic Usage

```typescript
import { validateCodebaseStrings } from './validator';

const result = validateCodebaseStrings({
  files: [
    { path: 'src/app.js', content: 'const msg = "Hello world";' }
  ],
  checker: 'grammar',
  decider: 'threshold'
});
```

### Advanced Usage

```typescript
import { 
  validateCodebaseStrings,
  StringExtractor,
  CheckerFactory,
  DeciderFactory
} from './index';

// Extract strings manually
const extractor = new StringExtractor();
const strings = extractor.extractStrings(files);

// Create checkers manually  
const checker = CheckerFactory.createChecker('custom');
const checkResult = checker.check('test string', { 
  logic: 'content.length > 5' 
});

// Create deciders manually
const decider = DeciderFactory.createDecider('threshold');
const summary = decider.decide(results, { minValidRatio: 0.9 });
```

### Type-Safe Usage

```typescript
import { ValidatorInput, ValidatorOutput } from './types';

function validateProject(projectFiles: string[]): ValidatorOutput {
  const input: ValidatorInput = {
    files: projectFiles.map(path => ({
      path,
      content: fs.readFileSync(path, 'utf8')
    })),
    checker: 'grammar',
    decider: 'threshold',
    deciderOptions: { minValidRatio: 0.8 }
  };
  
  return validateCodebaseStrings(input);
}
```

## Version Compatibility

| Version | Node.js | TypeScript | Features |
|---------|---------|------------|----------|
| 1.0.x | 18+ | 5.0+ | Core validation |
| 1.1.x | 18+ | 5.0+ | Enhanced checkers |
| 2.0.x | 20+ | 5.2+ | Breaking changes |

## Migration Guide

### From 0.x to 1.x

```typescript
// Old API (0.x)
validateStrings(files, 'grammar', { threshold: 0.8 });

// New API (1.x)  
validateCodebaseStrings({
  files,
  checker: 'grammar',
  decider: 'threshold',
  deciderOptions: { minValidRatio: 0.8 }
});
```

## Next Steps

- [Usage Examples](examples.md)
- [Troubleshooting](troubleshooting.md)
- [Contributing Guide](../CONTRIBUTING.md)