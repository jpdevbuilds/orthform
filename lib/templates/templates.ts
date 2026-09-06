export type TemplateId =
  | "authority"
  | "spotlight"
  | "utility"
  | "comparison";

export type TemplateSystem = {
  id: TemplateId;

  name: string;

  description: string;

  bestFor: string[];

  visualDirection: {
    background: string;
    accent: string;
    layout: string;
  };
};

export const BGL_TEMPLATES: TemplateSystem[] = [
  {
    id: "authority",

    name: "Authority Card",

    description:
      "Bold educational content designed to establish expertise and drive saves.",

    bestFor: [
      "Educational",
      "Business problems",
      "Money & profit",
      "Business thinking",
    ],

    visualDirection: {
      background: "#2A5D9E",
      accent: "#FFD166",
      layout:
        "Bold headline with structured supporting information.",
    },
  },

  {
    id: "spotlight",

    name: "Spotlight Card",

    description:
      "Story-driven content designed to create connection through people, experiences, and proof.",

    bestFor: [
      "Case studies",
      "Customer stories",
      "Social proof",
      "Business journeys",
    ],

    visualDirection: {
      background: "#F1EFE7",
      accent: "#FFD166",
      layout:
        "Human-centered composition with image-led storytelling.",
    },
  },

  {
    id: "utility",

    name: "Utility Card",

    description:
      "Action-oriented content designed to give the audience something immediately useful.",

    bestFor: [
      "Quick tips",
      "Announcements",
      "Tools",
      "Calls to action",
    ],

    visualDirection: {
      background: "#FFD166",
      accent: "#2A5D9E",
      layout:
        "Simple utility-first composition with a clear action.",
    },
  },

  {
    id: "comparison",

    name: "Comparison Card",

    description:
      "Side-by-side visual content designed to make differences, trade-offs, or relationships immediately understandable.",

    bestFor: [
      "Comparisons",
      "Business metrics",
      "Before vs after",
      "Good vs bad",
      "Revenue vs profit",
      "Business concepts",
    ],

    visualDirection: {
      background: "#F1EFE7",
      accent: "#2A5D9E",
      layout:
        "Split composition with clearly separated concepts and a central takeaway.",
    },
  },
];

export function getTemplate(
  templateId: string
): TemplateSystem | undefined {
  return BGL_TEMPLATES.find(
    (template) => template.id === templateId
  );
}