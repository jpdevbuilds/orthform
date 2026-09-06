import type {
  EditorialSystem,
} from "./types";

import {
  BGL_EDITORIAL_SYSTEM,
} from ".";

const EDITORIAL_SYSTEMS: EditorialSystem[] = [
  BGL_EDITORIAL_SYSTEM,
];

export function getEditorialSystem(
  id: string
): EditorialSystem | undefined {
  return EDITORIAL_SYSTEMS.find(
    (system) => system.id === id
  );
}

export function getEditorialSystems(): EditorialSystem[] {
  return EDITORIAL_SYSTEMS;
}