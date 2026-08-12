/**
 * Deterministic Python output simulation.
 *
 * There is no interpreter, no `eval`, and no network here. Every "Run" button
 * in the deck calls one of these pure helpers, so a live workshop always sees
 * exactly the same output — which is the whole point when you are teaching.
 */

/** How Python's `print()` renders a value we already know the shape of. */
export function printText(value: string): string {
  return value;
}

/** `print(<int>)` — we keep the learner's number as an integer string. */
export function printInteger(value: number): string {
  return String(Math.trunc(value));
}

/** Python renders a list with square brackets and single-quoted strings. */
export function reprList(items: string[]): string {
  return `[${items.map((item) => `'${escapeSingle(item)}'`).join(", ")}]`;
}

/** Python renders a tuple with parentheses (and a trailing comma if size 1). */
export function reprTuple(items: string[]): string {
  const inner = items.map((item) => `'${escapeSingle(item)}'`).join(", ");
  return items.length === 1 ? `(${inner},)` : `(${inner})`;
}

/** Source-code form of a list literal, using the double quotes we teach. */
export function listLiteral(items: string[]): string {
  return `[${items.map((item) => `"${escapeDouble(item)}"`).join(", ")}]`;
}

/** Source-code form of a tuple literal. */
export function tupleLiteral(items: string[]): string {
  const inner = items.map((item) => `"${escapeDouble(item)}"`).join(", ");
  return items.length === 1 ? `(${inner},)` : `(${inner})`;
}

/** Safe double-quoted string literal for the code preview. */
export function stringLiteral(value: string): string {
  return `"${escapeDouble(value)}"`;
}

function escapeDouble(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeSingle(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * Clamp free text to something that stays readable on a projector and can
 * never break the code preview layout.
 */
export function cleanInput(value: string, maxLength: number): string {
  return value.replace(/[\r\n\t]/g, " ").slice(0, maxLength);
}

/** Parse an age-like input into a whole number, tolerating an empty field. */
export function parseWholeNumber(
  value: string,
  fallback: number,
  min = 0,
  max = 120,
): number {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits === "") return fallback;
  const parsed = Number.parseInt(digits, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}
