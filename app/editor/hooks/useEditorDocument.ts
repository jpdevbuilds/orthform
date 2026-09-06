"use client";

import { useEffect, useState } from "react";
import { getEditorialSystem } from "@/lib/editorial";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";
import type { TemplateId } from "@/lib/templates/templates";
import { getDocument } from "@/lib/documents";

export type Slide = {
  id: string;
  order: number;
  role: string;
  title: string;
  body: string;
};

export type DocumentStatus =
  | "new"
  | "loaded"
  | "missing";

type UseEditorDocumentParams = {
  brand: string;
  type: string;
  input: string;
  documentId: string | null;
  requestedFormat: ArtifactFormat;
  getDefaultTemplate: (contentType: string) => TemplateId;
};

function createInitialSlides(
  brandId: string,
  contentType: string,
  artifactFormat: ArtifactFormat
): Slide[] {
  const system = getEditorialSystem(brandId);

  if (!system) return [];

  const structure =
    system.structures[
      contentType as keyof typeof system.structures
    ];

  if (!structure) return [];

  const sourceSlides = structure.slides;

  if (artifactFormat === "single") {
    const firstSlide = sourceSlides[0];

    if (!firstSlide) return [];

    return [
      {
        id: crypto.randomUUID(),
        order: 0,
        role: "single",
        title: "Single Post",
        body: firstSlide.instruction,
      },
    ];
  }

  return sourceSlides.map((slide, index) => ({
    id: crypto.randomUUID(),
    order: index,
    role: slide.role,
    title: slide.role,
    body: slide.instruction,
  }));
}

function getInitializationError(
  brandId: string,
  contentType: string
): string | null {
  const system = getEditorialSystem(brandId);

  if (!system) {
    return `The editorial system for "${brandId}" could not be found.`;
  }

  const structure =
    system.structures[
      contentType as keyof typeof system.structures
    ];

  if (!structure) {
    return `The "${contentType}" content structure could not be found.`;
  }

  if (!structure.slides || structure.slides.length === 0) {
    return `The "${contentType}" content structure has no sections.`;
  }

  return null;
}

export function useEditorDocument({
  brand,
  type,
  input,
  documentId,
  requestedFormat,
  getDefaultTemplate,
}: UseEditorDocumentParams) {
  const [hydrated, setHydrated] = useState(false);

  const [initialBrand, setInitialBrand] = useState(brand);
  const [initialType, setInitialType] = useState(type);
  const [initialInput, setInitialInput] = useState(input);

  const [artifactFormat, setArtifactFormat] =
    useState<ArtifactFormat>(requestedFormat);

  const [templateId, setTemplateId] = useState<TemplateId>(
    getDefaultTemplate(type)
  );

  const [slides, setSlides] = useState<Slide[]>([]);

  const [documentTitle, setDocumentTitle] =
    useState("Untitled artifact");

  const [activeDocumentId, setActiveDocumentId] =
    useState<string | null>(null);

  const [documentCreatedAt, setDocumentCreatedAt] =
    useState<string | null>(null);

  const [documentStatus, setDocumentStatus] =
    useState<DocumentStatus>("new");

  const [initializationError, setInitializationError] =
    useState<string | null>(null);

  const [documentRecovered, setDocumentRecovered] =
    useState(false);

  useEffect(() => {
    setHydrated(false);
    setInitializationError(null);
    setDocumentRecovered(false);

    const existingDocument = documentId
      ? getDocument(documentId)
      : undefined;

    /*
     * A document ID was explicitly requested, but the document
     * does not exist. Do not silently turn this into a new artifact.
     */
    if (documentId && !existingDocument) {
      setInitialBrand(brand);
      setInitialType(type);
      setInitialInput(input);

      setArtifactFormat(requestedFormat);
      setTemplateId(getDefaultTemplate(type));

      setSlides([]);
      setDocumentTitle("Untitled artifact");
      setActiveDocumentId(null);
      setDocumentCreatedAt(null);

      setDocumentStatus("missing");
      setInitializationError(
        "The document you tried to open could not be found."
      );

      setHydrated(true);
      return;
    }

    /*
     * A document loaded by ID is the source of truth.
     * URL values are only used when creating a new artifact.
     */
    if (existingDocument) {
      setInitialBrand(existingDocument.brandId);
      setInitialType(existingDocument.contentType);
      setInitialInput(existingDocument.sourceInput);

      setArtifactFormat(existingDocument.format);
      setTemplateId(
        existingDocument.templateId ||
          getDefaultTemplate(existingDocument.contentType)
      );

      const savedSlides = Array.isArray(existingDocument.slides)
        ? existingDocument.slides
        : [];

      if (savedSlides.length > 0) {
        setSlides(savedSlides);
      } else {
        /*
         * Recover gracefully from an older/corrupt document
         * that has no usable saved slides.
         */
        const recoveredSlides = createInitialSlides(
          existingDocument.brandId,
          existingDocument.contentType,
          existingDocument.format
        );

        setSlides(recoveredSlides);

        if (recoveredSlides.length > 0) {
          setDocumentRecovered(true);
        } else {
          setInitializationError(
            getInitializationError(
              existingDocument.brandId,
              existingDocument.contentType
            ) ||
              "This document has no usable content structure."
          );
        }
      }

      setDocumentTitle(
        existingDocument.title || "Untitled artifact"
      );

      setActiveDocumentId(existingDocument.id);
      setDocumentCreatedAt(existingDocument.createdAt);
      setDocumentStatus("loaded");

      setHydrated(true);
      return;
    }

    /*
     * No document ID means this is a new artifact.
     * Explicitly reset all document-owned state so a previous
     * document can never leak into a new editor session.
     */
    setInitialBrand(brand);
    setInitialType(type);
    setInitialInput(input);

    setArtifactFormat(requestedFormat);
    setTemplateId(getDefaultTemplate(type));

    const initialSlides = createInitialSlides(
      brand,
      type,
      requestedFormat
    );

    setSlides(initialSlides);

    if (initialSlides.length === 0) {
      setInitializationError(
        getInitializationError(brand, type) ||
          "No content structure could be created for this artifact."
      );
    }

    setDocumentTitle("Untitled artifact");
    setActiveDocumentId(null);
    setDocumentCreatedAt(null);
    setDocumentStatus("new");

    setHydrated(true);
  }, [
    documentId,
    brand,
    type,
    input,
    requestedFormat,
    getDefaultTemplate,
  ]);

  return {
    hydrated,

    initialBrand,
    setInitialBrand,

    initialType,
    setInitialType,

    initialInput,
    setInitialInput,

    artifactFormat,
    setArtifactFormat,

    templateId,
    setTemplateId,

    slides,
    setSlides,

    documentTitle,
    setDocumentTitle,

    activeDocumentId,
    setActiveDocumentId,

    documentCreatedAt,
    setDocumentCreatedAt,

    documentStatus,
    initializationError,
    documentRecovered,
  };
}