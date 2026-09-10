import React from "react";
import styles from "./Stat.module.css";

export interface StatProps {
  children: React.ReactNode;
  as?: "span" | "div" | "p";
  className?: string;
  id?: string;
}

export function Stat({
  children,
  as: Component = "span",
  className,
  id,
}: StatProps) {
  const combinedClasses = className
    ? `${styles.stat} ${className}`
    : styles.stat;

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
