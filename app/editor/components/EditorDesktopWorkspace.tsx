"use client";

import StructurePanel from "./StructurePanel";
import EditorCanvas from "./EditorCanvas";
import Inspector from "./Inspector";
import DesktopWorkspaceFrame from "./desktop/DesktopWorkspaceFrame";

import type { TemplateId } from "@/lib/templates/templates";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type Theme = "light" | "dark";

type SlideConstraints = {
  titleMaxWords: number;
  bodyMaxWords: number;
  bodyMaxCharacters: number;
};

type EditorDesktopWorkspaceProps = {
  slides: Slide[];
  currentSlide: number;
  slide: Slide;
  systemName: string;
  philosophy?: string;
  input: string;
  generating: boolean;
  constraints: SlideConstraints;
  theme: Theme;
  templateId: TemplateId;
  artifactFormat: ArtifactFormat;
  recomposing: boolean;
  structureOpen: boolean;
  inspectorOpen: boolean;

  onInputChange: (value: string) => void;
  onTemplateChange: (templateId: TemplateId) => void;
  onRecompose: () => void;

  onSelect: (index: number) => void;
  onAdd: () => void;
  onRename: (index: number, title: string) => void;
  onDelete: (index: number) => void;

  onUpdate: (
    field: "title" | "body",
    value: string
  ) => void;

  onEditStart: (field: "title" | "body") => void;
  onEditEnd: () => void;

  onPrevious: () => void;
  onNext: () => void;

  onToggleStructure: () => void;
  onToggleInspector: () => void;
};

export default function EditorDesktopWorkspace({
  slides,
  currentSlide,
  slide,
  systemName,
  philosophy,
  input,
  generating,
  constraints,
  theme,
  templateId,
  artifactFormat,
  recomposing,
  structureOpen,
  inspectorOpen,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onUpdate,
  onEditStart,
  onEditEnd,
  onPrevious,
  onNext,
  onToggleStructure,
  onToggleInspector,
  onInputChange,
  onTemplateChange,
  onRecompose,
}: EditorDesktopWorkspaceProps) {
  const structureWidth = structureOpen
    ? "220px"
    : "52px";

  const inspectorWidth = inspectorOpen
    ? "260px"
    : "52px";

  return (
    <div
      className="
        hidden
        min-h-[calc(100vh-73px)]
        px-4
        py-4
        lg:block
        xl:px-6
        xl:py-6
      "
    >
      <DesktopWorkspaceFrame
        structureWidth={structureWidth}
        inspectorWidth={inspectorWidth}
      >
        {/* STRUCTURE */}

        <div
          className="
            min-w-0
            overflow-hidden
            border-r
            border-[var(--app-border)]
          "
        >
          <StructurePanel
            slides={slides}
            currentSlide={currentSlide}
            artifactFormat={artifactFormat}
            onSelect={onSelect}
            onAdd={onAdd}
            onRename={onRename}
            onDelete={onDelete}
            open={structureOpen}
            onToggle={onToggleStructure}
          />
        </div>

        {/* CANVAS */}

        <div
          className="
            min-w-0
            overflow-y-auto
            overflow-x-hidden
            bg-[var(--app-bg)]
          "
        >
          <EditorCanvas
            slide={slide}
            currentSlide={currentSlide}
            totalSlides={slides.length}
            systemName={systemName}
            generating={generating}
            recomposing={recomposing}
            constraints={constraints}
            theme={theme}
            templateId={templateId}
            artifactFormat={artifactFormat}
            onUpdate={onUpdate}
            onEditStart={onEditStart}
            onEditEnd={onEditEnd}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>

        {/* INSPECTOR */}

        <div
          className="
            min-w-0
            overflow-hidden
            border-l
            border-[var(--app-border)]
          "
        >
          <Inspector
            slide={slide}
            systemName={systemName}
            philosophy={philosophy}
            input={input}
            generating={generating}
            open={inspectorOpen}
            onToggle={onToggleInspector}
            onInputChange={onInputChange}
            recomposing={recomposing}
            templateId={templateId}
            onTemplateChange={onTemplateChange}
            onRecompose={onRecompose}
          />
        </div>
      </DesktopWorkspaceFrame>
    </div>
  );
}