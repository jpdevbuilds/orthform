import type {
  EditorialSystem,
} from "./types";

export const BGL_EDITORIAL_SYSTEM: EditorialSystem = {
  id: "bgl",

  name: "Business Growth Lab",

  philosophy:
    "Help business owners understand and solve practical business problems.",

  audience: [
    "small business owners",
    "entrepreneurs",
    "operators",
    "early-stage business builders",
  ],

  principles: [
    "Start from a real business problem.",
    "Explain the underlying mechanism, not just the symptom.",
    "Prefer practical examples over abstract theory.",
    "Give the reader something they can apply or investigate.",
    "Make complex business ideas understandable without oversimplifying them.",
  ],

  tone: [
    "clear",
    "practical",
    "intelligent",
    "direct",
    "grounded",
  ],

  avoid: [
    "empty motivational language",
    "unnecessary jargon",
    "generic business advice",
    "overly dramatic hooks",
    "fake statistics",
    "clickbait",
  ],

  structures: {
    educational: {
      name: "Educational",

      purpose:
        "Teach one useful business idea clearly enough for a business owner to understand and apply.",

        format: "carousel",

      constraints: {
        titleMaxWords: 10,
        bodyMaxWords: 35,
        bodyMaxCharacters: 220,
      },

      slides: [
        {
          role: "hook",

          instruction:
            "Present the business problem or tension immediately. Make it recognizable without explaining everything.",

          constraints: {
            titleMaxWords: 8,
            bodyMaxWords: 20,
            bodyMaxCharacters: 130,
          },
        },

        {
          role: "problem",

          instruction:
            "Explain what is actually going wrong and why business owners commonly miss it.",

          constraints: {
            titleMaxWords: 8,
            bodyMaxWords: 32,
            bodyMaxCharacters: 200,
          },
        },

        {
          role: "insight",

          instruction:
            "Introduce the central idea that changes how the reader should think about the problem.",

          constraints: {
            titleMaxWords: 9,
            bodyMaxWords: 35,
            bodyMaxCharacters: 220,
          },
        },

        {
          role: "application",

          instruction:
            "Show how the idea applies to a realistic small-business situation.",

          constraints: {
            titleMaxWords: 9,
            bodyMaxWords: 35,
            bodyMaxCharacters: 220,
          },
        },

        {
          role: "action",

          instruction:
            "Give the reader one practical thing they can do or check immediately.",

          constraints: {
            titleMaxWords: 8,
            bodyMaxWords: 30,
            bodyMaxCharacters: 190,
          },
        },
      ],
    },

    discussion: {
      name: "Discussion",

      purpose:
        "Turn a business observation into a useful conversation among business owners.",

       format: "carousel",

       constraints: {
        titleMaxWords: 10,
        bodyMaxWords: 32,
        bodyMaxCharacters: 200,
      },

      slides: [
        {
          role: "observation",

          instruction:
            "Present a recognizable business situation.",

          constraints: {
            titleMaxWords: 9,
            bodyMaxWords: 30,
            bodyMaxCharacters: 190,
          },
        },

        {
          role: "tension",

          instruction:
            "Expose the question, disagreement, or contradiction.",

          constraints: {
            titleMaxWords: 9,
            bodyMaxWords: 30,
            bodyMaxCharacters: 190,
          },
        },

        {
          role: "perspective",

          instruction:
            "Offer a useful perspective without pretending there is only one answer.",

          constraints: {
            titleMaxWords: 10,
            bodyMaxWords: 35,
            bodyMaxCharacters: 220,
          },
        },

        {
          role: "question",

          instruction:
            "End with a concise question that encourages meaningful discussion.",

          constraints: {
            titleMaxWords: 8,
            bodyMaxWords: 20,
            bodyMaxCharacters: 130,
          },
        },
      ],
    },
  },
};