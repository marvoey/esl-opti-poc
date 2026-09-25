import React from "react";
import styles from "./Stat.module.css";
import { type TextColor } from "../text/Text";

export interface StatProps {
  children: React.ReactNode;
  as?: "span" | "div" | "p";
  color?: TextColor;
  size?: "sm";
  className?: string;
  id?: string;
}

export function Stat({
  children,
  as: Component = "span",
  color,
  size,
  className,
  id,
}: StatProps) {
  const colorClass = color ? styles[`color${color.charAt(0).toUpperCase() + color.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`] || "" : "";
  const sizeClass = size === "sm" ? styles.sizeSm : "";
  const combinedClasses = [styles.stat, sizeClass, colorClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
