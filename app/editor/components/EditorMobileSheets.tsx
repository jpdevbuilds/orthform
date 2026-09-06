"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import StructurePanel from "./StructurePanel";
import Inspector from "./Inspector";

import type { TemplateId } from "@/lib/templates/templates";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type EditorMobileSheetsProps = {
  structureOpen: boolean;
  inspectorOpen: boolean;
  slides: Slide[];
  currentSlide: number;
  artifactFormat: ArtifactFormat;
  slide: Slide;
  systemName: string;
  philosophy?: string;
  input: string;
  generating: boolean;
  recomposing: boolean;

  templateId: TemplateId;
  onTemplateChange: (
    templateId: TemplateId
  ) => void;
  onRecompose: () => void;

  onSelect: (index: number) => void;
  onAdd: () => void;
  onRename: (index: number, title: string) => void;
  onDelete: (index: number) => void;
  onCloseStructure: () => void;
  onCloseInspector: () => void;
  onInputChange: (value: string) => void;
};

type MobileSheetProps = {
  label: string;
  onClose: () => void;
  children: ReactNode;
};

function MobileSheet({
  label,
  onClose,
  children,
}: MobileSheetProps) {
  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label={`Close ${label}`}
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/35
          backdrop-blur-sm
        "
      />

      {/* SHEET */}

      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="
          absolute
          inset-x-0
          bottom-0
          flex
          max-h-[82vh]
          flex-col
          overflow-hidden
          rounded-t-[28px]
          border-t
          border-[var(--app-border)]
          bg-[var(--app-surface)]
          text-[var(--app-ink)]
          shadow-[0_-12px_40px_rgba(0,0,0,0.14)]
          transition-colors
          duration-300
        "
      >
        {/* HANDLE */}

        <div className="shrink-0 px-5 pt-3">
          <div
            className="
              mx-auto
              h-1
              w-10
              rounded-full
              bg-[var(--app-muted)]/20
            "
          />
        </div>

        {/* HEADER */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            px-5
            pb-3
            pt-4
          "
        >
          <p
            className="
              text-[11px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[var(--app-muted)]
            "
          >
            {label}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${label}`}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[var(--app-border)]
              text-[var(--app-muted)]
              transition
              hover:border-[var(--app-accent)]
              hover:text-[var(--app-ink)]
              active:scale-95
            "
          >
            <X
              size={15}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* CONTENT */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-5
            pb-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EditorMobileSheets({
  structureOpen,
  inspectorOpen,
  slides,
  currentSlide,
  slide,
  systemName,
  philosophy,
  input,
  generating,
  templateId,
  onTemplateChange,
  artifactFormat,
  onRecompose,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onCloseStructure,
  onCloseInspector,
  onInputChange,
  recomposing,
}: EditorMobileSheetsProps) {
  return (
    <>
      {/* STRUCTURE */}

      {structureOpen && (
        <MobileSheet
          label="Structure"
          onClose={onCloseStructure}
        >
          <StructurePanel
            slides={slides}
            currentSlide={currentSlide}
            artifactFormat={artifactFormat}
            onSelect={onSelect}
            onAdd={onAdd}
            onRename={onRename}
            onDelete={onDelete}
            mobile
            onClose={onCloseStructure}
          />
        </MobileSheet>
      )}

      {/* INSPECTOR */}

      {inspectorOpen && (
        <MobileSheet
          label="Inspector"
          onClose={onCloseInspector}
        >
          <Inspector
            slide={slide}
            systemName={systemName}
            philosophy={philosophy}
            input={input}
            generating={generating}
            onInputChange={onInputChange}
            templateId={templateId}
            onTemplateChange={onTemplateChange}
            onRecompose={onRecompose}
            recomposing={recomposing}
            mobile
            onClose={onCloseInspector}
          />
        </MobileSheet>
      )}
    </>
  );
}