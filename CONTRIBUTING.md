# 🤝 Contributing to Stringly-Typed

Thanks for your interest in Stringly-Typed! This is a hobby project, so contributions are welcome but kept simple.

## 🐛 Found a Bug?

- Check if it's already reported in [Issues](https://github.com/ddnetters/stringly-typed/issues)
- If not, open a new issue with:
  - What you expected vs what happened
  - Steps to reproduce
  - Your environment (OS, Node version, etc.)

## 💡 Have a Feature Idea?

- Open an issue to discuss it first
- Keep it simple - this is a small project!
- Include use cases and examples

## 🔧 Want to Contribute Code?

1. Fork the repo
2. Create a branch: `git checkout -b fix-something`
3. Make your changes
4. Add tests if needed
5. Run `npm test` to make sure everything works
6. Submit a PR with conventional commit title (see below)

### 🏷️ PR Title Format

Use conventional commit format for automatic releases:

- `feat: add new feature` → Minor release
- `fix: bug description` → Patch release  
- `docs: update readme` → Patch release
- `chore: maintenance task` → Patch release

See [PR Title Convention](.github/PULL_REQUEST_TITLE_CONVENTION.md) for full details.

### Development Setup

```bash
git clone your-fork
cd stringly-typed
npm install
npm test
```

## 📝 Code Style

- Use TypeScript
- Follow existing patterns
- Add tests for new features
- Keep it simple and readable

That's it! This is meant to be a straightforward project without heavy process.