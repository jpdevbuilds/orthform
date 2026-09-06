"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteDocument,
  getDocuments,
  type OrthformDocument,
} from "@/lib/documents";

export default function DocumentsPage() {
  const router = useRouter();

  const [documents, setDocuments] =
    useState<OrthformDocument[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  useEffect(() => {
    setDocuments(getDocuments());
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Delete this document?"
    );

    if (!confirmed) return;

    deleteDocument(id);

    setDocuments((current) =>
      current.filter(
        (document) => document.id !== id
      )
    );
  };

  const openDocument = (
    document: OrthformDocument
  ) => {
    const params = new URLSearchParams({
      documentId: document.id,
    });

    router.push(
      `/editor?${params.toString()}`
    );
  };

  return (
    <main className="min-h-screen bg-[#F1EFE7] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <header className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Orthform / Workspace
            </p>

            <h1 className="mt-2 text-3xl font-medium tracking-tight">
              Documents
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-black/50">
              Your saved editorial artifacts.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/create")
            }
            className="rounded-full bg-[#2A5D9E] px-5 py-3 text-xs text-white transition hover:opacity-90"
          >
            + New document
          </button>
        </header>

        {/* Content */}

        <section className="mt-10">

          {!loaded ? (
            <div className="py-20 text-center text-sm text-black/40">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white/40 px-6 py-20 text-center">
              <p className="text-sm font-medium">
                No documents yet
              </p>

              <p className="mt-2 text-sm text-black/40">
                Generate your first editorial artifact
                to see it here.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/create")
                }
                className="mt-6 rounded-full border border-black/10 bg-white px-5 py-3 text-xs transition hover:border-black/30"
              >
                Create your first document
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <article
                  key={document.id}
                  className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-sm"
                >
                  {/* Document identity */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-black/35">
                        {document.brandId}
                      </p>

                      <h2 className="mt-2 truncate text-base font-medium">
                        {document.title}
                      </h2>
                    </div>

                    <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-black/40">
                      {document.status}
                    </span>
                  </div>

                  {/* Metadata */}

                  <div className="mt-6 space-y-2 text-xs text-black/40">
                    <div className="flex justify-between">
                      <span>Type</span>
                      <span className="text-black/60">
                        {document.contentType}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Slides</span>
                      <span className="text-black/60">
                        {document.slides.length}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Updated</span>
                      <span className="text-black/60">
                        {new Date(
                          document.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="mt-6 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openDocument(document)
                      }
                      className="flex-1 rounded-full bg-black px-4 py-2.5 text-xs text-white transition hover:opacity-80"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(document.id)
                      }
                      className="rounded-full border border-black/10 px-4 py-2.5 text-xs text-black/50 transition hover:border-red-200 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>
      </div>
    </main>
  );
}