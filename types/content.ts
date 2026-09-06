// ============================================================
// ORTHFORM — CONTENT TYPES
// ============================================================

export type BrandId =
  | "bgl"
  | "jpdev"
  | "northstar"
  | "reel";

export type ContentTypeId =
  | "educational"
  | "reflection"
  | "product"
  | "discussion";

export type ContentStatus =
  | "draft"
  | "generated"
  | "published";

// ============================================================
// CONTENT DOCUMENT
// ============================================================

export interface ContentDocument {
  id: string;

  brandId: BrandId;

  contentType: ContentTypeId;

  sourceInput: string;

  title?: string;

  slides: ContentSlide[];

  status: ContentStatus;

  createdAt: string;

  updatedAt: string;
}

// ============================================================
// CONTENT SLIDE
// ============================================================

export interface ContentSlide {
  id: string;

  order: number;

  role?: string;

  title: string;

  body: string;
}