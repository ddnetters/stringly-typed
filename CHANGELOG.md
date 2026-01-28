# 📊 Changelog

All notable changes to Stringly-Typed are automatically documented here.

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases are automatically created when PRs with conventional commit titles are merged to main:
- `feat:` → Minor version bump (new features)
- `fix:` → Patch version bump (bug fixes) 
- `docs:`, `chore:`, `style:`, etc. → Patch version bump
- `BREAKING CHANGE` or `!` → Major version bump


## [1.0.2](https://github.com/ddnetters/stringly-typed/compare/v1.0.1...v1.0.2) (2026-01-28)

### 📚 Documentation

* streamline README for faster developer onboarding ([#19](https://github.com/ddnetters/stringly-typed/issues/19)) ([11685df](https://github.com/ddnetters/stringly-typed/commit/11685df672636b2093dc0d65e19dcdcbd6b607fb))

## [1.0.1](https://github.com/ddnetters/stringly-typed/compare/v1.0.0...v1.0.1) (2026-01-28)

### ♻️ Refactoring

* remove Grammar Checker ([#18](https://github.com/ddnetters/stringly-typed/issues/18)) ([3b9b86c](https://github.com/ddnetters/stringly-typed/commit/3b9b86ccdf2118ab00418aa3d8a83f1eaa4511b6))

## 1.0.0 (2026-01-28)

### ✨ Features

* use release branch pattern for dist folder ([b0b620a](https://github.com/ddnetters/stringly-typed/commit/b0b620a7a92ae9d5c75636585b29f05c17e5ae78))

### 🔧 Maintenance

* **deps:** bump langchain from 1.2.14 to 1.2.15 ([#17](https://github.com/ddnetters/stringly-typed/issues/17)) ([8e6fb88](https://github.com/ddnetters/stringly-typed/commit/8e6fb8836c6f9c29e9f3d0188e45fef74f210dfc))
* **deps:** bump zod from 3.25.76 to 4.3.6 ([#16](https://github.com/ddnetters/stringly-typed/issues/16)) ([e61af8d](https://github.com/ddnetters/stringly-typed/commit/e61af8d07b9540c984b1b1e27c8bbc596219bb68))
* **deps:** configure dependabot to use semver PR titles ([#15](https://github.com/ddnetters/stringly-typed/issues/15)) ([c37215e](https://github.com/ddnetters/stringly-typed/commit/c37215eda60a8bd421e904cc8f30bd8d4af597e1))
* upgrade to ESLint 9 and typescript-eslint v8 ([#14](https://github.com/ddnetters/stringly-typed/issues/14)) ([f109891](https://github.com/ddnetters/stringly-typed/commit/f109891629eba5e0e039471d19cd360fecba9e55))

### 👷 CI/CD

* add manual trigger to auto-release workflow ([c199a99](https://github.com/ddnetters/stringly-typed/commit/c199a99dc18a9d28bde9ac2ba974e6e65e2f2cf7))
* add semantic PR title validation ([0e8e4c3](https://github.com/ddnetters/stringly-typed/commit/0e8e4c3862503051b68bff10a1517be107ea6ed9))
* run semantic-release directly via npm instead of action ([795fa11](https://github.com/ddnetters/stringly-typed/commit/795fa117f3a821829b0f4543c13bc9f750c268c1))
* use GH_TOKEN for semantic-release to bypass branch protection ([f9bd553](https://github.com/ddnetters/stringly-typed/commit/f9bd553a00976936012e6a2d4b5d8aae103a6c3e))

## [Unreleased]

Changes that have been merged to main but not yet released.

---

## [1.0.0] - 2024-01-15

### 🎉 Initial Release

- ✨ Core string extraction from JS/TS/MD/JSON files
- 🔤 Grammar checker with spelling error detection
- 📏 Character count checker with configurable limits
- ⚡ Custom checker with JavaScript validation logic
- 🎯 Threshold decider for percentage-based validation
- 🚨 No-critical decider for zero-tolerance validation
- 🧠 Custom decider with JavaScript decision logic
- 📋 Complete GitHub Action integration
- 🧪 100% test coverage
- 📚 Full documentation

---

*This changelog is automatically updated when PRs are merged to main.*
