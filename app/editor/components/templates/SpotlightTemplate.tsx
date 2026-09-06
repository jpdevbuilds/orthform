"use client";

import React from "react";
import TemplateHeader from "./shared/TemplateHeader";
import TemplateFooter from "./shared/TemplateFooter";
import TemplateLabel from "./shared/TemplateLabel";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type SpotlightTemplateProps = {
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

export default function SpotlightTemplate({
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
}: SpotlightTemplateProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ==================================================
          SINGLE POST
          ================================================== */}

      {isSingle ? (
        <>
          {/* Quiet asymmetric field */}

          <div
            className="absolute inset-y-0 left-0 w-[24%]"
            style={{
              backgroundColor: "rgba(47,47,47,0.035)",
            }}
          />

          {/* Oversized editorial mark */}

          <div
            className="
              absolute
              -right-4
              top-1/2
              -translate-y-1/2
              select-none
              text-[180px]
              font-bold
              leading-none
              tracking-[-0.09em]
            "
            style={{
              color: "rgba(47,47,47,0.045)",
            }}
          >
            01
          </div>

          {/* Header */}

          <div className="absolute left-10 right-10 top-10 sm:left-14 sm:right-14 sm:top-14">
            <TemplateHeader
              systemName={systemName}
              templateName="Spotlight"
              muted={canvasMuted}
            />
          </div>

          {/* Editorial statement */}

          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 sm:left-14 sm:right-14">
            <div className="mb-6">
              <TemplateLabel color={canvasAccent}>
                {slide.role || "Observation"}
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
                max-w-[620px]
                resize-none
                overflow-hidden
                bg-transparent
                p-0
                font-medium
                leading-[1]
                tracking-[-0.045em]
                outline-none
              "
              style={{
                color: canvasInk,
                caretColor: canvasAccent,
                fontSize: "clamp(32px, 4.8vw, 62px)",
              }}
              aria-label="Post title"
            />

            <div
              className="my-7 h-px w-14"
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
                max-w-[470px]
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
              <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-red-600">
                Content exceeds recommended density
              </div>
            )}
          </div>

          {/* Editorial divider */}

          <div
            className="absolute bottom-12 left-[10%] top-[30%] w-px"
            style={{
              backgroundColor: "rgba(47,47,47,0.12)",
            }}
          />

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
           CAROUSEL
           ================================================== */

        <>
          {/* Asymmetric visual field */}

          <div
            className="absolute inset-y-0 left-0 w-[34%]"
            style={{
              backgroundColor: "rgba(47,47,47,0.045)",
            }}
          />

          {/* Oversized slide index */}

          <div
            className="
              absolute
              -left-5
              bottom-[-30px]
              select-none
              text-[190px]
              font-bold
              leading-none
              tracking-[-0.08em]
            "
            style={{
              color: "rgba(47,47,47,0.055)",
            }}
          >
            {String(currentSlide + 1).padStart(2, "0")}
          </div>

          {/* Header */}

          <div className="absolute left-12 right-12 top-12">
            <TemplateHeader
              systemName={systemName}
              templateName="Spotlight"
              muted={canvasMuted}
            />
          </div>

          {/* Story content */}

          <div className="absolute left-[22%] right-12 top-1/2 -translate-y-1/2">
            <div
              className="mb-8 h-px w-14"
              style={{
                backgroundColor: canvasAccent,
              }}
            />

            <div className="mb-5">
              <TemplateLabel color={canvasAccent}>
                {slide.role || "Story"}
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
                font-medium
                leading-[1.02]
                tracking-[-0.04em]
                outline-none
              "
              style={{
                color: canvasInk,
                caretColor: canvasAccent,
                fontSize: "clamp(30px, 4.5vw, 56px)",
              }}
              aria-label="Slide title"
            />

            <div className="my-7 max-w-[420px]">
              <textarea
                value={slide.body}
                onFocus={() => onEditStart("body")}
                onChange={(event) =>
                  onUpdate("body", event.target.value)
                }
                onBlur={onEditEnd}
                readOnly={recomposing}
                rows={6}
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
            </div>

            {(titleTooLong || bodyTooLong) && (
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-red-600">
                Content exceeds recommended density
              </div>
            )}
          </div>

          {/* Vertical divider */}

          <div
            className="absolute bottom-12 left-[16%] top-[28%] w-px"
            style={{
              backgroundColor: "rgba(47,47,47,0.14)",
            }}
          />

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