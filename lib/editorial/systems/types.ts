/* =========================================================
   ORTHFORM — EDITORIAL TYPES
   ========================================================= */

export type ArtifactFormat =
  | "single"
  | "carousel";

export type ContentConstraints = {
  titleMaxWords: number;
  bodyMaxWords: number;
  bodyMaxCharacters: number;
};

export type EditorialSlide = {
  role: string;
  instruction: string;
  constraints: ContentConstraints;
};

export type EditorialStructure = {
  name: string;
  purpose: string;

  format: ArtifactFormat;

  constraints: ContentConstraints;

  slides: EditorialSlide[];
};

export type EditorialSystem = {
  id: string;
  name: string;

  philosophy: string;

  audience: string[];

  principles: string[];

  tone: string[];

  avoid: string[];

  structures: Record<
    string,
    EditorialStructure
  >;
};