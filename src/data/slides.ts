import type { SlideMeta } from "@/types";

/**
 * The running order of the deck. `index` in every hook and control is an
 * index into this array, so adding a slide only means editing this file plus
 * the matching entry in `sections/index.ts`.
 *
 * Slides 08–11 are the spine of the workshop: Claude Code gets four
 * consecutive slides of its own, and stays the reference point on 12–14.
 */
export const SLIDES: SlideMeta[] = [
  {
    id: "hero",
    label: "Welcome",
    cue: "Set the tone, then start the workshop.",
  },
  {
    id: "what-is-vibe-coding",
    label: "What is vibe coding?",
    cue: "You describe it. The AI writes the code.",
  },
  {
    id: "how-it-works",
    label: "How it works",
    cue: "Describe, generate, run, refine.",
  },
  {
    id: "the-prompt",
    label: "The prompt",
    cue: "The prompt is the new first line of code.",
  },
  {
    id: "write-a-prompt",
    label: "Your first prompt",
    cue: "Change the boxes and watch the prompt rewrite itself.",
  },
  {
    id: "the-tools",
    label: "The tools",
    cue: "Four tools people use. We go deep on two.",
  },
  {
    id: "replit",
    label: "Replit",
    cue: "Build, run and share in one browser tab.",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    cue: "An AI teammate in your terminal.",
  },
  {
    id: "claude-code-plan",
    label: "Working in steps",
    cue: "It plans first. You can change the plan.",
  },
  {
    id: "claude-code-context",
    label: "CLAUDE.md",
    cue: "Write the rules once; they hold every time.",
  },
  {
    id: "claude-code-toolbelt",
    label: "The toolbelt",
    cue: "What turns it from a chatbot into a teammate.",
  },
  {
    id: "replit-vs-claude-code",
    label: "Replit vs Claude Code",
    cue: "One starts from nothing. One changes something real.",
  },
  {
    id: "quiz",
    label: "Quick quiz",
    cue: "Five short questions. No pressure.",
  },
  {
    id: "summary",
    label: "Summary",
    cue: "Everything we covered, and what to do next.",
  },
];

export const TOTAL_SLIDES = SLIDES.length;

/** Slide indices referenced by name elsewhere in the app. */
export const SLIDE_INDEX = Object.fromEntries(
  SLIDES.map((slide, index) => [slide.id, index]),
) as Record<string, number>;
