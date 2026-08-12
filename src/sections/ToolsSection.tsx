import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { TOOLS } from "@/data/lesson";
import { cn } from "@/lib/cn";

/** Slide 06 — the four tools, and which one this workshop is really about. */
export function ToolsSection({ index, registerRef }: SectionProps) {
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
      eyebrow="The landscape"
      title="The tools"
      lead="Four tools people vibe code with. The rest of this workshop is about the last two — and mostly about Claude Code."
      width="wide"
    >
      <Reveal delay={0.22}>
        <p className="mb-[clamp(0.9rem,2vh,1.4rem)] font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
          Open any card
        </p>
      </Reveal>

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {TOOLS.map((tool, cardIndex) => {
          const isOpen = openIds.includes(tool.id);
          const isViolet = tool.accent === "violet";

          return (
            <li key={tool.id} className="h-full">
              <Reveal delay={0.26 + cardIndex * 0.06} className="h-full">
                <div
                  className={cn(
                    "glass flex h-full flex-col rounded-2xl transition-colors duration-300",
                    tool.focus && "border-vibe-coral/45",
                    isOpen &&
                      (isViolet
                        ? "border-vibe-violet/50"
                        : "border-vibe-coral/50"),
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(tool.id)}
                    aria-expanded={isOpen}
                    aria-controls={`tool-${tool.id}`}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 p-5 text-left sm:p-6"
                  >
                    <span className="min-w-0">
                      <span className="block text-[clamp(1.2rem,1.9vw,2rem)] font-semibold tracking-tight text-chalk">
                        {tool.name}
                      </span>
                      <span
                        className={cn(
                          "mt-2 block truncate font-mono text-[clamp(0.85rem,1.1vw,1.15rem)]",
                          isViolet
                            ? "text-vibe-violet-bright"
                            : "text-vibe-coral",
                        )}
                      >
                        {tool.tagline}
                      </span>
                      {/* Visible while closed too: the card should teach
                          something before anyone clicks it. */}
                      <span className="mt-3.5 block text-[clamp(0.88rem,1.05vw,1.15rem)] leading-snug text-mist">
                        {tool.definition}
                      </span>
                      {tool.focus ? (
                        <span className="mt-3.5 inline-block rounded-md border border-vibe-coral/45 bg-vibe-coral/10 px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.14em] text-vibe-coral uppercase">
                          Main focus
                        </span>
                      ) : null}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                        isOpen
                          ? "border-vibe-coral/50 bg-vibe-coral/12 text-vibe-coral"
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
                        id={`tool-${tool.id}`}
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
                            code={tool.promptExample}
                            variant="prompt"
                            fileName="prompt"
                            size="sm"
                          />

                          <p className="flex items-start gap-2 text-[clamp(0.85rem,1vw,1.05rem)] leading-snug text-mist">
                            <span
                              aria-hidden="true"
                              className="mt-[0.35em] h-1.5 w-1.5 shrink-0 rounded-full bg-vibe-coral/70"
                            />
                            {tool.comparison}
                          </p>

                          <p className="rounded-lg border border-line bg-navy-950/70 px-3 py-2 font-mono text-[clamp(0.75rem,0.9vw,0.95rem)] text-vibe-violet-bright">
                            {tool.bestFor}
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
