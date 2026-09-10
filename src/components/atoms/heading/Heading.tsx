import React from "react";
import styles from "./Heading.module.css";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4";
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface HeadingProps {
  children: React.ReactNode;
  level?: HeadingLevel;
  as?: HeadingTag;
  className?: string;
  id?: string;
}

export function Heading({
  children,
  level = "h2",
  as,
  className,
  id,
}: HeadingProps) {
  // If 'as' is omitted, match the visual level semantically
  const Component = as || level;

  const levelClass = styles[level] || styles.h2;
  const combinedClasses = className
    ? `${styles.base} ${levelClass} ${className}`
    : `${styles.base} ${levelClass}`;

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
