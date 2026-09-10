import React from "react";
import styles from "./Eyebrow.module.css";

export type EyebrowColor = "brand" | "accent" | "vibrant" | "inverted";

export interface EyebrowProps {
  children: React.ReactNode;
  color?: EyebrowColor;
  as?: "span" | "p" | "div" | "h2" | "h3";
  className?: string;
  id?: string;
}

export function Eyebrow({
  children,
  color = "accent",
  as: Component = "span",
  className,
  id,
}: EyebrowProps) {
  const colorClass = styles[color] || styles.accent;
  const combinedClasses = className
    ? `${styles.eyebrow} ${colorClass} ${className}`
    : `${styles.eyebrow} ${colorClass}`;

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
