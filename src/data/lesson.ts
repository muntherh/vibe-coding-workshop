import {
  AppWindow,
  BarChart3,
  GitBranch,
  Globe,
  GraduationCap,
  ListChecks,
  Repeat,
  SquareTerminal,
  Users,
  Wand2,
} from "lucide-react";
import { SLIDE_INDEX } from "@/data/slides";
import type {
  ExplorerCard,
  QuizQuestion,
  SequenceStep,
  SummaryConcept,
  ToolCard,
} from "@/types";

/* -------------------------------------------------------------------------
   Slide 2 — What is vibe coding?
   ------------------------------------------------------------------------- */
export const USE_CASES: ExplorerCard[] = [
  {
    id: "websites",
    title: "Websites",
    icon: Globe,
    example:
      "Describe a page, and get a real one you can open in the browser.",
    snippet: "Build a one-page site for a coffee\nshop in Muscat, with the menu.",
  },
  {
    id: "apps",
    title: "Apps",
    icon: AppWindow,
    example: "Describe an app, and get screens and buttons that actually work.",
    snippet: "Make a to-do app where I can add,\ntick off and delete a task.",
  },
  {
    id: "automation",
    title: "Automation",
    icon: Repeat,
    example: "Describe a boring job, and get something that does it for you.",
    snippet: "Rename every file in this folder\nto include today's date.",
  },
  {
    id: "data",
    title: "Data",
    icon: BarChart3,
    example: "Point at a messy file and describe the answer you want from it.",
    snippet: "Read sales.csv and tell me which\nmonth sold the most.",
  },
  {
    id: "learning",
    title: "Learning",
    icon: GraduationCap,
    example:
      "Ask why, not just what — the AI explains the code it just wrote you.",
    snippet: "Explain what line 12 does,\nlike I am completely new to this.",
  },
];

/* -------------------------------------------------------------------------
   Slide 3 — How vibe coding works
   ------------------------------------------------------------------------- */
export const HOW_IT_WORKS_STEPS: SequenceStep[] = [
  {
    id: "describe",
    title: "You describe it.",
    detail: "You write what you want in plain language.",
    sample: "a to-do app",
  },
  {
    id: "generate",
    title: "The AI writes the code.",
    detail: "It turns your sentence into real, working files.",
    sample: "writing app.js…",
  },
  {
    id: "run",
    title: "You run it.",
    detail: "You open the thing and actually try it.",
    sample: "npm run dev",
  },
  {
    id: "refine",
    title: "You refine it.",
    detail: "You say what to change, and it changes.",
    sample: "make the button blue",
  },
];

/* -------------------------------------------------------------------------
   Slide 4 — the anatomy of a prompt
   ------------------------------------------------------------------------- */
export const PROMPT_PARTS = [
  {
    id: "what",
    token: "Build a…",
    title: "What to build",
    meaning: "Name the thing. An app, a page, a script.",
  },
  {
    id: "who",
    token: "for…",
    title: "Who it is for",
    meaning: "Who uses it changes almost every decision.",
  },
  {
    id: "must",
    token: "It must…",
    title: "What it must do",
    meaning: "List the features plainly, one idea per line.",
  },
  {
    id: "feel",
    token: "Keep it…",
    title: "How it should feel",
    meaning: "Tone, colours, simple or detailed.",
  },
] as const;

export type PromptPartId = (typeof PROMPT_PARTS)[number]["id"];

/** The four lines of the example prompt, in order, matched to PROMPT_PARTS. */
export const PROMPT_LINES: Array<{ id: PromptPartId; text: string }> = [
  { id: "what", text: "Build a to-do web app" },
  { id: "who", text: "for a student who forgets things." },
  { id: "must", text: "It must let me add, tick off and delete a task." },
  { id: "feel", text: "Keep it clean, calm and easy to read." },
];

/* -------------------------------------------------------------------------
   Slide 6 — the tool landscape
   ------------------------------------------------------------------------- */
export const TOOLS: ToolCard[] = [
  {
    id: "lovable",
    name: "Lovable",
    tagline: "Describe → website",
    definition: "Builds a whole web app from a chat, in your browser.",
    promptExample:
      "Build a landing page for my bakery\nwith a menu and a contact form.",
    comparison: "Like briefing a designer who ships the same day.",
    bestFor: "Best for: a good-looking web app, fast.",
    accent: "violet",
  },
  {
    id: "replit",
    name: "Replit",
    tagline: "Describe → running app",
    definition: "Writes, runs and hosts the app in one browser tab.",
    promptExample:
      "Make a quiz app that keeps score\nand shows the result at the end.",
    comparison: "Like a workshop where the machine is already switched on.",
    bestFor: "Best for: building and sharing with nothing installed.",
    accent: "coral",
  },
  {
    id: "cursor",
    name: "Cursor",
    tagline: "AI inside the editor",
    definition: "A code editor where the AI edits the file you are looking at.",
    promptExample:
      "Refactor this component and add\nloading and error states.",
    comparison: "Like a colleague typing in the same file as you.",
    bestFor: "Best for: people already comfortable in an editor.",
    accent: "violet",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    tagline: "AI in your terminal",
    definition: "An agent that works across your whole project, not one file.",
    promptExample:
      "Find why login fails on mobile,\nfix it, and run the tests.",
    comparison: "Like handing a task to a teammate who knows the codebase.",
    bestFor: "Best for: real projects, real repositories.",
    accent: "coral",
    focus: true,
  },
];

/* -------------------------------------------------------------------------
   Slide 8 — meeting Claude Code
   ------------------------------------------------------------------------- */
export const CLAUDE_CODE_STEPS: SequenceStep[] = [
  {
    id: "open",
    title: "Open your project.",
    detail: "Point the terminal at the folder your code lives in.",
    sample: "cd my-project",
  },
  {
    id: "start",
    title: "Start Claude Code.",
    detail: "One command. It reads the project itself.",
    sample: "claude",
  },
  {
    id: "describe",
    title: "Describe the task.",
    detail: "A whole task, not one line. It plans before it edits.",
    sample: "add a dark mode toggle",
  },
  {
    id: "review",
    title: "Review the changes.",
    detail: "It shows every edit. You approve, or you push back.",
    sample: "2 files changed",
  },
];

/* -------------------------------------------------------------------------
   Slide 9 — the plan Claude Code writes before it edits
   ------------------------------------------------------------------------- */
export const DEFAULT_PLAN = [
  "Read the code",
  "Write the fix",
  "Run the tests",
];

export const PLAN_SUGGESTIONS = [
  "Update the README",
  "Add a test",
  "Handle errors",
  "Commit the change",
  "Open a pull request",
];

/* -------------------------------------------------------------------------
   Slide 10 — CLAUDE.md
   ------------------------------------------------------------------------- */
export const PROJECT_RULES = [
  "Never commit secrets",
  "Ask before deleting",
  "Match the existing style",
];

/* -------------------------------------------------------------------------
   Slide 11 — the Claude Code toolbelt
   ------------------------------------------------------------------------- */
export const CLAUDE_CODE_TOOLBELT: ExplorerCard[] = [
  {
    id: "plan-mode",
    title: "Plan mode",
    icon: ListChecks,
    example:
      "Ask for the plan before a single file is touched, then approve it.",
    snippet: "Plan the refactor first.\nDo not edit anything yet.",
  },
  {
    id: "run-and-test",
    title: "Run & test",
    icon: SquareTerminal,
    example:
      "It runs your commands, reads the output, and fixes what came back red.",
    snippet: "Run the tests and fix\nwhatever fails.",
  },
  {
    id: "git",
    title: "Git & pull requests",
    icon: GitBranch,
    example: "It can branch, commit, and open a pull request for you.",
    snippet: "Commit this and open a PR\nexplaining the change.",
  },
  {
    id: "skills",
    title: "Skills",
    icon: Wand2,
    example: "Teach it a repeatable job once, then reuse it by name.",
    snippet: "Use our review checklist\non this branch.",
  },
  {
    id: "subagents",
    title: "Subagents",
    icon: Users,
    example: "Hand a big search or a long job to a helper working in parallel.",
    snippet: "Search the whole repo for every\nplace we send an email.",
  },
];

/* -------------------------------------------------------------------------
   Slide 12 — Replit vs Claude Code sorting drill
   ------------------------------------------------------------------------- */
export const SORTING_ITEMS = [
  {
    id: "s1",
    code: "I have no project yet and want something online today.",
    answer: "replit" as const,
  },
  {
    id: "s2",
    code: "Our repository has a failing test on the checkout page.",
    answer: "claude" as const,
  },
  {
    id: "s3",
    code: "I want to share a working demo link with my team tonight.",
    answer: "replit" as const,
  },
  {
    id: "s4",
    code: "Rename one function everywhere it appears across 40 files.",
    answer: "claude" as const,
  },
];

/* -------------------------------------------------------------------------
   Slide 13 — Quiz
   ------------------------------------------------------------------------- */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What is vibe coding?",
    options: [
      "Describing what you want and letting AI write the code",
      "Copying code from the internet",
      "Writing code without a plan",
      "A programming language",
    ],
    answerIndex: 0,
    because: "You describe the goal in plain language; the AI writes the code.",
  },
  {
    id: "q2",
    prompt: "What makes a prompt strong?",
    options: [
      "Keeping it as short as possible",
      "Saying exactly what it must do",
      "Using difficult technical words",
      "Asking for everything at once",
    ],
    answerIndex: 1,
    because: "Say what to build, who it is for, and what it must do.",
  },
  {
    id: "q3",
    prompt: "Where does Claude Code run?",
    options: [
      "In a browser tab",
      "In your terminal, on your real project",
      "On a phone only",
      "Inside a spreadsheet",
    ],
    answerIndex: 1,
    because:
      "Claude Code works in the terminal, across every file in the project.",
  },
  {
    id: "q4",
    prompt: "What is CLAUDE.md for?",
    options: [
      "Storing passwords",
      "Project rules Claude Code reads every time",
      "A list of bugs",
      "The homepage of the app",
    ],
    answerIndex: 1,
    because:
      "It holds the rules and context you would otherwise repeat every session.",
  },
  {
    id: "q5",
    prompt: "You want a shareable demo tonight, starting from nothing. Which tool?",
    options: ["Replit", "Claude Code", "Neither of them", "A plain text editor"],
    answerIndex: 0,
    because:
      "Replit builds, runs and hosts it in one tab — the fastest path to a link.",
  },
];

/* -------------------------------------------------------------------------
   Slide 14 — Summary
   ------------------------------------------------------------------------- */
export const SUMMARY_CONCEPTS: SummaryConcept[] = [
  {
    id: "vibe-coding",
    label: "Vibe coding",
    slideIndex: SLIDE_INDEX["what-is-vibe-coding"]!,
    recap: "Describe it in plain language; the AI writes the code.",
  },
  {
    id: "prompt",
    label: "A strong prompt",
    slideIndex: SLIDE_INDEX["the-prompt"]!,
    recap: "What to build, who for, what it must do, how it should feel.",
  },
  {
    id: "replit",
    label: "Replit",
    slideIndex: SLIDE_INDEX["replit"]!,
    recap: "Build, run and share an app in one browser tab.",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    slideIndex: SLIDE_INDEX["claude-code"]!,
    recap: "An AI teammate in your terminal, working on your real project.",
  },
  {
    id: "claude-md",
    label: "CLAUDE.md",
    slideIndex: SLIDE_INDEX["claude-code-context"]!,
    recap: "Project rules Claude Code reads before every task.",
  },
];
