import type { SlideMeta } from "@/types";

/**
 * The running order of the deck. `index` in every hook and control is an
 * index into this array, so adding a slide only means editing this file plus
 * the matching entry in `sections/index.ts`.
 */
export const SLIDES: SlideMeta[] = [
  {
    id: "hero",
    label: "Welcome",
    cue: "Set the tone, then start the lesson.",
  },
  {
    id: "what-is-python",
    label: "What is Python?",
    cue: "Python gives instructions to a computer.",
  },
  {
    id: "how-code-works",
    label: "How code works",
    cue: "Write, read, follow, see the result.",
  },
  {
    id: "print",
    label: "print()",
    cue: "The first line of code everyone writes.",
  },
  {
    id: "variables",
    label: "Variables",
    cue: "Store a value now, use it later.",
  },
  {
    id: "data-types",
    label: "Data types",
    cue: "Four kinds of values to know.",
  },
  {
    id: "string",
    label: "String",
    cue: "Text lives inside quotation marks.",
  },
  {
    id: "list",
    label: "List",
    cue: "Many items in one box, and you can change them.",
  },
  {
    id: "tuple",
    label: "Tuple",
    cue: "Many items in one box, locked shut.",
  },
  {
    id: "list-vs-tuple",
    label: "List vs Tuple",
    cue: "Square brackets change. Parentheses do not.",
  },
  {
    id: "quiz",
    label: "Quick quiz",
    cue: "Four short questions. No pressure.",
  },
  {
    id: "summary",
    label: "Summary",
    cue: "Everything we covered, in one screen.",
  },
];

export const TOTAL_SLIDES = SLIDES.length;

/** Slide indices referenced by name elsewhere in the app. */
export const SLIDE_INDEX = Object.fromEntries(
  SLIDES.map((slide, index) => [slide.id, index]),
) as Record<string, number>;
