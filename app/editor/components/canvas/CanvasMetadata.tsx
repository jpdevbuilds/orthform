"use client";

import React from "react";

type CanvasMetadataProps = {
  isSingle: boolean;
  currentSlide: number;
  totalSlides: number;
  systemName: string;
};

export default function CanvasMetadata({
  isSingle,
  currentSlide,
  totalSlides,
  systemName,
}: CanvasMetadataProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-xs">
      <span className="font-medium text-[var(--app-muted)]">
        {systemName}
      </span>

      <span className="text-[var(--app-subtle)]">
        {isSingle
          ? "Single"
          : `Slide ${currentSlide + 1} of ${totalSlides}`}
      </span>
    </div>
  );
}