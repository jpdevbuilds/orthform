import {
  validateSlideDensity,
  countWords,
} from "@/lib/content/density";

import type {
  EditorialSlide,
} from "@/lib/editorial/systems/types";

/* =========================================================
   ORTHFORM — GENERATED SLIDE VALIDATION
   ========================================================= */

type GeneratedSlide = {
  role?: unknown;
  title?: unknown;
  body?: unknown;
};

export type ValidatedGeneratedSlide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

export function validateGeneratedSlides(
  slides: unknown[],
  definitions: EditorialSlide[]
): ValidatedGeneratedSlide[] {
  // ==================================================
  // SLIDE COUNT
  // ==================================================

  if (slides.length !== definitions.length) {
    throw new Error(
      `Gemini returned ${slides.length} sections. Expected ${definitions.length}.`
    );
  }

  // ==================================================
  // VALIDATE EACH SLIDE
  // ==================================================

  return slides.map((slide, index) => {
    if (
      typeof slide !== "object" ||
      slide === null
    ) {
      throw new Error(
        `Invalid slide at index ${index}.`
      );
    }

    const item =
      slide as GeneratedSlide;

    const definition =
      definitions[index];

    if (!definition) {
      throw new Error(
        `Missing slide definition at index ${index}.`
      );
    }

    const constraints =
      definition.constraints;

    // ==================================================
    // REQUIRED FIELDS
    // ==================================================

    if (
      typeof item.role !== "string" ||
      typeof item.title !== "string" ||
      typeof item.body !== "string"
    ) {
      throw new Error(
        `Slide ${index + 1} is missing role, title, or body.`
      );
    }

    const role =
      item.role.trim();

    const title =
      item.title.trim();

    const body =
      item.body.trim();

    if (!role) {
      throw new Error(
        `Slide ${index + 1} has an empty role.`
      );
    }

    if (!title) {
      throw new Error(
        `Slide ${index + 1} has an empty title.`
      );
    }

    if (!body) {
      throw new Error(
        `Slide ${index + 1} has an empty body.`
      );
    }

    // ==================================================
    // ROLE VALIDATION
    // ==================================================

    if (role !== definition.role) {
      throw new Error(
        `Slide ${index + 1} has an invalid role. Expected "${definition.role}".`
      );
    }

    // ==================================================
    // DENSITY VALIDATION
    // ==================================================

    const density =
      validateSlideDensity(
        title,
        body,
        constraints
      );

    if (!density.valid) {
      const titleWords =
        countWords(title);

      const bodyWords =
        countWords(body);

      const bodyCharacters =
        body.length;

      throw new Error(
        [
          `Slide ${index + 1} failed density validation.`,
          `Role: "${definition.role}".`,
          `Title: ${titleWords}/${constraints.titleMaxWords} words.`,
          `Body: ${bodyWords}/${constraints.bodyMaxWords} words.`,
          `Characters: ${bodyCharacters}/${constraints.bodyMaxCharacters}.`,
          `Issues: ${density.issues.join(" ")}`,
        ].join(" ")
      );
    }

    // ==================================================
    // NORMALIZED SLIDE
    // ==================================================

    return {
      id: crypto.randomUUID(),

      order: index,

      role: definition.role,

      title,

      body,
    };
  });
}