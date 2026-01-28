# 🎯 Stringly-Typed

> **Shine a light on your code's communication.**

A powerful, sonar-powered GitHub Action that swims through your codebase to illuminate string quality with precision and modularity.

## Overview

Stringly-Typed provides a comprehensive solution for maintaining string quality across your codebase. Like underwater sonar detecting objects in the depths, Stringly-Typed scans through your files, extracts strings, validates them using configurable checkers, and makes intelligent pass/fail decisions.

## Quick Start

```yaml
# .github/workflows/validate-strings.yml
name: Validate Strings
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 🔦 Scan with Stringly-Typed
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/**/*.{js,ts,md}'
          checker: 'char_count'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.8}'
```

## Architecture

The validator follows a three-stage pipeline:

```
Files → String Extraction → Validation → Decision → Result
```

### Stage 1: String Extraction
Extracts string literals and content from:
- JavaScript/TypeScript files (`"strings"`, `'strings'`, `` `strings` ``)
- Markdown files (content excluding headers and code blocks)
- JSON files (string values)

### Stage 2: Validation (Checkers)
Validates extracted strings using:
- **Character Count Checker**: Length limitations
- **Custom Checker**: User-defined JavaScript logic
- **Brand Style Checker**: AI-powered brand voice validation

### Stage 3: Decision (Deciders)
Makes pass/fail decisions based on:
- **Threshold Decider**: Minimum percentage of valid strings
- **No Critical Decider**: Fails on any critical issues
- **Custom Decider**: User-defined decision logic

## Features

- ✅ **Multi-file Support**: JS, TS, MD, JSON
- ✅ **Modular Design**: Pluggable checkers and deciders
- ✅ **Custom Logic**: JavaScript-based validation rules
- ✅ **Comprehensive Testing**: 100% function coverage
- ✅ **TypeScript Support**: Fully typed interfaces
- ✅ **CI/CD Ready**: GitHub Actions integration

## Navigation

- [Installation](installation.md) - Setup and configuration
- [Configuration](configuration.md) - Input parameters and options
- [Checkers](checkers.md) - Available validation rules
- [Deciders](deciders.md) - Decision-making logic
- [API Reference](api.md) - TypeScript interfaces and functions
- [Examples](examples.md) - Real-world usage scenarios
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

## Use Cases

### Code Quality
Ensure consistent string formatting and length limits across your codebase.

### Documentation Validation
Validate markdown documentation for length limits and brand style consistency.

### Internationalization
Check string patterns for i18n compliance and character encoding issues.

### Security
Detect potential security issues in string literals and prevent hardcoded secrets.

## Support

- [GitHub Issues](https://github.com/ddnetters/stringly-typed/issues)
- [Discussions](https://github.com/ddnetters/stringly-typed/discussions)
- [Contributing Guide](../CONTRIBUTING.md)

## License

MIT License - see [LICENSE](../LICENSE) for details.