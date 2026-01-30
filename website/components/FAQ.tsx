"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How much does it cost?",
    answer:
      "Stringly-Typed is completely free and open source. You only pay for your own OpenAI API usage, which is typically pennies per PR depending on your codebase size.",
  },
  {
    question: "Will it slow down my CI pipeline?",
    answer:
      "No. Stringly-Typed runs in parallel with your other checks and typically completes in under 30 seconds. It only scans files that changed in the PR, not your entire codebase.",
  },
  {
    question: "Can I customize what it checks?",
    answer:
      "Yes. You define your own style guide in Markdown, and you can use built-in checkers (brand_style, char_count) or write custom checkers. You also control the pass/fail threshold.",
  },
  {
    question: "Does it support languages other than TypeScript?",
    answer:
      "Yes. Stringly-Typed extracts user-facing strings from any file type you configure. It works with JS, TS, TSX, JSX, Vue, Svelte, and more.",
  },
  {
    question: "What if it flags something incorrectly?",
    answer:
      "You can add inline comments to skip specific strings, or adjust your style guide to be more specific. The threshold decider also lets you allow a certain number of issues before failing.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-20 bg-[var(--warm-cream)]">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <h2 className="font-[family-name:var(--font-righteous)] text-3xl md:text-4xl text-[var(--chocolate-brown)] text-center mb-4">
          Common Questions
        </h2>
        <p className="text-center text-[var(--chocolate-brown)] opacity-70 mb-10">
          Everything you need to know before getting started.
        </p>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[var(--chocolate-brown)] border-opacity-20 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-[#F5EDE4] transition-colors"
              >
                <span className="font-semibold text-[var(--chocolate-brown)]">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[var(--chocolate-brown)] transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-[var(--chocolate-brown)] border-opacity-10">
                  <p className="text-[var(--chocolate-brown)] opacity-80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
