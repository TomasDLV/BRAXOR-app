"use client";

import type { ReactNode } from "react";
import { LenisProvider } from "@/lib/lenis";
import SnapController from "./SnapController";

export default function SmoothScroller({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <SnapController />
      {children}
    </LenisProvider>
  );
}
