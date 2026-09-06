import {
  BrandId,
  ContentTypeId,
} from "@/types/content";

export interface BrandSystem {
  id: BrandId;
  name: string;
  description: string;
  contentTypes: ContentTypeId[];

  colors: {
    primary: string;
    secondary: string;

    background: string;
    surface: string;

    text: string;
    heading: string;

    success: string;
    warning: string;
    error: string;
  };
}

const DEFAULT_BRAND_COLORS: BrandSystem["colors"] = {
  primary: "#2A5D9E",
  secondary: "#FFD166",

  background: "#F1EFE7",
  surface: "#EAE7DC",

  text: "#2F2F2F",
  heading: "#1A1A1A",

  success: "#6A994E",
  warning: "#E67E22",
  error: "#D72638",
};

export const BRAND_SYSTEMS: BrandSystem[] = [
  {
    id: "bgl",
    name: "BGL",
    description: "Business Growth Lab",

    contentTypes: [
      "educational",
      "discussion",
    ],

    colors: DEFAULT_BRAND_COLORS,
  },

  {
    id: "jpdev",
    name: "JPDEV.STUDIO",
    description: "Product & Engineering",

    contentTypes: [
      "educational",
      "product",
    ],

    colors: DEFAULT_BRAND_COLORS,
  },

  {
    id: "northstar",
    name: "Northstar",
    description: "Personal Reflection & Philosophy",

    contentTypes: [
      "reflection",
      "educational",
    ],

    colors: DEFAULT_BRAND_COLORS,
  },

  {
    id: "reel",
    name: "ReelWithJP",
    description: "Short Form Media & Ideas",

    contentTypes: [
      "reflection",
      "discussion",
    ],

    colors: DEFAULT_BRAND_COLORS,
  },
];

// ============================================================
// BRAND LOOKUP
// ============================================================

export function getBrandSystem(
  brandId: BrandId
): BrandSystem {
  const brand = BRAND_SYSTEMS.find(
    (system) => system.id === brandId
  );

  if (!brand) {
    throw new Error(
      `Unknown brand system: ${brandId}`
    );
  }

  return brand;
}

export function getBrandContentTypes(
  brandId: BrandId
): ContentTypeId[] {
  return getBrandSystem(brandId).contentTypes;
}

export function isContentTypeAvailable(
  brandId: BrandId,
  contentType: ContentTypeId
): boolean {
  return getBrandSystem(
    brandId
  ).contentTypes.includes(contentType);
}