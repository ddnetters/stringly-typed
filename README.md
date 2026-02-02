<div align="center">

<img src="assets/stringly-typed-logo-v2-b.png" alt="Stringly-Typed" width="200">

# Stringly-Typed

**Catch off-brand copy before it ships.**

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Stringly--Typed-blue?logo=github)](https://github.com/marketplace/actions/stringly-typed)
[![GitHub release](https://img.shields.io/github/v/release/ddnetters/stringly-typed)](https://github.com/ddnetters/stringly-typed/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Docs-stringly--typed-C45D3E)](https://stringly-typed.netters.dev)
[![Demo Repo](https://img.shields.io/badge/Demo-stringly--typed--demo-green?logo=github)](https://github.com/ddnetters/stringly-typed-demo)

<!-- TODO: Add demo GIF once ready -->
<!-- <img src="assets/demo.gif" alt="Demo" width="600"> -->

</div>

---

## The Problem

Your style guide says "customers," but someone just merged a PR with "users" in 12 places. Your docs say "click," but your buttons say "tap," "press," and "select."

**Brand consistency dies in pull requests.** Code review catches bugs, not tone. And nobody has time to manually check every string.

---

## How It Works

Stringly-Typed is a GitHub Action that validates UI strings against your brand voice using AI.

- **Runs on every PR** — Catches issues before merge, not after deploy
- **Uses your style guide** — Define rules once in markdown, enforce everywhere
- **2-minute setup** — One workflow file, one style guide, done
- **Fast feedback** — Analyzes only changed files in ~2-5 seconds

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

## Use Cases

<details>
<summary><strong>Brand Voice Enforcement</strong></summary>

Ensure every user-facing string matches your tone guidelines. Define voice rules in your style guide, and Stringly-Typed flags violations like passive voice, wrong terminology, or off-brand phrasing.

```yaml
checker: 'brand_style'
style-guide-file: 'STYLE_GUIDE.md'
```
</details>

<details>
<summary><strong>Documentation Consistency</strong></summary>

Validate markdown files for consistent terminology and style. Great for docs-as-code workflows where multiple contributors write documentation.

```yaml
files: 'docs/**/*.md'
checker: 'brand_style'
```
</details>

<details>
<summary><strong>String Length Limits</strong></summary>

Enforce character limits for UI strings—useful for buttons, tooltips, and mobile interfaces where space is constrained.

```yaml
checker: 'char_count'
checker-options: '{"maxChars": 40}'
```
</details>

<details>
<summary><strong>Custom Validation Rules</strong></summary>

Write your own JavaScript validation logic for specialized requirements like banned words, required patterns, or domain-specific rules.

```yaml
checker: 'custom'
checker-options: '{"expression": "!content.toLowerCase().includes(\"todo\")"}'
```
</details>

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

<!-- TODO: Add PR comment screenshot once ready -->
<!-- <details>
<summary>See example PR comment</summary>

![PR Comment Example](assets/pr-comment-example.png)
</details> -->

---

## Checkers

| Checker | Use Case |
|---------|----------|
| `brand_style` | AI-powered voice & tone validation |
| `char_count` | Enforce max string length |
| `custom` | Your own JavaScript validation logic |

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Installation](docs/installation.md) | Setup, local dev, Docker, npm package |
| [Configuration](docs/configuration.md) | All options in detail |
| [Checkers](docs/checkers.md) | char_count, custom, brand_style |
| [Deciders](docs/deciders.md) | threshold, noCritical, custom |
| [LLM Providers](docs/providers.md) | OpenAI, OpenRouter, Anthropic, Azure, AWS Bedrock, Groq, and more |
| [Examples](docs/examples.md) | Real-world usage scenarios |
| [API Reference](docs/api.md) | TypeScript interfaces |
| [Troubleshooting](docs/troubleshooting.md) | Common issues |

---

## Common Questions

<details>
<summary><strong>How much does the AI cost?</strong></summary>

You use your own API key. A typical PR check costs $0.01-0.05 depending on how many strings changed.
</details>

<details>
<summary><strong>Is my code sent to the LLM?</strong></summary>

Only the string literals you specify are analyzed. Your source code logic is never sent.
</details>

<details>
<summary><strong>Can I use Claude or Gemini instead of OpenAI?</strong></summary>

Yes! Stringly-Typed supports multiple LLM providers. See the [Providers Guide](docs/providers.md) for setup instructions.
</details>

<details>
<summary><strong>What if it flags false positives?</strong></summary>

Configure sensitivity in your style guide, or set the decider threshold lower. You can also use `warn` mode instead of blocking merges.
</details>

<details>
<summary><strong>Does it work with my stack?</strong></summary>

Works with any text files—TypeScript, JavaScript, JSX, JSON, Markdown, YAML. Configure file patterns to match your project.
</details>

<details>
<summary><strong>How do I ignore certain strings?</strong></summary>

Use file patterns to exclude paths, or configure checker options to skip specific patterns. See [Configuration](docs/configuration.md) for details.
</details>

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- [Open an issue](https://github.com/ddnetters/stringly-typed/issues) for bugs or feature requests
- [Start a discussion](https://github.com/ddnetters/stringly-typed/discussions) for questions or ideas
- [Read the docs](https://stringly-typed.netters.dev) for detailed guides

---

## License

MIT - see [LICENSE](LICENSE)
