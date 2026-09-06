"use client";

import React from "react";

type CanvasDensityProps = {
  titleWords: number;
  bodyWords: number;
  bodyCharacters: number;
  titleMaxWords: number;
  bodyMaxWords: number;
  bodyMaxCharacters: number;
  titleTooLong: boolean;
  bodyWordsTooLong: boolean;
  bodyCharactersTooLong: boolean;
  bodyTooLong: boolean;
  bodyPercentage: number;
  densityStatus: string;
};

function Metric({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger: boolean;
}) {
  return (
    <div>
      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.14em]
          text-[var(--app-muted)]
        "
      >
        {label}
      </p>

      <p
        className={`mt-1 text-xs ${
          danger
            ? "text-[var(--app-error)]"
            : "text-[var(--app-ink)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function CanvasDensity({
  titleWords,
  bodyWords,
  bodyCharacters,
  titleMaxWords,
  bodyMaxWords,
  bodyMaxCharacters,
  titleTooLong,
  bodyWordsTooLong,
  bodyCharactersTooLong,
  bodyTooLong,
  bodyPercentage,
  densityStatus,
}: CanvasDensityProps) {
  return (
    <div
      className="
        mt-3
        rounded-2xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]/65
        p-4
        shadow-sm
        sm:mt-4
        sm:p-5
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-[var(--app-muted)]
            "
          >
            Content density
          </p>

          <p
            className={`mt-1 text-xs font-medium ${
              bodyTooLong
                ? "text-[var(--app-error)]"
                : "text-[var(--app-ink)]"
            }`}
          >
            {densityStatus}
          </p>
        </div>

        <span
          className="
            text-[9px]
            text-[var(--app-muted)]
          "
        >
          {bodyCharacters} /{" "}
          {bodyMaxCharacters}
        </span>
      </div>

      <div
        className="
          mt-3
          h-1
          overflow-hidden
          rounded-full
          bg-[var(--app-hover)]
        "
      >
        <div
          className="
            h-full
            rounded-full
            transition-all
            duration-300
          "
          style={{
            width: `${bodyPercentage}%`,
            backgroundColor:
              bodyTooLong
                ? "var(--app-error)"
                : bodyPercentage >= 85
                ? "var(--app-warning)"
                : "var(--app-accent)",
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Metric
          label="Title"
          value={`${titleWords} / ${titleMaxWords} words`}
          danger={titleTooLong}
        />

        <Metric
          label="Body"
          value={`${bodyWords} / ${bodyMaxWords} words`}
          danger={bodyWordsTooLong}
        />
      </div>

      {(titleTooLong ||
        bodyWordsTooLong ||
        bodyCharactersTooLong) && (
        <div
          className="
            mt-4
            border-t
            border-[var(--app-error)]/15
            pt-3
          "
        >
          <p
            className="
              text-[10px]
              leading-5
              text-[var(--app-error)]
            "
          >
            {titleTooLong &&
              "Title exceeds its editorial limit. "}

            {bodyWordsTooLong &&
              "Body exceeds its word limit. "}

            {bodyCharactersTooLong &&
              "Body exceeds its character limit."}
          </p>
        </div>
      )}
    </div>
  );
}