"use client";

import { useRef } from "react";

type UseCanvasSwipeOptions = {
  enabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function useCanvasSwipe({
  enabled,
  onPrevious,
  onNext,
}: UseCanvasSwipeOptions) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (!enabled) return;

    touchStartX.current =
      event.touches[0]?.clientX ?? null;

    touchStartY.current =
      event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    if (!enabled) return;

    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]?.clientX ?? 0;

    const endY =
      event.changedTouches[0]?.clientY ?? 0;

    const deltaX =
      endX - touchStartX.current;

    const deltaY =
      endY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (Math.abs(deltaX) < 55) {
      return;
    }

    if (deltaX < 0) {
      onNext();
    } else {
      onPrevious();
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}