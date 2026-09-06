"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { TemplateId } from "@/lib/templates/templates";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type InspectorProps = {
  slide: Slide;
  systemName: string;
  philosophy?: string;
  input: string;
  generating: boolean;
  recomposing: boolean;

  // Source idea
  onInputChange: (value: string) => void;

  // Template
  templateId: TemplateId;
  onTemplateChange: (templateId: TemplateId) => void;
  onRecompose: () => void;

  // Mobile
  mobile?: boolean;
  onClose?: () => void;

  // Desktop
  open?: boolean;
  onToggle?: () => void;
};

export default function Inspector({
  slide,
  systemName,
  philosophy,
  input,
  generating,
  recomposing,
  onInputChange,
  templateId,
  onTemplateChange,
  onRecompose,
  mobile = false,
  open = true,
  onToggle,
  onClose,
}: InspectorProps) {
  // --------------------------------------------------
  // Mobile
  // --------------------------------------------------

  if (mobile) {
    return (
      <aside
        className="
          flex
          min-h-0
          flex-col
          bg-[var(--editor-surface)]
          text-[var(--editor-ink)]
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--editor-muted)]">
            Inspector
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[var(--editor-border)]
              bg-[var(--editor-surface)]
              text-[var(--editor-muted)]
              transition
              hover:border-[var(--editor-accent)]
              hover:text-[var(--editor-ink)]
            "
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}

        <div className="mt-6">
          <InspectorContent
            slide={slide}
            systemName={systemName}
            philosophy={philosophy}
            input={input}
            generating={generating}
            recomposing={recomposing}
            onInputChange={onInputChange}
            templateId={templateId}
            onTemplateChange={onTemplateChange}
            onRecompose={onRecompose}
          />
        </div>
      </aside>
    );
  }

  // --------------------------------------------------
  // Desktop
  // --------------------------------------------------

  return (
    <aside
      className={`hidden h-full min-h-[calc(100vh-73px)] flex-col overflow-hidden bg-[var(--editor-surface)] text-[var(--editor-ink)] transition-[padding] duration-200 lg:flex ${
        open ? "p-5" : "items-center px-2 py-5"
      }`}
    >
      {/* Header */}

      <div
        className={`flex w-full shrink-0 items-center ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        {open && (
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--editor-muted)]">
            Inspector
          </p>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            open
              ? "Collapse inspector panel"
              : "Expand inspector panel"
          }
          title={
            open
              ? "Collapse inspector"
              : "Expand inspector"
          }
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-[var(--editor-border)]
            bg-[var(--editor-surface)]
            text-[var(--editor-muted)]
            transition
            hover:border-[var(--editor-accent)]
            hover:text-[var(--editor-ink)]
          "
        >
          {open ? (
            <ChevronRight size={15} strokeWidth={1.8} />
          ) : (
            <ChevronLeft size={15} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Expanded */}

      {open && (
        <div className="mt-5 flex-1 overflow-y-auto">
          <InspectorContent
            slide={slide}
            systemName={systemName}
            philosophy={philosophy}
            input={input}
            generating={generating}
            recomposing={recomposing}
            onInputChange={onInputChange}
            templateId={templateId}
            onTemplateChange={onTemplateChange}
            onRecompose={onRecompose}
          />
        </div>
      )}
    </aside>
  );
}

// --------------------------------------------------
// Inspector Content
// --------------------------------------------------

function InspectorContent({
  slide,
  systemName,
  philosophy,
  input,
  generating,
  recomposing,
  onInputChange,
  templateId,
  onTemplateChange,
  onRecompose,
}: {
  slide: Slide;
  systemName: string;
  philosophy?: string;
  input: string;
  generating: boolean;
  recomposing: boolean;
  onInputChange: (value: string) => void;
  templateId: TemplateId;
  onTemplateChange: (templateId: TemplateId) => void;
  onRecompose: () => void;
}) {
  return (
    <div>
      {/* Source idea */}

      <section>
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--editor-muted)]">
            Source idea
          </p>

          <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--editor-subtle)]">
            Editable
          </span>
        </div>

        <textarea
          value={input}
          onChange={(event) =>
            onInputChange(event.target.value)
          }
          placeholder="Enter the idea you want Orthform to work from..."
          rows={7}
          className="
            mt-3
            w-full
            resize-y
            rounded-xl
            border
            border-[var(--editor-border)]
            bg-[var(--editor-bg)]
            px-3
            py-3
            text-sm
            leading-6
            text-[var(--editor-ink)]
            outline-none
            transition
            placeholder:text-[var(--editor-muted)]
            focus:border-[var(--editor-accent)]
            focus:ring-1
            focus:ring-[var(--editor-accent)]
          "
        />

        <p className="mt-2 text-[10px] leading-4 text-[var(--editor-muted)]">
          This is the source Orthform uses when generating the
          artifact.
        </p>
      </section>

      {/* Current section */}

      <section className="mt-8 border-t border-[var(--editor-border)] pt-5">
        <p className="text-xs text-[var(--editor-muted)]">
          Current section
        </p>

        <p className="mt-2 text-sm font-medium text-[var(--editor-ink)]">
          {slide.title}
        </p>

        <p className="mt-1 text-xs text-[var(--editor-muted)]">
          {slide.role}
        </p>
      </section>

      {/* Template */}

      <section className="mt-8 border-t border-[var(--editor-border)] pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--editor-muted)]">
            Template
          </p>

          <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--editor-subtle)]">
            {recomposing
              ? "Recomposing"
              : "Editorial mode"}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          <TemplateOption
            id="authority"
            name="Authority"
            description="Bold, structured and expertise-led."
            active={templateId === "authority"}
            disabled={generating || recomposing}
            onSelect={onTemplateChange}
          />

          <TemplateOption
            id="spotlight"
            name="Spotlight"
            description="Story-driven and human-centered."
            active={templateId === "spotlight"}
            disabled={generating || recomposing}
            onSelect={onTemplateChange}
          />

          <TemplateOption
            id="utility"
            name="Utility"
            description="Practical, action-oriented and direct."
            active={templateId === "utility"}
            disabled={generating || recomposing}
            onSelect={onTemplateChange}
          />

          <TemplateOption
            id="comparison"
            name="Comparison"
            description="Contrast-driven and insight-focused."
            active={templateId === "comparison"}
            disabled={generating || recomposing}
            onSelect={onTemplateChange}
          />
        </div>

        {/* Explicit AI action */}

        <button
          type="button"
          onClick={onRecompose}
          disabled={
            generating ||
            recomposing ||
            !input.trim()
          }
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            px-3
            py-2.5
            text-[11px]
            font-semibold
            transition
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          style={{
            backgroundColor: "var(--editor-ink)",
            color: "var(--editor-surface)",
          }}
        >
          {recomposing
            ? "Recomposing…"
            : "Recompose with AI"}
        </button>

        <p className="mt-2 text-[10px] leading-4 text-[var(--editor-muted)]">
          Select a template to preview it instantly. Use
          Recompose with AI when you want Orthform to reshape
          the content for that template.
        </p>
      </section>

      {/* Editorial system */}

      <section className="mt-8 border-t border-[var(--editor-border)] pt-5">
        <p className="text-xs text-[var(--editor-muted)]">
          Editorial system
        </p>

        <p className="mt-2 text-sm font-medium text-[var(--editor-ink)]">
          {systemName}
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--editor-muted)]">
          {philosophy ||
            "No editorial philosophy available."}
        </p>
      </section>

      {/* Status */}

      <section className="mt-8 border-t border-[var(--editor-border)] pt-5">
        <p className="text-xs text-[var(--editor-muted)]">
          Status
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              generating || recomposing
                ? "animate-pulse bg-[var(--editor-accent)]"
                : "bg-[var(--editor-accent)]"
            }`}
          />

          <span className="text-xs text-[var(--editor-ink)]">
            {generating
              ? "Generating draft"
              : recomposing
              ? "Recomposing artifact"
              : "Ready"}
          </span>
        </div>
      </section>
    </div>
  );
}

// --------------------------------------------------
// Template Option
// --------------------------------------------------

function TemplateOption({
  id,
  name,
  description,
  active,
  disabled,
  onSelect,
}: {
  id: TemplateId;
  name: string;
  description: string;
  active: boolean;
  disabled: boolean;
  onSelect: (templateId: TemplateId) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={`
        w-full
        rounded-xl
        border
        px-3
        py-3
        text-left
        transition
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${
          active
            ? "border-[var(--editor-accent)] bg-[var(--editor-accent-soft)]"
            : "border-[var(--editor-border)] bg-[var(--editor-surface)] hover:border-[var(--editor-accent)]"
        }
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-sm font-medium ${
            active
              ? "text-[var(--editor-accent)]"
              : "text-[var(--editor-ink)]"
          }`}
        >
          {name}
        </span>

        <span
          className={`
            flex
            h-4
            w-4
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              active
                ? "bg-[var(--editor-accent)] text-[var(--editor-surface)]"
                : "border border-[var(--editor-border-strong)]"
            }
          `}
        >
          {active && (
            <Check size={10} strokeWidth={2.5} />
          )}
        </span>
      </div>

      <p className="mt-1 text-[11px] leading-4 text-[var(--editor-muted)]">
        {description}
      </p>
    </button>
  );
}