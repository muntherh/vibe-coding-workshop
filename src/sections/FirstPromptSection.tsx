import { motion, useReducedMotion } from "framer-motion";
import { Box, RotateCcw, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { CodeBlock } from "@/components/CodeBlock";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";
import { buildPrompt, cleanInput, reviewPrompt, simulateBuild } from "@/lib/simulate";

const DEFAULT_WHAT = "a to-do app";
const DEFAULT_WHO = "a busy student";

const DEFAULT_PRACTICE = `Build a habit tracker
for someone starting at the gym.
It must show a streak for each habit.`;

const PROMPT_OPTIONS = [
  "make me a website",
  "Build a 3-page site for a bakery: menu, hours, contact form.",
  "website bakery",
];

const BEST_OPTION = PROMPT_OPTIONS[1]!;

/** Slide 05 — the learner writes a prompt by filling in two boxes. */
export function FirstPromptSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();

  const [what, setWhat] = useState(DEFAULT_WHAT);
  const [who, setWho] = useState(DEFAULT_WHO);

  const [showPractice, setShowPractice] = useState(false);
  const [practicePrompt, setPracticePrompt] = useState(DEFAULT_PRACTICE);
  const [practiceOutput, setPracticeOutput] = useState<string[]>([]);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const safeWhat = what.trim() === "" ? DEFAULT_WHAT : what;
  const safeWho = who.trim() === "" ? DEFAULT_WHO : who;

  const prompt = useMemo(
    () => buildPrompt(safeWhat, safeWho),
    [safeWhat, safeWho],
  );

  const output = simulateBuild(safeWhat);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Your turn"
      title="Your first prompt"
      lead="Change the two boxes and watch the prompt rewrite itself."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.22}>
            <div className="flex flex-col gap-4 pt-3 sm:flex-row lg:flex-col xl:flex-row">
              <IngredientBox
                label="what"
                value={safeWhat}
                accent="violet"
                reduceMotion={reduceMotion}
              />

              <IngredientBox
                label="who"
                value={safeWho}
                accent="coral"
                reduceMotion={reduceMotion}
              />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="prompt-what"
                label="What to build"
                value={what}
                onChange={(next) => setWhat(cleanInput(next, 28))}
                placeholder={DEFAULT_WHAT}
              />

              <Field
                id="prompt-who"
                label="Who it is for"
                value={who}
                onChange={(next) => setWho(cleanInput(next, 28))}
                placeholder={DEFAULT_WHO}
              />
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-4 flex flex-wrap gap-3">
              <ActionButton
                icon={RotateCcw}
                variant="ghost"
                onClick={() => {
                  setWhat(DEFAULT_WHAT);
                  setWho(DEFAULT_WHO);
                }}
              >
                Reset
              </ActionButton>

              <ActionButton
                icon={Sparkles}
                onClick={() => setShowPractice((current) => !current)}
              >
                {showPractice ? "Close Practice" : "Try It Yourself"}
              </ActionButton>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.26}>
            <CodeBlock code={prompt} variant="prompt" fileName="prompt" size="md" />
          </Reveal>

          <Reveal delay={0.34}>
            <OutputPanel lines={output} title="Result" minLines={3} placeholder="" />
          </Reveal>
        </div>
      </div>

      {showPractice && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl border border-vibe-violet/35 bg-navy-950/75 p-4 shadow-[0_0_28px_rgba(139,127,240,0.1)] sm:p-5"
        >
          <div className="mb-4">
            <p className="font-display text-[clamp(1.05rem,1.6vw,1.4rem)] font-semibold text-chalk">
              Write your own
            </p>

            <p className="mt-1 text-sm text-dim">
              Say what to build, who it is for, and what it must do. Then send
              it.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="min-w-0">
              <label
                htmlFor="practice-prompt"
                className="mb-2 block font-mono text-[0.72rem] tracking-[0.2em] text-vibe-violet-bright uppercase"
              >
                Your prompt
              </label>

              <textarea
                id="practice-prompt"
                value={practicePrompt}
                onChange={(event) => setPracticePrompt(event.target.value)}
                spellCheck={false}
                className="min-h-[150px] w-full resize-y rounded-xl border border-vibe-violet/35 bg-[#0a0818] p-4 font-mono text-[0.95rem] leading-7 text-chalk outline-none transition focus:border-vibe-violet/70 focus:shadow-[0_0_22px_rgba(139,127,240,0.12)]"
              />

              <div className="mt-3 flex flex-wrap gap-3">
                <ActionButton
                  icon={Send}
                  onClick={() => setPracticeOutput(reviewPrompt(practicePrompt))}
                >
                  Send Prompt
                </ActionButton>

                <ActionButton
                  icon={RotateCcw}
                  variant="ghost"
                  onClick={() => {
                    setPracticePrompt(DEFAULT_PRACTICE);
                    setPracticeOutput([]);
                  }}
                >
                  Reset
                </ActionButton>
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-2 font-mono text-[0.72rem] tracking-[0.2em] text-vibe-coral uppercase">
                What the AI would say
              </p>

              <OutputPanel
                lines={practiceOutput}
                title="Result"
                minLines={4}
                placeholder="Send the prompt to see the response."
              />
            </div>
          </div>
        </motion.div>
      )}

      <Reveal delay={0.42}>
        <div className="mt-6 rounded-2xl border border-vibe-coral/25 bg-navy-900/55 p-4 sm:p-5">
          <p className="font-display text-[clamp(1.05rem,1.6vw,1.4rem)] font-semibold text-chalk">
            Which of these is the better prompt?
          </p>

          <p className="mt-1 text-sm text-dim">
            All three ask for a bakery website. Only one of them will get it.
          </p>

          <div className="mt-4 grid content-start gap-3">
            {PROMPT_OPTIONS.map((option) => {
              const selected = quizAnswer === option;
              const correct = option === BEST_OPTION;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setQuizAnswer(option)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left font-mono text-[clamp(0.85rem,1vw,1.05rem)] transition-all duration-200",
                    selected && correct
                      ? "border-ok/70 bg-ok/10 text-ok"
                      : selected
                        ? "border-bad/60 bg-bad/10 text-bad"
                        : "border-line bg-navy-950/60 text-chalk hover:border-vibe-violet/50",
                  )}
                >
                  {option}
                </button>
              );
            })}

            {quizAnswer && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  quizAnswer === BEST_OPTION
                    ? "border-ok/35 bg-ok/10 text-ok"
                    : "border-bad/35 bg-bad/10 text-bad",
                )}
                role="status"
              >
                {quizAnswer === BEST_OPTION
                  ? "Right — it says what to build, for whom, and exactly what it needs."
                  : "Too vague. The AI has to guess, and it will guess something you did not want."}
              </motion.div>
            )}

            {quizAnswer && (
              <ActionButton
                icon={RotateCcw}
                variant="ghost"
                onClick={() => setQuizAnswer(null)}
              >
                Try Again
              </ActionButton>
            )}
          </div>
        </div>
      </Reveal>
    </PresentationSection>
  );
}

/** A labelled box holding one ingredient of the prompt. */
function IngredientBox({
  label,
  value,
  accent,
  reduceMotion,
}: {
  label: string;
  value: string;
  accent: "violet" | "coral";
  reduceMotion: boolean | null;
}) {
  const isViolet = accent === "violet";

  return (
    <div className="relative flex-1">
      <span
        className={cn(
          "absolute -top-2.5 left-4 z-10 rounded-md border px-2.5 py-0.5 font-mono text-[0.78rem]",
          isViolet
            ? "border-vibe-violet/45 bg-navy-900 text-vibe-violet"
            : "border-vibe-coral/45 bg-navy-900 text-vibe-coral",
        )}
      >
        {label}
      </span>

      <div
        className={cn(
          "flex min-h-[clamp(6rem,14vh,8.5rem)] items-center gap-3 rounded-2xl border bg-navy-900/55 px-4 pt-5 pb-4 sm:px-5",
          isViolet ? "border-vibe-violet/25" : "border-vibe-coral/25",
        )}
      >
        <Box
          aria-hidden="true"
          className={cn(
            "h-5 w-5 shrink-0",
            isViolet ? "text-vibe-violet/60" : "text-vibe-coral/60",
          )}
        />

        <motion.span
          key={value}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 truncate font-mono text-[clamp(0.95rem,1.5vw,1.5rem)] text-chalk"
        >
          {value}
        </motion.span>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.72rem] tracking-[0.2em] text-dim uppercase"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-xl border border-line bg-navy-950/70 px-4 py-3 font-mono text-[clamp(0.9rem,1.1vw,1.15rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-vibe-violet/40 focus:border-vibe-violet/70 focus:outline-none"
      />
    </div>
  );
}
