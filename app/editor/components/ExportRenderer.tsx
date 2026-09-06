"use client";

import type { TemplateId } from "@/lib/templates/templates";
import { TEMPLATE_STYLES } from "@/lib/templates/templateStyles";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";

type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

type ExportRendererProps = {
  slide: Slide;
  systemName: string;
  templateId: TemplateId;
  artifactFormat: ArtifactFormat;
  totalSlides: number;
  theme?: "light" | "dark";
  slideNumber?: number;
};

export default function ExportRenderer({
  slide,
  systemName,
  templateId,
  artifactFormat,
  totalSlides,
  theme = "light",
  slideNumber,
}: ExportRendererProps) {
  const style = TEMPLATE_STYLES[templateId];

  const isSingle =
    artifactFormat === "single";

  /*
   * Use the explicit slideNumber when supplied.
   * Fall back to slide.order for backwards compatibility.
   */
  const displaySlideNumber =
    slideNumber ?? slide.order + 1;

  /*
   * ExportRenderer is intentionally self-contained.
   *
   * It does not depend on editor CSS variables because
   * renderSlide() captures this component independently.
   *
   * The template remains the source of truth for the
   * visual treatment.
   */

  const background =
    theme === "dark"
      ? style.ink
      : style.background;

  const ink =
    theme === "dark"
      ? style.background
      : style.ink;

  const muted =
    theme === "dark"
      ? style.background
      : style.muted;

  const border =
    theme === "dark"
      ? style.background
      : style.border;

  /*
   * ==================================================
   * COMPARISON TEMPLATE
   * ==================================================
   *
   * Comparison is intentionally handled as a separate
   * visual composition.
   *
   * It uses the existing title/body fields so the
   * underlying document model does not need to change.
   */

  if (templateId === "comparison") {
    return (
      <ComparisonRenderer
        slide={slide}
        systemName={systemName}
        artifactFormat={artifactFormat}
        totalSlides={totalSlides}
        slideNumber={slideNumber}
        theme={theme}
        background={background}
        ink={ink}
        muted={muted}
        border={border}
        accent={style.accent}
      />
    );
  }

  return (
    <div
      data-export-slide
      style={{
        position: "relative",
        width: "1080px",
        height: "1350px",
        overflow: "hidden",
        backgroundColor: background,
        color: ink,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* ==================================================
          GRID
          ================================================== */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          color: ink,
          pointerEvents: "none",
        }}
      />

      {/* ==================================================
          BORDER
          ================================================== */}

      <div
        style={{
          position: "absolute",
          inset: "56px",
          border: `1px solid ${border}`,
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />

      {/* ==================================================
          CORNER MARKERS
          ================================================== */}

      <Corner
        position="top-left"
        color={border}
      />

      <Corner
        position="top-right"
        color={border}
      />

      <Corner
        position="bottom-left"
        color={border}
      />

      <Corner
        position="bottom-right"
        color={border}
      />

      {/* ==================================================
          HEADER
          ================================================== */}

      <div
        style={{
          position: "absolute",
          top: "90px",
          left: "100px",
          right: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            minWidth: 0,
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              flexShrink: 0,
              borderRadius: "2px",
              backgroundColor: style.accent,
            }}
          />

          <p
            style={{
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            {systemName}
          </p>
        </div>

        <p
          style={{
            margin: 0,
            flexShrink: 0,
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          {slide.role}
        </p>
      </div>

      {/* ==================================================
          CONTENT
          ================================================== */}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "100px",
          right: "100px",
          transform: "translateY(-50%)",
        }}
      >
        <p
          style={{
            margin: "0 0 28px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: style.accent,
          }}
        >
          {style.label}
        </p>

        <h1
          style={{
            margin: 0,
            maxWidth: "850px",
            fontSize: "72px",
            lineHeight: 0.94,
            fontWeight: 700,
            letterSpacing: "-0.055em",
            whiteSpace: "pre-wrap",
            color: ink,
          }}
        >
          {slide.title}
        </h1>

        <div
          style={{
            width: "80px",
            height: "4px",
            marginTop: "42px",
            marginBottom: "42px",
            backgroundColor: style.accent,
          }}
        />

        <p
          style={{
            margin: 0,
            maxWidth: "820px",
            fontSize: "25px",
            lineHeight: 1.5,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            whiteSpace: "pre-wrap",
            color: ink,
            opacity:
              templateId === "authority"
                ? 0.88
                : 0.72,
          }}
        >
          {slide.body}
        </p>
      </div>

      {/* ==================================================
          FOOTER
          ================================================== */}

      <div
        style={{
          position: "absolute",
          bottom: "90px",
          left: "100px",
          right: "100px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ink,
            }}
          >
            {systemName}
          </p>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            {templateId}
          </p>
        </div>

        {!isSingle && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: muted,
            }}
          >
            {String(displaySlideNumber).padStart(
              2,
              "0"
            )}
            {" / "}
            {String(totalSlides).padStart(
              2,
              "0"
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// ==================================================
// COMPARISON RENDERER
// ==================================================

function ComparisonRenderer({
  slide,
  systemName,
  artifactFormat,
  totalSlides,
  slideNumber,
  theme,
  background,
  ink,
  muted,
  border,
  accent,
}: {
  slide: Slide;
  systemName: string;
  artifactFormat: ArtifactFormat;
  totalSlides: number;
  slideNumber?: number;
  theme: "light" | "dark";
  background: string;
  ink: string;
  muted: string;
  border: string;
  accent: string;
}) {
  const isSingle =
    artifactFormat === "single";

  const displaySlideNumber =
    slideNumber ?? slide.order + 1;

  const panelBackground =
    theme === "dark"
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.72)";

  const secondaryBackground =
    theme === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(47,47,47,0.035)";

  return (
    <div
      data-export-slide
      style={{
        position: "relative",
        width: "1080px",
        height: "1350px",
        overflow: "hidden",
        backgroundColor: background,
        color: ink,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* ==================================================
          HEADER
          ================================================== */}

      <div
        style={{
          position: "absolute",
          top: "78px",
          left: "82px",
          right: "82px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span
            style={{
              width: "11px",
              height: "11px",
              borderRadius: "2px",
              backgroundColor: accent,
            }}
          />

          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            {systemName}
          </span>
        </div>

        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          Comparison
        </span>
      </div>

      {/* ==================================================
          TITLE
          ================================================== */}

      <div
        style={{
          position: "absolute",
          top: "145px",
          left: "82px",
          right: "82px",
        }}
      >
        <p
          style={{
            margin: "0 0 18px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          Business breakdown
        </p>

        <h1
          style={{
            margin: 0,
            maxWidth: "900px",
            fontSize: "58px",
            lineHeight: 0.98,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            color: ink,
          }}
        >
          {slide.title}
        </h1>
      </div>

      {/* ==================================================
          SPLIT PANELS
          ================================================== */}

      <div
        style={{
          position: "absolute",
          top: "380px",
          left: "82px",
          right: "82px",
          height: "610px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "22px",
        }}
      >
        {/* LEFT PANEL */}

        <div
          style={{
            position: "relative",
            padding: "48px",
            border: `1px solid ${border}`,
            backgroundColor: panelBackground,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "7px",
              backgroundColor: accent,
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            The idea
          </p>

          <h2
            style={{
              margin: "42px 0 0",
              fontSize: "42px",
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: "-0.035em",
              color: ink,
            }}
          >
            {slide.title}
          </h2>
        </div>

        {/* RIGHT PANEL */}

        <div
          style={{
            position: "relative",
            padding: "48px",
            border: `1px solid ${border}`,
            backgroundColor: secondaryBackground,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "7px",
              backgroundColor: accent,
              opacity: 0.55,
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            The explanation
          </p>

          <p
            style={{
              margin: "42px 0 0",
              fontSize: "26px",
              lineHeight: 1.48,
              fontWeight: 400,
              color: ink,
            }}
          >
            {slide.body}
          </p>
        </div>
      </div>

      {/* ==================================================
          CENTRAL TAKEAWAY
          ================================================== */}

      <div
        style={{
          position: "absolute",
          left: "180px",
          right: "180px",
          bottom: "205px",
          padding: "20px 28px",
          backgroundColor: accent,
          color:
            theme === "dark"
              ? "#101112"
              : "#1A1A1A",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "19px",
            lineHeight: 1.3,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          The difference is where the business
          decision becomes clear.
        </p>
      </div>

      {/* ==================================================
          FOOTER
          ================================================== */}

      <div
        style={{
          position: "absolute",
          bottom: "82px",
          left: "82px",
          right: "82px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ink,
            }}
          >
            {systemName}
          </p>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: muted,
            }}
          >
            comparison
          </p>
        </div>

        {!isSingle && (
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: muted,
            }}
          >
            {String(displaySlideNumber).padStart(
              2,
              "0"
            )}
            {" / "}
            {String(totalSlides).padStart(
              2,
              "0"
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// ==================================================
// CORNER
// ==================================================

function Corner({
  position,
  color,
}: {
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  color: string;
}) {
  const base = {
    position: "absolute" as const,
    width: "24px",
    height: "24px",
    borderColor: color,
    borderStyle: "solid" as const,
    pointerEvents: "none" as const,
    boxSizing: "border-box" as const,
  };

  const positions = {
    "top-left": {
      top: "56px",
      left: "56px",
      borderWidth: "1px 0 0 1px",
    },

    "top-right": {
      top: "56px",
      right: "56px",
      borderWidth: "1px 1px 0 0",
    },

    "bottom-left": {
      bottom: "56px",
      left: "56px",
      borderWidth: "0 0 1px 1px",
    },

    "bottom-right": {
      bottom: "56px",
      right: "56px",
      borderWidth: "0 1px 1px 0",
    },
  };

  return (
    <div
      style={{
        ...base,
        ...positions[position],
      }}
    />
  );
}