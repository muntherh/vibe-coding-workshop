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

/** A real-world area where Python is used (slide 2). */
export interface UseCase {
  id: string;
  title: string;
  icon: LucideIcon;
  /** One short beginner-friendly sentence, revealed on click. */
  example: string;
  /** A tiny, readable snippet that matches the example. */
  snippet: string;
}

/** One of the four core data types (slide 6). */
export interface DataTypeCard {
  id: string;
  name: string;
  sample: string;
  definition: string;
  code: string;
  comparison: string;
  /** What `type(value)` prints in Python. */
  pythonType: string;
  accent: "blue" | "yellow";
}

/** A multiple-choice quiz question (slide 11). */
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

/** Token kinds produced by the Python highlighter. */
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
