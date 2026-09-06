"use client";

import React from "react";

type CanvasHintProps = {
  visible: boolean;
};

export default function CanvasHint({
  visible,
}: CanvasHintProps) {
  if (!visible) return null;

  return (
    <div
      className="
        mt-3
        hidden
        items-center
        justify-between
        px-1
        text-[9px]
        uppercase
        tracking-[0.14em]
        text-[var(--app-muted)]
        lg:flex
      "
    >
      <span>
        Swipe / click to navigate
      </span>

      <span>
        ← → Previous / Next
      </span>
    </div>
  );
}