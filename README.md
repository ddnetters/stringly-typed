# 🌊 StringRay

> **Shine a light on your code's communication.**

StringRay is a GitHub Action that swims through your codebase, finds every string message, and illuminates their quality with sonar-like precision. Whether checking length limits, brand style compliance, or detecting critical alerts, StringRay ensures your code speaks clearly and passes your CI gates.

```
🔦 StringRay Scanning...
├── 📄 src/components/Header.jsx
│   ├── ✅ "Welcome to our app" (line 12) - OK
│   └── ❌ "Recieve notifications" (line 24) - CRITICAL: spelling error
└── 📊 Summary: 1/2 strings valid (50%) - FAILED
```

---

## 🪼 Overview

StringRay navigates through JavaScript, TypeScript, Markdown, and JSON files to extract and validate string content. Using configurable checkers (length, brand style, custom logic) and flexible deciders (threshold, critical detection, custom rules), it provides automated quality gates for your development workflow.

Perfect for maintaining consistent messaging, catching spelling errors, enforcing UX guidelines, and ensuring internationalization readiness.

---

## ⚙️ How It Works

StringRay operates through a **three-stage sonar pipeline**:

```
🌊 Stage 1: String Extraction
   └── Scans files and extracts string literals + content

🔍 Stage 2: Quality Scanning (Checkers)
   └── Validates each string using length/brand style/custom rules

🎯 Stage 3: Decision Sonar (Deciders)
   └── Determines pass/fail based on threshold/critical/custom logic
```

Each stage is modular and extensible, allowing you to customize validation rules for your project's needs.

---

## 🧪 Supported Checkers

### 📏 **Character Count Checker**
- Enforces maximum string length
- Configurable limits per file type
- Perfect for UI constraints

### ⚡ **Custom Checker**
- JavaScript-based validation logic
- Access to full string content
- Unlimited customization possibilities

### 🎨 **Brand Style Checker**
- AI-powered brand voice validation
- Style guide compliance checking
- Consistent terminology enforcement

---

## 🧠 Example: Catching Critical Issues

### Input Code:
```javascript
// src/messages.js
const ERROR_MSG = "An error occurred while processing your request. Please contact support.";
const SUCCESS_MSG = "Done";
const WARNING_MSG = "Please check your configuration settings before proceeding";
```

### StringRay Output (with char_count checker, maxChars: 50):
```yaml
🔦 StringRay Results:
📄 src/messages.js:
  ├── Line 1: "An error occurred while processing..." ❌
  │   └── Too long: 75 characters (max: 50)
  ├── Line 2: "Done" ✅
  │   └── OK
  └── Line 3: "Please check your configuration..." ❌
      └── Too long: 58 characters (max: 50)

🎯 Decision: FAILED - 1/3 strings valid (33%)
```

---

## 🛠️ Configuration

### Basic GitHub Action Setup:

```yaml
name: StringRay Quality Check
on: [push, pull_request]

jobs:
  string-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 🔦 Scan strings with StringRay
        uses: ddnetters/stringray@v1
        with:
          files: 'src/**/*.{js,ts,jsx,tsx,md}'
          checker: 'char_count'
          decider: 'threshold'
```

### Advanced Configuration:

```yaml
- name: 🌊 StringRay Deep Scan
  uses: ddnetters/stringray@v1
  with:
    files: 'src/**/*.{js,ts,md}'
    checker: 'custom'
    checker-options: |
      {
        "logic": "!content.toLowerCase().includes('password') && content.length > 3"
      }
    decider: 'threshold'
    decider-options: |
      {
        "minValidRatio": 0.95
      }
```

### Configuration Options:

| 🎛️ Input | Description | Default |
|----------|-------------|---------|
| `files` | Glob pattern for target files | `**/*.{js,ts,md,json}` |
| `checker` | Validation type: `char_count` `custom` `brand_style` | `char_count` |
| `checker-options` | JSON configuration for checker | `{}` |
| `decider` | Decision logic: `threshold` `noCritical` `custom` | `threshold` |
| `decider-options` | JSON configuration for decider | `{}` |

---

## 🧱 Extending StringRay

### Custom Checker Example:
```yaml
checker: 'custom'
checker-options: |
  {
    "logic": "({ valid: !content.includes('TODO'), message: content.includes('TODO') ? 'CRITICAL: TODO found in production code' : 'Clean' })"
  }
```

### Custom Decider Example:
```yaml
decider: 'custom'  
decider-options: |
  {
    "logic": "({ pass: results.filter(r => r.file.includes('critical')).every(r => r.valid), reason: 'Critical files must be perfect' })"
  }
```

### Programmatic Usage:
```typescript
import { validateCodebaseStrings } from 'stringray';

const result = validateCodebaseStrings({
  files: [{ path: 'app.js', content: 'const msg = "Hello world";' }],
  checker: 'char_count',
  decider: 'threshold',
  deciderOptions: { minValidRatio: 0.8 }
});

console.log(`🎯 Result: ${result.summary.pass ? '✅ PASS' : '❌ FAIL'}`);
```

---

## 🎯 Use Cases

### 🛡️ **Quality Gates**
- Block PRs with spelling errors
- Enforce consistent messaging
- Maintain professional communication

### 🌍 **Internationalization Review**  
- Validate translatable strings
- Check character limits for UI
- Ensure consistent terminology

### 🎨 **UX Tone Checks**
- Maintain brand voice consistency
- Detect inappropriate language
- Enforce style guide compliance

### 🔒 **Security Scanning**
- Detect hardcoded secrets
- Flag sensitive information
- Validate sanitization

---

## 📊 Outputs

| 🎯 Output | Description |
|-----------|-------------|
| `results` | Detailed JSON array of all string validations |
| `summary` | Pass/fail summary with human-readable reason |
| `pass` | Boolean result for CI/CD gates |

---

## 🌊 API Reference

```typescript
function validateCodebaseStrings(input: {
  files: { path: string; content: string }[];
  checker: "char_count" | "custom" | "brand_style";
  checkerOptions?: Record<string, any>;
  decider: "threshold" | "noCritical" | "custom";
  deciderOptions?: Record<string, any>;
}): {
  results: ValidationResult[];
  summary: { pass: boolean; reason: string; };
}
```

**Full API documentation:** [`docs/api.md`](docs/api.md)

---

## 🚀 Development

```bash
# Install dependencies
npm install

# Run StringRay tests  
npm test

# Check test coverage
npm run test:coverage

# Build the action
npm run build

# Type checking
npm run typecheck
```

---

## 📚 Documentation

- 🏠 [**Getting Started**](docs/index.md) - Overview and quick start
- ⚙️ [**Configuration Guide**](docs/configuration.md) - Detailed setup options
- 🔍 [**Checkers Reference**](docs/checkers.md) - Length, brand style, and custom validation
- 🎯 [**Deciders Reference**](docs/deciders.md) - Decision logic and thresholds
- 💡 [**Examples**](docs/examples.md) - Real-world usage scenarios
- 🐛 [**Troubleshooting**](docs/troubleshooting.md) - Common issues and solutions

---

## 🤝 Contributing

This is a hobby project, but contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

- 🐛 [Report Issues](https://github.com/ddnetters/stringray/issues)
- 🔧 [Contributing Guide](CONTRIBUTING.md)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**🌊 StringRay - Illuminating code quality, one string at a time 🔦**

Made with ❤️ for developers who care about communication

</div>