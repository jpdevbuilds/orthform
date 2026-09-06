import { BGL_EDITORIAL_SYSTEM } from "./systems/bgl";
import type {
  ContentConstraints,
  EditorialSlide,
  EditorialStructure,
  EditorialSystem,
} from "./systems/types";

/* =========================================================
   EDITORIAL SYSTEM REGISTRY
   ========================================================= */

export const EDITORIAL_SYSTEMS = {
  bgl: BGL_EDITORIAL_SYSTEM,
} satisfies Record<string, EditorialSystem>;


/* =========================================================
   GET SYSTEM
   ========================================================= */

export function getEditorialSystem(
  id: string
): EditorialSystem | undefined {
  return EDITORIAL_SYSTEMS[
    id as keyof typeof EDITORIAL_SYSTEMS
  ];
}


/* =========================================================
   GET ALL SYSTEMS
   ========================================================= */

export function getEditorialSystems(): EditorialSystem[] {
  return Object.values(EDITORIAL_SYSTEMS);
}


/* =========================================================
   TYPES
   ========================================================= */

export type {
  ContentConstraints,
  EditorialSlide,
  EditorialStructure,
  EditorialSystem,
} from "./systems/types";



