import React from "react";
import styles from "./Display.module.css";

export interface DisplayProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "div" | "p";
  className?: string;
  id?: string;
}

export function Display({
  children,
  as: Component = "h1",
  className,
  id,
}: DisplayProps) {
  const combinedClasses = className
    ? `${styles.display} ${className}`
    : styles.display;

  return (
    <Component id={id} className={combinedClasses}>
      {children}
    </Component>
  );
}
