"use client";

import React from "react";
import TemplateHeader from "./shared/TemplateHeader";
import TemplateFooter from "./shared/TemplateFooter";
import TemplateLabel from "./shared/TemplateLabel";
import AuthorityCorner from "./shared/AuthorityCorner";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type AuthorityTemplateProps = {
  slide: Slide;
  systemName: string;
  recomposing: boolean;
  titleTooLong: boolean;
  bodyTooLong: boolean;
  isSingle: boolean;
  currentSlide: number;
  canvasInk: string;
  canvasMuted: string;
  canvasAccent: string;

  onUpdate: (
    field: "title" | "body",
    value: string
  ) => void;

  onEditStart: (field: "title" | "body") => void;
  onEditEnd: () => void;
};

export default function AuthorityTemplate({
  slide,
  systemName,
  recomposing,
  titleTooLong,
  bodyTooLong,
  isSingle,
  currentSlide,
  canvasInk,
  canvasMuted,
  canvasAccent,
  onUpdate,
  onEditStart,
  onEditEnd,
}: AuthorityTemplateProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ==================================================
          EDITORIAL GRID
          ================================================== */}

      <div
        className={`absolute inset-0 ${
          isSingle ? "opacity-[0.04]" : "opacity-[0.07]"
        }`}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${canvasInk} 1px, transparent 1px),
            linear-gradient(to bottom, ${canvasInk} 1px, transparent 1px)
          `,
          backgroundSize: isSingle
            ? "72px 72px"
            : "48px 48px",
        }}
      />

      {/* ==================================================
          FRAME
          ================================================== */}

      {!isSingle && (
        <div
          className="absolute inset-6 border"
          style={{
            borderColor: "rgba(255,255,255,0.18)",
          }}
        />
      )}

      {/* ==================================================
          CORNER MARKS
          ================================================== */}

      <AuthorityCorner
        position="top-left"
        color={canvasAccent}
      />

      <AuthorityCorner
        position="top-right"
        color={canvasAccent}
      />

      <AuthorityCorner
        position="bottom-left"
        color={canvasAccent}
      />

      <AuthorityCorner
        position="bottom-right"
        color={canvasAccent}
      />

      {/* ==================================================
          SINGLE POST
          Statement-led composition.
          ================================================== */}

      {isSingle ? (
        <>
          {/* Header */}

          <div className="absolute left-10 right-10 top-10 sm:left-14 sm:right-14 sm:top-14">
            <TemplateHeader
              systemName={systemName}
              templateName="Authority"
              muted={canvasMuted}
            />
          </div>

          {/* Main statement */}

          <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 sm:inset-x-14">
            <div className="max-w-[620px]">
              <div className="mb-8">
                <TemplateLabel color={canvasAccent}>
                  {slide.role || "Key insight"}
                </TemplateLabel>
              </div>

              <textarea
                value={slide.title}
                onFocus={() => onEditStart("title")}
                onChange={(event) =>
                  onUpdate("title", event.target.value)
                }
                onBlur={onEditEnd}
                readOnly={recomposing}
                rows={4}
                className="
                  w-full
                  resize-none
                  overflow-hidden
                  bg-transparent
                  p-0
                  font-bold
                  leading-[0.92]
                  tracking-[-0.055em]
                  outline-none
                "
                style={{
                  color: canvasInk,
                  caretColor: canvasAccent,
                  fontSize: "clamp(36px, 5.5vw, 72px)",
                }}
                aria-label="Post title"
              />

              <div
                className="my-9 h-[3px] w-16"
                style={{
                  backgroundColor: canvasAccent,
                }}
              />

              <textarea
                value={slide.body}
                onFocus={() => onEditStart("body")}
                onChange={(event) =>
                  onUpdate("body", event.target.value)
                }
                onBlur={onEditEnd}
                readOnly={recomposing}
                rows={4}
                className="
                  w-full
                  max-w-[500px]
                  resize-none
                  overflow-hidden
                  bg-transparent
                  p-0
                  leading-7
                  outline-none
                "
                style={{
                  color: canvasMuted,
                  caretColor: canvasAccent,
                  fontSize: "15px",
                }}
                aria-label="Post body"
              />

              {(titleTooLong || bodyTooLong) && (
                <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-red-200">
                  Content exceeds recommended density
                </div>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="absolute bottom-10 left-10 right-10 sm:bottom-14 sm:left-14 sm:right-14">
            <TemplateFooter
              isSingle
              currentSlide={currentSlide}
              muted={canvasMuted}
            />
          </div>
        </>
      ) : (
        /* ==================================================
           CAROUSEL SLIDE
           ================================================== */

        <>
          {/* Header */}

          <div className="absolute left-12 right-12 top-12">
            <TemplateHeader
              systemName={systemName}
              templateName="Authority"
              muted={canvasMuted}
            />
          </div>

          {/* Main editorial content */}

          <div className="absolute inset-x-12 top-1/2 -translate-y-1/2">
            <div className="mb-6">
              <TemplateLabel color={canvasAccent}>
                {slide.role || "Key insight"}
              </TemplateLabel>
            </div>

            <textarea
              value={slide.title}
              onFocus={() => onEditStart("title")}
              onChange={(event) =>
                onUpdate("title", event.target.value)
              }
              onBlur={onEditEnd}
              readOnly={recomposing}
              rows={3}
              className="
                w-full
                resize-none
                overflow-hidden
                bg-transparent
                p-0
                font-bold
                leading-[0.98]
                tracking-[-0.045em]
                outline-none
              "
              style={{
                color: canvasInk,
                caretColor: canvasAccent,
                fontSize: "clamp(32px, 5vw, 64px)",
              }}
              aria-label="Slide title"
            />

            <div
              className="my-7 h-px w-16"
              style={{
                backgroundColor: canvasAccent,
              }}
            />

            <textarea
              value={slide.body}
              onFocus={() => onEditStart("body")}
              onChange={(event) =>
                onUpdate("body", event.target.value)
              }
              onBlur={onEditEnd}
              readOnly={recomposing}
              rows={5}
              className="
                w-full
                resize-none
                overflow-hidden
                bg-transparent
                p-0
                leading-7
                outline-none
              "
              style={{
                color: canvasMuted,
                caretColor: canvasAccent,
                fontSize: "15px",
              }}
              aria-label="Slide body"
            />

            {(titleTooLong || bodyTooLong) && (
              <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-red-200">
                Content exceeds recommended density
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="absolute bottom-12 left-12 right-12">
            <TemplateFooter
              isSingle={false}
              currentSlide={currentSlide}
              muted={canvasMuted}
            />
          </div>
        </>
      )}
    </div>
  );
}