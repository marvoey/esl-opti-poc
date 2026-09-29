import type { IconName } from "@/components/atoms/icons";

const LOCAL_ICON_NAMES = ["gauge", "house-plus", "clipboard-list"] as const;

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
  | (typeof LOCAL_ICON_NAMES)[number]
  | (typeof SHARED_ICONS)[number];

export const LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES: ReadonlyArray<LongTextLeftCardsRightIconName> = [
  ...LOCAL_ICON_NAMES,
  ...SHARED_ICONS,
];

export function isLongTextLeftCardsRightIconName(
  value: string
): value is LongTextLeftCardsRightIconName {
  return (LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES as ReadonlyArray<string>).includes(value);
}
