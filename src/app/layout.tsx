import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Albert_Sans, League_Spartan } from "next/font/google";
import { WebVitals } from "@/components/diagnostics/WebVitals";
import "@/infrastructure/cms/optimizely-registry";
import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-albert-sans",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-league-spartan",
  display: "swap",
});

export const revalidate = 60;

// The site title and title template come from src/app/sites/[site]/layout.tsx.
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ESL Federal Credit Union",
    description: "Enterprise Next.js architecture with Pragmatic Hexagonal Design, CMS Anti-Corruption Layer, and Intrinsic CSS Tokens",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'none',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${albertSans.variable} ${leagueSpartan.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.optimizely.com" />
        <link rel="dns-prefetch" href="https://cdn.optimizely.com" />
      </head>
      <body>
        <WebVitals />
        {children}
        <Script
          src="https://cdn.optimizely.com/js/4775830914596864.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
