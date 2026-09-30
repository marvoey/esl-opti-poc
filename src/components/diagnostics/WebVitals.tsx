"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onTTFB, onFCP } from "web-vitals/attribution";

const BADGE = "background:#0b3d5c;color:#fff;padding:2px 6px;border-radius:3px";

function describe(node: unknown): string {
  if (!(node instanceof Element)) return "(no node)";
  const id = node.id ? `#${node.id}` : "";
  const cls = typeof node.className === "string" && node.className
    ? `.${node.className.trim().split(/\s+/).slice(0, 3).join(".")}`
    : "";
  return `${node.tagName.toLowerCase()}${id}${cls}`;
}

export function WebVitals() {
  useEffect(() => {
    onLCP((m) => {
      const a = m.attribution;
      console.groupCollapsed(`%cLCP%c ${Math.round(m.value)}ms (${m.rating})`, BADGE, "");
      console.log("element:", a.target ?? "(unknown)");
      if (a.url) console.log("resource:", a.url);
      console.table({
        ttfb: Math.round(a.timeToFirstByte),
        resourceLoadDelay: Math.round(a.resourceLoadDelay),
        resourceLoadDuration: Math.round(a.resourceLoadDuration),
        elementRenderDelay: Math.round(a.elementRenderDelay),
      });
      console.groupEnd();
    });

    onCLS((m) => {
      const a = m.attribution;
      console.groupCollapsed(`%cCLS%c ${m.value.toFixed(4)} (${m.rating})`, BADGE, "");
      console.log("largest shift target:", a.largestShiftTarget ?? "(unknown)");
      console.log("largest shift value:", a.largestShiftValue?.toFixed(4));
      console.log("happened at:", Math.round(a.largestShiftTime ?? 0), "ms");
      console.log("load state:", a.loadState);
      console.groupEnd();
    });

    onINP((m) => {
      const a = m.attribution;
      console.groupCollapsed(`%cINP%c ${Math.round(m.value)}ms (${m.rating})`, BADGE, "");
      console.log("target:", a.interactionTarget ?? "(unknown)");
      console.log("type:", a.interactionType);
      console.groupEnd();
    });

    onFCP((m) => console.log(`%cFCP%c ${Math.round(m.value)}ms (${m.rating})`, BADGE, ""));
    onTTFB((m) => console.log(`%cTTFB%c ${Math.round(m.value)}ms (${m.rating})`, BADGE, ""));

    // web-vitals reports only the largest shift in the worst session window.
    // This logs every shift with the actual DOM nodes that moved, which is what
    // identifies a late third-party mutation versus a font or image reflow.
    if (typeof PerformanceObserver === "undefined") return;
    let observer: PerformanceObserver | undefined;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
            sources?: Array<{ node?: Node }>;
          };
          if (shift.hadRecentInput || shift.value < 0.001) continue;
          console.groupCollapsed(
            `%cSHIFT%c ${shift.value.toFixed(4)} @ ${Math.round(shift.startTime)}ms`,
            BADGE,
            ""
          );
          for (const source of shift.sources ?? []) {
            console.log(describe(source.node), source.node);
          }
          console.groupEnd();
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
    } catch {
      // layout-shift is Chromium-only; ignore where unsupported.
    }
    return () => observer?.disconnect();
  }, []);

  return null;
}
