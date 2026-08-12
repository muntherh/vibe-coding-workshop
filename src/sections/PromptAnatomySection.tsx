import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lightbulb, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { RunButton } from "@/components/RunButton";
import { PROMPT_LINES, PROMPT_PARTS } from "@/data/lesson";
import { cn } from "@/lib/cn";

const RESULT = [
  "Created index.html, styles.css, app.js",
  "A task list with add, tick off and delete.",
  "Running at localhost:5173",
];

/** Slide 04 — the prompt, taken apart line by line. */
export function PromptAnatomySection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [output, setOutput] = useState<string[]>([]);
  const [explaining, setExplaining] = useState(false);
  const [activePart, setActivePart] = useState<string | null>(null);

  const handleRun = useCallback(() => {
    setOutput(RESULT);
  }, []);

  const handleReset = useCallback(() => {
    setOutput([]);
    setExplaining(false);
    setActivePart(null);
  }, []);

  const toggleExplain = useCallback(() => {
    setExplaining((current) => {
      if (current) setActivePart(null);
      return !current;
    });
  }, []);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="First command"
      title="The prompt"
      lead="The prompt is your first line of code now. A vague prompt builds a vague app — these four parts are the fix."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.22}>
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-navy-950/85 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2.5 border-b border-line/80 bg-navy-900/70 px-4 py-2.5 sm:px-5">
                <span className="h-2.5 w-2.5 rounded-full bg-vibe-violet/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-vibe-coral/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-2 font-mono text-[0.72rem] tracking-[0.18em] text-dim uppercase">
                  prompt
                </span>
              </div>

              <div className="px-4 py-6 sm:px-7 sm:py-8">
                {PROMPT_LINES.map((line) => {
                  const isActive = explaining && activePart === line.id;
                  return (
                    <p
                      key={line.id}
                      onMouseEnter={() => explaining && setActivePart(line.id)}
                      onMouseLeave={() => explaining && setActivePart(null)}
                      className={cn(
                        "rounded-[6px] px-2 py-1 font-mono text-[clamp(0.9rem,1.5vw,1.55rem)] leading-[1.6] transition-all duration-300",
                        explaining && "cursor-pointer",
                        isActive
                          ? "bg-vibe-coral/18 text-vibe-coral ring-1 ring-vibe-coral/55"
                          : "text-chalk",
                        explaining && !isActive && "opacity-55",
                      )}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <RunButton
                onRun={handleRun}
                label="Send Prompt"
                runningLabel="Thinking"
              />
              <ActionButton
                icon={Lightbulb}
                onClick={toggleExplain}
                active={explaining}
                aria-pressed={explaining}
              >
                {explaining ? "Hide Explanation" : "Explain This Prompt"}
              </ActionButton>
              <ActionButton icon={RotateCcw} variant="ghost" onClick={handleReset}>
                Reset
              </ActionButton>
            </div>
          </Reveal>

          <Reveal delay={0.36} className="mt-4">
            <OutputPanel
              lines={output}
              title="Result"
              size="md"
              minLines={2}
              placeholder="Press Send Prompt to see what comes back."
            />
          </Reveal>
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {explaining ? (
              <motion.div
                key="explaining"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-vibe-coral uppercase">
                  Prompt breakdown
                </p>
                <ExplanationPanel
                  items={PROMPT_PARTS}
                  activeId={activePart}
                  onHover={setActivePart}
                  onSelect={(id) =>
                    setActivePart((current) => (current === id ? null : id))
                  }
                  visible
                />
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="glass rounded-2xl p-5 sm:p-7"
              >
                <p className="text-[clamp(0.98rem,1.25vw,1.3rem)] leading-relaxed text-mist">
                  Four short lines, and the AI no longer has to guess what you
                  meant.
                </p>
                <p className="mt-4 text-[clamp(0.92rem,1.1vw,1.15rem)] leading-relaxed text-dim">
                  Press{" "}
                  <span className="text-vibe-coral">Explain This Prompt</span>{" "}
                  to take it apart, line by line.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PresentationSection>
  );
}
