import type { LucideIcon } from "lucide-react";

/** One full-screen slide of the deck. */
export interface SlideMeta {
  /** Stable id, also used as the DOM id and hash anchor. */
  id: string;
  /** Short label shown in the overview menu and dot tooltips. */
  label: string;
  /** Line the presenter can read out loud to introduce the slide. */
  cue: string;
}

/**
 * A clickable card that reveals one example when you open it.
 *
 * Used twice: for the places people vibe code (slide 2) and for the parts of
 * Claude Code worth knowing (slide 11).
 */
export interface ExplorerCard {
  id: string;
  title: string;
  icon: LucideIcon;
  /** One short beginner-friendly sentence, revealed on click. */
  example: string;
  /** A tiny, readable prompt that matches the example. */
  snippet: string;
}

/** One step in an auto-revealed sequence (slides 3 and 8). */
export interface SequenceStep {
  id: string;
  title: string;
  detail: string;
  /** A short literal shown at the bottom of the step card. */
  sample: string;
}

/** One of the vibe coding tools on the landscape slide (slide 6). */
export interface ToolCard {
  id: string;
  name: string;
  /** Four or five words describing the shape of the tool. */
  tagline: string;
  definition: string;
  /** A prompt you would realistically give this tool. */
  promptExample: string;
  comparison: string;
  bestFor: string;
  accent: "violet" | "coral";
  /** Marks the tool this workshop goes deep on. */
  focus?: boolean;
}

/** A multiple-choice quiz question (slide 13). */
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answerIndex: number;
  /** Shown after answering, whether right or wrong. */
  because: string;
}

/** One concept chip on the summary slide. */
export interface SummaryConcept {
  id: string;
  label: string;
  /** The slide index the chip jumps back to. */
  slideIndex: number;
  recap: string;
}

/** Token kinds produced by the code highlighter. */
export type TokenKind =
  | "plain"
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "operator"
  | "punctuation"
  | "bracket"
  | "identifier";

export interface Token {
  kind: TokenKind;
  value: string;
}

/** Result of running the quiz, shared with the summary slide. */
export interface QuizResult {
  score: number;
  total: number;
}
