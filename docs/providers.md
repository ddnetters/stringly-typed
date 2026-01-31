# LLM Providers

This guide covers how to configure stringly-typed with different LLM providers for the `brand_style` checker.

## Quick Reference

| Provider | Model Format | Environment Variables |
|----------|-------------|----------------------|
| [OpenAI](#openai) | `openai:gpt-4o-mini` | `OPENAI_API_KEY` |
| [OpenRouter](#openrouter) | `openai:<model-id>` | `OPENAI_API_KEY`, `OPENAI_BASE_URL` |
| [Anthropic](#anthropic) | `anthropic:claude-3-5-haiku-latest` | `ANTHROPIC_API_KEY` |
| [Google AI](#google-ai) | `google:gemini-2.0-flash` | `GOOGLE_API_KEY` |
| [Azure OpenAI](#azure-openai) | `azure:gpt-4o-mini` | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT` |
| [AWS Bedrock](#aws-bedrock) | `bedrock:anthropic.claude-3-haiku` | AWS credentials |
| [Together AI](#together-ai) | `openai:<model-id>` | `OPENAI_API_KEY`, `OPENAI_BASE_URL` |
| [Groq](#groq) | `openai:<model-id>` | `OPENAI_API_KEY`, `OPENAI_BASE_URL` |
| [Fireworks AI](#fireworks-ai) | `openai:<model-id>` | `OPENAI_API_KEY`, `OPENAI_BASE_URL` |
| [Ollama](#ollama-self-hosted) | `openai:<model-name>` | `OPENAI_BASE_URL` |

---

## OpenAI

Direct integration with OpenAI's API.

### Setup

1. Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add `OPENAI_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "openai:gpt-4o-mini"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Available Models

| Model | Cost | Best For |
|-------|------|----------|
| `openai:gpt-4o-mini` | $ | Fast, cost-effective validation |
| `openai:gpt-4o` | $$$ | High-quality analysis |
| `openai:gpt-4-turbo` | $$ | Balance of speed and quality |

---

## OpenRouter

Access 200+ models through a single API. Great for using Claude, Llama, Mistral, and more.

### Setup

1. Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys)
2. Add `OPENROUTER_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "openai:anthropic/claude-3.5-haiku"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          OPENAI_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
          OPENAI_BASE_URL: https://openrouter.ai/api/v1
```

### Available Models

| Model ID | Provider | Cost |
|----------|----------|------|
| `openai:anthropic/claude-3.5-haiku` | Anthropic | $ |
| `openai:anthropic/claude-3.5-sonnet` | Anthropic | $$ |
| `openai:google/gemini-2.0-flash-001` | Google | $ |
| `openai:google/gemini-3-flash-preview` | Google | $ |
| `openai:meta-llama/llama-3.3-70b-instruct` | Meta | $ |
| `openai:mistralai/mistral-large` | Mistral | $$ |
| `openai:openai/gpt-4o-mini` | OpenAI | $ |

See [openrouter.ai/models](https://openrouter.ai/models) for the full list.

---

## Anthropic

Direct integration with Anthropic's Claude models.

### Setup

1. Get your API key from [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Add `ANTHROPIC_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "anthropic:claude-3-5-haiku-latest"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Available Models

| Model | Cost | Best For |
|-------|------|----------|
| `anthropic:claude-3-5-haiku-latest` | $ | Fast, cost-effective |
| `anthropic:claude-3-5-sonnet-latest` | $$ | High-quality analysis |
| `anthropic:claude-3-opus-latest` | $$$ | Most capable |

---

## Google AI

Integration with Google's Gemini models.

### Setup

1. Get your API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Add `GOOGLE_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "google:gemini-2.0-flash"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
```

### Available Models

| Model | Cost | Best For |
|-------|------|----------|
| `google:gemini-2.0-flash` | $ | Fast, cost-effective (recommended) |
| `google:gemini-3-flash-preview` | $ | Latest preview model |
| `google:gemini-1.5-pro` | $$ | High-quality analysis |

---

## Azure OpenAI

For enterprise deployments using Azure's OpenAI Service.

### Setup

1. Deploy a model in [Azure OpenAI Studio](https://oai.azure.com/)
2. Add these repository secrets:
   - `AZURE_OPENAI_API_KEY` - Your Azure OpenAI key
   - `AZURE_OPENAI_ENDPOINT` - Your endpoint URL (e.g., `https://your-resource.openai.azure.com`)

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "azure:gpt-4o-mini"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
          AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          AZURE_OPENAI_API_VERSION: "2024-02-15-preview"
```

> **Note:** The model name must match your Azure deployment name.

---

## AWS Bedrock

For AWS-native deployments using Bedrock.

### Setup

1. Enable model access in [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Configure AWS credentials using OIDC (recommended) or access keys

### Workflow Example (OIDC)

```yaml
name: Validate UI Strings

on: [push, pull_request]

permissions:
  id-token: write
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions
          aws-region: us-east-1

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "bedrock:anthropic.claude-3-haiku-20240307-v1:0"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
```

### Available Models

| Model ID | Provider |
|----------|----------|
| `bedrock:anthropic.claude-3-haiku-20240307-v1:0` | Anthropic |
| `bedrock:anthropic.claude-3-5-sonnet-20240620-v1:0` | Anthropic |
| `bedrock:amazon.titan-text-lite-v1` | Amazon |
| `bedrock:meta.llama3-8b-instruct-v1:0` | Meta |

---

## Together AI

Fast inference for open-source models.

### Setup

1. Get your API key from [api.together.xyz](https://api.together.xyz/settings/api-keys)
2. Add `TOGETHER_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "openai:meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          OPENAI_API_KEY: ${{ secrets.TOGETHER_API_KEY }}
          OPENAI_BASE_URL: https://api.together.xyz/v1
```

---

## Groq

Ultra-fast inference with Groq's LPU hardware.

### Setup

1. Get your API key from [console.groq.com](https://console.groq.com/keys)
2. Add `GROQ_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "openai:llama-3.1-70b-versatile"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          OPENAI_API_KEY: ${{ secrets.GROQ_API_KEY }}
          OPENAI_BASE_URL: https://api.groq.com/openai/v1
```

### Available Models

| Model | Speed |
|-------|-------|
| `openai:llama-3.1-8b-instant` | ⚡⚡⚡ Fastest |
| `openai:llama-3.1-70b-versatile` | ⚡⚡ Fast |
| `openai:mixtral-8x7b-32768` | ⚡⚡ Fast |

---

## Fireworks AI

Fast inference with competitive pricing.

### Setup

1. Get your API key from [fireworks.ai](https://fireworks.ai/api-keys)
2. Add `FIREWORKS_API_KEY` as a repository secret

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "openai:accounts/fireworks/models/llama-v3p1-70b-instruct"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          OPENAI_API_KEY: ${{ secrets.FIREWORKS_API_KEY }}
          OPENAI_BASE_URL: https://api.fireworks.ai/inference/v1
```

---

## Ollama (Self-Hosted)

Run models locally on your own infrastructure. **Requires a self-hosted GitHub Actions runner** with Ollama installed.

> **Note:** Ollama won't work on GitHub-hosted runners because it requires a local server. Use this only with self-hosted runners.

### Setup

1. Install Ollama on your self-hosted runner
2. Pull your desired model: `ollama pull llama3.1`
3. Ensure Ollama is running: `ollama serve`

### Workflow Example

```yaml
name: Validate UI Strings

on: [push, pull_request]

jobs:
  validate:
    runs-on: self-hosted  # Must be self-hosted!
    steps:
      - uses: actions/checkout@v4

      - name: Validate UI Strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: "**/*.{ts,js,md}"
          checker: brand_style
          checker-options: |
            {
              "model": "openai:llama3.1"
            }
          style-guide-file: STYLE_GUIDE.md
          decider: noCritical
          comment: on-failure
        env:
          OPENAI_BASE_URL: http://localhost:11434/v1
```

### Available Models

Any model you've pulled with `ollama pull`:
- `openai:llama3.1`
- `openai:mistral`
- `openai:codellama`
- `openai:phi3`

---

## Troubleshooting

### Authentication Errors

```
Authentication failed. Please check your API key environment variable.
```

- Verify your secret name matches the environment variable
- Check that the API key is valid and has not expired
- Ensure you have billing set up (most providers require this)

### Rate Limiting

```
Rate limit exceeded. Please try again later.
```

- Consider using a different provider or model
- Enable caching to reduce API calls: `"enableCache": true`
- Upgrade your API plan for higher limits

### Model Not Found

```
Model not found: openai:invalid-model
```

- Check the exact model ID for your provider
- Ensure you have access to the model (some require approval)
- Verify the model is available in your region

### OpenAI-Compatible Providers

For providers using the OpenAI-compatible API format, remember:
- The model prefix is always `openai:` (this refers to the LangChain provider, not the company)
- Set `OPENAI_BASE_URL` to the provider's endpoint
- Set `OPENAI_API_KEY` to your provider's API key

---

## Cost Optimization Tips

1. **Use fast, cheap models for CI** - `gpt-4o-mini`, `claude-3.5-haiku`, or `gemini-flash` are cost-effective
2. **Enable caching** - Identical strings won't incur duplicate API calls
3. **Filter files carefully** - Only validate files that matter with specific glob patterns
4. **Use `noCritical` decider** - Avoid failing on minor suggestions
5. **Consider OpenRouter** - Often cheaper than direct provider access with usage-based pricing
