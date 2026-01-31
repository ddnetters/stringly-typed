"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { getConsentStatus } from "./CookieConsent";

/**
 * Track external link clicks, especially GitHub CTAs
 */
function useExternalLinkTracking() {
  useEffect(() => {
    if (getConsentStatus() !== "granted") return;

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("http")) return;

      const isGitHub = href.includes("github.com");
      const linkText = link.textContent?.trim() || "";

      posthog.capture("external_link_click", {
        url: href,
        text: linkText,
        is_github: isGitHub,
        is_cta: link.classList.contains("rounded-full"), // CTAs have rounded-full class
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

/**
 * Track which sections users view (engagement funnel)
 */
function useSectionVisibilityTracking() {
  useEffect(() => {
    if (getConsentStatus() !== "granted") return;
    if (typeof IntersectionObserver === "undefined") return;

    const sections = [
      { id: "hero", selector: "section:first-of-type" },
      { id: "how-it-works", selector: "#how-it-works, section:nth-of-type(2)" },
      { id: "quickstart", selector: "#quickstart, section:nth-of-type(3)" },
      { id: "docs", selector: "#docs, section:nth-of-type(4)" },
      { id: "faq", selector: "#faq, section:nth-of-type(5)" },
      { id: "why-we-built", selector: "#why-we-built, section:nth-of-type(6)" },
      { id: "footer", selector: "footer" },
    ];

    const viewedSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section");
            if (sectionId && !viewedSections.has(sectionId)) {
              viewedSections.add(sectionId);
              posthog.capture("section_viewed", { section: sectionId });
            }
          }
        });
      },
      { threshold: 0.3 } // 30% visible
    );

    sections.forEach(({ id, selector }) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute("data-section", id);
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);
}

/**
 * Track code snippet copies
 */
function useCodeCopyTracking() {
  useEffect(() => {
    if (getConsentStatus() !== "granted") return;

    const handleCopy = () => {
      const selection = window.getSelection()?.toString() || "";

      // Check if copied text looks like code (contains typical code patterns)
      const looksLikeCode =
        selection.includes("npm") ||
        selection.includes("npx") ||
        selection.includes("yarn") ||
        selection.includes("uses:") ||
        selection.includes("STYLE_GUIDE") ||
        selection.includes(".yml") ||
        selection.includes(".yaml") ||
        selection.length > 50;

      if (looksLikeCode && selection.length > 10) {
        posthog.capture("code_copied", {
          length: selection.length,
          preview: selection.slice(0, 100),
        });
      }
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, []);
}

/**
 * Track time to first CTA click
 */
function useTimeToCtaTracking() {
  useEffect(() => {
    if (getConsentStatus() !== "granted") return;

    const startTime = Date.now();
    let tracked = false;

    const handleClick = (e: MouseEvent) => {
      if (tracked) return;

      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (href?.includes("github.com")) {
        tracked = true;
        const timeToClick = Math.round((Date.now() - startTime) / 1000);
        posthog.capture("time_to_github_click", {
          seconds: timeToClick,
          cta_text: link.textContent?.trim(),
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

/**
 * Main Analytics component - renders nothing, just sets up tracking
 */
export function Analytics() {
  useExternalLinkTracking();
  useSectionVisibilityTracking();
  useCodeCopyTracking();
  useTimeToCtaTracking();

  return null;
}
