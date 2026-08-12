import { useCallback, useEffect, useRef, useState } from "react";
import { TOTAL_SLIDES } from "@/data/slides";

/** Elements that own the keyboard while focused. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

/** Space and Enter belong to the focused control, not to the deck. */
function isActivatableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("button, a[href], [role='button'], summary, label"),
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export interface DeckNavigation {
  index: number;
  total: number;
  goTo: (index: number, options?: { instant?: boolean }) => void;
  next: () => void;
  previous: () => void;
  restart: () => void;
  registerSlide: (index: number) => (node: HTMLElement | null) => void;
  /** Bumped on restart so slides can reset their local state. */
  runId: number;
}

/**
 * Owns deck position.
 *
 * The deck is a plain vertical scroller with CSS scroll-snap, which buys us
 * mouse wheel, trackpad and touch navigation for free (and keeps the hero
 * word animation genuinely scroll-linked). Buttons, dots and the keyboard all
 * funnel through `goTo`, so every input method stays in sync.
 */
export function useDeckNavigation(): DeckNavigation {
  const [index, setIndex] = useState(0);
  const [runId, setRunId] = useState(0);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const indexRef = useRef(0);

  indexRef.current = index;

  const registerSlide = useCallback(
    (slideIndex: number) => (node: HTMLElement | null) => {
      slideRefs.current[slideIndex] = node;
    },
    [],
  );

  const goTo = useCallback(
    (target: number, options?: { instant?: boolean }) => {
      const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, target));
      const node = slideRefs.current[clamped];
      if (!node) return;

      // Long jumps are snapped instantly: smooth-scrolling across ten
      // viewports looks slow and fights scroll-snap on the way.
      const distance = Math.abs(clamped - indexRef.current);
      const instant =
        options?.instant ?? (distance > 2 || prefersReducedMotion());

      setIndex(clamped);
      // "instant" is required rather than "auto": the deck sets
      // `scroll-behavior: smooth` in CSS, and "auto" defers to it.
      window.scrollTo({
        top: node.offsetTop,
        behavior: instant ? "instant" : "smooth",
      });
    },
    [],
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const previous = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  const restart = useCallback(() => {
    setRunId((value) => value + 1);
    setIndex(0);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Track the slide crossing the middle of the viewport. This keeps the
  // counter, progress bar and dots correct for wheel and touch scrolling too.
  useEffect(() => {
    const nodes = slideRefs.current.filter(
      (node): node is HTMLElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const found = slideRefs.current.indexOf(entry.target as HTMLElement);
          if (found >= 0) setIndex(found);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [runId]);

  return {
    index,
    total: TOTAL_SLIDES,
    goTo,
    next,
    previous,
    restart,
    registerSlide,
    runId,
  };
}

export interface KeyboardOptions {
  next: () => void;
  previous: () => void;
  goTo: (index: number, options?: { instant?: boolean }) => void;
  toggleOverview: () => void;
  closeOverview: () => void;
  toggleFullscreen: () => void;
  overviewOpen: boolean;
}

/** Presenter keyboard shortcuts, disabled while the user is typing. */
export function useDeckKeyboard({
  next,
  previous,
  goTo,
  toggleOverview,
  closeOverview,
  toggleFullscreen,
  overviewOpen,
}: KeyboardOptions): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // Never hijack typing in the learner inputs.
      if (isTypingTarget(event.target)) {
        if (event.key === "Escape" && event.target instanceof HTMLElement) {
          event.target.blur();
        }
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          previous();
          break;
        case " ":
        case "Spacebar":
          // Space still activates a focused button.
          if (isActivatableTarget(event.target)) return;
          event.preventDefault();
          next();
          break;
        case "Home":
          event.preventDefault();
          goTo(0, { instant: true });
          break;
        case "End":
          event.preventDefault();
          goTo(Number.MAX_SAFE_INTEGER, { instant: true });
          break;
        case "Escape":
          if (overviewOpen) {
            event.preventDefault();
            closeOverview();
          }
          break;
        case "o":
        case "O":
          event.preventDefault();
          toggleOverview();
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    next,
    previous,
    goTo,
    toggleOverview,
    closeOverview,
    toggleFullscreen,
    overviewOpen,
  ]);
}
