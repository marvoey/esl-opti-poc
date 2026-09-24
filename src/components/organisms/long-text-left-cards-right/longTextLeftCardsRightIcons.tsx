import React from "react";
import { ClipboardList, Gauge, HousePlus, type LucideProps } from "lucide-react";
import { Icon, type IconName } from "@/components/atoms/icons";

/**
 * Icons offered by the Long Text Left / Cards Right cards.
 * The first three are not in the shared Icon atom, so they are resolved here
 * directly from Lucide; the rest delegate to the shared Icon atom.
 */
const LOCAL_ICONS = {
  gauge: Gauge,
  "house-plus": HousePlus,
  "clipboard-list": ClipboardList,
} as const;

const SHARED_ICONS = [
  "piggy-bank",
  "home",
  "key-round",
  "landmark",
  "wallet",
  "credit-card",
  "shield-check",
  "coins",
] as const satisfies ReadonlyArray<IconName>;

export type LongTextLeftCardsRightIconName =
  | keyof typeof LOCAL_ICONS
  | (typeof SHARED_ICONS)[number];

export const LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES: ReadonlyArray<LongTextLeftCardsRightIconName> = [
  ...(Object.keys(LOCAL_ICONS) as Array<keyof typeof LOCAL_ICONS>),
  ...SHARED_ICONS,
];

export function isLongTextLeftCardsRightIconName(
  value: string
): value is LongTextLeftCardsRightIconName {
  return (LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES as ReadonlyArray<string>).includes(value);
}

export interface CardIconProps extends Omit<LucideProps, "ref"> {
  name: LongTextLeftCardsRightIconName;
}

export function CardIcon({ name, size = 24, ...props }: CardIconProps) {
  const Local = LOCAL_ICONS[name as keyof typeof LOCAL_ICONS];
  if (Local) return <Local size={size} aria-hidden={true} {...props} />;
  return <Icon name={name as IconName} size={size} aria-hidden={true} {...props} />;
}
