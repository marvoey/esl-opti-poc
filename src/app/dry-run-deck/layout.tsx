import React from "react";
import type { Metadata } from "next";
import "reveal.js/reveal.css";
import "reveal.js/theme/black.css";

export const metadata: Metadata = {
  title: "ESL Onsite Dry-Run Presentation",
  description: "Interactive breakout sessions guide and run-of-show deck",
  robots: { index: false, follow: false },
};

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#111827" }}>
      {children}
    </div>
  );
}
