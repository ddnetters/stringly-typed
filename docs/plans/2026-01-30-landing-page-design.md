# Stringly-Typed Landing Page Design

## Progress

**Status:** Live at https://stringly-typed-4a0c8.web.app/

### Completed
- [x] Next.js 16 project setup in `website/` directory
- [x] Tailwind CSS with Soul Session color palette
- [x] Fonts configured (Righteous, Source Serif 4, JetBrains Mono)
- [x] Hero section with TypewriterJS terminal animation
- [x] GitHub PR comment component with fade-in animation
- [x] How It Works section (side-by-side workflow + result)
- [x] Quickstart section with tabbed code blocks + copy button
- [x] Documentation Links grid (6 items)
- [x] FAQ accordion (5 objection-handling questions)
- [x] Why We Built This quote section
- [x] Footer with CTA + navigation
- [x] Firebase Hosting deployment
- [x] GitHub README updated with website badge
- [x] GitHub Action published on Marketplace

### Pending
- [ ] Add `FIREBASE_SERVICE_ACCOUNT` secret for auto-deploy (run `firebase init hosting:github`)
- [ ] Purchase custom domain (`stringlytyped.dev`)
- [ ] Add custom domain to Firebase Hosting
- [ ] Google Analytics + Search Console setup
- [ ] OG image for social sharing
- [ ] Product Hunt listing (optional)

### Auto-Deploy Setup
GitHub Actions workflow created at `.github/workflows/deploy-website.yml`. To enable:
```bash
cd website
firebase init hosting:github
```
This will create the `FIREBASE_SERVICE_ACCOUNT` secret automatically.

---

## Overview

A landing page for Stringly-Typed, an AI-powered brand voice validation GitHub Action. The page serves a hybrid purpose: drive adoption (get developers to install) and build awareness (explain the value proposition).

**Live URL:** https://stringly-typed-4a0c8.web.app/
**Future URL:** `stringlytyped.dev` (when purchased)

---

## Conversion Strategy

### Primary Goals (in order)
1. **Install** — Get developers to add the GitHub Action
2. **Star** — Micro-commitment that builds social proof
3. **Subscribe** — Capture email for those not ready to install

### Psychology Principles Applied

| Principle | Application |
|-----------|-------------|
| Social Proof | GitHub stars badge, user count, testimonials |
| Loss Aversion | Frame around "shipping off-brand copy" risk |
| Activation Energy | Copy-paste code, "2 minutes to setup" |
| Foot-in-the-Door | Star → Subscribe → Install progression |
| Authority | MIT license, familiar workflow syntax |
| Objection Handling | FAQ addresses cost, speed, accuracy concerns |

### Conversion Paths

```
High Intent:    Visit → Hero CTA → Install
Medium Intent:  Visit → Read → Star on GitHub → Eventually install
```

---

## Aesthetic Direction: "Soul Session"

Inspired by 1970s soul/R&B album art and recording studios. Warm, analog, human — fitting for a "brand voice" tool.

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Burnt Sienna | `#C45D3E` | Primary CTAs, accents, errors |
| Mustard Gold | `#D4A853` | Highlights, hover states, success |
| Warm Cream | `#F5EDE4` | Main background |
| Chocolate Brown | `#3D2B23` | Text, code blocks |
| Deep Burgundy | `#8B3A3A` | Links, subtle accents |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Display/Headlines | Righteous or similar groovy display font | 400-700 |
| Body | Source Serif 4 or Lora | 400-600 |
| Code | JetBrains Mono | 400 |

### Textures & Effects

- Subtle film grain overlay (CSS noise texture)
- Soft, warm shadows (no harsh drop shadows)
- Slightly rounded corners
- Code blocks with vintage terminal aesthetic (subtle scan lines)

---

## Page Sections

### 1. Hero

**Layout:** Asymmetric split. Left: headline + CTAs + social proof. Right: stylized terminal output.

**Content:**
- **Headline:** "Every PR is a chance to ship off-brand copy. Stop it automatically."
- **Subhead:** "AI-powered brand voice checks in your GitHub workflow. Catch tone issues before they merge."
- **Primary CTA:** "Get Started" → links to quickstart/docs
- **Secondary CTA:** "Star on GitHub" → repo link (micro-commitment, builds social proof)
- **Social Proof Strip:** GitHub stars badge + "Used by X developers" (once available)

**Copy Rationale:**
- Headline uses loss aversion ("chance to ship off-brand") rather than passive benefit
- Subhead is tighter, action-oriented
- "Star on GitHub" converts browsers into engaged users via foot-in-the-door

**Visual:**
- Stylized PR comment output showing Stringly-Typed results
- Warm cream background with scan lines
- Checkmarks in mustard gold, failures in burnt sienna
- Panel slightly rotated (2-3°) with soft shadow
- Subtle sound wave patterns in background (nodding to "voice")
- GitHub stars badge prominently displayed

### 2. How It Works

**Layout:** Side-by-side split (stacks on mobile).

**Left Panel: "Your workflow"**
```yaml
# .github/workflows/stringly-typed.yml
name: Stringly-Typed
on: [push, pull_request]

jobs:
  brand-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ddnetters/stringly-typed@v1
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{ts,tsx}'
          checker: 'brand_style'
          style-guide-file: 'STYLE_GUIDE.md'
```

**Right Panel: "PR feedback"**
- Styled GitHub PR comment from stringly-typed bot
- Validation results with checkmarks and X marks
- Summary line showing pass/fail ratio

**Visual Treatment:**
- Left: chocolate brown background, cream text (dark terminal)
- Right: cream background, chocolate text (GitHub-style, warmed up)
- Arrow icon (`bi-arrow-right`) connecting panels

### 3. Installation / Quickstart

**Layout:** Centered section with tabbed code block.

**Intro:** "Get started in under 2 minutes"

**Tabs:**
1. `STYLE_GUIDE.md` — Example brand voice rules
2. `.github/workflows/stringly-typed.yml` — Workflow config

**Features:**
- Copy button on each tab (`bi-clipboard` → `bi-clipboard-check`)
- Active tab in burnt sienna, inactive in muted brown
- Chocolate brown code block with cream text
- Subtle scan lines texture

### 4. Documentation Links

**Layout:** 2-3 column grid near footer.

**Header:** "Explore the docs"

**Links:**

| Icon | Title | Destination |
|------|-------|-------------|
| `bi-download` | Installation | docs/installation.md |
| `bi-sliders` | Configuration | docs/configuration.md |
| `bi-check2-circle` | Checkers | docs/checkers.md |
| `bi-signpost-split` | Deciders | docs/deciders.md |
| `bi-code-square` | Examples | docs/examples.md |
| `bi-book` | API Reference | docs/api.md |

**Visual:**
- Minimal pill-style buttons or list items
- Icons in mustard gold, text in chocolate brown
- Hover: cream background, burnt sienna text

### 5. Why We Built This

**Layout:** Centered text block with subtle background treatment.

**Content:**
> "We got tired of shipping copy that didn't match our style guide. Manual reviews were slow and inconsistent. So we automated the whole thing."

**Purpose:**
- Creates relatability (Liking/Similarity Bias)
- Signals "built by developers for developers"
- Brief — doesn't distract from conversion

**Visual:**
- Slightly darker cream background
- Pull quote styling with burgundy left border
- Optional: small avatar/name of creator

---

### 6. FAQ / Objection Handling

**Layout:** Accordion or simple Q&A list.

**Header:** "Common questions"

**Questions:**

| Question | Answer |
|----------|--------|
| Will this slow down my CI? | Checks run in ~2-5 seconds. We only analyze changed files, not your entire codebase. |
| How much does the AI cost? | You use your own OpenAI API key. Typical PR check costs $0.01-0.05 depending on content volume. |
| What if it flags false positives? | Configure sensitivity in your style guide. You can also set it to "warn" mode instead of blocking merges. |
| Does it work with my stack? | Works with any text files — TypeScript, JavaScript, Markdown, JSON, YAML. Configure file patterns to match your project. |
| Is my code sent to OpenAI? | Only the text strings you specify are analyzed. Source code logic is never sent. |

**Visual:**
- Chocolate brown text on warm cream
- Subtle dividers between Q&A pairs
- Expandable accordions (optional)

---

### 7. Footer

- MIT License badge
- GitHub link (`bi-github`)
- "Made by ddnetters"
- Email signup link (if user scrolled past section 7)

---

## Technical Implementation

### Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + CSS variables
- **Icons:** bootstrap-icons (npm)
- **Fonts:** Google Fonts
- **Deployment:** Firebase Hosting (static export)

### SEO

- Next.js metadata API (title, description, OG, Twitter cards)
- Semantic HTML structure
- Proper heading hierarchy
- `robots.txt` and `sitemap.xml` at build
- JSON-LD structured data

### Analytics & Tracking

- Google Analytics 4 via Next.js Script component
- Google Search Console verification
- Event tracking: CTA clicks, copy buttons, doc links

### Performance

- Static export (`output: 'export'`)
- Next.js Image optimization
- CSS-based grain texture (lightweight)
- Font preloading with display swap

### Project Structure

```
website/
├── app/
│   ├── layout.tsx      # Root layout, fonts, analytics
│   ├── page.tsx        # Landing page
│   └── globals.css     # Tailwind + custom styles
├── components/
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── Quickstart.tsx
│   ├── DocsLinks.tsx
│   ├── WhyWeBuiltThis.tsx
│   ├── FAQ.tsx
│   ├── GitHubStars.tsx   # Dynamic stars badge
│   └── Footer.tsx
├── public/
│   └── (favicon, OG image)
├── firebase.json
└── next.config.js
```

---

## Domain Recommendation

**Primary:** `stringlytyped.dev` (~$12/year)
- Exact brand match
- `.dev` signals developer tool
- HTTPS-only (Google-owned TLD)
- SEO-friendly

**Alternative:** `stringly.dev` (shorter, punchier)

---

## Next Steps

### Phase 1: Foundation
1. Set up Next.js project in `website/` directory
2. Configure Tailwind with custom color palette
3. Install dependencies (bootstrap-icons, fonts)
4. Purchase and connect domain

### Phase 2: Core Components
5. Build Hero with GitHub stars badge
6. Build How It Works section
7. Build Quickstart with tabbed code blocks
8. Build Documentation Links grid

### Phase 3: Conversion Elements
9. Build "Why We Built This" section
10. Build FAQ accordion
11. Build Footer

### Phase 4: Infrastructure
12. Set up Firebase Hosting
13. Configure Google Analytics + Search Console
14. Test all conversion paths

### Phase 5: Launch Prep
15. Create OG image for social sharing
16. Write launch announcement content (see traffic plan)
17. Prepare Product Hunt listing assets
18. Line up initial testimonials/quotes from beta users
