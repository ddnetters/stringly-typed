---
name: 🐛 Bug Report
about: Something isn't working as expected
title: '[BUG] Brief description'
labels: ['bug']
assignees: ''
---

## What happened?

**Brief description of the bug**

## Expected behavior

**What you expected to happen**

## Steps to reproduce

1. Configure Stringly-Typed with: `...`
2. Run on files: `...`
3. See error: `...`

## Environment

- **Stringly-Typed Version:** `v1.0.0`
- **Runner:** `ubuntu-latest` / `windows-latest` / `macos-latest`
- **Files:** What file types are you scanning?

## Additional context

**Any other info that might help debug this**

```yaml
# Your Stringly-Typed configuration
- uses: ddnetters/stringly-typed@v1
  with:
    files: 'src/**/*.js'
    checker: 'char_count'
    decider: 'threshold'
```

```
Error output or logs if available
```