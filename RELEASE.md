# 🚀 Stringly-Typed Release Process

This document outlines the release process for Stringly-Typed, including versioning, tagging, and publishing.

## 📋 Release Checklist

### Pre-Release
- [ ] All tests pass (`npm test`)
- [ ] Code builds successfully (`npm run build`)
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated with changes
- [ ] Version number follows semantic versioning

### Release Steps
- [ ] Update version in `package.json`
- [ ] Create and push git tag
- [ ] GitHub release is created automatically
- [ ] npm package is published (if applicable)
- [ ] Major version tag is updated (e.g., `v1` points to `v1.2.3`)

## 🏷️ Versioning Strategy

Stringly-Typed follows [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)**: Breaking changes to the action interface
- **Minor (1.X.0)**: New features, backward compatible
- **Patch (1.0.X)**: Bug fixes, backward compatible

### Examples
- `v1.0.0` → `v1.0.1`: Fixed bug in grammar checker
- `v1.0.1` → `v1.1.0`: Added new checker type
- `v1.1.0` → `v2.0.0`: Changed action input format (breaking)

## 🔧 Release Commands

### 1. Update Version
```bash
# For patch release (bug fixes)
npm version patch

# For minor release (new features)
npm version minor

# For major release (breaking changes)
npm version major

# Or set specific version
npm version 1.2.3
```

### 2. Push Release
```bash
# Push the version commit and tag
git push origin main --follow-tags
```

### 3. Verify Release
- Check GitHub release was created
- Verify action works in test repository
- Confirm npm package published (if applicable)

## 🤖 Automated Release Process

The release process is automated via GitHub Actions:

### Trigger
- Push a git tag starting with `v` (e.g., `v1.2.3`)

### What Happens
1. **Validation**: Run full test suite and build
2. **Action Test**: Test the built action on sample files
3. **Publish Release Branch**: Push built code to `releases/v1` branch
4. **GitHub Release**: Create release with changelog
5. **npm Publish**: Publish to npm registry (if configured)
6. **Major Tag Update**: Update `v1` to point to latest release

## 📦 npm Publishing (Optional)

If you want to publish Stringly-Typed as an npm package:

### Setup
1. Create npm account and get auth token
2. Add `NPM_TOKEN` to GitHub repository secrets
3. Uncomment npm publishing step in `.github/workflows/release.yml`

### Package Configuration
The package will be published as:
- **Name**: `stringly-typed`
- **Scope**: Could be `@ddnetters/stringly-typed`
- **Registry**: npm public registry

## 🏗️ Manual Release Process

If you need to release manually:

### 1. Prepare Release
```bash
# Make sure you're on main branch
git checkout main
git pull origin main

# Update version (creates commit and tag)
npm version patch  # or minor/major

# Verify the changes
git log --oneline -n 2
git tag -l | tail -1
```

### 2. Update Changelog
```bash
# Edit CHANGELOG.md to add release notes
# Commit the changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for $(git describe --tags --abbrev=0)"
```

### 3. Push Release
```bash
# Push everything
git push origin main --follow-tags
```

### 4. Create GitHub Release
- Go to GitHub releases page
- Click "Create a new release"
- Select the tag you just pushed
- Add release notes from CHANGELOG.md
- Publish release

## 🔄 Hotfix Process

For urgent fixes to released versions:

### 1. Create Hotfix Branch
```bash
# From the problematic tag
git checkout v1.2.3
git checkout -b hotfix/urgent-fix
```

### 2. Make Fix
```bash
# Make your changes
# Commit the fix
git add .
git commit -m "fix: urgent security fix"
```

### 3. Release Hotfix
```bash
# Version bump (patch)
npm version patch  # Creates v1.2.4

# Push hotfix
git push origin hotfix/urgent-fix --follow-tags

# Merge back to main
git checkout main
git merge hotfix/urgent-fix
git push origin main
```

## 📝 Release Notes Template

Use this template for GitHub releases:

```markdown
## 🎯 Stringly-Typed vX.Y.Z

### ✨ New Features
- Feature 1 description
- Feature 2 description

### 🐛 Bug Fixes
- Fix 1 description
- Fix 2 description

### 📚 Documentation
- Documentation improvements

### 🔧 Maintenance
- Internal improvements

## 🚀 Quick Start

\`\`\`yaml
- uses: ddnetters/stringly-typed@vX.Y.Z
  with:
    files: 'src/**/*.{js,ts,md}'
    checker: 'char_count'
    decider: 'threshold'
\`\`\`

**Full Changelog**: https://github.com/ddnetters/stringly-typed/compare/vX.Y.Z-1...vX.Y.Z
```

## 🎯 Version Tags & Release Branches

Stringly-Typed uses a **release branch pattern** to keep the main branch clean. The compiled `dist/` folder is not committed to main - instead, it's published to release branches during the release process.

### How It Works

| Branch/Tag | Contains | Purpose |
|------------|----------|---------|
| `main` | Source code only | Development |
| `releases/v1` | Built action (dist/) | Action distribution |
| `v1` | Tag pointing to releases/v1 | User-facing version |
| `v1.2.3` | Specific release tag | Pinned version |

### Usage Examples
```yaml
# Use latest in major version (recommended)
uses: ddnetters/stringly-typed@v1

# Pin to exact version (for maximum stability)
uses: ddnetters/stringly-typed@v1.2.3

# Reference release branch directly (alternative)
uses: ddnetters/stringly-typed@releases/v1
```

## 🚨 Release Rollback

If a release has issues:

### 1. Quick Rollback
```bash
# Revert the major tag to previous version
git tag -d v1
git push origin :refs/tags/v1
git tag v1 v1.2.2  # Previous good version
git push origin v1
```

### 2. Create Patch Release
```bash
# Better approach: fix and release new version
git revert <problematic-commit>
npm version patch
git push origin main --follow-tags
```

## 📊 Release Metrics

Track these metrics for releases:

- **Download counts** from GitHub releases
- **Action usage** in public repositories
- **Issue reports** after release
- **Community feedback** in discussions

---

## 🤝 Questions?

If you have questions about the release process:
- Check existing [GitHub Issues](https://github.com/ddnetters/stringly-typed/issues)
- Create a [Discussion](https://github.com/ddnetters/stringly-typed/discussions)
- Review previous releases for examples