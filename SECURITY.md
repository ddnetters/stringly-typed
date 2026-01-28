# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Stringly-Typed, please report it responsibly:

1. **Do NOT open a public issue** for security vulnerabilities
2. Email the maintainers directly or use GitHub's private vulnerability reporting feature
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

We aim to respond to security reports within 48 hours and will work with you to understand and address the issue.

## Security Considerations

### Custom Checker/Decider Logic

Stringly-Typed supports custom JavaScript logic via the `custom` checker and decider types. This feature uses JavaScript's `Function` constructor to execute user-provided code.

**Important:** Only use custom logic from trusted sources. Malicious custom logic could potentially:
- Access environment variables
- Make network requests
- Consume excessive resources

When using Stringly-Typed in CI/CD pipelines, ensure that:
- Custom logic configurations come from trusted, version-controlled sources
- Pull requests modifying custom logic are carefully reviewed
- Untrusted user input is never passed directly to custom logic configurations
