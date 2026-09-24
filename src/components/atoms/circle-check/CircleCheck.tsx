import React from "react";

export interface CircleCheckProps {
  size?: number | string;
  backgroundColor?: string;
  tickColor?: string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

/**
 * CircleCheck Atom Component
 * Renders an accessible, vector-crisp checkmark inside a filled circle.
 * Supports dynamic backgroundColor and tickColor props.
 */
export function CircleCheck({
  size = 28,
  backgroundColor = "var(--color-primary)",
  tickColor = "var(--color-aqua-300)",
  className = "",
  "aria-hidden": ariaHidden = true,
}: CircleCheckProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
      data-testid="circle-check"
    >
      <circle cx="14" cy="14" r="14" fill={backgroundColor} />
      <path
        d="M8.5 14.5L12 18L19.5 10.5"
        stroke={tickColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
