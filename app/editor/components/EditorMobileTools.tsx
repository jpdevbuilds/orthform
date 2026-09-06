"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FileText,
  Layers,
  Plus,
  Undo2,
} from "lucide-react";

type EditorMobileToolsProps = {
  onOpenStructure: () => void;
  onOpenInspector: () => void;
  canUndo: boolean;
  onUndo: () => void;
};

export default function EditorMobileTools({
  onOpenStructure,
  onOpenInspector,
  canUndo,
  onUndo,
}: EditorMobileToolsProps) {
  const [open, setOpen] = useState(false);

  const toolsRef =
    useRef<HTMLDivElement>(null);

  // ==================================================
  // CLOSE ON OUTSIDE CLICK / TOUCH
  // ==================================================

  useEffect(() => {
    if (!open) return;

    const handleOutsideInteraction = (
      event: PointerEvent
    ) => {
      const target = event.target;

      if (
        target instanceof Node &&
        toolsRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideInteraction
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideInteraction
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  // ==================================================
  // ACTIONS
  // ==================================================

  const handleUndo = () => {
    if (!canUndo) return;

    setOpen(false);
    onUndo();
  };

  const handleStructure = () => {
    setOpen(false);
    onOpenStructure();
  };

  const handleInspector = () => {
    setOpen(false);
    onOpenInspector();
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div
      ref={toolsRef}
      className="relative"
    >
      {open && (
        <div
          className="
            absolute
            bottom-12
            right-0
            w-40
            rounded-2xl
            border
            border-[var(--editor-border)]
            bg-[var(--editor-surface)]
            p-1.5
            shadow-[0_12px_30px_rgba(0,0,0,0.14)]
          "
        >
          {/* Undo */}

          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            aria-label={
              canUndo
                ? "Undo last change"
                : "Nothing to undo"
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-[var(--editor-ink)]
              transition
              hover:bg-[var(--editor-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <span
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-[var(--editor-hover)]
              "
              aria-hidden="true"
            >
              <Undo2
                size={15}
                strokeWidth={1.8}
              />
            </span>

            <span>
              Undo
            </span>
          </button>

          {/* Structure */}

          <button
            type="button"
            onClick={handleStructure}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-[var(--editor-ink)]
              transition
              hover:bg-[var(--editor-hover)]
            "
          >
            <span
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-[var(--editor-hover)]
              "
              aria-hidden="true"
            >
              <Layers
                size={15}
                strokeWidth={1.8}
              />
            </span>

            <span>
              Structure
            </span>
          </button>

          {/* Inspector */}

          <button
            type="button"
            onClick={handleInspector}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-left
              text-sm
              text-[var(--editor-ink)]
              transition
              hover:bg-[var(--editor-hover)]
            "
          >
            <span
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-[var(--editor-hover)]
              "
              aria-hidden="true"
            >
              <FileText
                size={15}
                strokeWidth={1.8}
              />
            </span>

            <span>
              Inspector
            </span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-label={
          open
            ? "Close editor tools"
            : "Open editor tools"
        }
        aria-expanded={open}
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-[var(--editor-border)]
          bg-[var(--editor-surface)]
          text-[var(--editor-ink)]
          shadow-[0_5px_16px_rgba(0,0,0,0.14)]
          transition
          hover:scale-105
          active:scale-95
        "
      >
        <Plus
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}