import type { Metadata } from "next";
import { Albert_Sans, League_Spartan } from "next/font/google";
import "@/infrastructure/cms/optimizely-registry";
import "./globals.css";
import { Footer } from "@/components/organisms/footer/Footer";
import { resolveFooterContent } from "@/infrastructure/cms/resolveFooterContent";

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

export const metadata: Metadata = {
  title: "ESL Enterprise - Spec-Driven Next.js Architecture",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerProps = await resolveFooterContent();

  return (
    <html lang="en" className={`${albertSans.variable} ${leagueSpartan.variable}`}>
      <body>
        {children}
        {footerProps && <Footer {...footerProps} />}
      </body>
    </html>
  );
}
