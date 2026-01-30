"use client";

export default function HowItWorks() {
  const workflowCode = `# .github/workflows/stringly-typed.yml
name: Stringly-Typed
on: [push, pull_request]

jobs:
  brand-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ddnetters/stringly-typed@v1
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
        with:
          files: 'src/**/*.{ts,tsx}'
          checker: 'brand_style'
          style-guide-file: 'STYLE_GUIDE.md'`;

  return (
    <section className="px-6 py-20 bg-[var(--warm-cream)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 className="font-[family-name:var(--font-righteous)] text-3xl md:text-4xl text-[var(--chocolate-brown)] text-center mb-4">
          How It Works
        </h2>
        <p className="text-center text-[var(--chocolate-brown)] opacity-70 mb-12 max-w-2xl mx-auto">
          Add one workflow file. Define your brand voice. Every PR gets checked automatically.
        </p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Workflow Code */}
          <div className="relative">
            <div className="absolute -top-3 left-4 bg-[var(--mustard-gold)] text-[var(--chocolate-brown)] text-xs font-semibold px-3 py-1 rounded-full">
              1. Add workflow
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <div className="bg-[#2D1F1A] px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--burnt-sienna)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--mustard-gold)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6B8E6B]" />
                </div>
                <span className="ml-3 text-[var(--warm-cream)] opacity-50 text-xs font-mono">
                  stringly-typed.yml
                </span>
              </div>
              <pre className="bg-[var(--chocolate-brown)] p-4 text-sm font-mono text-[var(--warm-cream)] overflow-x-auto leading-relaxed">
                <code>{workflowCode}</code>
              </pre>
            </div>
          </div>

          {/* Arrow (hidden on mobile) */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-[var(--burnt-sienna)] rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

          {/* Right: Result */}
          <div className="relative">
            <div className="absolute -top-3 left-4 bg-[var(--mustard-gold)] text-[var(--chocolate-brown)] text-xs font-semibold px-3 py-1 rounded-full">
              2. Get feedback
            </div>
            <div className="bg-white rounded-lg border border-[#d0d7de] shadow-xl overflow-hidden">
              {/* Comment Header */}
              <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--chocolate-brown)] flex items-center justify-center text-white text-xs font-bold">
                  ST
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1f2328] text-sm">stringly-typed</span>
                  <span className="text-[#656d76] text-xs">bot</span>
                </div>
              </div>

              {/* Comment Body */}
              <div className="p-4 text-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#dafbe1] text-[#1a7f37]">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                    Passed
                  </span>
                  <span className="text-[#656d76] text-xs">12/12 strings valid</span>
                </div>

                <div className="space-y-2 text-[#1f2328]">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1a7f37]" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                    <span className="text-sm">All strings match your brand voice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1a7f37]" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                    <span className="text-sm">Consistent terminology throughout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1a7f37]" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                    </svg>
                    <span className="text-sm">Active voice used correctly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
