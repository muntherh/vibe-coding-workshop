import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { TOKEN_CLASS, tokenizeCode } from "@/lib/pythonHighlight";
import type { Token } from "@/types";

/** Which characters get the teaching highlight ring. */
export type Emphasis = "none" | "brackets" | "parentheses" | "quotes";

interface CodeBlockProps {
  code: string;
  /** File chip shown in the window bar, e.g. `main.py`. */
  fileName?: string;
  emphasis?: Emphasis;
  size?: "sm" | "md" | "lg";
  showLineNumbers?: boolean;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<CodeBlockProps["size"]>, string> = {
  sm: "text-[clamp(0.85rem,1.05vw,1.18rem)]",
  md: "text-[clamp(0.95rem,1.35vw,1.55rem)]",
  lg: "text-[clamp(1.05rem,1.95vw,2.2rem)]",
};

const HIGHLIGHT =
  "rounded-[3px] bg-py-yellow/18 px-[0.12em] text-py-yellow ring-1 ring-py-yellow/45";

const OPEN_BRACKETS: Record<Emphasis, string[]> = {
  none: [],
  brackets: ["[", "]"],
  parentheses: ["(", ")"],
  quotes: [],
};

/** Split a string token so only its surrounding quotes get emphasised. */
function renderQuotedToken(token: Token, key: string) {
  const { value } = token;
  const quote = value[0];
  if (!quote || (quote !== '"' && quote !== "'")) {
    return (
      <span key={key} className={TOKEN_CLASS.string}>
        {value}
      </span>
    );
  }
  const closed = value.length > 1 && value[value.length - 1] === quote;
  const inner = closed ? value.slice(1, -1) : value.slice(1);

  return (
    <Fragment key={key}>
      <span className={HIGHLIGHT}>{quote}</span>
      <span className={TOKEN_CLASS.string}>{inner}</span>
      {closed ? <span className={HIGHLIGHT}>{quote}</span> : null}
    </Fragment>
  );
}

/**
 * Read-only Python snippet with hand-rolled highlighting.
 * `emphasis` is the teaching hook: it rings the brackets or the quotation
 * marks so the presenter can point at them from across the room.
 */
export function CodeBlock({
  code,
  fileName,
  emphasis = "none",
  size = "md",
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const lines = tokenizeCode(code);
  const emphasised = OPEN_BRACKETS[emphasis];

  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-navy-950/85 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line/80 bg-navy-900/70 px-4 py-2.5 sm:px-5">
        <span className="h-2.5 w-2.5 rounded-full bg-py-blue/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-py-yellow/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-2 font-mono text-xs tracking-[0.18em] text-dim uppercase sm:text-[0.72rem]">
          {fileName ?? "main.py"}
        </span>
      </div>

      <pre
        className={cn(
          "overflow-x-auto px-4 py-5 font-mono leading-[1.75] sm:px-6 sm:py-6",
          SIZE_CLASS[size],
        )}
      >
        <code className="block min-w-max">
          {lines.map((tokens, lineIndex) => {
            const lineNumber = lineIndex + 1;

            return (
              <span key={lineNumber} className="block">
                {showLineNumbers ? (
                  <span className="mr-4 inline-block w-5 shrink-0 text-right text-dim select-none">
                    {lineNumber}
                  </span>
                ) : null}
                {tokens.length === 0 ? "\u00A0" : null}
                {tokens.map((token, tokenIndex) => {
                  const key = `${lineNumber}-${tokenIndex}`;

                  if (emphasis === "quotes" && token.kind === "string") {
                    return renderQuotedToken(token, key);
                  }

                  if (
                    token.kind === "bracket" &&
                    emphasised.includes(token.value)
                  ) {
                    return (
                      <span key={key} className={HIGHLIGHT}>
                        {token.value}
                      </span>
                    );
                  }

                  return (
                    <span key={key} className={TOKEN_CLASS[token.kind]}>
                      {token.value}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
