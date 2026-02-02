import dynamic from "next/dynamic";
import HeroAnimation from "@/components/HeroAnimation";
import HowItWorks from "@/components/HowItWorks";
import Quickstart from "@/components/Quickstart";
import DocsLinks from "@/components/DocsLinks";

// Lazy load below-the-fold components to reduce initial bundle size
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <div className="min-h-[400px]" />,
});
const WhyWeBuiltThis = dynamic(() => import("@/components/WhyWeBuiltThis"), {
  loading: () => <div className="min-h-[200px]" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[100px]" />,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--warm-cream)]">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-12 lg:mb-16">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/images/stringly-typed-logo-v2-b.webp"
                alt="Stringly-Typed"
                width={469}
                height={256}
                className="h-24 md:h-32 w-auto"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <h1
              className="font-[family-name:var(--font-righteous)] text-4xl md:text-5xl lg:text-6xl text-[var(--chocolate-brown)] mb-6 leading-tight"
            >
              Every PR is a chance to ship off-brand copy.
              <br />
              <span className="text-[var(--burnt-sienna)]">Catch it automatically.</span>
            </h1>

            <p className="font-[family-name:var(--font-source-serif)] text-lg md:text-xl text-[var(--chocolate-brown)] opacity-80 max-w-2xl mx-auto mb-8">
              AI-powered brand voice checks in your GitHub workflow.
              Catch tone violations before they merge.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/ddnetters/stringly-typed#quickstart"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--burnt-sienna)] text-white font-semibold text-lg transition-all hover:bg-[#A84D32] hover:shadow-lg"
              >
                Get Started
              </a>
              <a
                href="https://github.com/ddnetters/stringly-typed"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-[var(--chocolate-brown)] text-[var(--chocolate-brown)] font-semibold text-lg transition-all hover:bg-[var(--chocolate-brown)] hover:text-[var(--warm-cream)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Star on GitHub
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-[var(--chocolate-brown)] opacity-60">
              <a
                href="https://github.com/ddnetters/stringly-typed"
                className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                </svg>
                <span>Star</span>
              </a>
              <span className="text-[var(--chocolate-brown)] opacity-30">|</span>
              <a
                href="https://github.com/ddnetters/stringly-typed-demo"
                className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                </svg>
                <span>Demo Repo</span>
              </a>
              <span className="text-[var(--chocolate-brown)] opacity-30">|</span>
              <span>MIT License</span>
              <span className="text-[var(--chocolate-brown)] opacity-30">|</span>
              <span>Free & Open Source</span>
            </div>
          </div>

          {/* Animation */}
          <HeroAnimation />
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Quickstart */}
      <Quickstart />

      {/* Documentation Links */}
      <DocsLinks />

      {/* FAQ */}
      <FAQ />

      {/* Why We Built This */}
      <WhyWeBuiltThis />

      {/* Footer */}
      <Footer />
    </div>
  );
}
