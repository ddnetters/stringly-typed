interface Issue {
  file: string;
  line: number;
  original: string;
  issue: string;
}

interface CommentData {
  author: string;
  avatarUrl: string;
  timestamp: string;
  validCount: number;
  totalCount: number;
  issues: Issue[];
}

interface GitHubCommentProps {
  data: CommentData;
}

export default function GitHubComment({ data }: GitHubCommentProps) {
  const percentage = Math.round((data.validCount / data.totalCount) * 100);
  const passed = percentage >= 90;

  return (
    <div>
      {/* GitHub Comment Container */}
      <div className="bg-white rounded-lg border border-[#d0d7de] shadow-lg overflow-hidden">
        {/* Comment Header */}
        <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-4 py-3 flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[var(--chocolate-brown)] flex items-center justify-center text-white text-xs font-bold">
            ST
          </div>

          {/* Author info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#1f2328] text-sm">
              {data.author}
            </span>
            <span className="text-[#656d76] text-sm">bot</span>
            <span className="text-[#656d76] text-sm">commented {data.timestamp}</span>
          </div>
        </div>

        {/* Comment Body */}
        <div className="p-4 text-sm text-[#1f2328]">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                passed
                  ? "bg-[#dafbe1] text-[#1a7f37]"
                  : "bg-[#ffebe9] text-[#cf222e]"
              }`}
            >
              {passed ? (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                </svg>
              )}
              {passed ? "Passed" : "Failed"}
            </span>
            <span className="text-[#656d76]">
              {data.validCount}/{data.totalCount} strings valid ({percentage}%)
            </span>
          </div>

          {/* Heading */}
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--burnt-sienna)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Brand Voice Issues Found
          </h3>

          {/* Issues List */}
          <div className="space-y-3">
            {data.issues.map((issue, index) => (
              <div
                key={index}
                className="bg-[#fff8f7] border border-[#ffcecb] rounded-md p-3"
              >
                {/* File location */}
                <div className="flex items-center gap-2 text-xs text-[#656d76] mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <code className="bg-[#f6f8fa] px-1.5 py-0.5 rounded text-[#1f2328]">
                    {issue.file}:{issue.line}
                  </code>
                </div>

                {/* Original text */}
                <div className="mb-2">
                  <code className="bg-[#ffebe9] text-[#cf222e] px-2 py-1 rounded text-xs block">
                    &quot;{issue.original}&quot;
                  </code>
                </div>

                {/* Issue description */}
                <div className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--burnt-sienna)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                  <span className="text-[#1f2328]">{issue.issue}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <p className="mt-4 text-xs text-[#656d76] flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" />
            </svg>
            Configure rules in your STYLE_GUIDE.md
          </p>
        </div>
      </div>
    </div>
  );
}
