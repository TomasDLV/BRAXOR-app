"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import SnapController from "./SnapController";

export default function SmoothScroller({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      }}
    >
      <SnapController />
      {children}
    </ReactLenis>
  );
}
