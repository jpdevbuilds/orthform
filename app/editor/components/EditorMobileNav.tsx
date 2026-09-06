"use client";

type EditorMobileNavProps = {
  currentSlide: number;
  totalSlides: number;
  onOpenStructure: () => void;
  onOpenInspector: () => void;
};

export default function EditorMobileNav({
  currentSlide,
  totalSlides,
  onOpenStructure,
  onOpenInspector,
}: EditorMobileNavProps) {
  return (
    <nav
      className="
        fixed
        inset-x-0
        bottom-0
        z-[100]
        lg:hidden
      "
    >
      <div
        className="
          border-t
          border-[var(--editor-border)]
          bg-[var(--editor-surface)]
          px-3
          py-2.5
          shadow-[0_-10px_35px_rgba(0,0,0,0.10)]
          backdrop-blur-xl
        "
      >
        <div className="mx-auto flex max-w-xl items-center justify-between">

          {/* STRUCTURE */}

          <button
            type="button"
            onClick={onOpenStructure}
            aria-label="Open structure"
            className="
              flex
              min-w-[88px]
              items-center
              justify-center
              gap-2
              rounded-xl
              px-3
              py-2.5
              text-xs
              text-[var(--editor-muted)]
              transition
              hover:bg-[var(--editor-hover)]
              hover:text-[var(--editor-ink)]
              active:scale-95
            "
          >
            <span
              className="text-base leading-none"
              aria-hidden="true"
            >
              ☰
            </span>

            <span>
              Structure
            </span>
          </button>

          {/* SLIDE INDICATOR */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-[var(--editor-muted)]
              "
            >
              Slide
            </span>

            <span
              className="
                mt-0.5
                text-xs
                font-medium
                text-[var(--editor-ink)]
              "
            >
              {String(currentSlide + 1).padStart(2, "0")}
              {" / "}
              {String(totalSlides).padStart(2, "0")}
            </span>
          </div>

          {/* INSPECTOR */}

          <button
            type="button"
            onClick={onOpenInspector}
            aria-label="Open inspector"
            className="
              flex
              min-w-[88px]
              items-center
              justify-center
              gap-2
              rounded-xl
              px-3
              py-2.5
              text-xs
              text-[var(--editor-muted)]
              transition
              hover:bg-[var(--editor-hover)]
              hover:text-[var(--editor-ink)]
              active:scale-95
            "
          >
            <span>
              Inspector
            </span>

            <span
              className="text-base leading-none"
              aria-hidden="true"
            >
              ◌
            </span>
          </button>

        </div>
      </div>
    </nav>
  );
}