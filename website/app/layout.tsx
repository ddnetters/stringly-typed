import type { Metadata } from "next";
import { Righteous, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

const righteous = Righteous({
  weight: "400",
  variable: "--font-righteous",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stringly-typed.netters.dev"),
  title: "Stringly-Typed | AI-Powered Brand Voice Validation",
  description:
    "A GitHub Action that validates your UI strings against your brand voice using AI. Catch tone violations before they ship.",
  keywords: [
    "github action",
    "brand voice",
    "content validation",
    "AI",
    "style guide",
    "developer tools",
  ],
  authors: [{ name: "ddnetters" }],
  icons: {
    icon: "/images/stringly-typed-favicon.jpg",
    apple: "/images/stringly-typed-favicon.jpg",
  },
  openGraph: {
    title: "Stringly-Typed | AI-Powered Brand Voice Validation",
    description:
      "A GitHub Action that validates your UI strings against your brand voice using AI. Catch tone violations before they ship.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/stringly-typed-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stringly-Typed - AI-powered brand voice validation for GitHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stringly-Typed | AI-Powered Brand Voice Validation",
    description:
      "A GitHub Action that validates your UI strings against your brand voice using AI. Catch tone violations before they ship.",
    images: ["/images/stringly-typed-og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload hero image for better LCP */}
        <link
          rel="preload"
          href="/images/stringly-typed-logo-v2-b.webp"
          as="image"
          type="image/webp"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://eu.i.posthog.com" />
      </head>
      <body
        className={`${righteous.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PostHogProvider>
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
