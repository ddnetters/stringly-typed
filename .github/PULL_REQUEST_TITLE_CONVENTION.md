# 🏷️ PR Title Convention

Stringly-Typed uses automated releases based on PR titles. Please format your PR titles using conventional commits:

## 📋 Format

```
<type>: <description>
```

## 🎯 Types

| Type | Release | Description | Example |
|------|---------|-------------|---------|
| `feat` | **Minor** | New features | `feat: add regex pattern checker` |
| `fix` | **Patch** | Bug fixes | `fix: handle escaped quotes correctly` |
| `docs` | **Patch** | Documentation | `docs: update configuration examples` |
| `style` | **Patch** | Code formatting | `style: fix TypeScript formatting` |
| `refactor` | **Patch** | Code refactoring | `refactor: simplify string extraction logic` |
| `test` | **Patch** | Tests | `test: add integration tests for custom checkers` |
| `chore` | **Patch** | Maintenance | `chore: update dependencies` |
| `perf` | **Patch** | Performance | `perf: optimize large file processing` |
| `ci` | **Patch** | CI/CD | `ci: add automated testing workflow` |
| `build` | **Patch** | Build system | `build: update TypeScript config` |

## 💥 Breaking Changes

For breaking changes, add `!` or include `BREAKING CHANGE` in the title:

```
feat!: change action input format
fix: resolve parsing issue

BREAKING CHANGE: input format changed
```

This triggers a **Major** version bump.

## ✅ Good Examples

- `feat: add custom validation rules support`
- `fix: prevent memory leak in large repositories` 
- `docs: add troubleshooting guide for common errors`
- `chore: bump dependencies to latest versions`
- `feat!: redesign configuration API`

## ❌ Bad Examples

- `Update readme` (no type prefix)
- `Fixed bug` (no conventional format)
- `feat add new feature` (missing colon)
- `FEAT: new feature` (wrong case)

## 🤖 What Happens

When you merge a PR with a conventional title:

1. **Auto Release** workflow detects the type
2. **Version bump** is calculated (patch/minor/major)
3. **Git tag** is created automatically
4. **GitHub release** is published
5. **Changelog** is updated automatically
6. **Major version tag** (e.g., `v1`) is moved to latest

## 🔧 Tips

- Keep descriptions concise but clear
- Use imperative mood ("add", not "adds" or "added")
- Reference issues when applicable: `fix: resolve parsing issue (#123)`
- For multiple changes, focus on the most significant one
- If unsure about type, `chore:` is safe for maintenance tasks

## 🚫 Skipping Releases

If you need to merge without creating a release, use non-conventional titles:

- `Update documentation`
- `Fix typo in readme`
- `Merge branch 'feature-branch'`

These won't trigger automatic releases.