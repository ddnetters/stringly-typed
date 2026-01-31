"use client";

import { useState } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";

// Custom theme matching site colors
const customTheme: PrismTheme = {
  plain: {
    color: "#F5F0E8", // warm cream
    backgroundColor: "#3D2B1F", // chocolate brown
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#A89F91", fontStyle: "italic" as const },
    },
    {
      types: ["punctuation"],
      style: { color: "#D4A574" }, // muted gold
    },
    {
      types: ["property", "tag", "boolean", "number", "constant", "symbol"],
      style: { color: "#E8B87D" }, // mustard gold
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: { color: "#E07B5E" }, // burnt sienna / coral
    },
    {
      types: ["atrule", "attr-value", "keyword"],
      style: { color: "#8ECAE6" }, // soft blue
    },
    {
      types: ["function", "class-name"],
      style: { color: "#F4D35E" }, // bright gold
    },
    {
      types: ["regex", "important", "variable"],
      style: { color: "#95D5B2" }, // mint green
    },
    {
      types: ["title"],
      style: { color: "#F4D35E", fontWeight: "bold" as const }, // headers in gold
    },
    {
      types: ["bold"],
      style: { fontWeight: "bold" as const },
    },
    {
      types: ["italic"],
      style: { fontStyle: "italic" as const },
    },
  ],
};

const tabs = [
  {
    id: "style-guide",
    label: "STYLE_GUIDE.md",
    language: "markdown",
    code: `# Brand Voice

## Tone
- Use active voice, not passive
- Be friendly but professional
- Keep sentences under 20 words

## Terminology
- Say "customers" not "users"
- Say "Select" not "Click"
- Say "dashboard" not "admin panel"

## Avoid
- Jargon and buzzwords
- Exclamation marks (except celebrations)
- ALL CAPS for emphasis`,
  },
  {
    id: "workflow",
    label: "stringly-typed.yml",
    language: "yaml",
    code: `name: Stringly-Typed
on: [push, pull_request]

jobs:
  brand-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ddnetters/stringly-typed@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{ts,tsx}'
          checker: 'brand_style'
          style-guide-file: 'STYLE_GUIDE.md'`,
  },
];

export default function Quickstart() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);

  const activeContent = tabs.find((t) => t.id === activeTab);

  const handleCopy = async () => {
    if (activeContent) {
      await navigator.clipboard.writeText(activeContent.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="px-6 py-20 bg-[#EDE5DC]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <h2 className="font-[family-name:var(--font-righteous)] text-3xl md:text-4xl text-[var(--chocolate-brown)] text-center mb-4">
          Get Started in 2 Minutes
        </h2>
        <p className="text-center text-[var(--chocolate-brown)] opacity-70 mb-10 max-w-xl mx-auto">
          Two files. That&apos;s all you need. Define your brand voice, add the workflow, done.
        </p>

        {/* Tabbed Code Block */}
        <div className="rounded-lg overflow-hidden shadow-xl">
          {/* Tab Headers */}
          <div className="bg-[#2D1F1A] px-4 py-2 flex items-center justify-between">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-mono rounded-t transition-colors ${
                    activeTab === tab.id
                      ? "bg-[var(--chocolate-brown)] text-[var(--warm-cream)]"
                      : "text-[var(--warm-cream)] opacity-50 hover:opacity-80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--warm-cream)] opacity-70 hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          {activeContent && (
            <Highlight
              theme={customTheme}
              code={activeContent.code}
              language={activeContent.language as "yaml" | "markdown"}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} p-6 text-sm font-mono overflow-x-auto leading-relaxed max-h-[400px] overflow-y-auto scan-lines`}
                  style={style}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          )}
        </div>

        {/* Step indicator */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[var(--chocolate-brown)]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--burnt-sienna)] text-white flex items-center justify-center text-xs font-bold">1</span>
            <span>Add <code className="bg-[var(--chocolate-brown)] text-[var(--warm-cream)] px-1.5 py-0.5 rounded text-xs font-mono">STYLE_GUIDE.md</code> to your repo</span>
          </div>
          <svg className="w-4 h-4 hidden sm:block opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--burnt-sienna)] text-white flex items-center justify-center text-xs font-bold">2</span>
            <span>Add workflow to <code className="bg-[var(--chocolate-brown)] text-[var(--warm-cream)] px-1.5 py-0.5 rounded text-xs font-mono">.github/workflows/</code></span>
          </div>
          <svg className="w-4 h-4 hidden sm:block opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--mustard-gold)] text-[var(--chocolate-brown)] flex items-center justify-center text-xs font-bold">✓</span>
            <span>Push and you&apos;re done!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
