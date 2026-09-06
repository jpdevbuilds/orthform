
"use client";

type TemplateFooterProps = {
  isSingle: boolean;
  currentSlide: number;
  muted: string;
};

export default function TemplateFooter({
  isSingle,
  currentSlide,
  muted,
}: TemplateFooterProps) {
  return (
    <div className="flex items-end justify-between">
      <span
        className="text-[9px] font-medium uppercase tracking-[0.18em]"
        style={{ color: muted }}
      >
        {isSingle ? "Single" : "Editorial artifact"}
      </span>

      {!isSingle && (
        <span
          className="text-[10px] font-semibold tabular-nums"
          style={{ color: muted }}
        >
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}