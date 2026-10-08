import React from "react";
import {
  Calculator,
  CreditCard,
  Gauge,
  Home,
  Landmark,
  ListChecks,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { GuidanceIconName } from "./guidanceDetailPanelData";

/**
 * Component-local icon map. The shared `Icon` atom has no calculator, gauge or
 * checklist glyphs, and atoms are not edited for a single component.
 */
const GUIDANCE_ICONS: Record<GuidanceIconName, LucideIcon> = {
  home: Home,
  calculator: Calculator,
  gauge: Gauge,
  "list-checks": ListChecks,
  "piggy-bank": PiggyBank,
  wallet: Wallet,
  "credit-card": CreditCard,
  landmark: Landmark,
};

export const GUIDANCE_ICON_NAMES = Object.keys(GUIDANCE_ICONS) as GuidanceIconName[];

export function GuidanceIcon({
  name,
  size = 20,
  className,
}: {
  name: GuidanceIconName;
  size?: number;
  className?: string;
}) {
  const Component = GUIDANCE_ICONS[name];
  return <Component size={size} strokeWidth={1.75} className={className} aria-hidden="true" />;
}
