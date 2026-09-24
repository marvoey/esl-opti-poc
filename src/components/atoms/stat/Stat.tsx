import React from "react";
import styles from "./Stat.module.css";
import { type TextColor } from "../text/Text";

export interface StatProps {
  children: React.ReactNode;
  as?: "span" | "div" | "p";
  color?: TextColor;
  className?: string;
  id?: string;
}

export function Stat({
  children,
  as: Component = "span",
  color,
  className,
  id,
}: StatProps) {
  const colorClass = color ? styles[`color${color.charAt(0).toUpperCase() + color.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`] || "" : "";
  const combinedClasses = [styles.stat, colorClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
