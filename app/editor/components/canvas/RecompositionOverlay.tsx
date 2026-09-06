"use client";

import React from "react";

type RecompositionOverlayProps = {
  visible: boolean;
};

export default function RecompositionOverlay({
  visible,
}: RecompositionOverlayProps) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
      <div className="mx-6 w-full max-w-sm rounded-2xl border border-white/15 bg-black/70 px-7 py-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>

        <h3 className="text-base font-semibold text-white">
          Recomposing artifact
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/65">
          Adapting your content to the new editorial mode.
        </p>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
          Please wait…
        </p>
      </div>
    </div>
  );
}