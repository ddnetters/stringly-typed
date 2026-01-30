# Stringly-Typed

**Every PR is a chance to ship off-brand copy. Catch it automatically.**

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Stringly--Typed-blue?logo=github)](https://github.com/marketplace/actions/stringly-typed)
[![GitHub release](https://img.shields.io/github/v/release/ddnetters/stringly-typed)](https://github.com/ddnetters/stringly-typed/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-stringly--typed-C45D3E)](https://stringly-typed-4a0c8.web.app/)

Stringly-Typed is a GitHub Action that validates your UI strings against your brand voice using AI. It runs on every push, catches tone violations, and comments on PRs with specific fixes.

<!-- TODO: Add demo GIF showing PR comment output -->

---

## Why Use This

- **Catch issues before merge** — No more "that doesn't sound like us" in code review
- **Enforce your style guide automatically** — Define rules once, apply everywhere
- **2-minute setup** — One workflow file, one style guide, done
- **Runs in ~2-5 seconds** — Only analyzes changed files

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

Create `.github/workflows/stringly-typed.yml`:

```yaml
name: Stringly-Typed
on: [push, pull_request]

jobs:
  brand-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ddnetters/stringly-typed@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{js,ts,tsx}'
          checker: 'brand_style'
          style-guide-file: 'STYLE_GUIDE.md'
          decider: 'threshold'
          decider-options: '{"minValidRatio": 0.9}'
```

That's it. Stringly-Typed now validates every string against your brand voice.

---

## Example Output

```
Stringly-Typed Results:
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

## PR Comments

Stringly-Typed can automatically comment on pull requests with validation results.

| Value | Behavior |
|-------|----------|
| `on-failure` | Comment only when validation fails (default) |
| `always` | Comment on every PR run |
| `never` | Disable PR comments |

```yaml
- uses: ddnetters/stringly-typed@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    comment: 'on-failure'
```

---

## Other Checkers

Stringly-Typed also supports non-AI checkers for simpler validation:

| Checker | Use Case |
|---------|----------|
| `brand_style` | AI-powered voice & tone validation |
| `char_count` | Enforce max string length |
| `custom` | Your own JavaScript validation logic |

```yaml
# Example: Enforce 80 character limit
- uses: ddnetters/stringly-typed@v1
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

## Common Questions

<details>
<summary><strong>How much does the AI cost?</strong></summary>

You use your own OpenAI API key. A typical PR check costs $0.01-0.05 depending on how many strings changed.
</details>

<details>
<summary><strong>Is my code sent to OpenAI?</strong></summary>

Only the string literals you specify are analyzed. Your source code logic is never sent.
</details>

<details>
<summary><strong>What if it flags false positives?</strong></summary>

Configure sensitivity in your style guide, or set the decider to `warn` mode instead of blocking merges.
</details>

<details>
<summary><strong>Does it work with my stack?</strong></summary>

Works with any text files — TypeScript, JavaScript, JSX, JSON, Markdown, YAML. Configure file patterns to match your project.
</details>

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT - see [LICENSE](LICENSE)
