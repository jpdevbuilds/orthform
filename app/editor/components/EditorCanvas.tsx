"use client";

import { useCanvasDensity } from "./canvas/useCanvasDensity";
import { useCanvasSwipe } from "./canvas/useCanvasSwipe";
import { getCanvasTheme } from "./canvas/getCanvasTheme";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";
import type { TemplateId } from "@/lib/templates/templates";

import AuthorityTemplate from "./templates/AuthorityTemplate";
import SpotlightTemplate from "./templates/SpotlightTemplate";
import UtilityTemplate from "./templates/UtilityTemplate";
import ComparisonTemplate from "./templates/ComparisonTemplate";

import RecompositionOverlay from "./canvas/RecompositionOverlay";
import CanvasNavigation from "./canvas/CanvasNavigation";
import CanvasMetadata from "./canvas/CanvasMetadata";
import CanvasFrame from "./canvas/CanvasFrame";
import CanvasDensity from "./canvas/CanvasDensity";
import CanvasHint from "./canvas/CanvasHint";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type SlideConstraints = {
  titleMaxWords: number;
  bodyMaxWords: number;
  bodyMaxCharacters: number;
};

type Theme = "light" | "dark";

type EditorCanvasProps = {
  slide: Slide;
  currentSlide: number;
  totalSlides: number;
  systemName: string;
  generating: boolean;
  recomposing: boolean;
  constraints: SlideConstraints;
  theme: Theme;
  templateId?: TemplateId;
  artifactFormat: ArtifactFormat;

  onUpdate: (
    field: "title" | "body",
    value: string
  ) => void;

  onEditStart: (field: "title" | "body") => void;
  onEditEnd: () => void;

  onPrevious: () => void;
  onNext: () => void;
};

export default function EditorCanvas({
  slide,
  currentSlide,
  totalSlides,
  systemName,
  generating,
  recomposing,
  constraints,
  theme,
  templateId = "authority",
  artifactFormat,
  onUpdate,
  onEditStart,
  onEditEnd,
  onPrevious,
  onNext,
}: EditorCanvasProps) {
  // --------------------------------------------------
  // Artifact format
  // --------------------------------------------------

  const isSingle = artifactFormat === "single";
  const isCarousel = artifactFormat === "carousel";

  // --------------------------------------------------
  // Swipe navigation
  // --------------------------------------------------

  const {
    handleTouchStart,
    handleTouchEnd,
  } = useCanvasSwipe({
    enabled: isCarousel && !recomposing,
    onPrevious,
    onNext,
  });

  // --------------------------------------------------
  // Density
  // --------------------------------------------------

  const {
    titleWords,
    bodyWords,
    bodyCharacters,
    titleTooLong,
    bodyWordsTooLong,
    bodyCharactersTooLong,
    bodyTooLong,
    bodyPercentage,
    densityStatus,
  } = useCanvasDensity(slide, constraints);

  // --------------------------------------------------
  // Canvas theme
  // --------------------------------------------------

  const {
    isAuthority,
    isSpotlight,
    isUtility,
    background: canvasBackground,
    ink: canvasInk,
    muted: canvasMuted,
    accent: canvasAccent,
    border: canvasBorder,
  } = getCanvasTheme(templateId);

  const isComparison = templateId === "comparison";

  // --------------------------------------------------
  // Format presentation
  // --------------------------------------------------

  const canvasAspectClass = "aspect-[4/5]";

  const canvasInteractionClass = isCarousel
    ? "cursor-grab active:cursor-grabbing"
    : "cursor-default";

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <main
      className="
        relative
        min-h-0
        min-w-0
        overflow-hidden
        bg-[var(--app-bg)]
        text-[var(--app-ink)]
        transition-colors
        duration-300
      "
    >
      <div
        className="
          flex
          min-h-full
          w-full
          min-w-0
          max-w-full
          justify-center
          px-3
          py-4
          sm:px-6
          sm:py-8
          lg:px-10
          lg:py-10
          xl:px-14
        "
      >
        <div className="w-full min-w-0 max-w-[760px]">

          {/* ==================================================
              CANVAS METADATA
              ================================================== */}

          <CanvasMetadata
            isSingle={isSingle}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            systemName={systemName}
          />

          {/* ==================================================
              CANVAS
              ================================================== */}

          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`
              relative
              w-full
              min-w-0
              touch-pan-y
              select-none
              ${canvasInteractionClass}
            `}
          >
            <div
              className={`
                relative
                w-full
                overflow-hidden
                ${canvasAspectClass}
              `}
            >
              <CanvasFrame
                backgroundColor={canvasBackground}
                borderColor={canvasBorder}
              >

                {/* ==================================================
                    AUTHORITY
                    ================================================== */}

                {isAuthority && (
                  <AuthorityTemplate
                    slide={slide}
                    systemName={systemName}
                    recomposing={recomposing}
                    titleTooLong={titleTooLong}
                    bodyTooLong={bodyTooLong}
                    isSingle={isSingle}
                    currentSlide={currentSlide}
                    canvasInk={canvasInk}
                    canvasMuted={canvasMuted}
                    canvasAccent={canvasAccent}
                    onUpdate={onUpdate}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                  />
                )}

                {/* ==================================================
                    SPOTLIGHT
                    ================================================== */}

                {isSpotlight && (
                  <SpotlightTemplate
                    slide={slide}
                    systemName={systemName}
                    recomposing={recomposing}
                    titleTooLong={titleTooLong}
                    bodyTooLong={bodyTooLong}
                    isSingle={isSingle}
                    currentSlide={currentSlide}
                    canvasInk={canvasInk}
                    canvasMuted={canvasMuted}
                    canvasAccent={canvasAccent}
                    onUpdate={onUpdate}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                  />
                )}

                {/* ==================================================
                    UTILITY
                    ================================================== */}

                {isUtility && (
                  <UtilityTemplate
                    slide={slide}
                    systemName={systemName}
                    recomposing={recomposing}
                    titleTooLong={titleTooLong}
                    bodyTooLong={bodyTooLong}
                    isSingle={isSingle}
                    currentSlide={currentSlide}
                    canvasInk={canvasInk}
                    canvasMuted={canvasMuted}
                    canvasAccent={canvasAccent}
                    onUpdate={onUpdate}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                  />
                )}

                {/* ==================================================
                    COMPARISON
                    ================================================== */}

                {isComparison && (
                  <ComparisonTemplate
                    slide={slide}
                    systemName={systemName}
                    recomposing={recomposing}
                    titleTooLong={titleTooLong}
                    bodyTooLong={bodyTooLong}
                    isSingle={isSingle}
                    currentSlide={currentSlide}
                    canvasInk={canvasInk}
                    canvasMuted={canvasMuted}
                    canvasAccent={canvasAccent}
                    onUpdate={onUpdate}
                    onEditStart={onEditStart}
                    onEditEnd={onEditEnd}
                  />
                )}

                {/* ==================================================
                    CAROUSEL NAVIGATION
                    ================================================== */}

                <CanvasNavigation
                  visible={isCarousel}
                  currentSlide={currentSlide}
                  totalSlides={totalSlides}
                  onPrevious={onPrevious}
                  onNext={onNext}
                />

                {/* ==================================================
                    RECOMPOSITION
                    ================================================== */}

                <RecompositionOverlay
                  visible={recomposing}
                />

              </CanvasFrame>
            </div>
          </div>

          {/* ==================================================
              DENSITY
              ================================================== */}

          <CanvasDensity
            titleWords={titleWords}
            bodyWords={bodyWords}
            bodyCharacters={bodyCharacters}
            titleMaxWords={constraints.titleMaxWords}
            bodyMaxWords={constraints.bodyMaxWords}
            bodyMaxCharacters={constraints.bodyMaxCharacters}
            titleTooLong={titleTooLong}
            bodyWordsTooLong={bodyWordsTooLong}
            bodyCharactersTooLong={bodyCharactersTooLong}
            bodyTooLong={bodyTooLong}
            bodyPercentage={bodyPercentage}
            densityStatus={densityStatus}
          />

          {/* ==================================================
              DESKTOP HINT
              ================================================== */}

          <CanvasHint visible={isCarousel} />

        </div>
      </div>
    </main>
  );
}