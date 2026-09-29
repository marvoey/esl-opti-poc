import React from "react";

export interface KeyFactsTileItem {
  id?: string;
  value: string;
  callout: string;
  description: string;
}

export interface KeyFactsRowProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  headingLevel?: "h2" | "h3";
  tiles?: KeyFactsTileItem[];
  id?: string;
  className?: string;
}

export const DEFAULT_KEY_FACTS_TILES: KeyFactsTileItem[] = [
  {
    id: "tile-monthly-fee",
    value: "$0",
    callout: "Monthly service fee",
    description: "with a $1,000 average monthly balance — otherwise $10",
  },
  {
    id: "tile-min-open",
    value: "$1",
    callout: "Minimum to open",
    description: "Descriptive quick content",
  },
  {
    id: "tile-dividend",
    value: "0.050% / 0.05%",
    callout: "Dividend rate/APY",
    description: "Descriptive quick content",
  },
  {
    id: "tile-free-checks",
    value: "80",
    callout: "Free Checks",
    description: "with first order",
  },
  {
    id: "tile-atm-access",
    value: "Free",
    callout: "ATM Access",
    description: "up to 5 free non-ESL withdrawals/mo, then $2.50",
  },
  {
    id: "tile-overdraft",
    value: "Fully covered",
    callout: "Overdraft options",
    description: "Cash Reserve, CheckOK & Courtesy Pay",
  },
  {
    id: "tile-digital-banking",
    value: "$0",
    callout: "Digital Banking",
    description: "Mobile check deposit & bill pay",
  },
];
