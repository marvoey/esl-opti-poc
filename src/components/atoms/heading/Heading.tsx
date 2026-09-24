import React from "react";
import styles from "./Heading.module.css";
import { type TextColor } from "../text/Text";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4";
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface HeadingProps {
  children: React.ReactNode;
  level?: HeadingLevel;
  as?: HeadingTag;
  color?: TextColor;
  className?: string;
  id?: string;
}

export function Heading({
  children,
  level = "h2",
  as,
  color,
  className,
  id,
}: HeadingProps) {
  // If 'as' is omitted, match the visual level semantically
  const Component = as || level;

  const levelClass = styles[level] || styles.h2;
  const colorClass = color ? styles[`color${color.charAt(0).toUpperCase() + color.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`] || "" : "";
  const combinedClasses = [styles.base, levelClass, colorClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
