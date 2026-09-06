import type { ArtifactFormat } from "@/lib/editorial/systems/types";
import type { TemplateId } from "@/lib/templates/templates";

export type OrthformSlide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

export type OrthformDocument = {
  id: string;
  brandId: string;
  contentType: string;
  format: ArtifactFormat;
  templateId: TemplateId;
  sourceInput: string;
  title: string;
  slides: OrthformSlide[];
  status: "draft" | "generated";
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "orthform-documents";

// ==================================================
// STORAGE
// ==================================================

function writeDocuments(
  documents: OrthformDocument[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(documents)
  );
}

// ==================================================
// CREATE
// ==================================================

export function createDocument(
  data: Omit<
    OrthformDocument,
    "id" | "createdAt" | "updatedAt"
  >
): OrthformDocument {
  const now = new Date().toISOString();

  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

// ==================================================
// READ ALL
// ==================================================

export function getDocuments(): OrthformDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as OrthformDocument[];
  } catch {
    return [];
  }
}

// ==================================================
// READ ONE
// ==================================================

export function getDocument(
  id: string
): OrthformDocument | null {
  const documents = getDocuments();

  return (
    documents.find(
      (document) => document.id === id
    ) || null
  );
}

// ==================================================
// SAVE
//
// Creates a new document if the ID doesn't exist.
// Updates an existing document if the ID exists.
//
// Document identity is stable:
// - id never changes
// - createdAt never changes
// - updatedAt changes on every successful save
// ==================================================

export function saveDocument(
  document: OrthformDocument
): OrthformDocument {
  if (typeof window === "undefined") {
    return document;
  }

  const documents = getDocuments();

  const existingIndex =
    documents.findIndex(
      (item) => item.id === document.id
    );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const existingDocument =
      documents[existingIndex];

    const documentToSave: OrthformDocument = {
      ...document,

      // Existing document identity is authoritative.
      id: existingDocument.id,
      createdAt: existingDocument.createdAt,
      updatedAt: now,
    };

    documents[existingIndex] =
      documentToSave;

    writeDocuments(documents);

    return documentToSave;
  }

  const documentToSave: OrthformDocument = {
    ...document,
    updatedAt: now,
  };

  documents.unshift(documentToSave);

  writeDocuments(documents);

  return documentToSave;
}

// ==================================================
// UPDATE
//
// Updates an existing document only.
// Never creates a new document.
//
// Immutable fields:
// - id
// - createdAt
//
// Mutable fields:
// - brandId
// - contentType
// - format
// - templateId
// - sourceInput
// - title
// - slides
// - status
// - updatedAt
// ==================================================

export function updateDocument(
  id: string,
  updates: Partial<
    Omit<
      OrthformDocument,
      "id" | "createdAt"
    >
  >
): OrthformDocument | null {
  if (typeof window === "undefined") {
    return null;
  }

  const documents = getDocuments();

  const index =
    documents.findIndex(
      (document) => document.id === id
    );

  if (index === -1) {
    return null;
  }

  const existingDocument =
    documents[index];

  const updatedDocument: OrthformDocument = {
    ...existingDocument,
    ...updates,

    // Identity remains immutable.
    id: existingDocument.id,
    createdAt: existingDocument.createdAt,
    updatedAt: new Date().toISOString(),
  };

  documents[index] =
    updatedDocument;

  writeDocuments(documents);

  return updatedDocument;
}

// ==================================================
// DELETE
// ==================================================

export function deleteDocument(
  id: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  const documents = getDocuments();

  const updatedDocuments =
    documents.filter(
      (document) => document.id !== id
    );

  writeDocuments(updatedDocuments);
}

// ==================================================
// CLEAR ALL
// ==================================================

export function clearDocuments(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}