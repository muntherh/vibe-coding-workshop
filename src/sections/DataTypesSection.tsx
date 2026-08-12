import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { DATA_TYPES } from "@/data/lesson";
import { cn } from "@/lib/cn";

/** Slide 06 — the four values every beginner meets first. */
export function DataTypesSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((openId) => openId !== id)
        : [...current, id],
    );

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Kinds of values"
      title="Data types"
      lead="Every value in Python has a type. These four cover almost everything a beginner needs."
      width="wide"
    >
      <Reveal delay={0.22}>
        <p className="mb-[clamp(0.9rem,2vh,1.4rem)] font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
          Open any card
        </p>
      </Reveal>

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {DATA_TYPES.map((dataType, cardIndex) => {
          const isOpen = openIds.includes(dataType.id);
          const isBlue = dataType.accent === "blue";

          return (
            <li key={dataType.id} className="h-full">
              <Reveal delay={0.26 + cardIndex * 0.06} className="h-full">
                <div
                  className={cn(
                    "glass flex h-full flex-col rounded-2xl transition-colors duration-300",
                    isOpen
                      ? isBlue
                        ? "border-py-blue/50"
                        : "border-py-yellow/50"
                      : undefined,
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(dataType.id)}
                    aria-expanded={isOpen}
                    aria-controls={`datatype-${dataType.id}`}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 p-5 text-left sm:p-6"
                  >
                    <span className="min-w-0">
                      <span className="block text-[clamp(1.2rem,1.9vw,2rem)] font-semibold tracking-tight text-chalk">
                        {dataType.name}
                      </span>
                      <span
                        className={cn(
                          "mt-2 block truncate font-mono text-[clamp(1rem,1.5vw,1.6rem)]",
                          isBlue ? "text-py-blue-bright" : "text-py-yellow",
                        )}
                      >
                        {dataType.sample}
                      </span>
                      {/* Visible while closed too: the card should teach
                          something before anyone clicks it. */}
                      <span className="mt-3.5 block text-[clamp(0.88rem,1.05vw,1.15rem)] leading-snug text-mist">
                        {dataType.definition}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                        isOpen
                          ? "border-py-yellow/50 bg-py-yellow/12 text-py-yellow"
                          : "border-line bg-white/4 text-mist",
                      )}
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`datatype-${dataType.id}`}
                        initial={
                          reduceMotion ? false : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3.5 border-t border-line/70 p-5 sm:p-6">
                          <CodeBlock
                            code={dataType.code}
                            fileName={`${dataType.id}.py`}
                            size="sm"
                          />

                          <p className="flex items-start gap-2 text-[clamp(0.85rem,1vw,1.05rem)] leading-snug text-mist">
                            <span
                              aria-hidden="true"
                              className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full bg-py-yellow/70"
                            />
                            {dataType.comparison}
                          </p>

                          <p className="rounded-lg border border-line bg-navy-950/70 px-3 py-2 font-mono text-[clamp(0.78rem,0.95vw,1rem)] text-py-blue-bright">
                            {dataType.pythonType}
                          </p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </PresentationSection>
  );
}
