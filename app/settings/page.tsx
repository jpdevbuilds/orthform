"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getSettings,
  saveTheme,
  type ThemePreference,
} from "@/lib/settings";

const THEME_EVENT = "orthform-theme-change";

export default function Page() {
  const [theme, setTheme] =
    useState<ThemePreference>("light");

  useEffect(() => {
    setTheme(getSettings().theme);
  }, []);

  const handleThemeChange = (
    nextTheme: ThemePreference
  ) => {
    setTheme(nextTheme);
    saveTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent(THEME_EVENT, {
        detail: nextTheme,
      })
    );
  };

  return (
    <main
      className="
        min-h-screen
        bg-[var(--app-bg)]
        text-[var(--app-ink)]
        transition-colors
        duration-300
      "
    >
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

        {/* HEADER */}

        <header className="mb-10">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              text-[var(--app-muted)]
              transition
              hover:text-[var(--app-ink)]
            "
          >
            <span aria-hidden="true">←</span>
            Back to Orthform
          </Link>

          <div className="mt-8">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[var(--app-muted)]
              "
            >
              Orthform
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-medium
                tracking-tight
                text-[var(--app-heading)]
                sm:text-4xl
              "
            >
              Settings
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-[var(--app-muted)]
              "
            >
              Configure how Orthform behaves as an
              editorial workspace.
            </p>
          </div>
        </header>

        {/* SETTINGS */}

        <div className="space-y-4">

          {/* APPEARANCE */}

          <section
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              p-5
              transition-colors
              duration-300
              sm:p-6
            "
          >
            <div>
              <p className="text-sm font-medium text-[var(--app-heading)]">
                Appearance
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[var(--app-muted)]
                "
              >
                Control the visual appearance of the
                Orthform workspace.
              </p>
            </div>

            {/* THEME */}

            <div
              className="
                mt-6
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <ThemeOption
                label="Light"
                description="Use the light workspace."
                active={theme === "light"}
                onClick={() =>
                  handleThemeChange("light")
                }
              />

              <ThemeOption
                label="Dark"
                description="Use the dark workspace."
                active={theme === "dark"}
                onClick={() =>
                  handleThemeChange("dark")
                }
              />
            </div>
          </section>

          {/* EDITORIAL DEFAULTS */}

          <section
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              p-5
              transition-colors
              duration-300
              sm:p-6
            "
          >
            <div>
              <p className="text-sm font-medium text-[var(--app-heading)]">
                Editorial defaults
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[var(--app-muted)]
                "
              >
                Define the defaults used when creating
                new artifacts.
              </p>
            </div>

            <Placeholder>
              Default brand, artifact type, and template
              preferences will live here.
            </Placeholder>
          </section>

          {/* GENERATION */}

          <section
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              p-5
              transition-colors
              duration-300
              sm:p-6
            "
          >
            <div>
              <p className="text-sm font-medium text-[var(--app-heading)]">
                Generation
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[var(--app-muted)]
                "
              >
                Configure how Orthform approaches AI
                assisted editorial generation.
              </p>
            </div>

            <Placeholder>
              Generation preferences will live here.
            </Placeholder>
          </section>

          {/* WORKSPACE */}

          <section
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              p-5
              transition-colors
              duration-300
              sm:p-6
            "
          >
            <div>
              <p className="text-sm font-medium text-[var(--app-heading)]">
                Workspace
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[var(--app-muted)]
                "
              >
                Control editor and export behavior.
              </p>
            </div>

            <Placeholder>
              Workspace preferences will live here.
            </Placeholder>
          </section>

          {/* ABOUT */}

          <section
            className="
              rounded-2xl
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              p-5
              transition-colors
              duration-300
              sm:p-6
            "
          >
            <div>
              <p className="text-sm font-medium text-[var(--app-heading)]">
                About
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-[var(--app-muted)]
                "
              >
                Information about this Orthform
                workspace.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoItem
                label="Product"
                value="Orthform"
              />

              <InfoItem
                label="Workspace"
                value="Editorial system"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// ==================================================
// THEME OPTION
// ==================================================

function ThemeOption({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        flex
        flex-1
        items-center
        justify-between
        rounded-xl
        border
        px-4
        py-4
        text-left
        transition-colors
        duration-200
        ${
          active
            ? "border-[var(--app-accent)] bg-[var(--app-hover)]"
            : "border-[var(--app-border)] hover:border-[var(--app-accent)] hover:bg-[var(--app-hover)]"
        }
      `}
    >
      <div>
        <p className="text-sm font-medium text-[var(--app-heading)]">
          {label}
        </p>

        <p
          className="
            mt-1
            text-xs
            text-[var(--app-muted)]
          "
        >
          {description}
        </p>
      </div>

      <span
        className={`
          ml-4
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${
            active
              ? "border-[var(--app-accent)]"
              : "border-[var(--app-border)]"
          }
        `}
      >
        {active && (
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[var(--app-accent)]
            "
          />
        )}
      </span>
    </button>
  );
}

// ==================================================
// PLACEHOLDER
// ==================================================

function Placeholder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        mt-6
        rounded-xl
        border
        border-dashed
        border-[var(--app-border)]
        px-4
        py-4
        text-xs
        text-[var(--app-muted)]
      "
    >
      {children}
    </div>
  );
}

// ==================================================
// INFO ITEM
// ==================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[var(--app-border)]
        bg-[var(--app-surface)]
        px-4
        py-4
      "
    >
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.14em]
          text-[var(--app-muted)]
        "
      >
        {label}
      </p>

      <p className="mt-1 text-sm text-[var(--app-heading)]">
        {value}
      </p>
    </div>
  );
}