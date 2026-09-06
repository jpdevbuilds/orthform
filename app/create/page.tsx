"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Layers,
  LayoutTemplate,
  List,
  Scale,
} from "lucide-react";

import { BRAND_SYSTEMS } from "@/lib/brands";
import {
  getEditorialSystem,
  getEditorialSystems,
} from "@/lib/editorial";

import type {
  BrandId,
  ContentTypeId,
} from "@/types/content";

import type { TemplateId } from "@/lib/templates/templates";
import type { ArtifactFormat } from "@/lib/editorial/systems/types";

const ARTIFACT_FORMATS: {
  id: ArtifactFormat;
  name: string;
  description: string;
  meta: string;
}[] = [
  {
    id: "single",
    name: "Single Post",
    description:
      "One focused idea, clearly expressed in one visual artifact.",
    meta: "1 artifact",
  },
  {
    id: "carousel",
    name: "Carousel",
    description:
      "A structured idea broken into multiple connected slides.",
    meta: "Multiple slides",
  },
];

const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
  icon: typeof LayoutTemplate;
}[] = [
  {
    id: "authority",
    name: "Authority",
    description:
      "Bold statements, clear arguments and strong editorial hierarchy.",
    icon: Layers,
  },
  {
    id: "spotlight",
    name: "Spotlight",
    description:
      "Human observations, experiences and moments with room to breathe.",
    icon: LayoutTemplate,
  },
  {
    id: "utility",
    name: "Utility",
    description:
      "Practical information organized around useful actions and lessons.",
    icon: List,
  },
  {
    id: "comparison",
    name: "Comparison",
    description:
      "Two sides placed against each other to make a distinction clear.",
    icon: Scale,
  },
];

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ==================================================
     URL CONTEXT
  ================================================== */

  const requestedBrand =
    searchParams.get("brand") as BrandId | null;

  const requestedType =
    searchParams.get("type") as ContentTypeId | null;

  const requestedFormat =
    searchParams.get("format") as ArtifactFormat | null;

  const requestedTemplate =
    searchParams.get("template") as TemplateId | null;

  /* ==================================================
     INITIAL SELECTION
  ================================================== */

  const initialBrand =
    BRAND_SYSTEMS.some(
      (brand) => brand.id === requestedBrand
    )
      ? requestedBrand!
      : "bgl";

  const initialSystem =
    getEditorialSystem(initialBrand);

  const initialType =
    requestedType &&
    initialSystem?.structures[requestedType]
      ? requestedType
      : initialSystem
        ? Object.keys(initialSystem.structures)[0]
        : "educational";

  const initialFormat: ArtifactFormat =
    requestedFormat === "carousel"
      ? "carousel"
      : "single";

  const initialTemplate: TemplateId =
    TEMPLATES.some(
      (template) => template.id === requestedTemplate
    )
      ? requestedTemplate!
      : "authority";

  /* ==================================================
     STATE
  ================================================== */

  const [selectedFormat, setSelectedFormat] =
    useState<ArtifactFormat>(initialFormat);

  const [selectedBrand, setSelectedBrand] =
    useState<BrandId>(initialBrand);

  const [selectedType, setSelectedType] =
    useState<ContentTypeId>(
      initialType as ContentTypeId
    );

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>(initialTemplate);

  const [input, setInput] = useState("");

  /* ==================================================
     ACTIVE SYSTEM
  ================================================== */

  const activeBrand = useMemo(
    () =>
      BRAND_SYSTEMS.find(
        (brand) => brand.id === selectedBrand
      ),
    [selectedBrand]
  );

  const activeSystem = useMemo(
    () =>
      getEditorialSystem(selectedBrand),
    [selectedBrand]
  );

  /* ==================================================
     AVAILABLE STRUCTURES
  ================================================== */

  const availableTypes = useMemo(
    () =>
      activeSystem
        ? Object.entries(
            activeSystem.structures
          )
        : [],
    [activeSystem]
  );

  const activeStructure =
    activeSystem?.structures[selectedType];

  const activeTemplate =
    TEMPLATES.find(
      (template) =>
        template.id === selectedTemplate
    );

  /* ==================================================
     BRAND CHANGE
  ================================================== */

  const handleBrandChange = (
    brandId: BrandId
  ) => {
    setSelectedBrand(brandId);

    const system =
      getEditorialSystem(brandId);

    if (!system) return;

    const structureIds =
      Object.keys(system.structures);

    if (
      !structureIds.includes(
        selectedType
      )
    ) {
      setSelectedType(
        structureIds[0] as ContentTypeId
      );
    }
  };

  /* ==================================================
     TYPE CHANGE
  ================================================== */

  const handleTypeChange = (
    typeId: ContentTypeId
  ) => {
    setSelectedType(typeId);
  };

  /* ==================================================
     GENERATE
  ================================================== */

  const handleGenerate = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!input.trim()) return;

    const params = new URLSearchParams({
      brand: selectedBrand,
      type: selectedType,
      format: selectedFormat,
      template: selectedTemplate,
      input: input.trim(),
    });

    router.push(
      `/editor?${params.toString()}`
    );
  };

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--app-ink)]">
      <div className="mx-auto w-full max-w-4xl px-5 py-6 pb-28 sm:px-8 sm:py-10 lg:px-10">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.back()}
              className="
                mb-8
                flex
                items-center
                gap-2
                text-xs
                text-[var(--app-muted)]
                transition
                hover:text-[var(--app-ink)]
              "
            >
              <span>←</span>
              Back
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-subtle)]">
              New artifact
            </p>

            <h1 className="mt-3 text-3xl font-medium tracking-tight text-[var(--app-heading)] sm:text-4xl">
              Start with an idea.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--app-muted)]">
              Choose what you want to make, give
              Orthform your raw thinking, and let
              your editorial system shape it.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleGenerate}
          className="mt-12 space-y-14"
        >

          {/* ==================================================
              01 — ARTIFACT
          ================================================== */}

          <section>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                01
              </p>

              <h2 className="mt-2 text-xl font-medium tracking-tight text-[var(--app-heading)]">
                What are you making?
              </h2>

              <p className="mt-1 text-xs text-[var(--app-muted)]">
                Your idea can take different forms.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {ARTIFACT_FORMATS.map(
                (format) => {
                  const active =
                    selectedFormat === format.id;

                  return (
                    <button
                      key={format.id}
                      type="button"
                      onClick={() =>
                        setSelectedFormat(
                          format.id
                        )
                      }
                      className={[
                        "group relative overflow-hidden rounded-2xl border p-5 text-left transition",
                        active
                          ? "border-[var(--app-active)] bg-[var(--app-active)] text-[var(--app-active-ink)] shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
                          : "border-[var(--app-border)] bg-[var(--app-surface)] hover:-translate-y-0.5 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-raised)]",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {format.name}
                          </p>

                          <p
                            className={[
                              "mt-2 max-w-sm text-xs leading-5",
                              active
                                ? "opacity-65"
                                : "text-[var(--app-muted)]",
                            ].join(" ")}
                          >
                            {format.description}
                          </p>
                        </div>

                        <span
                          className={[
                            "shrink-0 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.12em]",
                            active
                              ? "border-white/10 opacity-60"
                              : "border-[var(--app-border)] text-[var(--app-subtle)]",
                          ].join(" ")}
                        >
                          {format.meta}
                        </span>
                      </div>

                      <div
                        className={[
                          "mt-7 flex h-8 w-8 items-center justify-center rounded-full border text-xs transition",
                          active
                            ? "border-white/20 bg-white/10"
                            : "border-[var(--app-border)] text-[var(--app-muted)]",
                        ].join(" ")}
                      >
                        {active ? "✓" : "→"}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* ==================================================
              02 — SYSTEM
          ================================================== */}

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                  02
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-tight text-[var(--app-heading)]">
                  Choose your system
                </h2>

                <p className="mt-1 text-xs text-[var(--app-muted)]">
                  This determines the editorial intelligence
                  behind the artifact.
                </p>
              </div>

              {activeBrand && (
                <span className="hidden text-xs text-[var(--app-subtle)] sm:block">
                  {activeBrand.name}
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {getEditorialSystems().map(
                (system) => {
                  const active =
                    selectedBrand === system.id;

                  const brand =
                    BRAND_SYSTEMS.find(
                      (item) =>
                        item.id === system.id
                    );

                  return (
                    <button
                      key={system.id}
                      type="button"
                      onClick={() =>
                        handleBrandChange(
                          system.id as BrandId
                        )
                      }
                      className={[
                        "relative rounded-2xl border p-5 text-left transition",
                        active
                          ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-white shadow-[0_12px_35px_rgba(42,93,158,0.12)]"
                          : "border-[var(--app-border)] bg-[var(--app-surface)] hover:-translate-y-0.5 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-raised)]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium">
                          {system.name}
                        </span>

                        {active && (
                          <span className="text-[10px] uppercase tracking-[0.12em] opacity-50">
                            Active
                          </span>
                        )}
                      </div>

                      <p
                        className={[
                          "mt-2 text-xs leading-5",
                          active
                            ? "text-white/60"
                            : "text-[var(--app-muted)]",
                        ].join(" ")}
                      >
                        {brand?.description ??
                          system.philosophy}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* ==================================================
              03 — STRUCTURE
          ================================================== */}

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                  03
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-tight text-[var(--app-heading)]">
                  Choose the structure
                </h2>

                <p className="mt-1 text-xs text-[var(--app-muted)]">
                  This controls how Orthform organizes
                  the idea.
                </p>
              </div>

              {activeStructure && (
                <span className="hidden text-xs text-[var(--app-subtle)] sm:block">
                  {activeStructure.name}
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {availableTypes.map(
                ([id, structure]) => {
                  const active =
                    selectedType === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        handleTypeChange(
                          id as ContentTypeId
                        )
                      }
                      className={[
                        "rounded-2xl border p-5 text-left transition",
                        active
                          ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-white shadow-[0_12px_35px_rgba(42,93,158,0.12)]"
                          : "border-[var(--app-border)] bg-[var(--app-surface)] hover:-translate-y-0.5 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-raised)]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">
                          {structure.name}
                        </p>

                        {active && (
                          <span className="text-[10px] uppercase tracking-[0.12em] opacity-50">
                            Selected
                          </span>
                        )}
                      </div>

                      <p
                        className={[
                          "mt-2 text-xs leading-5",
                          active
                            ? "text-white/60"
                            : "text-[var(--app-muted)]",
                        ].join(" ")}
                      >
                        {structure.purpose}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* ==================================================
              04 — VISUAL TEMPLATE
          ================================================== */}

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                  04
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-tight text-[var(--app-heading)]">
                  Choose the visual template
                </h2>

                <p className="mt-1 text-xs text-[var(--app-muted)]">
                  This determines how the composed idea is
                  expressed visually.
                </p>
              </div>

              {activeTemplate && (
                <span className="hidden text-xs text-[var(--app-subtle)] sm:block">
                  {activeTemplate.name}
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {TEMPLATES.map((template) => {
                const Icon = template.icon;

                const active =
                  selectedTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() =>
                      setSelectedTemplate(
                        template.id
                      )
                    }
                    className={[
                      "relative rounded-2xl border p-5 text-left transition",
                      active
                        ? "border-[var(--app-accent)] bg-[var(--app-accent)] text-white shadow-[0_12px_35px_rgba(42,93,158,0.12)]"
                        : "border-[var(--app-border)] bg-[var(--app-surface)] hover:-translate-y-0.5 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-raised)]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={[
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                            active
                              ? "border-white/10 bg-white/10"
                              : "border-[var(--app-border)] bg-[var(--app-surface-raised)]",
                          ].join(" ")}
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.7}
                          />
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {template.name}
                          </p>

                          <p
                            className={[
                              "mt-1 text-xs leading-5",
                              active
                                ? "text-white/60"
                                : "text-[var(--app-muted)]",
                            ].join(" ")}
                          >
                            {template.description}
                          </p>
                        </div>
                      </div>

                      <span
                        className={[
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          active
                            ? "border-white/20 bg-white/10"
                            : "border-[var(--app-border)]",
                        ].join(" ")}
                      >
                        {active && (
                          <Check
                            size={11}
                            strokeWidth={2.5}
                          />
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ==================================================
              05 — SOURCE
          ================================================== */}

          <section>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                05
              </p>

              <h2 className="mt-2 text-xl font-medium tracking-tight text-[var(--app-heading)]">
                What are you thinking about?
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--app-muted)]">
                Don't try to write the finished post.
                Give Orthform the thought, observation,
                problem, lesson, story, or rough notes.
              </p>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
              <textarea
                rows={10}
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Write freely. Start with what you know, what you noticed, what happened, or what you want people to understand..."
                className="
                  w-full
                  resize-none
                  bg-transparent
                  p-6
                  text-sm
                  leading-7
                  text-[var(--app-ink)]
                  outline-none
                  placeholder:text-[var(--app-subtle)]
                  sm:p-7
                "
                required
              />

              <div className="flex items-center justify-between border-t border-[var(--app-border)] px-5 py-3 sm:px-7">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--app-subtle)]">
                  Raw thinking is enough
                </p>

                <p className="text-xs text-[var(--app-subtle)]">
                  {input.length}
                </p>
              </div>
            </div>
          </section>

          {/* ==================================================
              READY BAR
          ================================================== */}

          <section className="sticky bottom-4 z-20">
            <div className="flex flex-col gap-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/95 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--app-surface-raised)] px-2.5 py-1 text-[10px] font-medium text-[var(--app-ink)]">
                    {selectedFormat === "single"
                      ? "Single Post"
                      : "Carousel"}
                  </span>

                  <span className="text-xs text-[var(--app-subtle)]">
                    ·
                  </span>

                  <span className="truncate text-xs text-[var(--app-muted)]">
                    {activeSystem?.name}
                  </span>

                  <span className="text-xs text-[var(--app-subtle)]">
                    ·
                  </span>

                  <span className="truncate text-xs text-[var(--app-muted)]">
                    {activeStructure?.name}
                  </span>

                  <span className="text-xs text-[var(--app-subtle)]">
                    ·
                  </span>

                  <span className="truncate text-xs font-medium text-[var(--app-muted)]">
                    {activeTemplate?.name}
                  </span>
                </div>

                <p className="mt-2 hidden text-[11px] text-[var(--app-subtle)] sm:block">
                  Orthform will shape your source and
                  build the first editorial draft.
                </p>
              </div>

              <button
                type="submit"
                disabled={!input.trim()}
                className="
                  group
                  flex
                  w-full
                  shrink-0
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-[var(--app-accent)]
                  px-6
                  py-3.5
                  text-sm
                  font-medium
                  text-white
                  shadow-[0_8px_25px_rgba(42,93,158,0.16)]
                  transition
                  hover:-translate-y-0.5
                  hover:opacity-95
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                  sm:w-auto
                "
              >
                Process idea

                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}