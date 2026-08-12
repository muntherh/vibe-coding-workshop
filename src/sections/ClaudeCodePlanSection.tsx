import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Pencil, Plus, RotateCcw, X } from "lucide-react";
import { useRef, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { CodeBlock } from "@/components/CodeBlock";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { DEFAULT_PLAN, PLAN_SUGGESTIONS } from "@/data/lesson";
import { cleanInput, formatPlan, simulatePlanRun } from "@/lib/simulate";

const MAX_STEPS = 6;

interface PlanStep {
  key: string;
  value: string;
}

let keyCounter = 0;
const makeSteps = (values: string[]): PlanStep[] =>
  values.map((value) => ({ key: `step-${keyCounter++}`, value }));

/** Slide 09 — the plan Claude Code writes first, and how you edit it. */
export function ClaudeCodePlanSection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [steps, setSteps] = useState<PlanStep[]>(() => makeSteps(DEFAULT_PLAN));
  const [draft, setDraft] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const values = steps.map((step) => step.value);

  const nextSuggestion =
    PLAN_SUGGESTIONS.find((suggestion) => !values.includes(suggestion)) ??
    "Write the docs";

  const addStep = () => {
    if (steps.length >= MAX_STEPS) return;
    const value = draft.trim() === "" ? nextSuggestion : draft.trim();
    setSteps((current) => [...current, ...makeSteps([value])]);
    setDraft("");
  };

  const removeStep = (key: string) => {
    setSteps((current) => current.filter((step) => step.key !== key));
    if (editingKey === key) setEditingKey(null);
  };

  const startEdit = (step: PlanStep) => {
    setEditingKey(step.key);
    setEditValue(step.value);
    window.requestAnimationFrame(() => editInputRef.current?.select());
  };

  const commitEdit = () => {
    if (editingKey === null) return;
    const trimmed = editValue.trim();
    setSteps((current) =>
      current.map((step) =>
        step.key === editingKey
          ? { ...step, value: trimmed === "" ? step.value : trimmed }
          : step,
      ),
    );
    setEditingKey(null);
  };

  const reset = () => {
    setSteps(makeSteps(DEFAULT_PLAN));
    setDraft("");
    setEditingKey(null);
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Claude Code — deep dive"
      title="Working in steps"
      lead="Give Claude Code a real task and it writes a plan before it edits anything. The plan is yours to change."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="min-w-0">
          <ul className="flex flex-wrap gap-2.5 sm:gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {steps.map((step, stepIndex) => {
                const isEditing = editingKey === step.key;

                return (
                  <motion.li
                    key={step.key}
                    layout={!reduceMotion}
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.9, y: -8 }
                    }
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex items-center gap-3 rounded-xl border border-line bg-navy-900/60 py-3.5 pr-3 pl-4 transition-colors duration-200 hover:border-vibe-violet/45"
                  >
                    <span className="font-mono text-[0.75rem] text-dim tabular-nums">
                      {stepIndex + 1}
                    </span>

                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        value={editValue}
                        onChange={(event) =>
                          setEditValue(cleanInput(event.target.value, 24))
                        }
                        onBlur={commitEdit}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") commitEdit();
                          if (event.key === "Escape") setEditingKey(null);
                        }}
                        aria-label={`Edit step ${stepIndex + 1}`}
                        autoFocus
                        className="w-[14ch] rounded-md border border-vibe-coral/50 bg-navy-950 px-2 py-1 font-mono text-[clamp(0.85rem,1vw,1.05rem)] text-chalk focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono text-[clamp(0.9rem,1.15vw,1.25rem)] text-chalk">
                        {step.value}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          isEditing ? commitEdit() : startEdit(step)
                        }
                        aria-label={
                          isEditing
                            ? `Save step ${stepIndex + 1}`
                            : `Edit step ${stepIndex + 1}, ${step.value}`
                        }
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-dim transition-colors duration-200 hover:bg-white/8 hover:text-vibe-coral"
                      >
                        {isEditing ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Pencil className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStep(step.key)}
                        aria-label={`Remove step ${stepIndex + 1}, ${step.value}`}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-dim transition-colors duration-200 hover:bg-white/8 hover:text-bad"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>

            {steps.length === 0 ? (
              <li className="rounded-xl border border-dashed border-line px-4 py-3 font-mono text-[0.95rem] text-dim">
                The plan is empty
              </li>
            ) : null}
          </ul>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="flex min-w-[10rem] flex-1 flex-col gap-2 sm:max-w-[18rem]">
              <label
                htmlFor="plan-new-step"
                className="font-mono text-[0.72rem] tracking-[0.2em] text-dim uppercase"
              >
                New step
              </label>
              <input
                id="plan-new-step"
                type="text"
                value={draft}
                placeholder={nextSuggestion}
                onChange={(event) =>
                  setDraft(cleanInput(event.target.value, 24))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") addStep();
                }}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-line bg-navy-950/70 px-3.5 py-2.5 font-mono text-[clamp(0.85rem,1vw,1.05rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-vibe-violet/40 focus:border-vibe-violet/70 focus:outline-none"
              />
            </div>

            <ActionButton
              icon={Plus}
              variant="primary"
              onClick={addStep}
              disabled={steps.length >= MAX_STEPS}
            >
              Add Step
            </ActionButton>
            <ActionButton icon={RotateCcw} variant="ghost" onClick={reset}>
              Reset
            </ActionButton>
          </div>

          <p className="mt-3 text-[clamp(0.85rem,1vw,1.05rem)] text-dim">
            {steps.length >= MAX_STEPS
              ? "That is plenty for one task. Small tasks beat big ones."
              : "Use the pencil to reword a step, or the cross to drop it."}
          </p>

          <Reveal delay={0.3}>
            <div className="glass mt-5 rounded-2xl p-5 sm:p-6">
              <p className="text-[clamp(0.9rem,1.1vw,1.15rem)] leading-relaxed text-mist">
                Read the plan before you approve it. Fixing a wrong step costs
                far less than fixing a wrong pile of code.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.24}>
            <CodeBlock
              code={formatPlan(values)}
              variant="prompt"
              fileName="plan"
              size="md"
            />
          </Reveal>
          <Reveal delay={0.32}>
            <OutputPanel
              lines={simulatePlanRun(values)}
              title="Claude Code"
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
