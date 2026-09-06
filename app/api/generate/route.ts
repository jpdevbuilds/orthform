import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getEditorialSystem } from "@/lib/editorial";
import { buildGenerationPrompt } from "./prompt";
import { validateGeneratedSlides } from "./validation";

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
    // Some model responses may contain
    // harmless surrounding text despite the
    // JSON response configuration.

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
// GENERATED RESPONSE VALIDATION
// ==================================================

function validateGeneratedResponse(
  generated: unknown
) {
  if (
    typeof generated !== "object" ||
    generated === null
  ) {
    throw new Error(
      "Gemini returned an invalid content structure."
    );
  }

  if (
    !("title" in generated) ||
    !("slides" in generated)
  ) {
    throw new Error(
      "Gemini returned an incomplete content structure."
    );
  }

  const generatedData =
    generated as {
      title: unknown;
      slides: unknown;
    };

  if (
    typeof generatedData.title !== "string" ||
    !Array.isArray(generatedData.slides)
  ) {
    throw new Error(
      "Gemini returned malformed content data."
    );
  }

  if (!generatedData.title.trim()) {
    throw new Error(
      "Gemini returned an empty artifact title."
    );
  }

  if (generatedData.slides.length === 0) {
    throw new Error(
      "Gemini returned no slides."
    );
  }

  return {
    title:
      generatedData.title.trim(),

    slides:
      generatedData.slides,
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

      await sleep(delay);
    }
  }

  throw lastError;
}

// ==================================================
// GENERATE VALID CONTENT
// ==================================================

async function generateValidContent({
  model,
  prompt,
  structure,
  artifactFormat,
}: {
  model: ReturnType<
    NonNullable<
      typeof genAI
    >["getGenerativeModel"]
  >;
  prompt: string;
  structure: EditorialStructure;
  artifactFormat: ArtifactFormat;
}) {
  let lastError: unknown;

  const expectedSlideCount =
    getExpectedSlideCount(
      structure,
      artifactFormat
    );

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

Your previous generation failed Orthform's validation.

Validation error:
${
  lastError instanceof Error
    ? lastError.message
    : "The previous output violated one or more editorial constraints."
}

Generate the COMPLETE artifact again.

Do not explain the correction.
Do not return the previous artifact.
Do not return partial JSON.

Return a completely new valid JSON response.

IMPORTANT:

- The artifact must contain EXACTLY ${expectedSlideCount} slide${
            expectedSlideCount === 1
              ? ""
              : "s"
          }.
- Follow the supplied slide order.
- Follow the supplied slide roles.
- Respect every slide-specific word limit.
- Respect every slide-specific character limit.
- Use the selected template's editorial composition.
- Do not invent information to satisfy the template.
- Return ONLY valid JSON.
`;

      const result =
        await generateWithRetry(
          model,
          attemptPrompt
        );

      const text =
        result.response.text().trim();

      const generated =
        parseGeneratedJson(text);

      const validatedResponse =
        validateGeneratedResponse(
          generated
        );

      if (
        validatedResponse.slides.length !==
        expectedSlideCount
      ) {
        throw new Error(
          `Gemini returned ${validatedResponse.slides.length} slides, but Orthform expected ${expectedSlideCount}.`
        );
      }

      const slides =
        validateGeneratedSlides(
          validatedResponse.slides,
          structure.slides
        );

      if (
        slides.length !==
        expectedSlideCount
      ) {
        throw new Error(
          `Generated slide validation returned ${slides.length} slides, but Orthform expected ${expectedSlideCount}.`
        );
      }

      return {
        title:
          validatedResponse.title,

        slides,
      };
    } catch (error) {
      lastError = error;
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
    } = body as {
      brandId?: unknown;
      contentType?: unknown;
      format?: unknown;
      templateId?: unknown;
      input?: unknown;
    };

    // ==================================================
    // REQUEST VALIDATION
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

    const artifactFormat: ArtifactFormat =
      isValidArtifactFormat(format)
        ? format
        : "carousel";

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
    // GENERATION PROMPT
    // ==================================================

    const prompt =
      buildGenerationPrompt({
        system,
        structure,
        input: input.trim(),
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
          temperature: 0.7,
          responseMimeType:
            "application/json",
        },
      });

    // ==================================================
    // GENERATE + VALIDATE
    // ==================================================

    let generated;

    try {
      generated =
        await generateValidContent({
          model,
          prompt,
          structure,
          artifactFormat,
        });
    } catch (error) {
      const status =
        getErrorStatus(error);

      // --------------------------------------------------
      // Gemini quota / rate limit
      // --------------------------------------------------

      if (status === 429) {
        return NextResponse.json(
          {
            error:
              "Gemini usage limit reached. Please try again later or check your Gemini API quota.",
          },
          { status: 429 }
        );
      }

      // --------------------------------------------------
      // Gemini service failure
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
              "Gemini is temporarily unavailable. Please try again in a moment.",
          },
          { status: 503 }
        );
      }

      // --------------------------------------------------
      // Network / fetch failure
      // --------------------------------------------------

      if (
        isRetryableGeminiError(error)
      ) {
        return NextResponse.json(
          {
            error:
              "Orthform could not reach Gemini. Please check your connection and try again.",
          },
          { status: 503 }
        );
      }

      // --------------------------------------------------
      // Editorial validation failure
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
            "Orthform could not produce a valid artifact. Please try again.",
        },
        { status: 422 }
      );
    }

    // ==================================================
    // DOCUMENT
    // ==================================================

    const now =
      new Date().toISOString();

    const document = {
      id: crypto.randomUUID(),

      brandId,

      contentType,

      format: artifactFormat,

      templateId:
        selectedTemplateId,

      sourceInput:
        input.trim(),

      title:
        generated.title,

      slides:
        generated.slides,

      status:
        "generated" as const,

      createdAt: now,

      updatedAt: now,
    };

    // ==================================================
    // RESPONSE
    // ==================================================

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error(
      "Orthform generation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Orthform could not complete the generation request. Please try again.",
      },
      { status: 500 }
    );
  }
}