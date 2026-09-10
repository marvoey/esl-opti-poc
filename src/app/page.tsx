import React from "react";
import { notFound } from "next/navigation";
import { GraphClient } from "@optimizely/cms-sdk";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import { SnipeCta } from "@/components/organisms/snipe-cta/SnipeCta";
import {
  TabbedIconCards,
  type TabCategory,
} from "@/components/organisms/tabbed-icon-cards";
import "@/infrastructure/cms/optimizely-registry";

// Sample tab data until this section is bound to CMS content.
const SAMPLE_TABBED_ICON_CARDS_TABS: TabCategory[] = [
  {
    id: "personal",
    label: "Personal",
    cards: [
      { id: "personal-checking", title: "Checking Accounts", href: "/personal/checking" },
      { id: "personal-savings", title: "Savings Accounts", href: "/personal/savings" },
      { id: "personal-loans", title: "Personal Loans", href: "/personal/loans" },
      { id: "personal-cards", title: "Credit Cards", href: "/personal/cards" },
      { id: "personal-mortgage", title: "Mortgages", href: "/personal/mortgage" },
      { id: "personal-auto", title: "Auto Loans", href: "/personal/auto-loans" },
      { id: "personal-investing", title: "Investments", href: "/personal/investments" },
    ],
  },
  {
    id: "business",
    label: "Business",
    cards: [
      { id: "business-checking", title: "Business Checking", href: "/business/checking" },
      { id: "business-loans", title: "Business Loans", href: "/business/loans" },
      { id: "business-cards", title: "Business Credit Cards", href: "/business/cards" },
      { id: "business-treasury", title: "Treasury Services", href: "/business/treasury" },
      { id: "business-merchant", title: "Merchant Services", href: "/business/merchant" },
      { id: "business-payroll", title: "Payroll Solutions", href: "/business/payroll" },
      { id: "business-insurance", title: "Business Insurance", href: "/business/insurance" },
    ],
  },
];

async function resolveHomeContent() {
  const host = process.env.OPTIMIZELY_APP_HOST || "http://localhost:5002";
  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const client = new GraphClient(apiKey, {
      graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
    });

    let content = await client.getContentByPath("/", {
      host,
    });

    // If the root is a StartPage container or has no registered component, resolve the child ESL Home Page (/home or /new-page)
    if (!content || content.length === 0 || content[0]?._metadata?.types?.includes("StartPage")) {
      try {
        const homeContent = await client.getContentByPath("/home", { host });
        if (homeContent && homeContent.length > 0) {
          content = homeContent;
        } else {
          const childContent = await client.getContentByPath("/new-page", { host });
          if (childContent && childContent.length > 0) {
            content = childContent;
          }
        }
      } catch {
        // ignore and proceed
      }
    }

    return content && content.length > 0 ? content : null;
  } catch (error) {
    console.warn("CMS Graph delivery query returned no published home page yet:", error);
    return null;
  }
}

export default async function Home() {
  const content = await resolveHomeContent();

  if (content) {
    return (
      <main>
        <OptimizelyComponent content={content[0]} />
        <TabbedIconCards
          heading="How can we help you today?"
          tabs={SAMPLE_TABBED_ICON_CARDS_TABS}
        />
      </main>
    );
  }

  return notFound();
}
