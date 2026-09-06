"use client";

import { useEffect, useRef, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { FileText } from "lucide-react";

import { getEditorialSystem } from "@/lib/editorial";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";
import type { TemplateId } from "@/lib/templates/templates";

import {
  createDocument,
  saveDocument,
  updateDocument,
} from "@/lib/documents";

import {
  getSettings,
  saveTheme,
  type ThemePreference,
} from "@/lib/settings";

import { getTemplate } from "@/lib/templates/templates";

import EditorMobileTools from "./components/EditorMobileTools";
import EditorHeader from "./components/EditorHeader";
import EditorMobileWorkspace from "./components/EditorMobileWorkspace";
import EditorDesktopWorkspace from "./components/EditorDesktopWorkspace";

import EditorExport, {
  type EditorExportHandle,
} from "./components/EditorExport";

import {
  useEditorDocument,
  type Slide,
} from "./hooks/useEditorDocument";

type SaveStatus =
  | "idle"
  | "saving"
  | "saved";

type ErrorAction =
  | "generate"
  | "recompose"
  | "saveAsNew"
  | null;

type HistorySnapshot = {
  slides: Slide[];
  currentSlide: number;
};

const THEME_EVENT = "orthform-theme-change";

const MAX_HISTORY = 30;

const DEFAULT_CONSTRAINTS = {
  titleMaxWords: 10,
  bodyMaxWords: 35,
  bodyMaxCharacters: 220,
};

// ==================================================
// CONSTRAINT HELPERS
// ==================================================

function countWords(value: string): number {
  return value.trim()
    ? value.trim().split(/\s+/).length
    : 0;
}

function limitWords(
  value: string,
  maxWords: number
): string {
  const words = value.trim().split(/\s+/);

  if (
    value.trim() === "" ||
    words.length <= maxWords
  ) {
    return value;
  }

  return words
    .slice(0, maxWords)
    .join(" ");
}

function applyConstraints(
  field: "title" | "body",
  value: string,
  constraints: {
    titleMaxWords: number;
    bodyMaxWords: number;
    bodyMaxCharacters: number;
  }
): string {
  if (field === "title") {
    return limitWords(
      value,
      constraints.titleMaxWords
    );
  }

  let nextValue = value.slice(
    0,
    constraints.bodyMaxCharacters
  );

  if (
    countWords(nextValue) >
    constraints.bodyMaxWords
  ) {
    nextValue = limitWords(
      nextValue,
      constraints.bodyMaxWords
    );
  }

  return nextValue;
}

// ==================================================
// DEFAULT TEMPLATE
// ==================================================

function getDefaultTemplate(
  contentType: string
): TemplateId {
  if (contentType === "educational") {
    return "authority";
  }

  if (contentType === "case-study") {
    return "spotlight";
  }

  return "utility";
}

// ==================================================
// API ERROR HELPERS
// ==================================================

function getResponseErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string" &&
    data.error.trim()
  ) {
    return data.error;
  }

  return fallback;
}

// ==================================================
// EDITOR PAGE
// ==================================================

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==================================================
  // EXPORT COMPONENT REF
  // ==================================================

  const exportComponentRef =
    useRef<EditorExportHandle>(null);

  // ==================================================
  // ROUTE PARAMETERS
  // ==================================================

  const brand =
    searchParams.get("brand") ||
    "bgl";

  const type =
    searchParams.get("type") ||
    "educational";

  const input =
    searchParams.get("input") ||
    "";

  const documentId =
    searchParams.get("documentId");

  const requestedFormat: ArtifactFormat =
    searchParams.get("format") === "single"
      ? "single"
      : "carousel";

  const requestedTemplate =
    searchParams.get("template");

  // ==================================================
  // DOCUMENT STATE
  // ==================================================

  const {
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
  } = useEditorDocument({
    brand,
    type,
    input,
    documentId,
    requestedFormat,
    getDefaultTemplate,
  });

  useEffect(() => {
    if (!hydrated || !requestedTemplate) {
      return;
    }

    const validTemplates: TemplateId[] = [
      "authority",
      "spotlight",
      "utility",
      "comparison",
    ];

    if (
      validTemplates.includes(
        requestedTemplate as TemplateId
      )
    ) {
      setTemplateId(
        requestedTemplate as TemplateId
      );
    }
  }, [
    hydrated,
    requestedTemplate,
    setTemplateId,
  ]);

  // ==================================================
  // EDITORIAL SYSTEM
  // ==================================================

  const system =
    getEditorialSystem(initialBrand);

  const structure =
    system?.structures[
      initialType as keyof typeof system.structures
    ];

  // ==================================================
  // EDITOR STATE
  // ==================================================

  const template =
    getTemplate(templateId);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [generating, setGenerating] =
    useState(false);

  const [recomposing, setRecomposing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [errorAction, setErrorAction] =
    useState<ErrorAction>(null);

  const [exporting, setExporting] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  // ==================================================
  // UNDO HISTORY
  // ==================================================

  const historyRef =
    useRef<HistorySnapshot[]>([]);

  // One history entry per editing session, not per keystroke.
  const editSessionRef = useRef(false);

  const [canUndo, setCanUndo] =
    useState(false);

  const pushHistory = () => {
    const snapshot: HistorySnapshot = {
      slides: slides.map((item) => ({
        ...item,
      })),
      currentSlide,
    };

    historyRef.current = [
      ...historyRef.current,
      snapshot,
    ].slice(-MAX_HISTORY);

    setCanUndo(true);
  };

  const clearHistory = () => {
    historyRef.current = [];
    setCanUndo(false);
  };

  const handleEditStart = (
    _field: "title" | "body"
  ) => {
    if (generating || recomposing) {
      return;
    }

    if (editSessionRef.current) {
      return;
    }

    pushHistory();
    editSessionRef.current = true;
  };

  const handleEditEnd = () => {
    editSessionRef.current = false;
  };

  const handleUndo = () => {
    if (
      !canUndo ||
      recomposing ||
      generating ||
      historyRef.current.length === 0
    ) {
      return;
    }

    const history =
      [...historyRef.current];

    const previous =
      history.pop();

    if (!previous) {
      setCanUndo(false);
      editSessionRef.current = false;
      return;
    }

    editSessionRef.current = false;
    historyRef.current = history;

    setSlides(
      previous.slides.map((item) => ({
        ...item,
      }))
    );

    setCurrentSlide(
      Math.min(
        previous.currentSlide,
        Math.max(
          0,
          previous.slides.length - 1
        )
      )
    );

    setSaveStatus("idle");
    setError("");
    setErrorAction(null);

    setCanUndo(
      history.length > 0
    );
  };

  // ==================================================
  // KEYBOARD RECOVERY
  // ==================================================

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const isUndo =
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "z" &&
        !event.shiftKey;

      if (!isUndo) {
        return;
      }

      if (
        generating ||
        recomposing ||
        !canUndo
      ) {
        return;
      }

      event.preventDefault();

      handleUndo();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    generating,
    recomposing,
    canUndo,
  ]);

  // ==================================================
  // DESKTOP PANEL STATE
  // ==================================================

  const [structureOpen, setStructureOpen] =
    useState(true);

  const [inspectorOpen, setInspectorOpen] =
    useState(true);

  // ==================================================
  // MOBILE SHEET STATE
  // ==================================================

  const [
    mobileStructureOpen,
    setMobileStructureOpen,
  ] = useState(false);

  const [
    mobileInspectorOpen,
    setMobileInspectorOpen,
  ] = useState(false);

  // ==================================================
  // THEME
  // ==================================================

  const [theme, setTheme] =
    useState<ThemePreference>("light");

  useEffect(() => {
    setTheme(getSettings().theme);

    const handleThemeChange = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<ThemePreference>;

      if (
        customEvent.detail === "light" ||
        customEvent.detail === "dark"
      ) {
        setTheme(customEvent.detail);
      }
    };

    window.addEventListener(
      THEME_EVENT,
      handleThemeChange
    );

    return () => {
      window.removeEventListener(
        THEME_EVENT,
        handleThemeChange
      );
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme =
      theme === "light"
        ? "dark"
        : "light";

    setTheme(nextTheme);
    saveTheme(nextTheme);

    window.dispatchEvent(
      new CustomEvent(THEME_EVENT, {
        detail: nextTheme,
      })
    );
  };

  // ==================================================
  // CURRENT SLIDE
  // ==================================================

  const slide =
    slides[currentSlide];

  // ==================================================
  // CURRENT CONSTRAINTS
  // ==================================================

  const constraints =
    structure?.slides[currentSlide]
      ?.constraints ||
    DEFAULT_CONSTRAINTS;

  // ==================================================
  // SOURCE IDEA
  // ==================================================

  const handleInputChange = (
    value: string
  ) => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    setInitialInput(value);
    setSaveStatus("idle");
    setError("");
    setErrorAction(null);
  };

  // ==================================================
  // TEMPLATE PREVIEW
  // ==================================================

  const handleTemplateChange = (
    nextTemplateId: TemplateId
  ) => {
    if (
      nextTemplateId === templateId ||
      recomposing ||
      generating
    ) {
      return;
    }

    setTemplateId(nextTemplateId);
    setSaveStatus("idle");
    setError("");
    setErrorAction(null);
  };

  // ==================================================
  // AI RECOMPOSITION
  // ==================================================

  const handleRecompose = async () => {
    if (
      recomposing ||
      generating ||
      !initialInput.trim()
    ) {
      return;
    }

    editSessionRef.current = false;

    const previousSlides = slides;
    const previousTitle = documentTitle;

    setRecomposing(true);
    setError("");
    setErrorAction(null);
    setSaveStatus("idle");

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    try {
      const response = await fetch(
        "/api/recompose",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            brandId: initialBrand,
            contentType: initialType,
            format: artifactFormat,
            templateId,
            input: initialInput,
            title: documentTitle,
            slides,
          }),
        }
      );

      let data: unknown;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Orthform received an invalid response from the server."
        );
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            getResponseErrorMessage(
              data,
              "Gemini usage limit reached. Please try again later."
            )
          );
        }

        throw new Error(
          getResponseErrorMessage(
            data,
            "Recomposition failed."
          )
        );
      }

      if (
        !data ||
        typeof data !== "object" ||
        !("slides" in data) ||
        !Array.isArray(data.slides) ||
        data.slides.length === 0
      ) {
        throw new Error(
          "The recomposition response contains no usable slides."
        );
      }

      const result = data as {
        title?: string;
        slides: Slide[];
      };

      setDocumentTitle(
        result.title ||
          previousTitle
      );

      setSlides(result.slides);

      setCurrentSlide((current) =>
        Math.min(
          current,
          result.slides.length - 1
        )
      );

      // AI output becomes the new baseline.
      clearHistory();

      setSaveStatus("idle");
    } catch (error) {
      console.error(
        "Orthform recomposition error:",
        error
      );

      setSlides(previousSlides);
      setDocumentTitle(previousTitle);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while recomposing."
      );

      setErrorAction("recompose");
    } finally {
      setRecomposing(false);
    }
  };

  // ==================================================
  // NAVIGATION
  // ==================================================

  const goPrevious = () => {
    if (recomposing || generating) {
      return;
    }

    setCurrentSlide((value) =>
      Math.max(0, value - 1)
    );
  };

  const goNext = () => {
    if (recomposing || generating) {
      return;
    }

    setCurrentSlide((value) =>
      Math.min(
        slides.length - 1,
        value + 1
      )
    );
  };

  const selectSlide = (
    index: number
  ) => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    if (
      index < 0 ||
      index >= slides.length
    ) {
      return;
    }

    setCurrentSlide(index);
    setMobileStructureOpen(false);
  };

  // ==================================================
  // UPDATE SLIDE
  // ==================================================

  const updateSlide = (
    field: "title" | "body",
    value: string
  ) => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    const constrainedValue =
      applyConstraints(
        field,
        value,
        constraints
      );

    const currentValue =
      slides[currentSlide]?.[field];

    if (
      currentValue ===
      constrainedValue
    ) {
      return;
    }

    setSlides((current) =>
      current.map(
        (item, index) =>
          index === currentSlide
            ? {
                ...item,
                [field]: constrainedValue,
              }
            : item
      )
    );

    setSaveStatus("idle");
  };

  // ==================================================
  // GENERATE CONTENT
  // ==================================================

  const generateContent = async () => {
    if (recomposing) {
      return;
    }

    if (!initialInput.trim()) {
      setError(
        "There is no source idea to generate from."
      );
      setErrorAction(null);

      return;
    }

    editSessionRef.current = false;

    setGenerating(true);
    setError("");
    setErrorAction(null);

    try {
      const response =
        await fetch(
          "/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              brandId: initialBrand,
              contentType: initialType,
              format: artifactFormat,
              templateId,
              input: initialInput,
            }),
          }
        );

      let data: unknown;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Orthform received an invalid response from the server."
        );
      }

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            getResponseErrorMessage(
              data,
              "Gemini usage limit reached. Please try again later."
            )
          );
        }

        throw new Error(
          getResponseErrorMessage(
            data,
            "Generation failed."
          )
        );
      }

      if (
        !data ||
        typeof data !== "object" ||
        !("document" in data) ||
        !data.document ||
        typeof data.document !== "object" ||
        !("slides" in data.document) ||
        !Array.isArray(data.document.slides) ||
        data.document.slides.length === 0
      ) {
        throw new Error(
          "The generation response contains no usable slides."
        );
      }

      const result = data as {
        document: {
          title?: string;
          slides: Slide[];
        };
      };

      setDocumentTitle(
        result.document.title ||
          "Untitled artifact"
      );

      setSlides(
        result.document.slides
      );

      setCurrentSlide(0);

      // Generated content becomes
      // the new recovery baseline.
      clearHistory();

      setSaveStatus("idle");

      setMobileStructureOpen(false);
      setMobileInspectorOpen(false);
    } catch (error) {
      console.error(
        "Orthform generation failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating."
      );

      setErrorAction("generate");
    } finally {
      setGenerating(false);
    }
  };

  // ==================================================
  // SAVE AS NEW DOCUMENT
  // ==================================================

  const handleSaveAsNew = () => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    if (!slides.length) {
      setError(
        "There is no content to save."
      );
      setErrorAction(null);

      return;
    }

    setSaveStatus("saving");
    setError("");
    setErrorAction(null);

    try {
      const newDocument =
        createDocument({
          brandId: initialBrand,
          contentType: initialType,
          format: artifactFormat,
          templateId,
          sourceInput: initialInput,
          title: documentTitle,
          slides,
          status: "generated",
        });

      const savedDocument =
        saveDocument(newDocument);

      setActiveDocumentId(
        savedDocument.id
      );

      setDocumentCreatedAt(
        savedDocument.createdAt
      );

      setSaveStatus("saved");

      window.setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error(
        "Orthform save-as-new error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not save this document as a new document."
      );

      setErrorAction("saveAsNew");
      setSaveStatus("idle");
    }
  };

  // ==================================================
  // RETRY FAILED ACTION
  // ==================================================

  const handleRetry = () => {
    if (
      generating ||
      recomposing ||
      !errorAction
    ) {
      return;
    }

    const action =
      errorAction;

    setError("");
    setErrorAction(null);

    if (action === "generate") {
      void generateContent();
      return;
    }

    if (action === "recompose") {
      void handleRecompose();
    }
  };

  // ==================================================
  // DISMISS ERROR
  // ==================================================

  const handleDismissError = () => {
    setError("");
    setErrorAction(null);
  };

  // ==================================================
  // SAVE DOCUMENT
  // ==================================================

  const handleSave = () => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    if (!slides.length) {
      setError(
        "There is no content to save."
      );
      setErrorAction(null);

      return;
    }

    setSaveStatus("saving");
    setError("");
    setErrorAction(null);

    try {
      // ==================================================
      // UPDATE EXISTING DOCUMENT
      // ==================================================

      if (activeDocumentId) {
        const updatedDocument =
          updateDocument(
            activeDocumentId,
            {
              brandId: initialBrand,
              contentType: initialType,
              format: artifactFormat,
              templateId,
              sourceInput: initialInput,
              title: documentTitle,
              slides,
              status: "generated",
            }
          );

        if (!updatedDocument) {
          throw new Error(
            "This document no longer exists in Archive. You can save the current version as a new document."
          );
        }

        setActiveDocumentId(
          updatedDocument.id
        );

        setDocumentCreatedAt(
          updatedDocument.createdAt
        );

        setSaveStatus("saved");

        window.setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);

        return;
      }

      // ==================================================
      // CREATE NEW DOCUMENT
      // ==================================================

      const newDocument =
        createDocument({
          brandId: initialBrand,
          contentType: initialType,
          format: artifactFormat,
          templateId,
          sourceInput: initialInput,
          title: documentTitle,
          slides,
          status: "generated",
        });

      const savedDocument =
        saveDocument(newDocument);

      setActiveDocumentId(
        savedDocument.id
      );

      setDocumentCreatedAt(
        savedDocument.createdAt
      );

      setSaveStatus("saved");

      window.setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error(
        "Orthform save error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Could not save this document.";

      const isMissingDocument =
        message.includes(
          "no longer exists in Archive"
        );

      setError(message);

      setErrorAction(
        isMissingDocument
          ? "saveAsNew"
          : null
      );

      setSaveStatus("idle");
    }
  };

  // ==================================================
  // EXPORT CURRENT SLIDE
  // ==================================================

  const handleExport = async () => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    await exportComponentRef.current
      ?.exportCurrent();
  };

  // ==================================================
  // EXPORT ALL SLIDES
  // ==================================================

  const handleExportAll = async () => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    await exportComponentRef.current
      ?.exportAll();
  };

  // ==================================================
  // ADD SECTION
  // ==================================================

  const addSection = () => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    editSessionRef.current = false;
    pushHistory();

    const newSlide: Slide = {
      id: crypto.randomUUID(),
      order: slides.length,
      role: "custom",
      title: "New Section",
      body: "Add your content here.",
    };

    setSlides((current) => [
      ...current,
      newSlide,
    ]);

    setCurrentSlide(
      slides.length
    );

    setSaveStatus("idle");
    setError("");
    setErrorAction(null);
    setMobileStructureOpen(false);
  };

  // ==================================================
  // RENAME SECTION
  // ==================================================

  const renameSection = (
    index: number,
    title: string
  ) => {
    if (
      recomposing ||
      generating
    ) {
      return;
    }

    const nextTitle =
      applyConstraints(
        "title",
        title.trim(),
        structure?.slides[index]
          ?.constraints ||
          DEFAULT_CONSTRAINTS
      );

    if (!nextTitle) {
      return;
    }

    const currentTitle =
      slides[index]?.title;

    if (
      currentTitle === nextTitle
    ) {
      return;
    }

    editSessionRef.current = false;
    pushHistory();

    setSlides((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                title: nextTitle,
              }
            : item
      )
    );

    setSaveStatus("idle");
    setError("");
    setErrorAction(null);
  };

  // ==================================================
  // DELETE SECTION
  // ==================================================

  const deleteSection = (
    index: number
  ) => {
    if (
      recomposing ||
      generating ||
      slides.length <= 1 ||
      index < 0 ||
      index >= slides.length
    ) {
      return;
    }

    editSessionRef.current = false;
    pushHistory();

    setSlides((current) =>
      current
        .filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
        .map((item, itemIndex) => ({
          ...item,
          order: itemIndex,
        }))
    );

    setCurrentSlide((current) => {
      if (index < current) {
        return current - 1;
      }

      if (index === current) {
        return Math.min(
          current,
          slides.length - 2
        );
      }

      return current;
    });

    setSaveStatus("idle");
    setError("");
    setErrorAction(null);
  };

  // ==================================================
  // HYDRATION LOADING STATE
  // ==================================================

  if (!hydrated) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[var(--app-bg)]
          text-[var(--app-ink)]
          transition-colors
          duration-300
        "
      >
        <p
          className="
            text-xs
            uppercase
            tracking-[0.2em]
            text-[var(--app-muted)]
          "
        >
          Loading Orthform…
        </p>
      </div>
    );
  }

  // ==================================================
  // EMPTY / MISSING DOCUMENT RECOVERY
  // ==================================================

  if (!slide) {
    const isMissingDocument =
      documentStatus === "missing";

    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[var(--app-bg)]
          px-6
          text-[var(--app-ink)]
          transition-colors
          duration-300
        "
      >
        <div className="w-full max-w-md text-center">
          <div
            className="
              mx-auto
              mb-6
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[var(--app-border)]
              bg-[var(--app-surface)]
              text-[var(--app-muted)]
            "
          >
            <FileText
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-[var(--app-muted)]
            "
          >
            Orthform / Editor
          </p>

          <h1
            className="
              mt-3
              text-2xl
              font-medium
              text-[var(--app-heading)]
            "
          >
            {isMissingDocument
              ? "Document not found"
              : "Nothing to edit yet"}
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[var(--app-muted)]
            "
          >
            {isMissingDocument
              ? "The document you tried to open could not be found."
              : initializationError ||
                "Orthform could not create a usable content structure for this artifact."}
          </p>

          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push("/create")
              }
              className="
                rounded-lg
                bg-[var(--app-active)]
                px-4
                py-2.5
                text-sm
                font-medium
                text-[var(--app-active-ink)]
                transition-opacity
                hover:opacity-90
              "
            >
              Create new
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/")
              }
              className="
                rounded-lg
                border
                border-[var(--app-border)]
                bg-[var(--app-surface)]
                px-4
                py-2.5
                text-sm
                font-medium
                text-[var(--app-ink)]
                transition-colors
                hover:bg-[var(--app-hover)]
              "
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div
      className="
        min-h-screen
        w-full
        min-w-0
        max-w-full
        overflow-x-clip
        bg-[var(--app-bg)]
        text-[var(--app-ink)]
        transition-colors
        duration-300
      "
    >
      {/* ==================================================
          EXPORT
          ================================================== */}

      <EditorExport
        ref={exportComponentRef}
        slides={slides}
        currentSlide={currentSlide}
        documentTitle={documentTitle}
        systemName={
          system?.name ||
          initialBrand
        }
        templateId={
          template?.id ||
          "authority"
        }
        artifactFormat={artifactFormat}
        onExportingChange={
          setExporting
        }
        onError={(message) => {
          setError(message);
          setErrorAction(null);
        }}
      />

      {/* ==================================================
          HEADER
          ================================================== */}

      <EditorHeader
        systemName={
          system?.name ||
          initialBrand
        }
        contentType={initialType}
        title={documentTitle}
        generating={generating}
        theme={theme}
        onToggleTheme={toggleTheme}
        saveStatus={saveStatus}
        onTitleChange={(value) => {
          if (
            generating ||
            recomposing
          ) {
            return;
          }

          setDocumentTitle(value);
          setSaveStatus("idle");
          setError("");
          setErrorAction(null);
        }}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
        onGenerate={generateContent}
        onSave={handleSave}
        onExport={handleExport}
        onExportAll={handleExportAll}
        exporting={exporting}
      />

      {/* ==================================================
          RECOVERY NOTICE
          ================================================== */}

      {documentRecovered && (
        <div
          className="
            border-b
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            px-4
            py-2.5
          "
        >
          <div className="mx-auto max-w-7xl">
            <p
              className="
                text-xs
                text-[var(--app-muted)]
              "
            >
              This document had no saved
              sections, so Orthform restored
              its original structure.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================
          ERROR
          ================================================== */}

      {error && (
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
            border-b
            border-[var(--app-error)]/20
            bg-[var(--app-error)]/5
            px-5
            py-3
            text-xs
            text-[var(--app-error)]
          "
          role="alert"
        >
          <p className="text-center">
            {error}
          </p>

          {errorAction === "saveAsNew" && (
            <button
              type="button"
              onClick={handleSaveAsNew}
              disabled={
                generating ||
                recomposing ||
                saveStatus === "saving"
              }
              className="
                shrink-0
                rounded-md
                border
                border-[var(--app-error)]/20
                bg-[var(--app-error)]/5
                px-3
                py-1
                font-medium
                transition
                hover:bg-[var(--app-error)]/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Save as new
            </button>
          )}

          {(errorAction === "generate" ||
            errorAction === "recompose") && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={
                generating ||
                recomposing
              }
              className="
                shrink-0
                rounded-md
                border
                border-[var(--app-error)]/20
                bg-[var(--app-error)]/5
                px-3
                py-1
                font-medium
                transition
                hover:bg-[var(--app-error)]/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Retry
            </button>
          )}

          <button
            type="button"
            onClick={handleDismissError}
            className="
              shrink-0
              rounded-md
              px-2
              py-1
              font-medium
              transition
              hover:bg-[var(--app-error)]/10
            "
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================================================
          DESKTOP UNDO
          ================================================== */}

      {canUndo && (
        <button
          type="button"
          onClick={handleUndo}
          disabled={
            generating ||
            recomposing
          }
          aria-label="Undo last change"
          title="Undo last change (Ctrl+Z)"
          aria-keyshortcuts="Control+Z Meta+Z"
          className="
            fixed
            bottom-6
            left-6
            z-50
            hidden
            h-10
            items-center
            gap-2
            rounded-full
            border
            border-[var(--app-border)]
            bg-[var(--app-surface)]
            px-4
            text-xs
            font-medium
            text-[var(--app-ink)]
            shadow-[0_10px_30px_rgba(0,0,0,0.12)]
            transition
            hover:bg-[var(--app-hover)]
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
            md:flex
          "
        >
          <span aria-hidden="true">
            ↶
          </span>

          <span>
            Undo
          </span>

          <span className="text-[var(--app-subtle)]">
            Ctrl+Z
          </span>
        </button>
      )}

      {/* ==================================================
          DESKTOP WORKSPACE
          ================================================== */}

      <EditorDesktopWorkspace
        slides={slides}
        currentSlide={currentSlide}
        slide={slide}
        systemName={
          system?.name ||
          initialBrand
        }
        philosophy={system?.philosophy}
        input={initialInput}
        generating={generating}
        recomposing={recomposing}
        constraints={constraints}
        onRecompose={handleRecompose}
        theme={theme}
        templateId={templateId}
        artifactFormat={artifactFormat}
        structureOpen={structureOpen}
        inspectorOpen={inspectorOpen}
        onSelect={selectSlide}
        onAdd={addSection}
        onRename={renameSection}
        onDelete={deleteSection}
        onUpdate={updateSlide}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
        onPrevious={goPrevious}
        onInputChange={handleInputChange}
        onNext={goNext}
        onTemplateChange={handleTemplateChange}
        onToggleStructure={() => {
          setStructureOpen(
            (value) => {
              const next = !value;

              if (next) {
                setInspectorOpen(false);
              }

              return next;
            }
          );
        }}
        onToggleInspector={() => {
          setInspectorOpen(
            (value) => {
              const next = !value;

              if (next) {
                setStructureOpen(false);
              }

              return next;
            }
          );
        }}
      />

      {/* ==================================================
          MOBILE WORKSPACE
          ================================================== */}

      <EditorMobileWorkspace
        slides={slides}
        currentSlide={currentSlide}
        slide={slide}
        totalSlides={slides.length}
        systemName={
          system?.name ||
          initialBrand
        }
        philosophy={system?.philosophy}
        input={initialInput}
        generating={generating}
        recomposing={recomposing}
        constraints={constraints}
        theme={theme}
        templateId={templateId}
        artifactFormat={artifactFormat}
        mobileStructureOpen={
          mobileStructureOpen
        }
        mobileInspectorOpen={
          mobileInspectorOpen
        }
        onInputChange={handleInputChange}
        onTemplateChange={handleTemplateChange}
        onRecompose={handleRecompose}
        onUpdate={updateSlide}
        onEditStart={handleEditStart}
        onEditEnd={handleEditEnd}
        onPrevious={goPrevious}
        onNext={goNext}
        onOpenStructure={() => {
          setMobileInspectorOpen(false);
          setMobileStructureOpen(true);
        }}
        onOpenInspector={() => {
          setMobileStructureOpen(false);
          setMobileInspectorOpen(true);
        }}
        onSelect={selectSlide}
        onAdd={addSection}
        onRename={renameSection}
        onDelete={deleteSection}
        onCloseStructure={() =>
          setMobileStructureOpen(false)
        }
        onCloseInspector={() =>
          setMobileInspectorOpen(false)
        }
      />

      {/* ==================================================
          MOBILE FLOATING ACTIONS
          ================================================== */}

      <div
        className="
          fixed
          bottom-[4.75rem]
          right-5
          z-40
          lg:hidden
        "
      >
        {/* EDITOR TOOLS */}

        <div className="absolute bottom-16 right-0">
          <EditorMobileTools
            canUndo={canUndo}
            onUndo={handleUndo}
            onOpenStructure={() => {
              setMobileInspectorOpen(false);
              setMobileStructureOpen(true);
            }}
            onOpenInspector={() => {
              setMobileStructureOpen(false);
              setMobileInspectorOpen(true);
            }}
          />
        </div>

        {/* CREATE */}

        <button
          type="button"
          onClick={addSection}
          disabled={
            generating ||
            recomposing
          }
          aria-label="Create new section"
          title="Create new section"
          className="
            flex
            h-13
            w-13
            items-center
            justify-center
            rounded-full
            bg-[var(--app-accent)]
            text-xl
            text-[var(--app-active-ink)]
            shadow-[0_10px_30px_rgba(0,0,0,0.18)]
            transition
            hover:scale-105
            active:scale-95
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          +
        </button>
      </div>
    </div>
  );
}