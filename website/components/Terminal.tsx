"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Typewriter from "typewriter-effect";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "success" | "error" | "file";
}

interface TerminalProps {
  lines: TerminalLine[];
  onComplete?: () => void;
}

export default function Terminal({ lines, onComplete }: TerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Track which indices we've already processed to prevent duplicates (Strict Mode runs effects twice)
  const processedIndices = useRef<Set<number>>(new Set());
  const completionCalled = useRef(false);

  const currentLine = currentIndex < lines.length ? lines[currentIndex] : null;
  const isFinished = currentIndex >= lines.length;

  // Handle empty lines immediately
  useEffect(() => {
    if (currentLine && currentLine.text === "" && !processedIndices.current.has(currentIndex)) {
      processedIndices.current.add(currentIndex);
      setDisplayedLines((prev) => [...prev, currentLine]);
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentLine]);

  // Handle completion
  useEffect(() => {
    if (isFinished && !completionCalled.current) {
      completionCalled.current = true;
      setIsTypingComplete(true);
      onComplete?.();
    }
  }, [isFinished, onComplete]);

  const handleTypewriterComplete = useCallback(() => {
    if (currentLine && currentLine.text !== "" && !processedIndices.current.has(currentIndex)) {
      processedIndices.current.add(currentIndex);
      setDisplayedLines((prev) => [...prev, currentLine]);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 150);
    }
  }, [currentLine, currentIndex]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-[var(--warm-cream)]";
      case "success":
        return "text-[var(--mustard-gold)]";
      case "error":
        return "text-[var(--burnt-sienna)]";
      case "file":
        return "text-[var(--mustard-gold)] font-semibold";
      default:
        return "text-[var(--warm-cream)] opacity-90";
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-[#2D1F1A] px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--burnt-sienna)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--mustard-gold)]" />
          <div className="w-3 h-3 rounded-full bg-[#6B8E6B]" />
        </div>
        <span className="ml-4 text-[var(--warm-cream)] opacity-60 text-sm font-mono">
          stringly-typed
        </span>
      </div>

      {/* Terminal Body */}
      <div className="bg-[var(--chocolate-brown)] p-6 font-mono text-sm leading-relaxed h-[400px] overflow-y-auto scan-lines">
        {/* Already displayed lines */}
        {displayedLines.map((line, index) => (
          <div key={index} className={`${getLineColor(line.type)} min-h-[1.5em]`}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {/* Currently typing line (only for non-empty lines) */}
        {currentLine && currentLine.text !== "" && !processedIndices.current.has(currentIndex) && (
          <div className={getLineColor(currentLine.type)}>
            <Typewriter
              key={currentIndex}
              onInit={(typewriter) => {
                typewriter
                  .typeString(currentLine.text)
                  .callFunction(handleTypewriterComplete)
                  .start();
              }}
              options={{
                delay: currentLine.type === "command" ? 40 : 12,
                cursor: "",
              }}
            />
          </div>
        )}

        {/* Blinking cursor at the end */}
        {isFinished && (
          <div className="text-[var(--warm-cream)] mt-2">
            <span className="animate-pulse">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
