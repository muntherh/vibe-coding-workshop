import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Lock, RotateCcw, Unlock, X } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { SORTING_ITEMS } from "@/data/lesson";
import { cn } from "@/lib/cn";

type Kind = "list" | "tuple";

/** Slide 10 — the two collections side by side, then a quick sorting drill. */
export function ListVsTupleSection({ index, registerRef }: SectionProps) {
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
      title="List vs Tuple"
      lead="Same idea, one difference: whether you can change it later."
      width="wide"
    >
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <Reveal delay={0.2}>
          <ComparisonCard
            kind="list"
            title="List"
            bracket="[ ]"
            bracketName="Uses square brackets."
            mutability="Can be changed."
            example='["Apple", "Banana"]'
          />
        </Reveal>
        <Reveal delay={0.26}>
          <ComparisonCard
            kind="tuple"
            title="Tuple"
            bracket="( )"
            bracketName="Uses parentheses."
            mutability="Cannot normally be changed."
            example='("Blue", "Yellow")'
          />
        </Reveal>
      </div>

      <Reveal delay={0.32}>
        <div className="glass mt-[clamp(1.1rem,3vh,2.25rem)] rounded-2xl p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
              Your turn — list or tuple?
            </p>
            <p
              className="font-mono text-[0.85rem] text-mist tabular-nums"
              aria-live="polite"
            >
              <span className="text-py-yellow">{correctCount}</span>
              <span className="mx-1 text-dim">/</span>
              <span className="text-dim">{SORTING_ITEMS.length}</span>
            </p>
          </div>

          <div className="mt-4 grid items-center gap-4 md:grid-cols-[1fr_auto] md:gap-8">
            <div className="min-h-[3.6rem]">
              <AnimatePresence mode="wait">
                {current ? (
                  <motion.code
                    key={current.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="block font-mono text-[clamp(1.05rem,2.1vw,2.1rem)] break-all text-chalk"
                  >
                    {current.code}
                  </motion.code>
                ) : (
                  <motion.p
                    key="done"
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[clamp(1.05rem,1.7vw,1.7rem)] font-medium text-chalk"
                  >
                    {correctCount === SORTING_ITEMS.length
                      ? "All four correct. You have got it."
                      : `You got ${correctCount} of ${SORTING_ITEMS.length}. Look at the brackets and try again.`}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {current ? (
                <>
                  <ActionButton
                    variant="outline"
                    icon={Unlock}
                    onClick={() => choose("list")}
                  >
                    List
                  </ActionButton>
                  <ActionButton
                    variant="outline"
                    icon={Lock}
                    onClick={() => choose("tuple")}
                  >
                    Tuple
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
                    ? `Correct — ${lastAnswered.code} is a ${lastAnswered.answer}.`
                    : `That one was a ${lastAnswered.answer}. Check the brackets.`}
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
  bracket,
  bracketName,
  mutability,
  example,
}: {
  kind: Kind;
  title: string;
  bracket: string;
  bracketName: string;
  mutability: string;
  example: string;
}) {
  const isList = kind === "list";
  const Icon = isList ? Unlock : Lock;

  return (
    <div
      className={cn(
        "glass flex h-full flex-col gap-4 rounded-2xl p-5 sm:p-7",
        isList ? "border-py-blue/30" : "border-py-yellow/30",
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[clamp(1.35rem,2.4vw,2.4rem)] font-semibold tracking-tight text-chalk">
          {title}
        </h3>
        <span
          className={cn(
            "font-mono text-[clamp(1.35rem,2.4vw,2.4rem)] leading-none",
            isList ? "text-py-blue" : "text-py-yellow",
          )}
        >
          {bracket}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        <li className="flex items-start gap-2.5 text-[clamp(0.92rem,1.15vw,1.22rem)] text-mist">
          <span
            aria-hidden="true"
            className={cn(
              "mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full",
              isList ? "bg-py-blue" : "bg-py-yellow",
            )}
          />
          {bracketName}
        </li>
        <li className="flex items-start gap-2.5 text-[clamp(0.92rem,1.15vw,1.22rem)] text-chalk">
          <Icon
            aria-hidden="true"
            className={cn(
              "mt-[0.2em] h-4 w-4 shrink-0",
              isList ? "text-py-blue" : "text-py-yellow",
            )}
          />
          {mutability}
        </li>
      </ul>

      <code className="mt-auto block overflow-x-auto rounded-xl border border-line bg-navy-950/75 px-4 py-3 font-mono text-[clamp(0.88rem,1.2vw,1.25rem)] whitespace-nowrap text-chalk">
        {example}
      </code>
    </div>
  );
}
