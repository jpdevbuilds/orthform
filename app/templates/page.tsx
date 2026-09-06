"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Layers,
  LayoutTemplate,
  List,
  Scale,
} from "lucide-react";

import type { TemplateId } from "@/lib/templates/templates";

const TEMPLATES: {
  id: TemplateId;
  name: string;
  label: string;
  description: string;
  bestFor: string;
  icon: typeof LayoutTemplate;
}[] = [
  {
    id: "authority",
    name: "Authority",
    label: "Expertise-led",
    description:
      "Bold statements, clear arguments and strong editorial hierarchy.",
    bestFor: "Principles, insights, opinions and expertise.",
    icon: Layers,
  },
  {
    id: "spotlight",
    name: "Spotlight",
    label: "Story-driven",
    description:
      "Human observations, experiences and moments with room to breathe.",
    bestFor: "Stories, observations and personal realizations.",
    icon: LayoutTemplate,
  },
  {
    id: "utility",
    name: "Utility",
    label: "Action-oriented",
    description:
      "Practical information organized around useful actions and lessons.",
    bestFor: "Tips, checklists, steps and practical guidance.",
    icon: List,
  },
  {
    id: "comparison",
    name: "Comparison",
    label: "Contrast-driven",
    description:
      "Two sides placed against each other to make a distinction clear.",
    bestFor: "Before/after, old/new and problem/solution contrasts.",
    icon: Scale,
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-8 pb-24 text-[var(--app-ink)] sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
            ================================================== */}

        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-subtle)]">
            Template library
          </p>

          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[var(--app-heading)] sm:text-4xl">
            Choose how the idea should read.
          </h1>

          <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
            Visual templates give your composed idea a
            distinct editorial form. The template changes
            how the idea is expressed, not what the idea
            means.
          </p>
        </header>

        {/* ==================================================
            TEMPLATES
            ================================================== */}

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                Available templates
              </p>

              <h2 className="mt-2 text-xl font-medium text-[var(--app-heading)]">
                Visual compositions
              </h2>
            </div>

            <span className="text-xs text-[var(--app-subtle)]">
              {TEMPLATES.length} templates
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((template) => {
              const Icon = template.icon;

              return (
                <Link
                  key={template.id}
                  href={`/create?template=${encodeURIComponent(
                    template.id
                  )}`}
                  className="
                    group
                    rounded-2xl
                    border
                    border-[var(--app-border)]
                    bg-[var(--app-surface)]
                    p-6
                    transition
                    hover:-translate-y-1
                    hover:border-[var(--app-border-strong)]
                    hover:bg-[var(--app-surface-raised)]
                    hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]
                  "
                >
                  {/* Top */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-[var(--app-border)]
                          bg-[var(--app-surface-raised)]
                          text-[var(--app-muted)]
                          transition
                          group-hover:border-[var(--app-accent)]
                          group-hover:text-[var(--app-accent)]
                        "
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.7}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--app-subtle)]">
                          {template.label}
                        </p>

                        <h3 className="mt-1 text-lg font-medium tracking-tight text-[var(--app-heading)]">
                          {template.name}
                        </h3>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.7}
                      className="
                        shrink-0
                        text-[var(--app-subtle)]
                        transition-transform
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </div>

                  {/* Description */}

                  <p className="mt-5 text-sm leading-6 text-[var(--app-muted)]">
                    {template.description}
                  </p>

                  {/* Best for */}

                  <div className="mt-6 border-t border-[var(--app-border)] pt-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--app-subtle)]">
                      Best for
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[var(--app-muted)]">
                      {template.bestFor}
                    </p>
                  </div>

                  {/* Action */}

                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[var(--app-accent)]">
                    Use this template
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            HOW ORTHFORM WORKS
            ================================================== */}

        <section className="mt-16">
          <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-active)] p-7 text-[var(--app-active-ink)] sm:p-9">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] opacity-50">
                How Orthform works
              </p>

              <h2 className="mt-3 text-2xl font-medium tracking-tight">
                Shape → Compose → Visualize
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-60">
                Orthform separates the thinking from the
                presentation. Your idea remains the source.
                Orthform helps shape it, compose it and then
                express it through a visual template.
              </p>

              {/* Pipeline */}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <ProcessStep
                  number="01"
                  title="Shape"
                  description="Turn raw thinking into a clear editorial source."
                />

                <ProcessStep
                  number="02"
                  title="Compose"
                  description="Apply an editorial structure to the idea."
                />

                <ProcessStep
                  number="03"
                  title="Visualize"
                  description="Express the composed idea through a visual template."
                />
              </div>

              {/* Principle */}

              <div className="mt-7 rounded-2xl border border-current/10 bg-current/5 p-5">
                <div className="flex items-start gap-3">
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 opacity-70"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      The template does not own the idea.
                    </p>

                    <p className="mt-1 text-xs leading-5 opacity-50">
                      The same underlying idea can become a
                      different artifact when expressed through
                      a different editorial composition.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/create"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[var(--app-active-ink)]
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-[var(--app-active)]
                  transition
                  hover:scale-[1.02]
                "
              >
                Create an artifact
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Process Step
// --------------------------------------------------

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-current/10 bg-current/5 p-5">
      <p className="text-xs font-medium opacity-50">
        {number}
      </p>

      <p className="mt-4 text-sm font-medium">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 opacity-45">
        {description}
      </p>
    </div>
  );
}