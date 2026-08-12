import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Rocket, RotateCcw, Wrench, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { SORTING_ITEMS } from "@/data/lesson";
import { cn } from "@/lib/cn";

type Kind = "replit" | "claude";

const LABEL: Record<Kind, string> = {
  replit: "Replit",
  claude: "Claude Code",
};

/** Slide 12 — the two tools side by side, then a quick sorting drill. */
export function ReplitVsClaudeCodeSection({
  index,
  registerRef,
}: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<Record<string, Kind>>({});

  const current = SORTING_ITEMS.find((item) => !(item.id in answers)) ?? null;
  const correctCount = SORTING_ITEMS.filter(
    (item) => answers[item.id] === item.answer,
  ).length;
  const answeredCount = Object.keys(answers).length;
  const lastAnswered =
    answeredCount > 0 ? SORTING_ITEMS[answeredCount - 1] : null;
  const lastWasCorrect =
    lastAnswered !== null && answers[lastAnswered.id] === lastAnswered.answer;

  const choose = (kind: Kind) => {
    if (!current) return;
    setAnswers((existing) => ({ ...existing, [current.id]: kind }));
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Side by side"
      title="Replit vs Claude Code"
      lead="Same idea, different home: one lives in a browser tab, the other inside your project."
      width="wide"
    >
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <Reveal delay={0.2}>
          <ComparisonCard
            kind="replit"
            title="Replit"
            glyph="▶"
            where="Runs in the browser."
            strength="Best for starting from nothing."
            icon={Rocket}
            example="Make a quiz app that keeps score."
          />
        </Reveal>
        <Reveal delay={0.26}>
          <ComparisonCard
            kind="claude"
            title="Claude Code"
            glyph=">_"
            where="Runs in your terminal."
            strength="Best for changing something real."
            icon={Wrench}
            example="Fix the failing test in checkout."
          />
        </Reveal>
      </div>

      <Reveal delay={0.32}>
        <div className="glass mt-[clamp(1.1rem,3vh,2.25rem)] rounded-2xl p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
              Your turn — which tool?
            </p>
            <p
              className="font-mono text-[0.85rem] text-mist tabular-nums"
              aria-live="polite"
            >
              <span className="text-vibe-coral">{correctCount}</span>
              <span className="mx-1 text-dim">/</span>
              <span className="text-dim">{SORTING_ITEMS.length}</span>
            </p>
          </div>

          <div className="mt-4 grid items-center gap-4 md:grid-cols-[1fr_auto] md:gap-8">
            <div className="min-h-[3.6rem]">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.p
                    key={current.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-[clamp(1rem,1.6vw,1.65rem)] leading-snug text-chalk"
                  >
                    {current.code}
                  </motion.p>
                ) : (
                  <motion.p
                    key="done"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[clamp(1.05rem,1.7vw,1.7rem)] font-medium text-chalk"
                  >
                    {correctCount === SORTING_ITEMS.length
                      ? "All four correct. You know which tool to reach for."
                      : `You got ${correctCount} of ${SORTING_ITEMS.length}. Ask yourself: does the project already exist?`}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {current ? (
                <>
                  <ActionButton
                    variant="outline"
                    icon={Rocket}
                    onClick={() => choose("replit")}
                  >
                    Replit
                  </ActionButton>
                  <ActionButton
                    variant="outline"
                    icon={Wrench}
                    onClick={() => choose("claude")}
                  >
                    Claude Code
                  </ActionButton>
                </>
              ) : (
                <ActionButton
                  variant="accent"
                  icon={RotateCcw}
                  onClick={() => setAnswers({})}
                >
                  Try Again
                </ActionButton>
              )}
            </div>
          </div>

          <div className="mt-4 min-h-[1.9rem]">
            <AnimatePresence mode="wait">
              {lastAnswered ? (
                <motion.p
                  key={`${lastAnswered.id}-${lastWasCorrect}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex items-center gap-2.5 text-[clamp(0.9rem,1.1vw,1.15rem)]",
                    lastWasCorrect ? "text-ok" : "text-warn",
                  )}
                  role="status"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      lastWasCorrect ? "bg-ok/20" : "bg-warn/20",
                    )}
                  >
                    {lastWasCorrect ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </span>
                  {lastWasCorrect
                    ? `Correct — that is a job for ${LABEL[lastAnswered.answer]}.`
                    : `That one suits ${LABEL[lastAnswered.answer]} better.`}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </PresentationSection>
  );
}

function ComparisonCard({
  kind,
  title,
  glyph,
  where,
  strength,
  icon: Icon,
  example,
}: {
  kind: Kind;
  title: string;
  glyph: string;
  where: string;
  strength: string;
  icon: LucideIcon;
  example: string;
}) {
  const isReplit = kind === "replit";

  return (
    <div
      className={cn(
        "glass flex h-full flex-col gap-4 rounded-2xl p-5 sm:p-7",
        isReplit ? "border-vibe-violet/30" : "border-vibe-coral/30",
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[clamp(1.25rem,2.2vw,2.2rem)] font-semibold tracking-tight text-chalk">
          {title}
        </h3>
        <span
          className={cn(
            "font-mono text-[clamp(1.35rem,2.4vw,2.4rem)] leading-none",
            isReplit ? "text-vibe-violet" : "text-vibe-coral",
          )}
        >
          {glyph}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        <li className="flex items-start gap-2.5 text-[clamp(0.92rem,1.15vw,1.22rem)] text-mist">
          <span
            aria-hidden="true"
            className={cn(
              "mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full",
              isReplit ? "bg-vibe-violet" : "bg-vibe-coral",
            )}
          />
          {where}
        </li>
        <li className="flex items-start gap-2.5 text-[clamp(0.92rem,1.15vw,1.22rem)] text-chalk">
          <Icon
            aria-hidden="true"
            className={cn(
              "mt-[0.2em] h-4 w-4 shrink-0",
              isReplit ? "text-vibe-violet" : "text-vibe-coral",
            )}
          />
          {strength}
        </li>
      </ul>

      <code className="mt-auto block overflow-x-auto rounded-xl border border-line bg-navy-950/75 px-4 py-3 font-mono text-[clamp(0.82rem,1.05vw,1.1rem)] whitespace-nowrap text-chalk">
        {example}
      </code>
    </div>
  );
}
