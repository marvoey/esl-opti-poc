"use client";

import { useEffect } from "react";
import { pageviewEvent, trackEvents } from "@/infrastructure/odp/client";

/** Records one anonymous pageview for the page it is rendered on. Renders nothing. */
export function PageviewBeacon({ path, title }: { path: string; title: string }) {
  useEffect(() => {
    void trackEvents([pageviewEvent(path, title)]);
  }, [path, title]);
  return null;
}
