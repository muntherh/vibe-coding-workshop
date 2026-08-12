import { motion, useReducedMotion } from "framer-motion";
import { Box, Play, RotateCcw } from "lucide-react";
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
import {
  cleanInput,
  parseWholeNumber,
  printInteger,
  printText,
  stringLiteral,
} from "@/lib/simulate";

const DEFAULT_NAME = "Ali";
const DEFAULT_AGE = "18";

const DEFAULT_TRY_CODE = `name = "Said"
print(name)`;
const PRINT_QUESTION_CODE = `age = 18
print(age)`;

const PRINT_OPTIONS = ["18", '"18"', "age"];
/** Slide 05 — variables as labelled boxes the learner can refill. */
export function VariablesSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState(DEFAULT_NAME);
  const [age, setAge] = useState(DEFAULT_AGE);

  const [showTryIt, setShowTryIt] = useState(false);
  const [tryCode, setTryCode] = useState(DEFAULT_TRY_CODE);
  const [tryOutput, setTryOutput] = useState<string[]>([]);
const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const safeName = name.trim() === "" ? DEFAULT_NAME : name;
  const safeAge = parseWholeNumber(age, Number(DEFAULT_AGE));

  const code = useMemo(
    () =>
      [
        `name = ${stringLiteral(safeName)}`,
        `age = ${safeAge}`,
        "",
        "print(name)",
        "print(age)",
      ].join("\n"),
    [safeName, safeAge],
  );

  const output = [printText(safeName), printInteger(safeAge)];

  function runTryCode() {
    const assignmentMatch = tryCode.match(
      /name\s*=\s*["']([^"']*)["']/,
    );

    const hasPrintName = /print\s*\(\s*name\s*\)/.test(tryCode);

    if (!assignmentMatch || !hasPrintName) {
      setTryOutput(["This demo supports beginner Python examples only."]);
      return;
    }

    const value = assignmentMatch[1];
    setTryOutput([value]);
  }

  function resetTryCode() {
    setTryCode(DEFAULT_TRY_CODE);
    setTryOutput([]);
  }

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Storing values"
      title="Variables"
      lead="A variable stores information so we can use it later."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.22}>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
              <StorageBox
                label="name"
                value={stringLiteral(safeName)}
                accent="blue"
                reduceMotion={reduceMotion}
              />

              <StorageBox
                label="age"
                value={String(safeAge)}
                accent="yellow"
                reduceMotion={reduceMotion}
              />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                id="variable-name"
                label="Change the name"
                value={name}
                onChange={(next) => setName(cleanInput(next, 18))}
                placeholder={DEFAULT_NAME}
              />

              <Field
                id="variable-age"
                label="Change the age"
                value={age}
                onChange={(next) => setAge(cleanInput(next, 3))}
                placeholder={DEFAULT_AGE}
                inputMode="numeric"
              />
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-4 flex flex-wrap gap-3">
              <ActionButton
                icon={RotateCcw}
                variant="ghost"
                onClick={() => {
                  setName(DEFAULT_NAME);
                  setAge(DEFAULT_AGE);
                }}
              >
                Reset
              </ActionButton>

              <ActionButton
                icon={Play}
                onClick={() => setShowTryIt((current) => !current)}
              >
                {showTryIt ? "Close Practice" : "Try It Yourself"}
              </ActionButton>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.26}>
            <CodeBlock
              code={code}
              fileName="variables.py"
              size="md"
              showLineNumbers
            />
          </Reveal>

          <Reveal delay={0.34}>
            <OutputPanel lines={output} minLines={2} placeholder="" />
          </Reveal>
        </div>
      </div>

      {showTryIt && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl border border-emerald-400/35 bg-navy-950/75 p-4 shadow-[0_0_28px_rgba(52,211,153,0.08)] sm:p-5"
        >
          <div className="mb-4">
            <p className="font-display text-[clamp(1.05rem,1.6vw,1.4rem)] font-semibold text-chalk">
              Try It Yourself
            </p>

            <p className="mt-1 text-sm text-dim">
              Change the name, then press Run Code.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="min-w-0">
              <label
                htmlFor="try-variable-code"
                className="mb-2 block font-mono text-[0.72rem] tracking-[0.2em] text-emerald-300 uppercase"
              >
                Code
              </label>

              <textarea
                id="try-variable-code"
                value={tryCode}
                onChange={(event) => setTryCode(event.target.value)}
                spellCheck={false}
                className="min-h-[150px] w-full resize-y rounded-xl border border-emerald-400/35 bg-[#07110d] p-4 font-mono text-[0.95rem] leading-7 text-chalk outline-none transition focus:border-emerald-300/70 focus:shadow-[0_0_22px_rgba(52,211,153,0.08)]"
              />

              <div className="mt-3 flex flex-wrap gap-3">
                <ActionButton icon={Play} onClick={runTryCode}>
                  Run Code
                </ActionButton>

                <ActionButton
                  icon={RotateCcw}
                  variant="ghost"
                  onClick={resetTryCode}
                >
                  Reset
                </ActionButton>
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-2 font-mono text-[0.72rem] tracking-[0.2em] text-py-yellow uppercase">
                Output
              </p>

              <OutputPanel
                lines={tryOutput}
                minLines={4}
                placeholder="Run the code to see the output."
              />
            </div>
          </div>
        </motion.div>
      )}
      <Reveal delay={0.42}>
  <div className="mt-6 rounded-2xl border border-py-yellow/25 bg-navy-900/55 p-4 sm:p-5">
    <p className="font-display text-[clamp(1.05rem,1.6vw,1.4rem)] font-semibold text-chalk">
      What will this code print?
    </p>

    <p className="mt-1 text-sm text-dim">
      Read the code and choose the correct output.
    </p>

    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <CodeBlock
        code={PRINT_QUESTION_CODE}
        fileName="question.py"
        size="md"
        showLineNumbers
      />

      <div className="grid content-start gap-3">
        {PRINT_OPTIONS.map((option) => {
          const selected = quizAnswer === option;
          const correct = option === "18";

          return (
            <button
              key={option}
              type="button"
              onClick={() => setQuizAnswer(option)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left font-mono transition-all duration-200",
                selected && correct
                  ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-300"
                  : selected
                    ? "border-red-400/60 bg-red-400/10 text-red-300"
                    : "border-line bg-navy-950/60 text-chalk hover:border-py-blue/50",
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
              quizAnswer === "18"
                ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/35 bg-red-400/10 text-red-300",
            )}
          >
            {quizAnswer === "18"
              ? "Correct! The variable age stores the number 18."
              : "Try again. print(age) displays the value stored inside age."}
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
  </div>
</Reveal>
    </PresentationSection>
  );
}

/** A labelled box holding one value — the mental model for a variable. */
function StorageBox({
  label,
  value,
  accent,
  reduceMotion,
}: {
  label: string;
  value: string;
  accent: "blue" | "yellow";
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative flex-1">
      <span
        className={cn(
          "absolute -top-2.5 left-4 z-10 rounded-md border px-2.5 py-0.5 font-mono text-[0.78rem]",
          accent === "blue"
            ? "border-py-blue/45 bg-navy-900 text-py-blue"
            : "border-py-yellow/45 bg-navy-900 text-py-yellow",
        )}
      >
        {label}
      </span>

      <div
        className={cn(
          "flex min-h-[clamp(6rem,14vh,8.5rem)] items-center gap-3 rounded-2xl border bg-navy-900/55 px-4 pt-5 pb-4 sm:px-5",
          accent === "blue"
            ? "border-py-blue/25"
            : "border-py-yellow/25",
        )}
      >
        <Box
          aria-hidden="true"
          className={cn(
            "h-5 w-5 shrink-0",
            accent === "blue"
              ? "text-py-blue/60"
              : "text-py-yellow/60",
          )}
        />

        <motion.span
          key={value}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="min-w-0 truncate font-mono text-[clamp(1.05rem,1.9vw,1.85rem)] text-chalk"
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
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric" | "text";
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
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-xl border border-line bg-navy-950/70 px-4 py-3 font-mono text-[clamp(0.95rem,1.15vw,1.2rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-py-blue/40 focus:border-py-blue/70 focus:outline-none"
      />
    </div>
  );
}