import { ContentTypeId } from "@/types/content";

export interface ContentTypeDefinition {
  id: ContentTypeId;
  name: string;
  description: string;
}

export const CONTENT_TYPES: ContentTypeDefinition[] = [
  {
    id: "educational",
    name: "Educational",
    description: "Break down an idea into a clear, structured explanation.",
  },

  {
    id: "reflection",
    name: "Reflection",
    description: "Turn an observation or personal thought into an expression.",
  },

  {
    id: "product",
    name: "Product",
    description: "Present a product, feature, system, or idea.",
  },

  {
    id: "discussion",
    name: "Discussion",
    description: "Create something designed to start a useful conversation.",
  },
];