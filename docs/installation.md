# Installation

## GitHub Actions Usage

### Basic Setup

Add the action to your workflow file:

```yaml
# .github/workflows/validate-strings.yml
name: String Validation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Validate strings
        uses: ddnetters/stringly-typed@v1
        with:
          files: 'src/**/*.{js,ts,md}'
          checker: 'char_count'
          decider: 'threshold'
```

### Version Pinning

For production use, pin to a specific version:

```yaml
- uses: ddnetters/stringly-typed@v1.0.0
```

Or use a commit SHA for maximum security:

```yaml
- uses: ddnetters/stringly-typed@v1
```

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/ddnetters/stringly-typed.git
cd stringly-typed

# Install dependencies
npm install

# Run tests
npm test

# Build the action
npm run build
```

### Development Workflow

```bash
# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for distribution
npm run build
```

## NPM Package Usage

You can also use the validator as a standalone npm package:

```bash
npm install @ddnetters/string-validator
```

```javascript
import { validateCodebaseStrings } from '@ddnetters/string-validator';

const result = validateCodebaseStrings({
  files: [
    { path: 'src/app.js', content: 'const msg = "Hello world";' }
  ],
  checker: 'char_count',
  decider: 'threshold'
});

console.log(result.summary.pass); // true/false
```

## Docker Usage

Run the validator in a Docker container:

```bash
# Build the image
docker build -t string-validator .

# Run validation
docker run --rm -v $(pwd):/workspace string-validator \
  --files "src/**/*.js" \
  --checker char_count \
  --decider threshold
```

## Self-Hosted Runners

For self-hosted GitHub Actions runners, ensure:

1. Node.js 18+ is installed
2. Required permissions for file system access
3. Network access for downloading dependencies

```yaml
jobs:
  validate:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Validate strings
        uses: ddnetters/stringly-typed@v1
```

## Enterprise Setup

### GitHub Enterprise Server

1. Upload the action to your GitHub Enterprise instance
2. Configure organization-level workflows
3. Set up required permissions and secrets

### Custom Registry

For private npm registries:

```yaml
- name: Setup npm registry
  run: |
    echo "@ddnetters:registry=https://npm.your-company.com/" >> ~/.npmrc
    echo "//npm.your-company.com/:_authToken=${{ secrets.NPM_TOKEN }}" >> ~/.npmrc
```

## Troubleshooting Installation

### Common Issues

**Permission Denied**
```bash
sudo chown -R $(whoami) ~/.npm
```

**Node Version Mismatch**
```bash
nvm use 18
npm install
```

**Dependencies Not Found**
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Verification

Test your installation:

```bash
# Local testing
npm test

# Action testing
act -j validate  # requires act tool
```

## Next Steps

- [Configuration Guide](configuration.md)
- [Available Checkers](checkers.md) 
- [Usage Examples](examples.md)