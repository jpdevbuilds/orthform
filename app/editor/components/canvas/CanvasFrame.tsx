"use client";

import React from "react";

type CanvasFrameProps = {
  backgroundColor: string;
  borderColor: string;
  children: React.ReactNode;
};

export default function CanvasFrame({
  backgroundColor,
  borderColor,
  children,
}: CanvasFrameProps) {
  return (
    <div
      className="
        relative
        aspect-[4/5]
        w-full
        overflow-hidden
        rounded-[20px]
        border
        shadow-[0_20px_70px_rgba(32,32,32,0.14)]
        transition-colors
        duration-300
        sm:rounded-[28px]
        [container-type:inline-size]
      "
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      {children}
    </div>
  );
}