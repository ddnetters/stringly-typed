"use client";

import Terminal from "./Terminal";
import GitHubComment from "./GitHubComment";

// Sample data - replace with actual output from running the action
const terminalLines = [
  { text: "$ stringly-typed --files 'src/**/*.tsx'", type: "command" as const },
  { text: "", type: "output" as const },
  { text: "Stringly-Typed v1.0.0", type: "output" as const },
  { text: "Scanning files...", type: "output" as const },
  { text: "", type: "output" as const },
  { text: "src/components/Button.tsx", type: "file" as const },
  { text: '  Line 12: "Click here to continue"', type: "output" as const },
  { text: "  \u2717 Use \"Select\" not \"Click\" (terminology)", type: "error" as const },
  { text: "", type: "output" as const },
  { text: '  Line 18: "Your order has been placed"', type: "output" as const },
  { text: "  \u2713 Matches brand voice", type: "success" as const },
  { text: "", type: "output" as const },
  { text: "src/utils/errors.ts", type: "file" as const },
  { text: '  Line 5: "An error was encountered by the system"', type: "output" as const },
  { text: "  \u2717 Use active voice: \"Something went wrong\"", type: "error" as const },
  { text: "", type: "output" as const },
  { text: "Summary: 4/6 strings valid (67%)", type: "output" as const },
  { text: "Status: FAILED", type: "error" as const },
];

const commentData = {
  author: "stringly-typed",
  avatarUrl: "/stringly-typed-avatar.svg",
  timestamp: "just now",
  validCount: 4,
  totalCount: 6,
  issues: [
    {
      file: "src/components/Button.tsx",
      line: 12,
      original: "Click here to continue",
      issue: 'Use "Select" not "Click" (terminology)',
    },
    {
      file: "src/utils/errors.ts",
      line: 5,
      original: "An error was encountered by the system",
      issue: 'Use active voice: "Something went wrong"',
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
