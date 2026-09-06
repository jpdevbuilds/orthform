"use client";

import React from "react";

type CanvasNavigationProps = {
  visible: boolean;
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function CanvasNavigation({
  visible,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: CanvasNavigationProps) {
  if (!visible) return null;

  const canGoPrevious = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  return (
    <>
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-ink)] shadow-sm transition hover:bg-[var(--app-hover)] disabled:pointer-events-none disabled:opacity-30"
      >
        <span aria-hidden="true">←</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-ink)] shadow-sm transition hover:bg-[var(--app-hover)] disabled:pointer-events-none disabled:opacity-30"
      >
        <span aria-hidden="true">→</span>
      </button>
    </>
  );
}