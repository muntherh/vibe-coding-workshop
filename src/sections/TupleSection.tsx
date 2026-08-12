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
import { cn } from "@/lib/cn";
import { reprTuple, tupleLiteral } from "@/lib/simulate";

const COLORS = ["Blue", "Yellow", "White"];

const CODE = [
  `colors = ${tupleLiteral(COLORS)}`,
  "print(colors)",
  "",
  '# colors[0] = "Green"  <- Python stops here',
].join("\n");

const REFUSAL = "A tuple cannot be changed after it is created.";
const TRACEBACK = "TypeError: 'tuple' object does not support item assignment";

/** Slide 09 — the locked collection, and what happens when you push on it. */
export function TupleSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const attemptEdit = useCallback((itemIndex: number) => {
    setAttempts((count) => count + 1);
    setShakeIndex(itemIndex);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShakeIndex(null), 420);
  }, []);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Collections"
      title="Tuple"
      lead="A tuple stores multiple items, but it cannot normally be changed after it is created."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
            Try to change one
          </p>

          <ul className="flex flex-wrap gap-2.5 sm:gap-3">
            {COLORS.map((color, colorIndex) => {
              const isShaking = shakeIndex === colorIndex;

              return (
                <li key={color}>
                  <motion.button
                    type="button"
                    onClick={() => attemptEdit(colorIndex)}
                    aria-label={`Try to change item ${colorIndex}, ${color}`}
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
                        : "border-line bg-navy-900/60 hover:border-py-yellow/45",
                    )}
                  >
                    <span className="font-mono text-[0.75rem] text-dim tabular-nums">
                      {colorIndex}
                    </span>
                    <span className="font-mono text-[clamp(0.98rem,1.35vw,1.5rem)] text-chalk">
                      {color}
                    </span>
                    <Lock
                      aria-hidden="true"
                      className={cn(
                        "h-3.5 w-3.5 transition-colors duration-200",
                        isShaking ? "text-bad" : "text-py-yellow/70",
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
                ? "Every item is locked. Click one and see."
                : `Blocked ${attempts} ${attempts === 1 ? "time" : "times"}. Python will not budge.`}
            </p>
          </div>

          <Reveal delay={0.3}>
            <div className="glass mt-5 rounded-2xl p-5 sm:p-6">
              <p className="text-[clamp(0.92rem,1.12vw,1.18rem)] leading-relaxed text-mist">
                Use a tuple when the values should stay fixed — days of the
                week, the colours of a flag, a pair of coordinates.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.24}>
            <CodeBlock
              code={CODE}
              fileName="colors.py"
              emphasis="parentheses"
              size="md"
            />
          </Reveal>

          <Reveal delay={0.32}>
            <OutputPanel
              lines={
                attempts > 0 ? [REFUSAL, TRACEBACK] : [reprTuple(COLORS)]
              }
              tone={attempts > 0 ? "error" : "normal"}
              title={attempts > 0 ? "Error" : "Output"}
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
