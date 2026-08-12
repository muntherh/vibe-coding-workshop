/**
 * Deterministic simulation of what a vibe coding tool answers back.
 *
 * There is no model call, no network and no `eval` here. Every "Run" button in
 * the deck calls one of these pure helpers, so a live workshop always sees
 * exactly the same response — which is the whole point when you are teaching
 * in front of a room and the wifi is not to be trusted.
 */

/**
 * Clamp free text to something that stays readable on a projector and can
 * never break the prompt preview layout.
 */
export function cleanInput(value: string, maxLength: number): string {
  return value.replace(/[\r\n\t]/g, " ").slice(0, maxLength);
}

/** Drop a leading article so "a to-do app" reads well after "Build ". */
export function withoutArticle(value: string): string {
  return value.replace(/^\s*(a|an|the)\s+/i, "").trim();
}

/** The four-part prompt built from the learner's two answers (slide 5). */
export function buildPrompt(what: string, who: string): string {
  return [
    `Build ${what}`,
    `for ${who}.`,
    "It must be simple enough to use on the first try.",
    "Keep the design clean and calm.",
  ].join("\n");
}

/** What a tool would report back after being given that prompt (slide 5). */
export function simulateBuild(what: string): string[] {
  const subject = withoutArticle(what) || "app";
  return [
    `Understood: ${subject}.`,
    "Created index.html, styles.css, app.js",
    "Running at localhost:5173",
  ];
}

/** Replit's build log for a described app (slide 7). */
export function simulateReplit(idea: string): string[] {
  const subject = withoutArticle(idea) || "app";
  return [
    `Creating a Repl for ${subject}…`,
    "Installing packages…",
    "Live at https://your-app.replit.app",
  ];
}

/** The plan Claude Code writes before it edits anything (slide 9). */
export function formatPlan(steps: string[]): string {
  if (steps.length === 0) return "Plan\n  (nothing to do)";
  const body = steps
    .map((step, stepIndex) => `  ${stepIndex + 1}. ${step}`)
    .join("\n");
  return `Plan\n${body}`;
}

/** What Claude Code says once the plan is agreed (slide 9). */
export function simulatePlanRun(steps: string[]): string[] {
  if (steps.length === 0) {
    return ["Nothing planned yet. Add a step to get started."];
  }
  return [
    `${steps.length} ${steps.length === 1 ? "step" : "steps"} planned.`,
    `Starting with: ${steps[0]}`,
  ];
}

/** The CLAUDE.md file rendered from a list of project rules (slide 10). */
export function formatProjectRules(rules: string[]): string {
  const body = rules.map((rule) => `- ${rule}`).join("\n");
  return `# CLAUDE.md\n\n## Project rules\n\n${body}`;
}

/**
 * How strong a prompt is, judged only on structure — does it say what to
 * build, and who for. Used by the practice box on slide 5. Deliberately
 * simple: it teaches the shape of a prompt, it does not grade English.
 */
export function reviewPrompt(prompt: string): string[] {
  const text = prompt.trim();

  if (text === "") {
    return ["Write a prompt first, then press Send Prompt."];
  }

  const saysWhat = /\b(build|make|create|write)\b/i.test(text);
  const saysWho = /\bfor\b/i.test(text);
  const saysMust = /\b(must|should|needs? to|it can)\b/i.test(text);

  const missing: string[] = [];
  if (!saysWhat) missing.push("what to build");
  if (!saysWho) missing.push("who it is for");
  if (!saysMust) missing.push("what it must do");

  if (missing.length === 0) {
    return [
      "Good prompt — I know what to build, who for, and what it needs.",
      "Building it now…",
    ];
  }

  return [
    `I am missing: ${missing.join(", ")}.`,
    "Add that and I will not have to guess.",
  ];
}
