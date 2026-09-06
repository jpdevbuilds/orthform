"use client";

import React from "react";

import TemplateHeader from "./shared/TemplateHeader";
import TemplateLabel from "./shared/TemplateLabel";
import TemplateFooter from "./shared/TemplateFooter";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type ComparisonTemplateProps = {
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

function parseComparisonBody(body: string) {
  const parts = body
    .split(/\n\s*---\s*\n/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return {
      left: parts[0],
      right: parts.slice(1).join("\n"),
      hasComparison: true,
    };
  }

  return {
    left: body.trim(),
    right: "",
    hasComparison: false,
  };
}

export default function ComparisonTemplate({
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
}: ComparisonTemplateProps) {
  const {
    left,
    right,
    hasComparison,
  } = parseComparisonBody(slide.body);

  const leftContent = left;
  const rightContent = right;

  const updateLeft = (value: string) => {
    onUpdate(
      "body",
      `${value.trim()}\n---\n${rightContent}`
    );
  };

  const updateRight = (value: string) => {
    onUpdate(
      "body",
      `${leftContent}\n---\n${value.trim()}`
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ==================================================
          SINGLE POST
          Comparison-first composition.
          ================================================== */}

      {isSingle ? (
        <>
          {/* Header */}

          <div className="absolute left-10 right-10 top-10 sm:left-14 sm:right-14 sm:top-14">
            <TemplateHeader
              systemName={systemName}
              templateName="Comparison"
              muted={canvasMuted}
            />
          </div>

          {/* Central marker */}

          <div
            className="absolute left-1/2 top-[23%] h-14 w-px -translate-x-1/2"
            style={{
              backgroundColor: canvasAccent,
            }}
          />

          {/* Main comparison */}

          <div className="absolute inset-x-8 top-[33%] sm:inset-x-14">
            <div className="mb-7">
              <TemplateLabel color={canvasAccent}>
                {slide.role || "The distinction"}
              </TemplateLabel>
            </div>

            <div className="grid grid-cols-2">
              {/* BEFORE */}

              <div
                className="border-r pr-5 sm:pr-10"
                style={{
                  borderColor:
                    "rgba(47,47,47,0.14)",
                }}
              >
                <p
                  className="
                    mb-4
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color: canvasMuted,
                  }}
                >
                  Before
                </p>

                <div
                  contentEditable={!recomposing}
                  suppressContentEditableWarning
                  onFocus={() => onEditStart("body")}
                  onBlur={(event) => {
                    updateLeft(
                      event.currentTarget.textContent || ""
                    );
                    onEditEnd();
                  }}
                  className={`
                    min-h-[76px]
                    outline-none
                    ${bodyTooLong ? "opacity-70" : ""}
                  `}
                  style={{
                    color: canvasInk,
                    fontSize:
                      "clamp(18px, 2.5vw, 30px)",
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {leftContent}
                </div>
              </div>

              {/* AFTER */}

              <div className="pl-5 sm:pl-10">
                <p
                  className="
                    mb-4
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color: canvasMuted,
                  }}
                >
                  After
                </p>

                <div
                  contentEditable={!recomposing}
                  suppressContentEditableWarning
                  onFocus={() => onEditStart("body")}
                  onBlur={(event) => {
                    updateRight(
                      event.currentTarget.textContent || ""
                    );
                    onEditEnd();
                  }}
                  className="min-h-[76px] outline-none"
                  style={{
                    color: canvasInk,
                    fontSize:
                      "clamp(18px, 2.5vw, 30px)",
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {rightContent}
                </div>
              </div>
            </div>

            {/* Fallback when AI/user content has not created
                a two-part comparison yet. */}

            {!hasComparison && (
              <div
                className="mt-4 text-[9px] uppercase tracking-[0.14em]"
                style={{
                  color: canvasMuted,
                }}
              >
                Add --- between the two sides
              </div>
            )}

            {/* Takeaway */}

            {slide.title && (
              <div
                className="
                  mt-10
                  border-t
                  pt-6
                  sm:mt-14
                  sm:pt-8
                "
                style={{
                  borderColor:
                    "rgba(47,47,47,0.16)",
                }}
              >
                <p
                  className="
                    mb-3
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color: canvasMuted,
                  }}
                >
                  Takeaway
                </p>

                <p
                  className="max-w-[620px] outline-none"
                  contentEditable={!recomposing}
                  suppressContentEditableWarning
                  onFocus={() => onEditStart("title")}
                  onBlur={(event) => {
                    onUpdate(
                      "title",
                      event.currentTarget.textContent || ""
                    );
                    onEditEnd();
                  }}
                  style={{
                    color: canvasInk,
                    fontSize:
                      "clamp(26px, 4vw, 48px)",
                    lineHeight: 1.04,
                    fontWeight: 700,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {slide.title}
                </p>
              </div>
            )}
          </div>

          {/* Accent rule */}

          <div
            className="
              absolute
              bottom-14
              left-10
              h-[2px]
              w-20
              sm:left-14
            "
            style={{
              backgroundColor: canvasAccent,
            }}
          />

          {/* Footer */}

          <div className="absolute bottom-10 right-10 sm:bottom-14 sm:right-14">
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
          {/* Structural divider */}

          <div
            className="
              absolute
              bottom-0
              left-1/2
              top-0
              w-px
            "
            style={{
              backgroundColor:
                "rgba(47,47,47,0.16)",
            }}
          />

          {/* Header */}

          <div className="absolute left-7 right-7 top-7 sm:left-10 sm:right-10 lg:left-14 lg:right-14">
            <TemplateHeader
              systemName={systemName}
              templateName="Comparison"
              muted={canvasMuted}
            />
          </div>

          {/* Comparison content */}

          <div
            className="
              absolute
              inset-x-7
              top-1/2
              -translate-y-1/2
              sm:inset-x-10
              lg:inset-x-14
            "
          >
            <TemplateLabel color={canvasAccent}>
              {slide.role || "The distinction"}
            </TemplateLabel>

            <div className="grid grid-cols-2 gap-0">
              {/* BEFORE */}

              <div className="pr-5 sm:pr-8">
                <p
                  className="
                    mb-4
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color: canvasMuted,
                  }}
                >
                  Before
                </p>

                <div
                  contentEditable={!recomposing}
                  suppressContentEditableWarning
                  onFocus={() => onEditStart("body")}
                  onBlur={(event) => {
                    updateLeft(
                      event.currentTarget.textContent || ""
                    );
                    onEditEnd();
                  }}
                  className={`
                    min-h-[80px]
                    outline-none
                    transition-opacity
                    duration-200
                    ${bodyTooLong ? "opacity-70" : ""}
                  `}
                  style={{
                    color: canvasInk,
                    fontSize:
                      "clamp(16px, 2.2vw, 28px)",
                    lineHeight: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {leftContent}
                </div>
              </div>

              {/* AFTER */}

              <div className="pl-5 sm:pl-8">
                <p
                  className="
                    mb-4
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color: canvasMuted,
                  }}
                >
                  After
                </p>

                <div
                  contentEditable={!recomposing}
                  suppressContentEditableWarning
                  onFocus={() => onEditStart("body")}
                  onBlur={(event) => {
                    updateRight(
                      event.currentTarget.textContent || ""
                    );
                    onEditEnd();
                  }}
                  className="min-h-[80px] outline-none"
                  style={{
                    color: canvasInk,
                    fontSize:
                      "clamp(16px, 2.2vw, 28px)",
                    lineHeight: 1.25,
                    fontWeight: 500,
                  }}
                >
                  {rightContent}
                </div>
              </div>
            </div>

            {/* Main comparison statement */}

            {slide.title && (
              <div
                className="
                  mt-10
                  max-w-[620px]
                  border-t
                  pt-5
                  sm:mt-14
                  sm:pt-7
                "
                style={{
                  borderColor:
                    "rgba(47,47,47,0.16)",
                }}
              >
                <p
                  className="outline-none"
                  contentEditable={!recomposing}
                  suppressContentEditableWarning
                  onFocus={() => onEditStart("title")}
                  onBlur={(event) => {
                    onUpdate(
                      "title",
                      event.currentTarget.textContent || ""
                    );
                    onEditEnd();
                  }}
                  style={{
                    color: canvasInk,
                    fontSize:
                      "clamp(24px, 4vw, 48px)",
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {slide.title}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}

          <TemplateFooter
            isSingle={false}
            currentSlide={currentSlide}
            muted={canvasMuted}
          />

          {/* Validation */}

          {(titleTooLong || bodyTooLong) && (
            <div
              className="
                absolute
                bottom-20
                left-7
                right-7
                text-[9px]
                uppercase
                tracking-[0.12em]
                sm:left-10
                sm:right-10
                lg:left-14
                lg:right-14
              "
              style={{
                color: "#D72638",
              }}
            >
              Content exceeds editorial limits
            </div>
          )}
        </>
      )}
    </div>
  );
}