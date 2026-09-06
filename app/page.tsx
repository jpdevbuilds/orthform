"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getDocuments,
  OrthformDocument,
} from "@/lib/documents";

import { BRAND_SYSTEMS } from "@/lib/brands";
import { CONTENT_TYPES } from "@/lib/content-types";

const systems = [
  {
    id: "bgl",
    name: "BGL",
    description: "Business Growth Lab",
  },
  {
    id: "jpdev",
    name: "JPDEV.STUDIO",
    description: "Product & technology",
  },
  {
    id: "northstar",
    name: "Northstar",
    description: "Self-development & wealth",
  },
  {
    id: "reelwithjp",
    name: "ReelWithJP",
    description: "Short-form content",
  },
];

export default function Dashboard() {
  const [documents, setDocuments] = useState<
    OrthformDocument[]
  >([]);

  const [greeting, setGreeting] = useState(
    "Good morning"
  );

  useEffect(() => {
    setDocuments(getDocuments());

    setGreeting(getGreeting());

    // Keep the greeting responsive if the page
    // remains open while the time changes.
    const interval = window.setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const recentWork = documents.slice(0, 6);

  return (
    <main
      className="
        min-h-screen
        bg-[var(--editor-bg)]
        text-[var(--editor-ink)]
        transition-colors
        duration-300
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1440px]
          px-5
          py-6
          pb-24
          sm:px-8
          lg:px-12
          lg:py-10
          xl:px-16
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <header
          className="
            flex
            items-start
            justify-between
            gap-6
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[var(--editor-muted)]
              "
            >
              Workspace
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-medium
                tracking-tight
                text-[var(--editor-heading)]
                sm:text-4xl
              "
            >
              {greeting}, JP.
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-[var(--editor-muted)]
              "
            >
              Build, refine, and organize your
              editorial systems from one workspace.
            </p>
          </div>

          <Link
            href="/create"
            className="
              shrink-0
              rounded-full
              bg-[var(--editor-accent)]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:-translate-y-0.5
              hover:opacity-90
            "
          >
            + Create
          </Link>
        </header>

        {/* ==================================================
            RECENT WORK
        ================================================== */}

        <section className="mt-12">
          <div
            className="
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[var(--editor-muted)]
                "
              >
                Continue working
              </p>

              <h2
                className="
                  mt-2
                  text-xl
                  font-medium
                  tracking-tight
                  text-[var(--editor-heading)]
                "
              >
                Your recent work
              </h2>
            </div>

            <Link
              href="/archive"
              className="
                shrink-0
                text-sm
                text-[var(--editor-muted)]
                transition
                hover:text-[var(--editor-ink)]
              "
            >
              View archive →
            </Link>
          </div>

          {recentWork.length > 0 ? (
            <div
              className="
                mt-5
                grid
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {recentWork.map((document) => (
                <Link
                  key={document.id}
                  href={`/editor?documentId=${encodeURIComponent(
                    document.id
                  )}`}
                  className="
                    group
                    rounded-2xl
                    border
                    border-[var(--editor-border)]
                    bg-[var(--editor-surface)]
                    p-5
                    transition
                    hover:-translate-y-1
                    hover:border-[var(--editor-accent)]/30
                    hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  "
                >
                  {/* Meta */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.15em]
                        text-[var(--editor-muted)]
                      "
                    >
                      {getBrandName(
                        document.brandId
                      )}
                    </span>

                    <span
                      className="
                        rounded-full
                        border
                        border-[var(--editor-border)]
                        px-2.5
                        py-1
                        text-[10px]
                        text-[var(--editor-muted)]
                      "
                    >
                      {document.status === "generated"
                        ? "Generated"
                        : "Draft"}
                    </span>
                  </div>

                  {/* Title */}

                  <h3
                    className="
                      mt-8
                      line-clamp-2
                      text-lg
                      font-medium
                      leading-snug
                      tracking-tight
                      text-[var(--editor-heading)]
                    "
                  >
                    {document.title ||
                      "Untitled artifact"}
                  </h3>

                  {/* Type */}

                  <p
                    className="
                      mt-3
                      text-sm
                      text-[var(--editor-muted)]
                    "
                  >
                    {getContentTypeName(
                      document.contentType
                    )}
                  </p>

                  {/* Timestamp */}

                  <p
                    className="
                      mt-2
                      text-[11px]
                      text-[var(--editor-muted)]
                      opacity-70
                    "
                  >
                    {formatDate(
                      document.updatedAt
                    )}
                  </p>

                  {/* Action */}

                  <div
                    className="
                      mt-7
                      flex
                      items-center
                      justify-between
                      text-sm
                      text-[var(--editor-muted)]
                      transition
                      group-hover:text-[var(--editor-ink)]
                    "
                  >
                    <span>
                      Open workspace
                    </span>

                    <span
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state */

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-dashed
                border-[var(--editor-border)]
                bg-[var(--editor-surface)]
                p-10
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-[var(--editor-heading)]
                "
              >
                No editorial artifacts yet.
              </p>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-sm
                  text-xs
                  leading-5
                  text-[var(--editor-muted)]
                "
              >
                Start with an idea and let Orthform
                shape it into your first artifact.
              </p>

              <Link
                href="/create"
                className="
                  mt-5
                  inline-flex
                  rounded-full
                  bg-[var(--editor-accent)]
                  px-5
                  py-3
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Create your first artifact →
              </Link>
            </div>
          )}
        </section>

        {/* ==================================================
            SYSTEMS
        ================================================== */}

        <section className="mt-16">
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[var(--editor-muted)]
              "
            >
              Your systems
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-medium
                tracking-tight
                text-[var(--editor-heading)]
              "
            >
              Editorial systems
            </h2>
          </div>

          <div
            className="
              mt-5
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            {systems.map((system) => (
              <Link
                key={system.id}
                href={`/create?brand=${system.id}`}
                className="
                  group
                  rounded-2xl
                  border
                  border-[var(--editor-border)]
                  bg-[var(--editor-surface)]
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:bg-[var(--editor-accent)]
                  hover:text-white
                  hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p className="text-sm font-medium">
                    {system.name}
                  </p>

                  <span
                    className="
                      text-xs
                      opacity-30
                      transition
                      group-hover:opacity-70
                    "
                  >
                    ↗
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    text-[var(--editor-muted)]
                    group-hover:text-white/60
                  "
                >
                  {system.description}
                </p>

                <p
                  className="
                    mt-8
                    text-xs
                    text-[var(--editor-muted)]
                    group-hover:text-white/60
                  "
                >
                  Create with system →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ==================================================
            QUICK ACTION
        ================================================== */}

        <section className="mt-16">
          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-[var(--editor-border)]
              bg-[var(--color-primary-700)]
              p-6
              text-white
              sm:p-8
            "
          >
            <div className="max-w-xl">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white/40
                "
              >
                Start something new
              </p>

              <h2
                className="
                  mt-3
                  text-2xl
                  font-medium
                  tracking-tight
                "
              >
                Turn an idea into an editorial
                artifact.
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-white/55
                "
              >
                Choose a system, provide the source
                idea, and let Orthform build the
                structure for you.
              </p>

              <Link
                href="/create"
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-[var(--color-primary-700)]
                  transition
                  hover:scale-[1.02]
                "
              >
                Create new artifact →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==================================================
   HELPERS
================================================== */

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getBrandName(
  brandId: string
): string {
  const brand = BRAND_SYSTEMS.find(
    (item) => item.id === brandId
  );

  return brand?.name || brandId;
}

function getContentTypeName(
  contentTypeId: string
): string {
  const type = CONTENT_TYPES.find(
    (item) => item.id === contentTypeId
  );

  return type?.name || contentTypeId;
}

function formatDate(
  value: string
): string {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}