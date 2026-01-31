"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { CookieConsent, getConsentStatus, type ConsentStatus } from "./CookieConsent";
import dynamic from "next/dynamic";

// Dynamically import Analytics to reduce initial bundle
const Analytics = dynamic(() => import("./Analytics").then(mod => ({ default: mod.Analytics })), {
  ssr: false,
});

// PostHog instance reference (loaded dynamically)
let posthogInstance: typeof import("posthog-js").default | null = null;

async function initPostHog() {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return null;
  }

  // Dynamically import posthog-js only when needed
  const posthog = (await import("posthog-js")).default;

  if (!posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage+cookie",
      respect_dnt: true,
      opt_out_capturing_by_default: false,
    });
  }

  posthogInstance = posthog;
  return posthog;
}

function useScrollDepthTracking(enabled: boolean) {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !posthogInstance) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      const thresholds = [25, 50, 75, 100];

      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !trackedDepths.current.has(threshold)) {
          trackedDepths.current.add(threshold);
          posthogInstance?.capture("scroll_depth", { depth: threshold });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");
  const [isPostHogReady, setIsPostHogReady] = useState(false);

  // Track scroll depth when consent is granted and PostHog is ready
  useScrollDepthTracking(consentStatus === "granted" && isPostHogReady);

  useEffect(() => {
    const status = getConsentStatus();
    setConsentStatus(status);

    // Initialize PostHog only if consent was previously granted
    if (status === "granted") {
      initPostHog().then((ph) => {
        if (ph) setIsPostHogReady(true);
      });
    }
  }, []);

  const handleConsentChange = useCallback((status: ConsentStatus) => {
    setConsentStatus(status);
    if (status === "granted") {
      initPostHog().then((ph) => {
        if (ph) {
          setIsPostHogReady(true);
          // Capture the initial pageview now that we have consent
          ph.capture("$pageview");
        }
      });
    }
  }, []);

  // If no API key, just render children without analytics
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  // Render without PHProvider until PostHog is ready
  if (!isPostHogReady || !posthogInstance) {
    return (
      <>
        {children}
        <CookieConsent onConsentChange={handleConsentChange} />
      </>
    );
  }

  return (
    <PHProvider client={posthogInstance}>
      {children}
      {consentStatus === "granted" && <Analytics />}
      <CookieConsent onConsentChange={handleConsentChange} />
    </PHProvider>
  );
}
