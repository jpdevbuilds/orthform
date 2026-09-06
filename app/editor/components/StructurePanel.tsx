"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import type { ArtifactFormat } from "@/lib/editorial/systems/types";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type StructurePanelProps = {
  slides: Slide[];
  currentSlide: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onRename: (index: number, title: string) => void;
  onDelete: (index: number) => void;
  artifactFormat: ArtifactFormat;
  mobile?: boolean;
  onClose?: () => void;
  open?: boolean;
  onToggle?: () => void;
};

type SectionItemProps = {
  slide: Slide;
  index: number;
  active: boolean;
  editing: boolean;
  renameValue: string;
  allowDelete: boolean;
  onSelect: () => void;
  onStartRename: () => void;
  onRenameChange: (value: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
  onDelete: () => void;
};

function SectionItem({
  slide,
  index,
  active,
  editing,
  renameValue,
  allowDelete,
  onSelect,
  onStartRename,
  onRenameChange,
  onRenameCommit,
  onRenameCancel,
  onDelete,
}: SectionItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
      setMenuOpen(false);
    }
  }, [editing]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleSelect = () => {
    setMenuOpen(false);
    onSelect();
  };

  const handleStartRename = () => {
    setMenuOpen(false);
    onStartRename();
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete();
  };

  return (
    <div
      className={[
        "group relative flex min-w-0 items-center gap-2 rounded-xl border px-2 py-2 transition-colors",
        active
          ? "border-[var(--app-border-strong)] bg-[var(--app-hover)]"
          : "border-transparent hover:bg-[var(--app-hover)]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={handleSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-label={`Open section ${index + 1}`}
      >
        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-medium",
            active
              ? "bg-[var(--app-active)] text-[var(--app-active-ink)]"
              : "bg-[var(--app-surface-raised)] text-[var(--app-muted)]",
          ].join(" ")}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {editing ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(event) => onRenameChange(event.target.value)}
            onBlur={onRenameCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onRenameCommit();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                onRenameCancel();
              }
            }}
            onClick={(event) => event.stopPropagation()}
            className="min-w-0 flex-1 rounded-md border border-[var(--app-border-strong)] bg-[var(--app-input)] px-2 py-1 text-sm text-[var(--app-ink)] outline-none focus:border-[var(--app-accent)]"
            aria-label="Rename section"
          />
        ) : (
          <span
            className={[
              "min-w-0 flex-1 truncate text-sm",
              active
                ? "font-medium text-[var(--app-heading)]"
                : "text-[var(--app-ink)]",
            ].join(" ")}
          >
            {slide.title || "Untitled section"}
          </span>
        )}
      </button>

      {!editing && (
        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((current) => !current);
            }}
            className="
              flex
              h-7
              w-7
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              text-[var(--app-muted)]
              hover:bg-[var(--app-surface-raised)]
              hover:text-[var(--app-ink)]
            "
            aria-label={`Actions for section ${index + 1}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <MoreHorizontal
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {menuOpen && (
            <div
              className="
                absolute
                right-0
                top-8
                z-50
                w-32
                overflow-hidden
                rounded-xl
                border
                border-[var(--app-border)]
                bg-[var(--app-surface)]
                p-1
                shadow-lg
              "
              role="menu"
            >
              <button
                type="button"
                onClick={handleSelect}
                className="
                  flex
                  w-full
                  rounded-lg
                  px-3
                  py-2
                  text-left
                  text-xs
                  text-[var(--app-ink)]
                  hover:bg-[var(--app-hover)]
                "
                role="menuitem"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleStartRename}
                className="
                  flex
                  w-full
                  rounded-lg
                  px-3
                  py-2
                  text-left
                  text-xs
                  text-[var(--app-ink)]
                  hover:bg-[var(--app-hover)]
                "
                role="menuitem"
              >
                Rename
              </button>

              {allowDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    flex
                    w-full
                    rounded-lg
                    px-3
                    py-2
                    text-left
                    text-xs
                    text-[var(--app-error)]
                    hover:bg-[var(--app-error-soft)]
                  "
                  role="menuitem"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StructurePanel({
  slides,
  currentSlide,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  artifactFormat,
  mobile = false,
  onClose,
  open = true,
  onToggle,
}: StructurePanelProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const isSingle = artifactFormat === "single";

  const startRename = (index: number) => {
    setEditingIndex(index);
    setRenameValue(slides[index]?.title || "");
  };

  const commitRename = () => {
    if (editingIndex === null) return;

    const nextTitle = renameValue.trim();

    if (nextTitle) {
      onRename(editingIndex, nextTitle);
    }

    setEditingIndex(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setEditingIndex(null);
    setRenameValue("");
  };

  const handleDelete = (index: number) => {
    if (isSingle || slides.length <= 1) return;

    onDelete(index);

    if (editingIndex === index) {
      cancelRename();
    }
  };

  const renderSections = () => (
    <div className="space-y-1">
      {slides.map((slide, index) => (
        <SectionItem
          key={slide.id}
          slide={slide}
          index={index}
          active={index === currentSlide}
          editing={editingIndex === index}
          renameValue={renameValue}
          allowDelete={!isSingle && slides.length > 1}
          onSelect={() => onSelect(index)}
          onStartRename={() => startRename(index)}
          onRenameChange={setRenameValue}
          onRenameCommit={commitRename}
          onRenameCancel={cancelRename}
          onDelete={() => handleDelete(index)}
        />
      ))}
    </div>
  );

  /*
   * SINGLE POST
   *
   * A single post is one editorial artifact.
   * It should not expose carousel controls such as:
   * - section count
   * - add section
   * - multi-section navigation
   */

  if (isSingle) {
    if (mobile) {
      return (
        <div className="flex h-full min-h-0 flex-col bg-[var(--app-surface)]">
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--app-border)] px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--app-heading)]">
                Structure
              </h2>

              <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                Single post
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Done"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-[var(--app-muted)]
                hover:bg-[var(--app-hover)]
                hover:text-[var(--app-ink)]
              "
            >
              <Check
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {renderSections()}
          </div>
        </div>
      );
    }

    return (
      <aside
        className="
          flex
          h-full
          min-h-0
          min-w-0
          w-full
          flex-col
          overflow-hidden
          bg-[var(--app-surface)]
        "
      >
        <div
          className="
            flex
            min-w-0
            shrink-0
            items-center
            justify-between
            border-b
            border-[var(--app-border)]
            px-3
            py-3
          "
        >
          {open && (
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-[var(--app-heading)]">
                Structure
              </h2>

              <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                Single post
              </p>
            </div>
          )}

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-[var(--app-muted)]
                hover:bg-[var(--app-hover)]
                hover:text-[var(--app-ink)]
              "
              aria-label={
                open
                  ? "Collapse structure"
                  : "Expand structure"
              }
            >
              {open ? (
                <ChevronLeft
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <ChevronRight
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
        </div>

        {open ? (
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
            {renderSections()}
          </div>
        ) : (
          <div className="flex min-w-0 flex-col items-center overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => onSelect(0)}
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-medium",
                currentSlide === 0
                  ? "bg-[var(--app-active)] text-[var(--app-active-ink)]"
                  : "bg-[var(--app-surface-raised)] text-[var(--app-muted)] hover:text-[var(--app-ink)]",
              ].join(" ")}
              aria-label="Open single post"
              title={slides[0]?.title || "Single post"}
            >
              01
            </button>
          </div>
        )}
      </aside>
    );
  }

  /*
   * CAROUSEL
   *
   * Existing multi-section behavior.
   */

  if (mobile) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[var(--app-surface)]">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--app-border)] px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--app-heading)]">
              Structure
            </h2>

            <p className="mt-0.5 text-xs text-[var(--app-muted)]">
              {slides.length} sections
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Done"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[var(--app-muted)]
              hover:bg-[var(--app-hover)]
              hover:text-[var(--app-ink)]
            "
          >
            <Check
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {renderSections()}
        </div>

        <div className="shrink-0 border-t border-[var(--app-border)] p-3">
          <button
            type="button"
            onClick={onAdd}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-dashed
              border-[var(--app-border-strong)]
              px-4
              py-3
              text-sm
              font-medium
              text-[var(--app-ink)]
              hover:bg-[var(--app-hover)]
            "
          >
            <Plus
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Add section
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      className="
        flex
        h-full
        min-h-0
        min-w-0
        w-full
        flex-col
        overflow-hidden
        bg-[var(--app-surface)]
      "
    >
      <div
        className="
          flex
          min-w-0
          shrink-0
          items-center
          justify-between
          border-b
          border-[var(--app-border)]
          px-3
          py-3
        "
      >
        {open && (
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[var(--app-heading)]">
              Structure
            </h2>

            <p className="mt-0.5 text-xs text-[var(--app-muted)]">
              {slides.length} sections
            </p>
          </div>
        )}

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[var(--app-muted)]
              hover:bg-[var(--app-hover)]
              hover:text-[var(--app-ink)]
            "
            aria-label={open ? "Collapse structure" : "Expand structure"}
          >
            {open ? (
              <ChevronLeft
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </button>
        )}
      </div>

      {open ? (
        <>
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
            {renderSections()}
          </div>

          <div className="shrink-0 border-t border-[var(--app-border)] p-3">
            <button
              type="button"
              onClick={onAdd}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-dashed
                border-[var(--app-border-strong)]
                px-4
                py-3
                text-sm
                font-medium
                text-[var(--app-ink)]
                hover:bg-[var(--app-hover)]
              "
            >
              <Plus
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              Add section
            </button>
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-col items-center gap-2 overflow-y-auto p-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelect(index)}
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-medium",
                index === currentSlide
                  ? "bg-[var(--app-active)] text-[var(--app-active-ink)]"
                  : "bg-[var(--app-surface-raised)] text-[var(--app-muted)] hover:text-[var(--app-ink)]",
              ].join(" ")}
              aria-label={`Open section ${index + 1}`}
              title={slide.title || `Section ${index + 1}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}

          <button
            type="button"
            onClick={onAdd}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-dashed
              border-[var(--app-border-strong)]
              text-[var(--app-muted)]
              hover:bg-[var(--app-hover)]
              hover:text-[var(--app-ink)]
            "
            aria-label="Add section"
            title="Add section"
          >
            <Plus
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </aside>
  );
}