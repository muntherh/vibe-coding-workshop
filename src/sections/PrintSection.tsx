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
import { PRINT_PARTS, type PrintPartId } from "@/data/lesson";
import { cn } from "@/lib/cn";
import { printText } from "@/lib/simulate";

const MESSAGE = "Hello, Python!";

/** Each clickable piece of `print("Hello, Python!")`, in source order. */
const SEGMENTS: Array<{ id: PrintPartId; text: string; className: string }> = [
  { id: "print", text: "print", className: "text-py-blue-bright" },
  { id: "parens", text: "(", className: "text-py-yellow" },
  { id: "quotes", text: '"', className: "text-[#8ce0a8]" },
  { id: "text", text: MESSAGE, className: "text-[#8ce0a8]" },
  { id: "quotes", text: '"', className: "text-[#8ce0a8]" },
  { id: "parens", text: ")", className: "text-py-yellow" },
];

/** Slide 04 — the first line of code, taken apart piece by piece. */
export function PrintSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [output, setOutput] = useState<string[]>([]);
  const [explaining, setExplaining] = useState(false);
  const [activePart, setActivePart] = useState<string | null>(null);

  const handleRun = useCallback(() => {
    setOutput([printText(MESSAGE)]);
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
      title="print()"
      lead="print() shows a value on the screen. It is the first line of code most people ever write."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.22}>
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-navy-950/85 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2.5 border-b border-line/80 bg-navy-900/70 px-4 py-2.5 sm:px-5">
                <span className="h-2.5 w-2.5 rounded-full bg-py-blue/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-py-yellow/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-2 font-mono text-[0.72rem] tracking-[0.18em] text-dim uppercase">
                  hello.py
                </span>
              </div>

              <div className="overflow-x-auto px-4 py-7 sm:px-7 sm:py-9">
                <p className="font-mono text-[clamp(1.05rem,2.35vw,2.4rem)] leading-none whitespace-nowrap">
                  {SEGMENTS.map((segment, segmentIndex) => {
                    const isActive = explaining && activePart === segment.id;
                    return (
                      <span
                        key={`${segment.id}-${segmentIndex}`}
                        onMouseEnter={() =>
                          explaining && setActivePart(segment.id)
                        }
                        onMouseLeave={() => explaining && setActivePart(null)}
                        className={cn(
                          "rounded-[4px] px-[0.06em] py-[0.12em] transition-all duration-300",
                          segment.className,
                          explaining && "cursor-pointer",
                          isActive &&
                            "bg-py-yellow/20 text-py-yellow ring-1 ring-py-yellow/55",
                          explaining && !isActive && "opacity-55",
                        )}
                      >
                        {segment.text}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <RunButton onRun={handleRun} />
              <ActionButton
                icon={Lightbulb}
                onClick={toggleExplain}
                active={explaining}
                aria-pressed={explaining}
              >
                {explaining ? "Hide Explanation" : "Explain This Code"}
              </ActionButton>
              <ActionButton icon={RotateCcw} variant="ghost" onClick={handleReset}>
                Reset
              </ActionButton>
            </div>
          </Reveal>

          <Reveal delay={0.36} className="mt-4">
            <OutputPanel
              lines={output}
              size="lg"
              minLines={1}
              placeholder="Press Run Code to see the output."
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
                <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-py-yellow uppercase">
                  Line breakdown
                </p>
                <ExplanationPanel
                  items={PRINT_PARTS}
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
                  This one line tells the computer to display some text.
                </p>
                <p className="mt-4 text-[clamp(0.92rem,1.1vw,1.15rem)] leading-relaxed text-dim">
                  Press{" "}
                  <span className="text-py-yellow">Explain This Code</span> to
                  take it apart, piece by piece.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PresentationSection>
  );
}
