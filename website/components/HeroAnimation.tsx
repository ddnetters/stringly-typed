"use client";

import Terminal from "./Terminal";
import GitHubComment from "./GitHubComment";

// Real output from stringly-typed-demo repository
const terminalLines = [
  { text: "$ npx stringly-typed --files 'src/**/*.ts'", type: "command" as const },
  { text: "", type: "output" as const },
  { text: "\uD83C\uDFAF Stringly-Typed v1.4.14", type: "output" as const },
  { text: "\uD83D\uDCD6 Loaded style guide from STYLE_GUIDE.md", type: "output" as const },
  { text: "", type: "output" as const },
  { text: "src/bad-examples.ts", type: "file" as const },
  { text: '  Line 6: "ERROR: Persistence layer failed..."', type: "output" as const },
  { text: "  \u2717 Technical jargon, unfriendly tone", type: "error" as const },
  { text: "", type: "output" as const },
  { text: '  Line 9: "The user\'s session has been..."', type: "output" as const },
  { text: "  \u2717 Passive voice, refers to \"the user\"", type: "error" as const },
  { text: "", type: "output" as const },
  { text: "src/good-examples.ts", type: "file" as const },
  { text: '  Line 5: "Welcome back! Ready to pick up..."', type: "output" as const },
  { text: "  \u2713 Friendly, uses active voice", type: "success" as const },
  { text: "", type: "output" as const },
  { text: '  Line 11: "Your changes have been saved!"', type: "output" as const },
  { text: "  \u2713 Clear, positive confirmation", type: "success" as const },
  { text: "", type: "output" as const },
  { text: "\uD83D\uDCCA Processed 98 strings", type: "output" as const },
  { text: "\u2705 80 valid, \u274C 18 invalid", type: "output" as const },
  { text: "Status: FAILED - Found 15 critical issue(s)", type: "error" as const },
];

// Real data matching the actual GitHub PR comment format
const commentData = {
  timestamp: "2 minutes ago",
  criticalCount: 15,
  files: [
    {
      file: "src/bad-examples.ts",
      issues: [
        {
          line: 6,
          content: "ERROR: Persistence layer failed to commit trans...",
          issue: "Technical jargon, unfriendly tone",
          suggestion: "\"Something went wrong. Please try again.\"",
        },
        {
          line: 9,
          content: "The user's session has been successfully authen...",
          issue: "Passive voice, refers to \"the user\"",
          suggestion: "\"You're signed in!\"",
        },
        {
          line: 18,
          content: "WARNING: THIS ACTION CANNOT BE UNDONE. ALL DATA...",
          issue: "Aggressive caps, threatening tone",
          suggestion: "\"Are you sure? This can't be undone.\"",
        },
      ],
    },
    {
      file: "src/example-strings.ts",
      issues: [
        {
          line: 5,
          content: "ERROR: Connection was terminated by the server...",
          issue: "Technical error message",
          suggestion: "\"Connection lost. Reconnecting...\"",
        },
        {
          line: 11,
          content: "YOUR REQUEST COULD NOT BE PROCESSED AT THIS TIM...",
          issue: "All caps, passive voice",
          suggestion: "\"We couldn't complete that. Try again?\"",
        },
      ],
    },
  ],
};

export default function HeroAnimation() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start w-full max-w-6xl mx-auto">
      {/* Terminal Panel */}
      <div className="transform lg:-rotate-1">
        <Terminal lines={terminalLines} />
      </div>

      {/* GitHub Comment Panel */}
      <div className="transform lg:rotate-1">
        <GitHubComment data={commentData} />
      </div>
    </div>
  );
}
