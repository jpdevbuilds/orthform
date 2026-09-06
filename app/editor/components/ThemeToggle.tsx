"use client";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

export default function ThemeToggle({
  theme,
  onToggle,
}: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        flex h-9 w-9 shrink-0
        items-center justify-center
        rounded-full
        border border-[var(--editor-border)]
        bg-[var(--editor-surface)]
        text-sm
        text-[var(--editor-ink)]
        transition
        hover:scale-105
        hover:border-[var(--editor-accent)]
        active:scale-95
      "
    >
      {isDark ? "☀" : "◐"}
    </button>
  );
}