import { motion, useInView, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { HOW_CODE_STEPS } from "@/data/lesson";
import { cn } from "@/lib/cn";

const STEP_DELAY_MS = 900;

/** Slide 03 — the four-step journey from typed code to visible result. */
export function HowCodeWorksSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(bodyRef, { amount: 0.35 });
  const [revealed, setRevealed] = useState(0);
  const [playToken, setPlayToken] = useState(0);

  // Play whenever the slide comes into view, and again on every Replay.
  // Restarting on re-entry is deliberate: a presenter often steps back a
  // slide and wants the build to run again.
  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setRevealed(HOW_CODE_STEPS.length);
      return;
    }

    setRevealed(0);
    const timers = HOW_CODE_STEPS.map((_, stepIndex) =>
      setTimeout(
        () => setRevealed(stepIndex + 1),
        320 + stepIndex * STEP_DELAY_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, playToken, reduceMotion]);

  const complete = revealed >= HOW_CODE_STEPS.length;

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="The process"
      title="How code works"
      lead="Every program follows the same four steps, every single time."
      width="wide"
    >
      <div ref={bodyRef}>
        <ol className="grid gap-3 sm:gap-4 lg:grid-cols-4">
          {HOW_CODE_STEPS.map((step, stepIndex) => {
            const isVisible = stepIndex < revealed;
            const isCurrent = stepIndex === revealed - 1 && !complete;

            return (
              <motion.li
                key={step.id}
                className="relative"
                initial={false}
                animate={{
                  opacity: isVisible ? 1 : 0.24,
                  y: isVisible || reduceMotion ? 0 : 14,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Connector between steps on wide screens. */}
                {stepIndex < HOW_CODE_STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -right-2 hidden h-px w-4 bg-line lg:block"
                  />
                ) : null}

                <div
                  className={cn(
                    "glass flex h-full flex-col gap-3 rounded-2xl p-4 transition-colors duration-500 sm:p-6",
                    isVisible ? "border-py-blue/30" : "border-line/60",
                    isCurrent && "border-py-yellow/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-[0.85rem] transition-colors duration-500",
                      isVisible
                        ? "border-py-blue/45 bg-py-blue/12 text-py-blue"
                        : "border-line bg-white/4 text-dim",
                    )}
                  >
                    {stepIndex + 1}
                  </span>

                  <p className="text-[clamp(1rem,1.35vw,1.42rem)] leading-snug font-semibold text-chalk">
                    {step.title}
                  </p>
                  <p className="text-[clamp(0.88rem,1.05vw,1.1rem)] leading-snug text-mist">
                    {step.detail}
                  </p>

                  <code
                    className={cn(
                      "mt-auto block truncate rounded-lg border px-3 py-2 font-mono text-[clamp(0.78rem,0.95vw,1rem)] transition-colors duration-500",
                      isVisible
                        ? "border-line bg-navy-950/70 text-py-blue-bright"
                        : "border-line/50 bg-navy-950/40 text-dim",
                    )}
                  >
                    {step.sample}
                  </code>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-[clamp(1.25rem,3vh,2.25rem)] flex flex-wrap items-center gap-4">
            <ActionButton
              icon={RotateCcw}
              onClick={() => setPlayToken((token) => token + 1)}
            >
              Replay
            </ActionButton>
            <p
              className="text-[clamp(0.88rem,1.05vw,1.1rem)] text-mist"
              aria-live="polite"
            >
              {complete
                ? "That is the whole loop. Write, read, follow, see."
                : `Step ${Math.max(revealed, 1)} of ${HOW_CODE_STEPS.length}`}
            </p>
          </div>
        </Reveal>
      </div>
    </PresentationSection>
  );
}
