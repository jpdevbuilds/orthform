import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getEditorialSystem } from "@/lib/editorial";
import { buildRecomposePrompt } from "./prompt";
import { validateGeneratedSlides } from "@/app/api/generate/validation";

import type {
  ArtifactFormat,
  EditorialStructure,
} from "@/lib/editorial/systems/types";

import type { TemplateId } from "@/lib/templates/templates";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;

// ==================================================
// GEMINI RETRY CONFIGURATION
// ==================================================

const MAX_RETRIES = 3;
const MAX_VALIDATION_ATTEMPTS = 3;

const RETRYABLE_STATUS_CODES = [
  500,
  502,
  503,
  504,
];

const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

function getErrorStatus(
  error: unknown
): number | null {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return null;
  }

  const possibleError =
    error as {
      status?: unknown;
      statusCode?: unknown;
      response?: {
        status?: unknown;
      };
    };

  if (
    typeof possibleError.status === "number"
  ) {
    return possibleError.status;
  }

  if (
    typeof possibleError.statusCode === "number"
  ) {
    return possibleError.statusCode;
  }

  if (
    typeof possibleError.response?.status ===
      "number"
  ) {
    return possibleError.response.status;
  }

  return null;
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function isRetryableGeminiError(
  error: unknown
): boolean {
  const status = getErrorStatus(error);

  if (status !== null) {
    return RETRYABLE_STATUS_CODES.includes(status);
  }

  const message =
    getErrorMessage(error).toLowerCase();

  return (
    message.includes("service unavailable") ||
    message.includes("high demand") ||
    message.includes("temporarily unavailable") ||
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("timeout") ||
    message.includes("econnreset") ||
    message.includes("enotfound")
  );
}

// ==================================================
// TEMPLATE VALIDATION
// ==================================================

function isValidTemplateId(
  value: unknown
): value is TemplateId {
  return (
    value === "authority" ||
    value === "spotlight" ||
    value === "utility" ||
    value === "comparison"
  );
}

// ==================================================
// ARTIFACT FORMAT VALIDATION
// ==================================================

function isValidArtifactFormat(
  value: unknown
): value is ArtifactFormat {
  return (
    value === "single" ||
    value === "carousel"
  );
}

// ==================================================
// INPUT TYPES
// ==================================================

type ExistingSlide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

function isValidSlide(
  value: unknown
): value is ExistingSlide {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const slide =
    value as Record<string, unknown>;

  return (
    typeof slide.id === "string" &&
    typeof slide.order === "number" &&
    typeof slide.role === "string" &&
    typeof slide.title === "string" &&
    typeof slide.body === "string"
  );
}

// ==================================================
// JSON EXTRACTION
// ==================================================

function parseGeneratedJson(
  text: string
): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace =
      cleaned.indexOf("{");

    const lastBrace =
      cleaned.lastIndexOf("}");

    if (
      firstBrace === -1 ||
      lastBrace === -1 ||
      lastBrace <= firstBrace
    ) {
      throw new Error(
        "Gemini returned invalid JSON."
      );
    }

    const possibleJson =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      );

    try {
      return JSON.parse(possibleJson);
    } catch {
      throw new Error(
        "Gemini returned invalid JSON."
      );
    }
  }
}

// ==================================================
// BASIC RESPONSE VALIDATION
// ==================================================

function validateRecomposeResponse(
  value: unknown
) {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    throw new Error(
      "Gemini returned an invalid recomposition structure."
    );
  }

  if (
    !("title" in value) ||
    !("slides" in value)
  ) {
    throw new Error(
      "Gemini returned an incomplete recomposition structure."
    );
  }

  const data =
    value as {
      title: unknown;
      slides: unknown;
    };

  if (
    typeof data.title !== "string" ||
    !Array.isArray(data.slides)
  ) {
    throw new Error(
      "Gemini returned malformed recomposition data."
    );
  }

  if (!data.title.trim()) {
    throw new Error(
      "Gemini returned an empty artifact title."
    );
  }

  if (data.slides.length === 0) {
    throw new Error(
      "Gemini returned no slides."
    );
  }

  return {
    title: data.title.trim(),
    slides: data.slides,
  };
}

// ==================================================
// EXPECTED SLIDE COUNT
// ==================================================

function getExpectedSlideCount(
  structure: EditorialStructure,
  artifactFormat: ArtifactFormat
): number {
  if (artifactFormat === "single") {
    return 1;
  }

  return structure.slides.length;
}

// ==================================================
// USER-CREATED SECTIONS
// ==================================================

function isCustomSlide(
  slide: ExistingSlide
): boolean {
  return slide.role === "custom";
}

/**
 * Custom sections belong to the user, not the AI.
 *
 * During recomposition we remove them from the AI-managed
 * structure, then merge them back into their original
 * positions after Gemini responds.
 */
function getRecomposeScope(
  structure: EditorialStructure,
  existingSlides: ExistingSlide[]
) {
  const managedIndexes: number[] = [];
  const customIndexes: number[] = [];

  existingSlides.forEach(
    (slide, index) => {
      if (isCustomSlide(slide)) {
        customIndexes.push(index);
      } else {
        managedIndexes.push(index);
      }
    }
  );

  const managedSlides =
    managedIndexes.map(
      (index) => existingSlides[index]
    );

  const managedStructureSlides =
    managedIndexes.map(
      (index) => structure.slides[index]
    );

  const managedStructure: EditorialStructure = {
    ...structure,
    slides: managedStructureSlides,
  };

  return {
    managedIndexes,
    customIndexes,
    managedSlides,
    managedStructure,
  };
}

// ==================================================
// GEMINI GENERATION WITH RETRY
// ==================================================

async function generateWithRetry(
  model: ReturnType<
    NonNullable<
      typeof genAI
    >["getGenerativeModel"]
  >,
  prompt: string
) {
  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      return await model.generateContent(
        prompt
      );
    } catch (error) {
      lastError = error;

      const shouldRetry =
        isRetryableGeminiError(error);

      const isLastAttempt =
        attempt === MAX_RETRIES;

      if (
        !shouldRetry ||
        isLastAttempt
      ) {
        throw error;
      }

      const delay =
        1000 * Math.pow(2, attempt);

      console.warn(
        `Gemini recompose request failed. Retrying in ${delay}ms...`,
        {
          attempt: attempt + 1,
          maxRetries: MAX_RETRIES,
          status: getErrorStatus(error),
        }
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

// ==================================================
// RECOMPOSE + VALIDATE
// ==================================================

async function recomposeValidContent({
  model,
  prompt,
  structure,
  artifactFormat,
  existingSlides,
}: {
  model: ReturnType<
    NonNullable<
      typeof genAI
    >["getGenerativeModel"]
  >;
  prompt: string;
  structure: EditorialStructure;
  artifactFormat: ArtifactFormat;
  existingSlides: ExistingSlide[];
}) {
  let lastError: unknown;

  const {
    managedIndexes,
    managedSlides,
    managedStructure,
  } = getRecomposeScope(
    structure,
    existingSlides
  );

  const expectedSlideCount =
    getExpectedSlideCount(
      managedStructure,
      artifactFormat
    );

  // --------------------------------------------------
  // NO AI-MANAGED SLIDES
  // --------------------------------------------------

  if (managedSlides.length === 0) {
    return {
      title: "",
      slides: existingSlides.map(
        (slide) => ({
          ...slide,
        })
      ),
    };
  }

  // --------------------------------------------------
  // CURRENT ARTIFACT CONSISTENCY
  // --------------------------------------------------

  if (
    artifactFormat === "single" &&
    existingSlides.length !== 1
  ) {
    throw new Error(
      `The current artifact contains ${existingSlides.length} slides, but 1 is required for a single post.`
    );
  }

  if (
    artifactFormat === "carousel" &&
    existingSlides.length <
      managedSlides.length
  ) {
    throw new Error(
      "The current artifact contains an invalid slide structure."
    );
  }

  // --------------------------------------------------
  // AI RECOMPOSITION
  // --------------------------------------------------

  for (
    let attempt = 0;
    attempt < MAX_VALIDATION_ATTEMPTS;
    attempt++
  ) {
    try {
      const attemptPrompt =
        attempt === 0
          ? prompt
          : `
${prompt}

============================================================
CORRECTION REQUIRED
============================================================

The previous recomposition failed Orthform's validation.

Validation error:
${
  lastError instanceof Error
    ? lastError.message
    : "The previous output violated one or more editorial constraints."
}

Recompose the COMPLETE AI-MANAGED portion of the artifact again.

Do not explain the correction.
Do not return the previous artifact.
Do not return partial JSON.

Return a completely new valid JSON response.

IMPORTANT:

- Generate EXACTLY ${expectedSlideCount} slide${
            expectedSlideCount === 1
              ? ""
              : "s"
          } for the AI-managed sections.
- Preserve the original ideas.
- Preserve the original slide order.
- Preserve the original editorial roles.
- Do not modify user-created custom sections.
- Do not invent facts, people, events, customers, results,
  statistics, testimonials, or experiences.
- Follow the selected template's editorial logic.
- Follow every title word limit.
- Follow every body word limit.
- Follow every body character limit.
- Use simple English.
- Return ONLY valid JSON.
`;

      const result =
        await generateWithRetry(
          model,
          attemptPrompt
        );

      const text =
        result.response.text().trim();

      const parsed =
        parseGeneratedJson(text);

      const validatedResponse =
        validateRecomposeResponse(
          parsed
        );

      if (
        validatedResponse.slides.length !==
        expectedSlideCount
      ) {
        throw new Error(
          `Gemini returned ${validatedResponse.slides.length} slides, but Orthform expected ${expectedSlideCount}.`
        );
      }

      const validatedSlides =
        validateGeneratedSlides(
          validatedResponse.slides,
          managedStructure.slides
        );

      if (
        validatedSlides.length !==
        managedSlides.length
      ) {
        throw new Error(
          "Recomposed AI-managed sections do not match the current artifact structure."
        );
      }

      // --------------------------------------------------
      // REBUILD COMPLETE ARTIFACT
      // --------------------------------------------------

      const recomposedManagedSlides =
        validatedSlides.map(
          (slide, index) => ({
            ...slide,
            id:
              managedSlides[index].id,
            order:
              managedSlides[index].order,
          })
        );

      let managedCursor = 0;

      const slides =
        existingSlides.map(
          (existingSlide, index) => {
            if (
              !managedIndexes.includes(index)
            ) {
              // User-created section.
              // Preserve it exactly.
              return {
                ...existingSlide,
              };
            }

            const recomposedSlide =
              recomposedManagedSlides[
                managedCursor
              ];

            managedCursor += 1;

            return recomposedSlide;
          }
        );

      return {
        title:
          validatedResponse.title,

        slides,
      };
    } catch (error) {
      lastError = error;

      console.warn(
        `Orthform recomposition attempt ${
          attempt + 1
        } failed.`,
        {
          message:
            getErrorMessage(error),
        }
      );
    }
  }

  throw lastError;
}

// ==================================================
// POST
// ==================================================

export async function POST(
  request: Request
) {
  try {
    // ==================================================
    // API CONFIGURATION
    // ==================================================

    if (!genAI) {
      return NextResponse.json(
        {
          error:
            "Gemini API is not configured on the server.",
        },
        { status: 500 }
      );
    }

    // ==================================================
    // REQUEST
    // ==================================================

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const {
      brandId,
      contentType,
      format,
      templateId,
      input,
      title,
      slides: rawSlides,
    } = body as {
      brandId?: unknown;
      contentType?: unknown;
      format?: unknown;
      templateId?: unknown;
      input?: unknown;
      title?: unknown;
      slides?: unknown;
    };

    // ==================================================
    // BASIC INPUT VALIDATION
    // ==================================================

    if (
      typeof brandId !== "string" ||
      typeof contentType !== "string" ||
      typeof input !== "string" ||
      !input.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "brandId, contentType and input are required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "A current artifact title is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(rawSlides) ||
      rawSlides.length === 0 ||
      !rawSlides.every(isValidSlide)
    ) {
      return NextResponse.json(
        {
          error:
            "A valid current artifact is required for recomposition.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // FORMAT VALIDATION
    // ==================================================

    if (
      format !== undefined &&
      !isValidArtifactFormat(format)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid artifact format.",
        },
        { status: 400 }
      );
    }

    const artifactFormat: ArtifactFormat =
      isValidArtifactFormat(format)
        ? format
        : "carousel";

    // ==================================================
    // TEMPLATE VALIDATION
    // ==================================================

    if (
      templateId !== undefined &&
      !isValidTemplateId(templateId)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid template.",
        },
        { status: 400 }
      );
    }

    const selectedTemplateId: TemplateId =
      isValidTemplateId(templateId)
        ? templateId
        : "authority";

    // ==================================================
    // EDITORIAL SYSTEM
    // ==================================================

    const system =
      getEditorialSystem(brandId);

    if (!system) {
      return NextResponse.json(
        {
          error:
            `Editorial system "${brandId}" was not found.`,
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CONTENT STRUCTURE
    // ==================================================

    const structure =
      system.structures[
        contentType as keyof typeof system.structures
      ];

    if (!structure) {
      return NextResponse.json(
        {
          error:
            `Content structure "${contentType}" is not available for ${system.name}.`,
        },
        { status: 400 }
      );
    }

    // ==================================================
    // FORMAT / CURRENT ARTIFACT CONSISTENCY
    // ==================================================

    if (
      artifactFormat === "single" &&
      rawSlides.length !== 1
    ) {
      return NextResponse.json(
        {
          error:
            `The current artifact contains ${rawSlides.length} slides, but 1 is required for a single post.`,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // CAROUSEL STRUCTURE
    //
    // Custom sections are allowed to exist outside the
    // original editorial structure.
    // --------------------------------------------------

    if (
      artifactFormat === "carousel"
    ) {
      const customSlides =
        rawSlides.filter(
          isCustomSlide
        );

      const managedSlideCount =
        rawSlides.length -
        customSlides.length;

      if (
        managedSlideCount !==
        structure.slides.length
      ) {
        return NextResponse.json(
          {
            error:
              `The current artifact contains ${managedSlideCount} AI-managed slides, but ${structure.slides.length} are required by the editorial structure. User-created custom sections are allowed.`,
          },
          { status: 400 }
        );
      }
    }

    // ==================================================
    // RECOMPOSITION SCOPE
    // ==================================================

    const {
      managedSlides,
      managedStructure,
    } =
      getRecomposeScope(
        structure,
        rawSlides
      );

    // ==================================================
    // RECOMPOSITION PROMPT
    // ==================================================

    const prompt =
      buildRecomposePrompt({
        system,
        structure:
          managedStructure,
        input: input.trim(),
        title: title.trim(),
        slides: managedSlides,
        artifactFormat,
        templateId: selectedTemplateId,
      });

    // ==================================================
    // GEMINI MODEL
    // ==================================================

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",

        generationConfig: {
          temperature: 0.5,
          responseMimeType:
            "application/json",
        },
      });

    // ==================================================
    // RECOMPOSE + VALIDATE
    // ==================================================

    let recomposed;

    try {
      recomposed =
        await recomposeValidContent({
          model,
          prompt,
          structure,
          artifactFormat,
          existingSlides: rawSlides,
        });
    } catch (error) {
      const status =
        getErrorStatus(error);

      // --------------------------------------------------
      // QUOTA / RATE LIMIT
      // --------------------------------------------------

      if (status === 429) {
        return NextResponse.json(
          {
            error:
              "Gemini usage limit reached. Your current artifact has been preserved.",
          },
          { status: 429 }
        );
      }

      // --------------------------------------------------
      // GEMINI SERVICE FAILURE
      // --------------------------------------------------

      if (
        status !== null &&
        RETRYABLE_STATUS_CODES.includes(
          status
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Gemini is temporarily unavailable. Your current artifact has been preserved.",
          },
          { status: 503 }
        );
      }

      // --------------------------------------------------
      // NETWORK / FETCH FAILURE
      // --------------------------------------------------

      if (
        isRetryableGeminiError(error)
      ) {
        return NextResponse.json(
          {
            error:
              "Orthform could not reach Gemini. Your current artifact has been preserved.",
          },
          { status: 503 }
        );
      }

      // --------------------------------------------------
      // EDITORIAL VALIDATION FAILURE
      // --------------------------------------------------

      if (
        error instanceof Error
      ) {
        return NextResponse.json(
          {
            error:
              error.message,
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Orthform could not produce a valid recomposition. Your current artifact has been preserved.",
        },
        { status: 422 }
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return NextResponse.json({
      success: true,

      templateId:
        selectedTemplateId,

      title:
        recomposed.title ||
        title.trim(),

      slides:
        recomposed.slides,
    });
  } catch (error) {
    console.error(
      "Orthform recomposition error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Orthform could not complete the recomposition request. Your current artifact has been preserved.",
      },
      { status: 500 }
    );
  }
}