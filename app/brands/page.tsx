"use client";

import Link from "next/link";
import { getEditorialSystems } from "@/lib/editorial";

export default function BrandsPage() {
  const systems = getEditorialSystems();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-8 pb-24 text-[var(--app-ink)] sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-subtle)]">
              Editorial systems
            </p>

            <h1 className="mt-3 text-3xl font-medium tracking-tight text-[var(--app-heading)] sm:text-4xl">
              Your systems
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
              Each system gives Orthform a different
              editorial philosophy, audience, voice,
              and way of structuring ideas.
            </p>
          </div>

          <Link
            href="/create"
            className="w-fit shrink-0 rounded-full bg-[var(--app-accent)] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            + Create
          </Link>
        </header>

        {/* ==================================================
            SYSTEM COUNT
        ================================================== */}

        <div className="mt-10 border-y border-[var(--app-border)] py-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--app-subtle)]">
            {systems.length}{" "}
            {systems.length === 1
              ? "editorial system"
              : "editorial systems"}
          </p>
        </div>

        {/* ==================================================
            SYSTEMS
        ================================================== */}

        {systems.length > 0 ? (
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {systems.map((system) => {
              const structures = Object.entries(
                system.structures
              );

              return (
                <article
                  key={system.id}
                  className="group rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 transition hover:-translate-y-1 hover:bg-[var(--app-surface-raised)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] sm:p-7"
                >
                  {/* Top */}

                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-subtle)]">
                        System
                      </p>

                      <h2 className="mt-2 text-xl font-medium tracking-tight text-[var(--app-heading)]">
                        {system.name}
                      </h2>
                    </div>

                    <span className="rounded-full border border-[var(--app-border)] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--app-subtle)]">
                      {system.id}
                    </span>
                  </div>

                  {/* Philosophy */}

                  <div className="mt-8">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-subtle)]">
                      Philosophy
                    </p>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--app-muted)]">
                      {system.philosophy}
                    </p>
                  </div>

                  {/* Audience */}

                  <div className="mt-7">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-subtle)]">
                      Audience
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {system.audience.map(
                        (audience) => (
                          <span
                            key={audience}
                            className="rounded-full bg-[var(--app-surface-raised)] px-3 py-1.5 text-[10px] text-[var(--app-muted)]"
                          >
                            {audience}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Structures */}

                  <div className="mt-7 border-t border-[var(--app-border)] pt-6">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-subtle)]">
                        Structures
                      </p>

                      <span className="text-[10px] text-[var(--app-subtle)]">
                        {structures.length}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {structures.map(
                        ([id, structure]) => (
                          <div
                            key={id}
                            className="flex items-center justify-between rounded-xl bg-[var(--app-surface-raised)] px-3 py-2.5"
                          >
                            <span className="text-xs font-medium text-[var(--app-ink)]">
                              {structure.name}
                            </span>

                            <span className="text-[10px] text-[var(--app-subtle)]">
                              {structure.slides.length}{" "}
                              sections
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Action */}

                  <Link
                    href={`/create?brand=${encodeURIComponent(
                      system.id
                    )}`}
                    className="mt-7 flex items-center justify-between rounded-xl border border-[var(--app-border)] px-4 py-3 text-xs font-medium text-[var(--app-muted)] transition hover:border-[var(--app-accent)] hover:bg-[var(--app-accent)] hover:text-white"
                  >
                    <span>
                      Create with this system
                    </span>

                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </article>
              );
            })}
          </section>
        ) : (
          /* ==================================================
             EMPTY STATE
          ================================================== */

          <section className="mt-10 rounded-3xl border border-dashed border-[var(--app-border-strong)] bg-[var(--app-surface)] px-6 py-16 text-center">
            <p className="text-sm font-medium text-[var(--app-heading)]">
              No editorial systems yet.
            </p>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--app-muted)]">
              Add an editorial system to give
              Orthform a distinct way of thinking
              and shaping content.
            </p>
          </section>
        )}

        {/* ==================================================
            SYSTEM PRINCIPLES
        ================================================== */}

        {systems.length > 0 && (
          <section className="mt-16">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-subtle)]">
                How systems work
              </p>

              <h2 className="mt-2 text-xl font-medium text-[var(--app-heading)]">
                The system is the intelligence.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--app-muted)]">
                Orthform does not simply generate text.
                The selected system determines how an
                idea should be interpreted, structured,
                written, and constrained.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Audience",
                "Philosophy",
                "Voice",
                "Structure",
              ].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5"
                >
                  <span className="text-[10px] font-medium tracking-[0.12em] text-[var(--app-subtle)]">
                    0{index + 1}
                  </span>

                  <p className="mt-5 text-sm font-medium text-[var(--app-heading)]">
                    {item}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[var(--app-muted)]">
                    Defined by the editorial system
                    rather than the generation model.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}