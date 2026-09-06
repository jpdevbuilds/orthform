"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createDocument,
  deleteDocument,
  getDocuments,
  saveDocument,
  updateDocument,
  type OrthformDocument,
} from "@/lib/documents";

export default function ArchivePage() {
  const router = useRouter();

  const [documents, setDocuments] = useState<
    OrthformDocument[]
  >([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "generated" | "draft"
  >("all");

  // ==================================================
  // LOAD DOCUMENTS
  // ==================================================

  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  // ==================================================
  // FILTER
  // ==================================================

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesFilter =
        filter === "all" ||
        document.status === filter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        document.title
          .toLowerCase()
          .includes(query) ||
        document.brandId
          .toLowerCase()
          .includes(query) ||
        document.contentType
          .toLowerCase()
          .includes(query)
      );
    });
  }, [documents, search, filter]);

  // ==================================================
  // OPEN DOCUMENT
  // ==================================================

  const openDocument = (
    document: OrthformDocument
  ) => {
    const params = new URLSearchParams({
      brand: document.brandId,
      type: document.contentType,
      input: document.sourceInput,
      documentId: document.id,
      format: document.format,
      template: document.templateId,
    });

    router.push(
      `/editor?${params.toString()}`
    );
  };

  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Delete this artifact?"
    );

    if (!confirmed) {
      return;
    }

    try {
      deleteDocument(id);

      setDocuments((current) =>
        current.filter(
          (document) => document.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Orthform delete error:",
        error
      );
    }
  };

  // ==================================================
  // RENAME
  // ==================================================

  const handleRename = (
    document: OrthformDocument
  ) => {
    const currentTitle =
      document.title || "Untitled artifact";

    const nextTitle = window.prompt(
      "Rename artifact",
      currentTitle
    );

    if (nextTitle === null) {
      return;
    }

    const title = nextTitle.trim();

    if (!title) {
      return;
    }

    if (title === currentTitle) {
      return;
    }

    const updatedDocument =
      updateDocument(
        document.id,
        { title }
      );

    if (!updatedDocument) {
      return;
    }

    setDocuments((current) =>
      current.map((item) =>
        item.id === updatedDocument.id
          ? updatedDocument
          : item
      )
    );
  };

  // ==================================================
  // DUPLICATE
  // ==================================================

  const handleDuplicate = (
    document: OrthformDocument
  ) => {
    const duplicate =
      createDocument({
        brandId: document.brandId,
        templateId: document.templateId,
        contentType: document.contentType,
        format: document.format,
        sourceInput: document.sourceInput,
        title: `${
          document.title ||
          "Untitled artifact"
        } — Copy`,
        slides: document.slides.map(
          (slide) => ({
            ...slide,
            id: crypto.randomUUID(),
          })
        ),
        status: document.status,
      });

    const savedDocument =
      saveDocument(duplicate);

    setDocuments((current) => [
      savedDocument,
      ...current,
    ]);
  };

  // ==================================================
  // DATE
  // ==================================================

  const formatDate = (
    value: string
  ) => {
    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Unknown date";
    }

    return new Intl.DateTimeFormat(
      "en",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(date);
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-5 py-8 text-[var(--app-ink)] sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-subtle)]">
              Orthform
            </p>

            <h1 className="mt-3 text-3xl font-medium tracking-tight text-[var(--app-heading)] sm:text-4xl">
              Archive
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--app-muted)]">
              Your generated editorial artifacts,
              saved in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/create")
            }
            className="w-fit rounded-full bg-[var(--app-accent)] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_25px_rgba(42,93,158,0.16)] transition hover:-translate-y-0.5 hover:opacity-95"
          >
            + New artifact
          </button>
        </header>

        {/* ==================================================
            CONTROLS
        ================================================== */}

        <section className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* SEARCH */}

          <div className="relative max-w-md flex-1">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search artifacts..."
              className="w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-input)] px-5 py-3 text-sm text-[var(--app-ink)] outline-none transition placeholder:text-[var(--app-subtle)] focus:border-[var(--app-accent)]"
            />
          </div>

          {/* FILTER */}

          <div className="flex rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] p-1">
            {(
              [
                "all",
                "generated",
                "draft",
              ] as const
            ).map((value) => {
              const active =
                filter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFilter(value)
                  }
                  className={`rounded-full px-4 py-2 text-xs font-medium capitalize transition ${
                    active
                      ? "bg-[var(--app-active)] text-[var(--app-active-ink)]"
                      : "text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-ink)]"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            COUNT
        ================================================== */}

        <div className="mt-8 flex items-center justify-between border-b border-[var(--app-border)] pb-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--app-subtle)]">
            {filteredDocuments.length}{" "}
            {filteredDocuments.length ===
            1
              ? "artifact"
              : "artifacts"}
          </p>
        </div>

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {filteredDocuments.length ===
          0 && (
            <section className="mt-12 rounded-3xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] px-6 py-20 text-center">
              <p className="text-sm font-medium text-[var(--app-heading)]">
                {documents.length ===
                0
                  ? "Your archive is empty."
                  : "No artifacts found."}
              </p>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--app-muted)]">
                {documents.length ===
                0
                  ? "Generate and save your first editorial artifact and it will appear here."
                  : "Try a different search term or filter."}
              </p>

              {documents.length ===
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/create"
                    )
                  }
                  className="mt-6 rounded-full bg-[var(--app-accent)] px-5 py-2.5 text-xs font-medium text-white"
                >
                  Create first artifact
                </button>
              )}
            </section>
          )}

        {/* ==================================================
            ARTIFACT GRID
        ================================================== */}

        {filteredDocuments.length >
          0 && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map(
              (document) => (
                <article
                  key={document.id}
                  className="group flex min-h-[240px] flex-col rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-raised)] hover:shadow-md"
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-[var(--app-accent-soft)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--app-accent)]">
                      {
                        document.contentType
                      }
                    </span>

                    <span
                      className={`text-[10px] uppercase tracking-[0.12em] ${
                        document.status ===
                        "generated"
                          ? "text-[var(--app-success)]"
                          : "text-[var(--app-subtle)]"
                      }`}
                    >
                      {
                        document.status
                      }
                    </span>
                  </div>

                  {/* CONTENT */}

                  <div className="mt-6 flex-1">
                    <h2 className="line-clamp-2 text-lg font-medium tracking-tight text-[var(--app-heading)]">
                      {document.title ||
                        "Untitled artifact"}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-[var(--app-muted)]">
                      {
                        document.sourceInput
                      }
                    </p>
                  </div>

                  {/* META + ACTIONS */}

                  <div className="mt-6 flex flex-col gap-4 border-t border-[var(--app-border)] pt-4">

                    {/* META */}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--app-subtle)]">
                          {
                            document.brandId
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-[var(--app-subtle)]">
                          {formatDate(
                            document.updatedAt
                          )}
                        </p>
                      </div>

                      {/* PRIMARY ACTION */}

                      <button
                        type="button"
                        onClick={() =>
                          openDocument(
                            document
                          )
                        }
                        className="rounded-full bg-[var(--app-accent)] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
                      >
                        Open
                      </button>
                    </div>

                    {/* SECONDARY ACTIONS */}

                    <div className="flex items-center justify-end gap-1 border-t border-[var(--app-border)] pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleRename(
                            document
                          )
                        }
                        className="rounded-full px-3 py-2 text-[11px] text-[var(--app-muted)] transition hover:bg-[var(--app-hover)] hover:text-[var(--app-ink)]"
                      >
                        Rename
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDuplicate(
                            document
                          )
                        }
                        className="rounded-full px-3 py-2 text-[11px] text-[var(--app-muted)] transition hover:bg-[var(--app-hover)] hover:text-[var(--app-ink)]"
                      >
                        Duplicate
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            document.id
                          )
                        }
                        className="rounded-full px-3 py-2 text-[11px] text-[var(--app-muted)] transition hover:bg-[var(--app-hover)] hover:text-[var(--app-error)]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </section>
        )}
      </div>
    </main>
  );
}