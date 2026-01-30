import type { Metadata } from "next";
import { Righteous, Source_Serif_4, JetBrains_Mono } from "next/font/google";
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
  openGraph: {
    title: "Stringly-Typed | AI-Powered Brand Voice Validation",
    description:
      "A GitHub Action that validates your UI strings against your brand voice using AI. Catch tone violations before they ship.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stringly-Typed | AI-Powered Brand Voice Validation",
    description:
      "A GitHub Action that validates your UI strings against your brand voice using AI. Catch tone violations before they ship.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${righteous.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
