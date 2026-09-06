// ============================================================
// ORTHFORM — CONTENT DENSITY
// ============================================================

export type DensityConstraints = {
  titleMaxWords: number;
  bodyMaxWords: number;
  bodyMaxCharacters: number;
};

export type DensityResult = {
  valid: boolean;

  titleWords: number;
  bodyWords: number;
  bodyCharacters: number;

  issues: string[];
};

// ============================================================
// WORD COUNT
// ============================================================

export function countWords(
  text: string
): number {
  const normalized = text.trim();

  if (!normalized) {
    return 0;
  }

  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

// ============================================================
// SLIDE DENSITY VALIDATION
// ============================================================

export function validateSlideDensity(
  title: string,
  body: string,
  constraints: DensityConstraints
): DensityResult {
  const normalizedTitle = title.trim();
  const normalizedBody = body.trim();

  const titleWords =
    countWords(normalizedTitle);

  const bodyWords =
    countWords(normalizedBody);

  const bodyCharacters =
    normalizedBody.length;

  const issues: string[] = [];

  // ----------------------------------------------------------
  // Title
  // ----------------------------------------------------------

  if (
    titleWords >
    constraints.titleMaxWords
  ) {
    issues.push(
      `Title exceeds ${constraints.titleMaxWords} words.`
    );
  }

  // ----------------------------------------------------------
  // Body — word limit
  // ----------------------------------------------------------

  if (
    bodyWords >
    constraints.bodyMaxWords
  ) {
    issues.push(
      `Body exceeds ${constraints.bodyMaxWords} words.`
    );
  }

  // ----------------------------------------------------------
  // Body — character limit
  // ----------------------------------------------------------

  if (
    bodyCharacters >
    constraints.bodyMaxCharacters
  ) {
    issues.push(
      `Body exceeds ${constraints.bodyMaxCharacters} characters.`
    );
  }

  return {
    valid: issues.length === 0,

    titleWords,
    bodyWords,
    bodyCharacters,

    issues,
  };
}