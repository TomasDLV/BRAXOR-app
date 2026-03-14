"use client";

/**
 * SnapController
 * Programmatic magnetic snap using Lenis' scrollTo API.
 * When the user stops scrolling near a snap section, this
 * smoothly pulls the viewport to that section's top edge.
 *
 * Sections that participate: add an id matching SNAP_IDS below.
 * TallerSection is intentionally excluded so its internal
 * 400vh sticky scrolltelling (4 chapters) flows without interruption.
 */

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

const SNAP_IDS = [
  "hero-section",
  "categories-section",
  "location-section",
  "cta-section",
];

// Snap activates when section top is within this many px of the viewport top
const SNAP_THRESHOLD_PX = 180;

// Milliseconds of scroll inactivity before snap check fires
const IDLE_MS = 110;

export default function SnapController() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Capture in local const so TypeScript knows it's non-null inside closure
    const instance = lenis;

    function onScroll({ velocity }: { velocity: number }) {
      // Clear any pending snap
      if (timerRef.current) clearTimeout(timerRef.current);

      // Still scrolling fast — don't schedule yet
      if (Math.abs(velocity) > 0.4) return;

      timerRef.current = setTimeout(() => {
        for (const id of SNAP_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;

          const { top } = el.getBoundingClientRect();

          // Element is close to viewport top — snap to it
          if (top > -SNAP_THRESHOLD_PX && top < SNAP_THRESHOLD_PX) {
            instance.scrollTo(el, {
              duration: 0.85,
              easing: (t: number) => 1 - Math.pow(1 - t, 3),
            });
            break;
          }
        }
      }, IDLE_MS);
    }

    instance.on("scroll", onScroll);

    return () => {
      instance.off("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lenis]);

  return null;
}
