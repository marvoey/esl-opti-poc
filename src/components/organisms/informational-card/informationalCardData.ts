import type React from "react";
import type { HeadingLevel } from "@/components/atoms/heading/Heading";

export interface InformationalCardLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface InformationalCardProps {
  id?: string;
  /** Short taxonomy label shown in the pill above the title. */
  badge?: string;
  title: string;
  /** Semantic level of the title; the visual size stays the same. */
  headingLevel?: HeadingLevel;
  description?: React.ReactNode;
  /** Bold lead-in of the note, e.g. "Why it's here:". */
  noteLabel?: string;
  note?: string;
  /** With a link, the whole card is clickable. */
  cta?: InformationalCardLink;
  className?: string;
}

export const INFORMATIONAL_CARD_FIXTURE: InformationalCardProps = {
  id: "fixed-rate-mortgage",
  badge: "Borrowing",
  title: "Fixed-rate mortgage",
  description:
    "A payment that does not move for the life of the loan, with local underwriting and closing in Rochester.",
  noteLabel: "Why it's here:",
  note: "the affordability question is easier to answer when one side of it stays still.",
  cta: { label: "See the details", href: "/borrowing/mortgages/fixed-rate" },
};
