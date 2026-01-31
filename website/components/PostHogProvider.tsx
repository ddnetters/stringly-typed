"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState, useRef } from "react";
import { CookieConsent, getConsentStatus, type ConsentStatus } from "./CookieConsent";
import { Analytics } from "./Analytics";

function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    !posthog.__loaded
  ) {
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
}

function useScrollDepthTracking(enabled: boolean) {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      const thresholds = [25, 50, 75, 100];

      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !trackedDepths.current.has(threshold)) {
          trackedDepths.current.add(threshold);
          posthog.capture("scroll_depth", { depth: threshold });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled]);
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");

  // Track scroll depth when consent is granted
  useScrollDepthTracking(consentStatus === "granted");

  useEffect(() => {
    const status = getConsentStatus();
    setConsentStatus(status);

    // Initialize PostHog only if consent was previously granted
    if (status === "granted") {
      initPostHog();
    }
  }, []);

  const handleConsentChange = (status: ConsentStatus) => {
    setConsentStatus(status);
    if (status === "granted") {
      initPostHog();
      // Capture the initial pageview now that we have consent
      posthog.capture("$pageview");
    }
  };

  // If no API key, just render children without analytics
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      {children}
      {consentStatus === "granted" && <Analytics />}
      <CookieConsent onConsentChange={handleConsentChange} />
    </PHProvider>
  );
}
