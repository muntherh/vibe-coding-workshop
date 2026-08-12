import { motion, useReducedMotion } from "framer-motion";
import { Lock, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { CodeBlock } from "@/components/CodeBlock";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { PROJECT_RULES } from "@/data/lesson";
import { cn } from "@/lib/cn";
import { formatProjectRules } from "@/lib/simulate";

const REFUSAL = "That rule lives in CLAUDE.md.";
const REASON = "Claude Code reads it before every task and will not quietly go around it.";

/** Slide 10 — CLAUDE.md: the rules that survive between sessions. */
export function ClaudeCodeContextSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attemptBreak = useCallback((ruleIndex: number) => {
    setAttempts((count) => count + 1);
    setShakeIndex(ruleIndex);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShakeIndex(null), 420);
  }, []);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Claude Code — deep dive"
      title="CLAUDE.md"
      lead="A file of project rules Claude Code reads every time. Write them once, and they hold for every task after."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
            Try to break one
          </p>

          <ul className="flex flex-wrap gap-2.5 sm:gap-3">
            {PROJECT_RULES.map((rule, ruleIndex) => {
              const isShaking = shakeIndex === ruleIndex;

              return (
                <li key={rule}>
                  <motion.button
                    type="button"
                    onClick={() => attemptBreak(ruleIndex)}
                    aria-label={`Try to break the rule: ${rule}`}
                    animate={
                      isShaking && !reduceMotion
                        ? { x: [0, -7, 6, -4, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border py-3.5 pr-4 pl-4 transition-colors duration-200",
                      isShaking
                        ? "border-bad/60 bg-bad/10"
                        : "border-line bg-navy-900/60 hover:border-vibe-coral/45",
                    )}
                  >
                    <span className="font-mono text-[clamp(0.9rem,1.15vw,1.25rem)] text-chalk">
                      {rule}
                    </span>
                    <Lock
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 transition-colors duration-200",
                        isShaking ? "text-bad" : "text-vibe-coral/70",
                      )}
                    />
                  </motion.button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ActionButton
              icon={RotateCcw}
              variant="ghost"
              onClick={() => {
                setAttempts(0);
                setShakeIndex(null);
              }}
              disabled={attempts === 0}
            >
              Clear
            </ActionButton>
            <p className="text-[clamp(0.85rem,1vw,1.05rem)] text-dim">
              {attempts === 0
                ? "Every rule is in force. Click one and see."
                : `Blocked ${attempts} ${attempts === 1 ? "time" : "times"}. The rules hold.`}
            </p>
          </div>

          <Reveal delay={0.3}>
            <div className="glass mt-5 rounded-2xl p-5 sm:p-6">
              <p className="text-[clamp(0.9rem,1.12vw,1.18rem)] leading-relaxed text-mist">
                Put the things you would otherwise repeat every single session
                in here — the stack you use, the commands that run the project,
                the house style, and the things that are off-limits.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.24}>
            <CodeBlock
              code={formatProjectRules(PROJECT_RULES)}
              variant="prompt"
              fileName="CLAUDE.md"
              size="md"
            />
          </Reveal>

          <Reveal delay={0.32}>
            <OutputPanel
              lines={
                attempts > 0
                  ? [REFUSAL, REASON]
                  : [`Loaded CLAUDE.md — ${PROJECT_RULES.length} project rules in effect.`]
              }
              tone={attempts > 0 ? "error" : "normal"}
              title={attempts > 0 ? "Blocked" : "Claude Code"}
              minLines={2}
              placeholder=""
              size="md"
            />
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
