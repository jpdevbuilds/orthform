"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { MoreVertical } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type Theme = "light" | "dark";

type EditorHeaderProps = {
  systemName: string;
  contentType: string;
  title: string;
  generating: boolean;
  exporting: boolean;

  theme: Theme;
  onToggleTheme: () => void;

  saveStatus: "idle" | "saving" | "saved";

  onTitleChange: (value: string) => void;
  onEditStart: (field: "title" | "body") => void;
  onEditEnd: () => void;
  onGenerate: () => void;
  onSave: () => void;
  onExport: () => void;
  onExportAll: () => void;
};

export default function EditorHeader({
  systemName,
  contentType,
  title,
  generating,
  exporting,
  theme,
  onToggleTheme,
  saveStatus,
  onTitleChange,
  onEditStart,
  onEditEnd,
  onGenerate,
  onSave,
  onExport,
  onExportAll,
}: EditorHeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const mobileActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen && !mobileActionsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(target) &&
        mobileActionsRef.current &&
        !mobileActionsRef.current.contains(target)
      ) {
        setExportOpen(false);
        setMobileActionsOpen(false);
        return;
      }

      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(target)
      ) {
        setExportOpen(false);
      }

      if (
        mobileActionsRef.current &&
        !mobileActionsRef.current.contains(target)
      ) {
        setMobileActionsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExportOpen(false);
        setMobileActionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [exportOpen, mobileActionsOpen]);

  const handleExportCurrent = () => {
    setExportOpen(false);
    setMobileActionsOpen(false);
    onExport();
  };

  const handleExportAll = () => {
    setExportOpen(false);
    setMobileActionsOpen(false);
    onExportAll();
  };

  const handleMobileSave = () => {
    if (saveStatus === "saving") return;

    setMobileActionsOpen(false);
    onSave();
  };

  const handleMobileGenerate = () => {
    if (generating || exporting) return;

    setMobileActionsOpen(false);
    onGenerate();
  };

  const handleMobileTheme = () => {
    setMobileActionsOpen(false);
    onToggleTheme();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-bg)]/90 px-4 py-3 backdrop-blur transition-colors duration-300 sm:px-8 sm:py-4 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        {/* Identity */}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] uppercase tracking-[0.16em] text-[var(--app-muted)] sm:text-xs sm:tracking-[0.18em]">
            {systemName} / {contentType}
          </p>

          <input
            value={title}
            onFocus={() => onEditStart("title")}
            onBlur={onEditEnd}
            onChange={(e) => onTitleChange(e.target.value)}
            className="mt-1 w-full max-w-[280px] truncate bg-transparent text-sm font-medium text-[var(--app-ink)] outline-none"
            aria-label="Document title"
          />
        </div>

        {/* Desktop Actions */}

        <div className="hidden shrink-0 items-center gap-1.5 sm:flex sm:gap-2">
          {/* Theme */}

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
          />

          {/* Save */}

          <button
            type="button"
            onClick={() => {
              setMobileActionsOpen((value) => !value);
              setExportOpen(false);
            }}
            aria-expanded={mobileActionsOpen}
            aria-haspopup="menu"
            aria-label="Editor actions"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-ink)] transition hover:border-[var(--app-accent)]"
          >
            <MoreVertical
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {/* Generate */}

          <button
            type="button"
            onClick={onGenerate}
            disabled={generating || exporting}
            className="rounded-full bg-[var(--app-accent)] px-4 py-2 text-xs text-[var(--app-active-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate draft →"}
          </button>

          {/* Export */}

          <div
            ref={exportMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => {
                setExportOpen((value) => !value);
                setMobileActionsOpen(false);
              }}
              disabled={exporting}
              aria-expanded={exportOpen}
              aria-haspopup="menu"
              aria-label="Export"
              className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-xs text-[var(--app-ink)] transition hover:border-[var(--app-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting ? "Exporting..." : "Export"}
            </button>

            {exportOpen && !exporting && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleExportCurrent}
                  className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)]"
                >
                  <span>
                    <span className="block font-medium">
                      Current slide
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[var(--app-muted)]">
                      Export this slide as PNG
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleExportAll}
                  className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)]"
                >
                  <span>
                    <span className="block font-medium">
                      All slides
                    </span>

                    <span className="mt-0.5 block text-[10px] text-[var(--app-muted)]">
                      Export every slide as PNG
                    </span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions */}

        <div
          ref={mobileActionsRef}
          className="relative sm:hidden"
        >
          <button
            type="button"
            onClick={() => {
              setMobileActionsOpen((value) => !value);
              setExportOpen(false);
            }}
            aria-expanded={mobileActionsOpen}
            aria-haspopup="menu"
            aria-label="Editor actions"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-base leading-none text-[var(--app-ink)] transition hover:border-[var(--app-accent)]"
          >
            ⋮
          </button>

          {mobileActionsOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
            >
              {/* Save */}

              <button
                type="button"
                role="menuitem"
                onClick={handleMobileSave}
                disabled={saveStatus === "saving"}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {saveStatus === "saving"
                    ? "Saving..."
                    : saveStatus === "saved"
                    ? "Saved"
                    : "Save"}
                </span>

                {saveStatus === "saved" && (
                  <span className="text-[var(--app-success)]">
                    ✓
                  </span>
                )}
              </button>

              {/* Generate */}

              <button
                type="button"
                role="menuitem"
                onClick={handleMobileGenerate}
                disabled={generating || exporting}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {generating ? "Generating..." : "Generate draft"}
                </span>

                <span className="text-[var(--app-muted)]">
                  →
                </span>
              </button>

              {/* Export */}

              <div className="my-1 border-t border-[var(--app-border)]" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMobileActionsOpen(false);
                  setExportOpen(true);
                }}
                disabled={exporting}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {exporting ? "Exporting..." : "Export"}
                </span>

                <span className="text-[var(--app-muted)]">
                  →
                </span>
              </button>

              {/* Theme */}

              <button
                type="button"
                role="menuitem"
                onClick={handleMobileTheme}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)]"
              >
                <span>Theme</span>

                <span className="text-[10px] uppercase tracking-wide text-[var(--app-muted)]">
                  {theme}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Export Menu */}

      {exportOpen && (
        <div className="sm:hidden">
          <div
            className="absolute right-4 top-[calc(100%+0.5rem)] z-50 w-52 overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
          >
            <button
              type="button"
              onClick={handleExportCurrent}
              disabled={exporting}
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                <span className="block font-medium">
                  Current slide
                </span>

                <span className="mt-0.5 block text-[10px] text-[var(--app-muted)]">
                  Export this slide as PNG
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportAll}
              disabled={exporting}
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs text-[var(--app-ink)] transition hover:bg-[var(--app-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                <span className="block font-medium">
                  All slides
                </span>

                <span className="mt-0.5 block text-[10px] text-[var(--app-muted)]">
                  Export every slide as PNG
                </span>
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}