import type { TemplateId } from "@/lib/templates/templates";

type CanvasTheme = {
  isAuthority: boolean;
  isSpotlight: boolean;
  isUtility: boolean;
  background: string;
  ink: string;
  muted: string;
  accent: string;
  border: string;
};

export function getCanvasTheme(
  templateId: TemplateId
): CanvasTheme {
  const isAuthority =
    templateId === "authority";

  const isSpotlight =
    templateId === "spotlight";

  const isUtility =
    templateId === "utility";

  const background = isAuthority
    ? "#2A5D9E"
    : isSpotlight
    ? "#F1EFE7"
    : "#FFD166";

  const ink = isAuthority
    ? "#FFFFFF"
    : "#1A1A1A";

  const muted = isAuthority
    ? "rgba(255,255,255,0.68)"
    : "rgba(47,47,47,0.58)";

  const accent = isUtility
    ? "#2A5D9E"
    : "#FFD166";

  const border = isAuthority
    ? "rgba(255,255,255,0.18)"
    : "rgba(47,47,47,0.18)";

  return {
    isAuthority,
    isSpotlight,
    isUtility,
    background,
    ink,
    muted,
    accent,
    border,
  };
}