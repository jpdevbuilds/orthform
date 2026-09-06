"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import ExportRenderer from "./ExportRenderer";
import { renderSlide } from "@/lib/export/renderSlide";
import type { TemplateId } from "@/lib/templates/templates";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

export type EditorExportHandle = {
  exportCurrent: () => Promise<void>;
  exportAll: () => Promise<void>;
};

type EditorExportProps = {
  slides: Slide[];
  currentSlide: number;
  documentTitle: string;
  systemName: string;
  templateId: TemplateId;
  artifactFormat: ArtifactFormat;
  onExportingChange: (exporting: boolean) => void;
  onError: (error: string) => void;
};

const EditorExport = forwardRef<
  EditorExportHandle,
  EditorExportProps
>(function EditorExport(
  {
    slides,
    currentSlide,
    documentTitle,
    systemName,
    templateId,
    artifactFormat,
    onExportingChange,
    onError,
  },
  ref
) {
  const currentExportRef =
    useRef<HTMLDivElement>(null);

  const allExportRef =
    useRef<HTMLDivElement>(null);

  const waitForRender = async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  };

  const exportCurrent = async () => {
    const slide = slides[currentSlide];

    if (!slide) {
      onError("There is no content to export.");
      return;
    }

    onExportingChange(true);
    onError("");

    try {
      await waitForRender();

      if (!currentExportRef.current) {
        throw new Error(
          "Export renderer is not ready."
        );
      }

      const filename =
        `${documentTitle || "orthform-slide"}-${String(
          currentSlide + 1
        ).padStart(2, "0")}.png`;

      await renderSlide(
        currentExportRef.current,
        filename
      );
    } catch (error) {
      console.error(
        "Orthform export error:",
        error
      );

      onError(
        error instanceof Error
          ? error.message
          : "Could not export this slide."
      );
    } finally {
      onExportingChange(false);
    }
  };

  const exportAll = async () => {
    if (!slides.length) {
      onError("There are no slides to export.");
      return;
    }

    onExportingChange(true);
    onError("");

    try {
      await waitForRender();

      if (!allExportRef.current) {
        throw new Error(
          "Export renderer is not ready."
        );
      }

      const exportSlides =
        allExportRef.current.querySelectorAll<HTMLElement>(
          "[data-export-slide]"
        );

      if (exportSlides.length !== slides.length) {
        throw new Error(
          "Not all slides are ready for export."
        );
      }

      for (
        let index = 0;
        index < exportSlides.length;
        index++
      ) {
        const filename =
          `${documentTitle || "orthform-slide"}-${String(
            index + 1
          ).padStart(2, "0")}.png`;

        await renderSlide(
          exportSlides[index],
          filename
        );

        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 150);
        });
      }
    } catch (error) {
      console.error(
        "Orthform export all error:",
        error
      );

      onError(
        error instanceof Error
          ? error.message
          : "Could not export all slides."
      );
    } finally {
      onExportingChange(false);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      exportCurrent,
      exportAll,
    }),
    [
      slides,
      currentSlide,
      documentTitle,
      systemName,
      templateId,
      artifactFormat,
    ]
  );

  const current = slides[currentSlide];

  return (
    <>
      {/* Current slide export target */}
      <div
        className="
          pointer-events-none
          fixed
          left-[-10000px]
          top-0
          z-[-1]
        "
        aria-hidden="true"
      >
        {current && (
          <div ref={currentExportRef}>
            <ExportRenderer
              slide={current}
              systemName={systemName}
              templateId={templateId}
              artifactFormat={artifactFormat}
              totalSlides={slides.length}
            />
          </div>
        )}
      </div>

      {/* All slides export targets */}
      <div
        ref={allExportRef}
        className="
          pointer-events-none
          fixed
          left-[-10000px]
          top-0
          z-[-1]
        "
        aria-hidden="true"
      >
        {slides.map((slide) => (
          <div key={slide.id}>
            <ExportRenderer
              slide={slide}
              systemName={systemName}
              templateId={templateId}
              artifactFormat={artifactFormat}
              totalSlides={slides.length}
            />
          </div>
        ))}
      </div>
    </>
  );
});

export default EditorExport;