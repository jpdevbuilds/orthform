import type { TemplateId } from "@/lib/templates/templates";

export type TemplateStyle = {
  background: string;
  ink: string;
  muted: string;
  accent: string;
  label: string;
  border: string;
};

export const TEMPLATE_STYLES: Record<
  TemplateId,
  TemplateStyle
> = {
  authority: {
    background: "#2A5D9E",
    ink: "#FFFFFF",
    muted: "rgba(255,255,255,0.68)",
    accent: "#FFD166",
    label: "Business insight",
    border: "rgba(255,255,255,0.18)",
  },

  spotlight: {
    background: "#F1EFE7",
    ink: "#1A1A1A",
    muted: "rgba(47,47,47,0.58)",
    accent: "#FFD166",
    label: "Business story",
    border: "rgba(47,47,47,0.18)",
  },

  utility: {
    background: "#FFD166",
    ink: "#1A1A1A",
    muted: "rgba(47,47,47,0.58)",
    accent: "#2A5D9E",
    label: "Practical utility",
    border: "rgba(47,47,47,0.18)",
  },

  comparison: {
    background: "#F1EFE7",
    ink: "#1A1A1A",
    muted: "rgba(47,47,47,0.58)",
    accent: "#2A5D9E",
    label: "Business comparison",
    border: "rgba(47,47,47,0.18)",
  },
};