"use client";

import { useState } from "react";

interface Issue {
  line: number;
  content: string;
  issue: string;
  suggestion: string;
}

interface FileIssues {
  file: string;
  issues: Issue[];
}

interface CommentData {
  timestamp: string;
  criticalCount: number;
  files: FileIssues[];
}

interface GitHubCommentProps {
  data: CommentData;
}

export default function GitHubComment({ data }: GitHubCommentProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(
    new Set([data.files[0]?.file])
  );

  const toggleFile = (file: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      return next;
    });
  };

  return (
    <div>
      {/* GitHub Comment Container */}
      <div className="bg-[#0d1117] rounded-lg border border-[#30363d] shadow-lg overflow-hidden">
        {/* Comment Header */}
        <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-3 flex items-center gap-3">
          {/* GitHub Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#21262d] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#8b949e]" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
          </div>

          {/* Author info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#e6edf3] text-sm">
              github-actions
            </span>
            <span className="text-[#8b949e] text-xs bg-[#30363d] px-1.5 py-0.5 rounded-full border border-[#30363d]">
              bot
            </span>
            <span className="text-[#8b949e] text-sm">
              commented {data.timestamp}
            </span>
          </div>
        </div>

        {/* Comment Body */}
        <div className="p-4 text-sm text-[#e6edf3]">
          {/* Title */}
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span>
            Stringly-Typed Results
          </h2>

          {/* Status */}
          <p className="mb-4">
            <span className="text-[#f85149]">❌</span>{" "}
            <strong>Failed:</strong> Found {data.criticalCount} critical issue(s)
          </p>

          {/* Issues Found Header */}
          <h3 className="font-semibold text-base mb-3">Issues Found</h3>

          {/* Collapsible File Sections */}
          <div className="space-y-2">
            {data.files.map((fileData) => (
              <div key={fileData.file}>
                {/* Details Summary */}
                <button
                  onClick={() => toggleFile(fileData.file)}
                  className="flex items-center gap-2 text-[#e6edf3] hover:text-[#58a6ff] transition-colors w-full text-left"
                >
                  <span
                    className={`transition-transform ${
                      expandedFiles.has(fileData.file) ? "rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  <code className="bg-[#343941] px-1.5 py-0.5 rounded text-[#e6edf3] text-xs">
                    {fileData.file}
                  </code>
                  <span className="text-[#8b949e]">
                    ({fileData.issues.length} issues)
                  </span>
                </button>

                {/* Expanded Table */}
                {expandedFiles.has(fileData.file) && (
                  <div className="mt-2 ml-4 overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#30363d]">
                          <th className="text-left py-2 px-3 text-[#8b949e] font-medium">
                            Line
                          </th>
                          <th className="text-left py-2 px-3 text-[#8b949e] font-medium">
                            Content
                          </th>
                          <th className="text-left py-2 px-3 text-[#8b949e] font-medium">
                            Issue
                          </th>
                          <th className="text-left py-2 px-3 text-[#8b949e] font-medium">
                            Suggestion
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fileData.issues.map((issue, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-[#21262d] hover:bg-[#161b22]"
                          >
                            <td className="py-2 px-3 text-[#e6edf3]">
                              {issue.line}
                            </td>
                            <td className="py-2 px-3">
                              <code className="bg-[#343941] px-1.5 py-0.5 rounded text-[#e6edf3] text-xs">
                                {issue.content}
                              </code>
                            </td>
                            <td className="py-2 px-3 text-[#e6edf3]">
                              {issue.issue}
                            </td>
                            <td className="py-2 px-3 text-[#58a6ff]">
                              {issue.suggestion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-[#30363d]">
            <p className="text-xs text-[#8b949e] flex items-center gap-1">
              <span>🎯</span>
              <span>Posted by</span>
              <a href="#" className="text-[#58a6ff] hover:underline">
                Stringly-Typed
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
