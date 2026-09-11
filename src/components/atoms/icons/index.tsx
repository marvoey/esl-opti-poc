import React from "react";
import {
  User,
  ArrowRight,
  Coins,
  Headphones,
  PiggyBank,
  Store,
  Play,
  X,
  Car,
  Check,
  type LucideProps,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "user"
  | "arrow-right"
  | "coins"
  | "headphones"
  | "piggy-bank"
  | "store"
  | "play"
  | "close"
  | "car"
  | "check";

export interface IconProps extends Omit<LucideProps, "ref"> {
  size?: number | string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

const iconRegistry: Record<IconName, LucideIcon> = {
  user: User,
  "arrow-right": ArrowRight,
  coins: Coins,
  headphones: Headphones,
  "piggy-bank": PiggyBank,
  store: Store,
  play: Play,
  close: X,
  car: Car,
  check: Check,
};

/**
 * Universal Typed Icon Dispatcher backed by Lucide
 * Fully supports currentColor CSS inheritance, WCAG accessibility, and tree-shaking.
 */
export function Icon({
  name,
  size = 20,
  "aria-hidden": ariaHidden = true,
  ...props
}: IconProps & { name: IconName }) {
  const Component = iconRegistry[name];
  if (!Component) return null;
  return <Component size={size} aria-hidden={ariaHidden} {...props} />;
}

// Tree-shakeable direct atom exports backed by Lucide
export function UserIcon(props: IconProps) {
  return <User size={props.size ?? 20} aria-hidden={true} {...props} />;
}

export function ArrowRightIcon(props: IconProps) {
  return <ArrowRight size={props.size ?? 20} aria-hidden={true} {...props} />;
}

export function CoinsIcon(props: IconProps) {
  return <Coins size={props.size ?? 24} aria-hidden={true} {...props} />;
}

export function HeadphonesIcon(props: IconProps) {
  return <Headphones size={props.size ?? 24} aria-hidden={true} {...props} />;
}

export function PiggyBankIcon(props: IconProps) {
  return <PiggyBank size={props.size ?? 28} aria-hidden={true} {...props} />;
}

export function StoreIcon(props: IconProps) {
  return <Store size={props.size ?? 22} aria-hidden={true} {...props} />;
}

export function PlayIcon(props: IconProps) {
  return <Play size={props.size ?? 20} aria-hidden={true} {...props} />;
}

export function CloseIcon(props: IconProps) {
  return <X size={props.size ?? 24} aria-hidden={true} {...props} />;
}

export function CarIcon(props: IconProps) {
  return <Car size={props.size ?? 20} aria-hidden={true} {...props} />;
}

export function CheckIcon(props: IconProps) {
  return <Check size={props.size ?? 16} aria-hidden={true} {...props} />;
}

