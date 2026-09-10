import React from "react";
import styles from "./StepBadge.module.css";

export interface StepBadgeProps {
  step: number | string;
  className?: string;
  textColor?: string;
  backgroundColor?: string;
}

export function StepBadge({ 
  step, 
  className = "", 
  textColor, 
  backgroundColor 
}: StepBadgeProps) {
  const classes = [styles.badge, className].filter(Boolean).join(" ");
  return (
    <div 
      className={classes} 
      aria-hidden="true"
      style={{ 
        ...(textColor ? { color: textColor } : {}),
        ...(backgroundColor ? { backgroundColor } : {})
      }}
    >
      <span className={styles.stepNumber}>{step}</span>
    </div>
  );
}
