import React from "react";
import { ClipboardList, Gauge, HousePlus, type LucideProps } from "lucide-react";
import { Icon, type IconName } from "@/components/atoms/icons";
import { type LongTextLeftCardsRightIconName } from "./longTextLeftCardsRightIconNames";

const LOCAL_ICONS = {
  gauge: Gauge,
  "house-plus": HousePlus,
  "clipboard-list": ClipboardList,
} as const;

export interface CardIconProps extends Omit<LucideProps, "ref"> {
  name: LongTextLeftCardsRightIconName;
}

export function CardIcon({ name, size = 24, ...props }: CardIconProps) {
  const Local = LOCAL_ICONS[name as keyof typeof LOCAL_ICONS];
  if (Local) return <Local size={size} aria-hidden={true} {...props} />;
  return <Icon name={name as IconName} size={size} aria-hidden={true} {...props} />;
}
