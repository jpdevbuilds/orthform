"use client";

import EditorCanvas from "./EditorCanvas";
import EditorMobileSheets from "./EditorMobileSheets";

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

type EditorMobileWorkspaceProps = {
  slides: Slide[];
  currentSlide: number;
  slide: Slide;
  totalSlides: number;

  systemName: string;
  philosophy?: string;
  input: string;
  generating: boolean;
  constraints: SlideConstraints;
  theme: Theme;
  templateId: TemplateId;
  artifactFormat: ArtifactFormat;
  recomposing: boolean;

  mobileStructureOpen: boolean;
  mobileInspectorOpen: boolean;

  onUpdate: (
    field: "title" | "body",
    value: string
  ) => void;

  onEditStart: (field: "title" | "body") => void;
  onEditEnd: () => void;

  onPrevious: () => void;
  onNext: () => void;

  onInputChange: (value: string) => void;

  onTemplateChange: (
    templateId: TemplateId
  ) => void;
  onRecompose: () => void;

  onSelect: (index: number) => void;
  onAdd: () => void;
  onRename: (index: number, title: string) => void;
  onDelete: (index: number) => void;

  onOpenStructure: () => void;
  onOpenInspector: () => void;

  onCloseStructure: () => void;
  onCloseInspector: () => void;
};

export default function EditorMobileWorkspace({
  slides,
  currentSlide,
  slide,
  totalSlides,
  systemName,
  philosophy,
  input,
  generating,
  constraints,
  theme,
  templateId,
  artifactFormat,
  recomposing,
  mobileStructureOpen,
  mobileInspectorOpen,
  onUpdate,
  onEditStart,
  onEditEnd,
  onPrevious,
  onNext,
  onInputChange,
  onTemplateChange,
  onRecompose,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onCloseStructure,
  onCloseInspector,
}: EditorMobileWorkspaceProps) {
  return (
    <div className="w-full min-w-0 lg:hidden">
      <div className="relative w-full min-w-0">
        <EditorCanvas
          slide={slide}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
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

      <EditorMobileSheets
        structureOpen={mobileStructureOpen}
        inspectorOpen={mobileInspectorOpen}
        slides={slides}
        currentSlide={currentSlide}
        slide={slide}
        systemName={systemName}
        philosophy={philosophy}
        artifactFormat={artifactFormat}
        input={input}
        generating={generating}
        templateId={templateId}
        onTemplateChange={onTemplateChange}
        onRecompose={onRecompose}
        onSelect={onSelect}
        onAdd={onAdd}
        onRename={onRename}
        onDelete={onDelete}
        onInputChange={onInputChange}
        onCloseStructure={onCloseStructure}
        onCloseInspector={onCloseInspector}
        recomposing={recomposing}
      />
    </div>
  );
}