import React, { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Albert_Sans, League_Spartan } from "next/font/google";
import "@/infrastructure/cms/optimizely-registry";
import "./globals.css";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/organisms/footer/Footer";
import { resolveHeaderContent } from "@/infrastructure/cms/resolveHeaderContent";
import { resolveFooterContent } from "@/infrastructure/cms/resolveFooterContent";
import { resolveSiteTitle } from "@/infrastructure/cms/resolveSiteTitle";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-albert-sans",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  display: "swap",
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const siteTitle = await resolveSiteTitle();
  const defaultTitle = siteTitle || "ESL Federal Credit Union";

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
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

async function ServerHeader() {
  const headerProps = await resolveHeaderContent();
  if (!headerProps) return null;
  return <Header {...headerProps} />;
}

async function ServerFooter() {
  const footerProps = await resolveFooterContent();
  if (!footerProps) return null;
  return <Footer {...footerProps} />;
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
        <Script
          src="https://cdn.optimizely.com/js/4775830914596864.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <ServerHeader />
        </Suspense>
        {children}
        <Suspense fallback={null}>
          <ServerFooter />
        </Suspense>
      </body>
    </html>
  );
}
