# 📊 Changelog

All notable changes to Stringly-Typed are automatically documented here.

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Releases are automatically created when PRs with conventional commit titles are merged to main:
- `feat:` → Minor version bump (new features)
- `fix:` → Patch version bump (bug fixes) 
- `docs:`, `chore:`, `style:`, etc. → Patch version bump
- `BREAKING CHANGE` or `!` → Major version bump


## [1.5.0](https://github.com/ddnetters/stringly-typed/compare/v1.4.14...v1.5.0) (2026-01-31)

### ✨ Features

* **website:** add syntax highlighting to How It Works section ([b32741e](https://github.com/ddnetters/stringly-typed/commit/b32741ec9bbfe820f0834d910e6e0961f8e08c69))
* **website:** update hero with real GitHub Action output ([da39353](https://github.com/ddnetters/stringly-typed/commit/da39353b68e26096aa31b8f80dee7ffef50c7d14))

### 🐛 Bug Fixes

* add retry logic for malformed LLM JSON responses ([#29](https://github.com/ddnetters/stringly-typed/issues/29)) ([0b99746](https://github.com/ddnetters/stringly-typed/commit/0b997467d7ee60703c4400cf7ee0fea344b976c4)), closes [#28](https://github.com/ddnetters/stringly-typed/issues/28)

### 🎨 Styling

* use inline code blocks for filenames in quickstart steps ([b2528fc](https://github.com/ddnetters/stringly-typed/commit/b2528fcddc5b5696b572e03e31eafb333d82b83e))

## [1.4.14](https://github.com/ddnetters/stringly-typed/compare/v1.4.13...v1.4.14) (2026-01-31)

### 🐛 Bug Fixes

* add website images to git (were ignored by /public rule) ([4653135](https://github.com/ddnetters/stringly-typed/commit/4653135d2f261f7a64e976a5a30197e21189699f))
* remove catch-all rewrite that was breaking static assets ([4e72355](https://github.com/ddnetters/stringly-typed/commit/4e72355c56cac8e46b4b4ecd6cc665bd70da9438))

## [1.4.13](https://github.com/ddnetters/stringly-typed/compare/v1.4.12...v1.4.13) (2026-01-31)

### 👷 CI/CD

* add emojis to workflow names ([ef374ba](https://github.com/ddnetters/stringly-typed/commit/ef374ba55423e09433de98b5bde87e1e047088e3))

## [1.4.12](https://github.com/ddnetters/stringly-typed/compare/v1.4.11...v1.4.12) (2026-01-31)

### 👷 CI/CD

* allow manual trigger for Deploy Website workflow ([2192911](https://github.com/ddnetters/stringly-typed/commit/2192911b396667bd64b73287464edb42ef351038))

## [1.4.11](https://github.com/ddnetters/stringly-typed/compare/v1.4.10...v1.4.11) (2026-01-31)

### 🐛 Bug Fixes

* use static imports for langchain providers to fix bundling ([#27](https://github.com/ddnetters/stringly-typed/issues/27)) ([2945d74](https://github.com/ddnetters/stringly-typed/commit/2945d747678ba778502a9151bbe63e7f7cfd8325)), closes [#26](https://github.com/ddnetters/stringly-typed/issues/26)

## [1.4.10](https://github.com/ddnetters/stringly-typed/compare/v1.4.9...v1.4.10) (2026-01-31)

### 🔧 Maintenance

* **deps:** bump esbuild from 0.24.2 to 0.25.0 ([#22](https://github.com/ddnetters/stringly-typed/issues/22)) ([0db1b4d](https://github.com/ddnetters/stringly-typed/commit/0db1b4d6f71af43e5689e2846b91a010359055f7))

## [1.4.9](https://github.com/ddnetters/stringly-typed/compare/v1.4.8...v1.4.9) (2026-01-31)

### 📚 Documentation

* restructure README based on awesome-readme patterns ([#23](https://github.com/ddnetters/stringly-typed/issues/23)) ([318af24](https://github.com/ddnetters/stringly-typed/commit/318af2467810617efd271998fa969feb14eeae95)), closes [#F4E8DD](https://github.com/ddnetters/stringly-typed/issues/F4E8DD)

## [1.4.8](https://github.com/ddnetters/stringly-typed/compare/v1.4.7...v1.4.8) (2026-01-31)

### 🐛 Bug Fixes

* noCritical decider now detects error-severity violations ([98de603](https://github.com/ddnetters/stringly-typed/commit/98de603c6849ce38c974da1fd2572469be242ea8))

## [1.4.7](https://github.com/ddnetters/stringly-typed/compare/v1.4.6...v1.4.7) (2026-01-31)

### 🐛 Bug Fixes

* preserve action.yml in release branch by saving SHA before orphan ([#25](https://github.com/ddnetters/stringly-typed/issues/25)) ([44ceab6](https://github.com/ddnetters/stringly-typed/commit/44ceab63777e1387ae98015fe3d51da34dc1bce4)), closes [#24](https://github.com/ddnetters/stringly-typed/issues/24)

## [1.4.6](https://github.com/ddnetters/stringly-typed/compare/v1.4.5...v1.4.6) (2026-01-31)

### 📚 Documentation

* update Anthropic models to Claude 4.5 (Haiku, Sonnet, Opus) ([c18954e](https://github.com/ddnetters/stringly-typed/commit/c18954e2bcb35a5c120d46fe43fe32eb2a7cd815))

## [1.4.5](https://github.com/ddnetters/stringly-typed/compare/v1.4.4...v1.4.5) (2026-01-31)

### 📚 Documentation

* update providers with latest Gemini models ([0fcc9dd](https://github.com/ddnetters/stringly-typed/commit/0fcc9dd075f4d0eaebff6c9d114fe1cdb7fb9a06))

## [1.4.4](https://github.com/ddnetters/stringly-typed/compare/v1.4.3...v1.4.4) (2026-01-31)

### 📚 Documentation

* add LLM providers guide to README ([fbe2b8c](https://github.com/ddnetters/stringly-typed/commit/fbe2b8c90200765eeaf0b1811f3b1b81a886435d))

## [1.4.3](https://github.com/ddnetters/stringly-typed/compare/v1.4.2...v1.4.3) (2026-01-31)

### 🔧 Maintenance

* update website URL to stringly-typed.netters.dev ([d1d7775](https://github.com/ddnetters/stringly-typed/commit/d1d77753fcfdccc4252a3ee8373f53bf558069e0))

## [1.4.2](https://github.com/ddnetters/stringly-typed/compare/v1.4.1...v1.4.2) (2026-01-31)

### 🐛 Bug Fixes

* **ci:** properly handle JSON output in test workflow ([c4a98fa](https://github.com/ddnetters/stringly-typed/commit/c4a98fab62a63192c098b32e709e1c63496b83aa))

## [1.4.1](https://github.com/ddnetters/stringly-typed/compare/v1.4.0...v1.4.1) (2026-01-31)

### 🐛 Bug Fixes

* **ci:** require Node 20+ and use bundle instead of build ([4000e1d](https://github.com/ddnetters/stringly-typed/commit/4000e1dffa8df775d6ee320d77d70105ed61d272))

## [1.4.0](https://github.com/ddnetters/stringly-typed/compare/v1.3.0...v1.4.0) (2026-01-31)

### ✨ Features

* **website:** improve code block syntax highlighting ([4dff496](https://github.com/ddnetters/stringly-typed/commit/4dff49689d728a604ec8b7a023258ab86e29042c))

### 🐛 Bug Fixes

* bundle action with esbuild for proper dependency inclusion ([fe866de](https://github.com/ddnetters/stringly-typed/commit/fe866debbd4a0ceeb2a6d754343aba8e82710dfb))
* **website:** make doc icons visible by default ([ba18e2d](https://github.com/ddnetters/stringly-typed/commit/ba18e2d3adf7da0ac42c66f0e319f7ec35f5b217))

### 📚 Documentation

* add comprehensive LLM providers guide with quickstart examples ([125110c](https://github.com/ddnetters/stringly-typed/commit/125110cc4baa43fab3b013bb302f6805c89d7d40))

### 🔧 Maintenance

* update package-lock.json with esbuild ([25addd9](https://github.com/ddnetters/stringly-typed/commit/25addd9b0e8e93a8f3ca47d99e70d7277da52e50))

### 👷 CI/CD

* exclude website folder from auto-release triggers [skip ci] ([cde4f33](https://github.com/ddnetters/stringly-typed/commit/cde4f33120d7d80fd35281691a06f0bad78ad516))

## [1.3.0](https://github.com/ddnetters/stringly-typed/compare/v1.2.1...v1.3.0) (2026-01-30)

### ✨ Features

* **website:** add syntax highlighting to code blocks ([0118c86](https://github.com/ddnetters/stringly-typed/commit/0118c862c2ff33cfcf8cb13de136b9bae8fbdd02))

## [1.2.1](https://github.com/ddnetters/stringly-typed/compare/v1.2.0...v1.2.1) (2026-01-30)

### 🐛 Bug Fixes

* use Firebase CLI directly for WIF-based deploy ([b1cac65](https://github.com/ddnetters/stringly-typed/commit/b1cac65df3af066de1060ff40f660f046938f876))

## [1.2.0](https://github.com/ddnetters/stringly-typed/compare/v1.1.3...v1.2.0) (2026-01-30)

### ✨ Features

* add landing page website with auto-deploy ([9d42d37](https://github.com/ddnetters/stringly-typed/commit/9d42d373550f994d1cc80b2ac55eaba6b56f6d7b))

## [1.1.3](https://github.com/ddnetters/stringly-typed/compare/v1.1.2...v1.1.3) (2026-01-28)

### 👷 CI/CD

* add CodeQL security analysis workflow ([c03c39b](https://github.com/ddnetters/stringly-typed/commit/c03c39b1c3500c92aec0871fe2ba50dd389bc60f))

## [1.1.2](https://github.com/ddnetters/stringly-typed/compare/v1.1.1...v1.1.2) (2026-01-28)

### 📚 Documentation

* add Marketplace badge and fix remaining StringRay references ([2472a33](https://github.com/ddnetters/stringly-typed/commit/2472a33de05ccaeb1ee650bbf3ae6a088837f871))

## [1.1.1](https://github.com/ddnetters/stringly-typed/compare/v1.1.0...v1.1.1) (2026-01-28)

### 🐛 Bug Fixes

* update release template emoji to 🎯 and fix checker example ([4d71ad3](https://github.com/ddnetters/stringly-typed/commit/4d71ad3eda5984d43831d63bfa4e9e78ffb5900a))

## [1.1.0](https://github.com/ddnetters/stringly-typed/compare/v1.0.3...v1.1.0) (2026-01-28)

### ✨ Features

* add optional PR comments for validation results ([#20](https://github.com/ddnetters/stringly-typed/issues/20)) ([fb37c1a](https://github.com/ddnetters/stringly-typed/commit/fb37c1abeec4c455356ab56858a92cbd29b0886a))

## [1.0.3](https://github.com/ddnetters/stringly-typed/compare/v1.0.2...v1.0.3) (2026-01-28)

### 🔧 Maintenance

* rebrand from StringRay to Stringly-Typed ([#21](https://github.com/ddnetters/stringly-typed/issues/21)) ([7459713](https://github.com/ddnetters/stringly-typed/commit/7459713c01480dfd94d0379e21f39b41060c4089))

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
