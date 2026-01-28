# 🌊 StringRay

> **AI-powered brand voice validation for your codebase.**

StringRay is a GitHub Action that scans your code for string literals and validates them against your brand style guide using AI. Ensure every user-facing message matches your voice and tone.

---

## Quickstart

### 1. Create your style guide

Add `STYLE_GUIDE.md` to your repo:

```markdown
# Brand Voice

- Use active voice, not passive
- Say "customers" not "users"
- Keep sentences under 20 words
- Be friendly but professional
```

### 2. Add the workflow

Create `.github/workflows/stringray.yml`:

```yaml
name: StringRay
on: [push, pull_request]

jobs:
  brand-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ddnetters/stringray@v1
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{js,ts,tsx}'
          checker: 'brand_style'
          style-guide-file: 'STYLE_GUIDE.md'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.9}'
```

That's it. StringRay now validates every string against your brand voice.

---

## Example Output

```
StringRay Results:
├── src/components/Button.tsx
│   ├── Line 12: "Click here to continue" ❌
│   │   └── Use "Select" not "Click" (terminology)
│   └── Line 18: "Your order has been placed" ✅ OK
├── src/utils/errors.ts
│   └── Line 5: "An error was encountered by the system" ❌
│       └── Use active voice: "Something went wrong" (tone)
└── Summary: 4/6 strings valid (67%) - FAILED
```

---

## Other Checkers

StringRay also supports non-AI checkers for simpler validation:

| Checker | Use Case |
|---------|----------|
| `brand_style` | AI-powered voice & tone validation |
| `char_count` | Enforce max string length |
| `custom` | Your own JavaScript validation logic |

```yaml
# Example: Enforce 80 character limit
- uses: ddnetters/stringray@v1
  with:
    checker: 'char_count'
    checker-options: '{"maxChars": 80}'
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Installation](docs/installation.md) | Setup, local dev, Docker, npm package |
| [Configuration](docs/configuration.md) | All options in detail |
| [Checkers](docs/checkers.md) | char_count, custom, brand_style |
| [Deciders](docs/deciders.md) | threshold, noCritical, custom |
| [Examples](docs/examples.md) | Real-world usage scenarios |
| [API Reference](docs/api.md) | TypeScript interfaces |
| [Troubleshooting](docs/troubleshooting.md) | Common issues |

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- [Report Issues](https://github.com/ddnetters/stringray/issues)

## License

MIT - see [LICENSE](LICENSE)
