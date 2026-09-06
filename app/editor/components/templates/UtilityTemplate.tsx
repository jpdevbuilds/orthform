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

type UtilityTemplateProps = {
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

  onUpdate: (field: "title" | "body", value: string) => void;

  onEditStart: (field: "title" | "body") => void;
  onEditEnd: () => void;
};

export default function UtilityTemplate({
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
}: UtilityTemplateProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ==================================================
          SINGLE POST
          Practical, action-led composition.
          ================================================== */}

      {isSingle ? (
        <>
          {/* Accent block */}

          <div
            className="absolute left-0 top-0 h-full w-[6%]"
            style={{
              backgroundColor: canvasAccent,
            }}
          />

          {/* Header */}

          <div className="absolute left-10 right-10 top-10 sm:left-14 sm:right-14 sm:top-14">
            <TemplateHeader
              systemName={systemName}
              templateName="Utility"
              muted={canvasMuted}
            />
          </div>

          {/* Main utility composition */}

          <div className="absolute left-10 right-10 top-[25%] sm:left-14 sm:right-14">
            {/* Context */}

            <div className="mb-7">
              <TemplateLabel color={canvasMuted}>
                {slide.role || "Practical"}
              </TemplateLabel>
            </div>

            {/* Action / lesson */}

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
                max-w-[610px]
                resize-none
                overflow-hidden
                bg-transparent
                p-0
                font-bold
                leading-[0.96]
                tracking-[-0.05em]
                outline-none
              "
              style={{
                color: canvasInk,
                caretColor: canvasAccent,
                fontSize: "clamp(34px, 5vw, 64px)",
              }}
              aria-label="Post title"
            />

            {/* Action marker */}

            <div className="my-8 flex items-center gap-4">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: canvasAccent,
                }}
              />

              <div
                className="h-px w-20"
                style={{
                  backgroundColor: canvasAccent,
                }}
              />
            </div>

            {/* Explanation */}

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

            {/* Validation */}

            {(titleTooLong || bodyTooLong) && (
              <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-red-600">
                Content exceeds recommended density
              </div>
            )}
          </div>

          {/* Bottom utility marker */}

          <div className="absolute bottom-10 left-10 right-10 sm:bottom-14 sm:left-14 sm:right-14">
            <div className="flex items-end justify-between">
              <div>
                <div
                  className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{
                    color: canvasMuted,
                  }}
                >
                  Takeaway
                </div>

                <div
                  className="h-1 w-12"
                  style={{
                    backgroundColor: canvasAccent,
                  }}
                />
              </div>

              <TemplateFooter
                isSingle
                currentSlide={currentSlide}
                muted={canvasMuted}
              />
            </div>
          </div>
        </>
      ) : (
        /* ==================================================
           CAROUSEL
           ================================================== */

        <>
          {/* Accent rail */}

          <div
            className="absolute inset-y-0 left-0 w-[13%]"
            style={{
              backgroundColor: canvasAccent,
            }}
          />

          {/* Vertical label */}

          <div
            className="absolute bottom-12 left-[4.2%] top-12 flex items-center justify-center"
            style={{
              writingMode: "vertical-rl",
            }}
          >
            <span
              className="text-[9px] font-bold uppercase tracking-[0.22em]"
              style={{
                color: canvasInk,
              }}
            >
              Practical
            </span>
          </div>

          {/* Header */}

          <div className="absolute left-12 right-12 top-12">
            <TemplateHeader
              systemName={systemName}
              templateName="Utility"
              muted={canvasMuted}
            />
          </div>

          {/* Main practical card */}

          <div className="absolute bottom-[15%] left-[18%] right-12 top-[22%]">
            <div
              className="h-full border p-8"
              style={{
                borderColor: "rgba(47,47,47,0.16)",
                backgroundColor: "rgba(255,255,255,0.32)",
              }}
            >
              <div className="flex h-full flex-col">
                {/* Section label */}

                <div className="mb-8 flex items-center gap-3">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: canvasAccent,
                    }}
                  />

                  <TemplateLabel color={canvasMuted}>
                    {slide.role || "Action"}
                  </TemplateLabel>
                </div>

                {/* Title */}

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
                    leading-[1.02]
                    tracking-[-0.04em]
                    outline-none
                  "
                  style={{
                    color: canvasInk,
                    caretColor: canvasAccent,
                    fontSize: "clamp(28px, 4vw, 52px)",
                  }}
                  aria-label="Slide title"
                />

                {/* Divider */}

                <div
                  className="my-7 h-px w-full"
                  style={{
                    backgroundColor: "rgba(47,47,47,0.14)",
                  }}
                />

                {/* Body */}

                <textarea
                  value={slide.body}
                  onFocus={() => onEditStart("body")}
                  onChange={(event) =>
                    onUpdate("body", event.target.value)
                  }
                  onBlur={onEditEnd}
                  readOnly={recomposing}
                  rows={7}
                  className="
                    w-full
                    flex-1
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

                {/* Validation */}

                {(titleTooLong || bodyTooLong) && (
                  <div className="mt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-red-600">
                    Content exceeds recommended density
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="absolute bottom-12 left-[18%] right-12">
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