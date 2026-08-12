import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  Check,
  CheckCheck,
  Copy,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { SUMMARY_CONCEPTS } from "@/data/lesson";
import { SLIDE_INDEX } from "@/data/slides";
import { useDeck } from "@/hooks/useDeckContext";

/** Where "Open Claude Code" sends the room. Swap for your own link if needed. */
const CLAUDE_CODE_URL = "https://claude.com/claude-code";

/**
 * The prompt the room copies at the end and runs for real.
 *
 * It is deliberately a *good* prompt, not merely a working one: it names the
 * thing, says who it is for, lists what it must do, and asks Claude Code to
 * explain itself and go one step at a time — the same habits taught earlier.
 */
const STARTER_PROMPT = `I am new to coding and this is my first time using Claude Code.

Build me a small personal task tracker I can run on my own machine.

It must let me:
- add a task
- tick a task off
- delete a task
- keep my tasks after I close the page

Please:
- tell me what you are about to do before you change anything
- keep the code simple and commented, because I want to read it
- use plain HTML, CSS and JavaScript, with no frameworks
- tell me exactly how to run it when you are done

Go one step at a time and check with me between steps.`;

/** Slide 14 — what the room learned, and the one thing to do next. */
export function SummarySection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const { goTo, quizResult } = useDeck();

  async function copyStarterPrompt() {
    try {
      await navigator.clipboard.writeText(STARTER_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked (insecure origin, denied permission).
      // The prompt is on screen and selectable, so this is not worth an alert.
      setCopied(false);
    }
  }

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Great work"
      title="You learned"
      lead="You have finished your first introduction to vibe coding."
      width="wide"
    >
      <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
        {SUMMARY_CONCEPTS.map((concept, conceptIndex) => (
          <motion.li
            key={concept.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.45,
              delay: reduceMotion ? 0 : conceptIndex * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            className="glass glass-hover rounded-2xl p-3.5"
          >
            <button
              type="button"
              onClick={() => goTo(concept.slideIndex)}
              className="w-full cursor-pointer text-left"
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ok/45 bg-ok/12 text-ok"
                >
                  <Check className="h-4 w-4" />
                </span>

                <span className="font-mono text-[clamp(0.85rem,1.05vw,1.1rem)] text-chalk">
                  {concept.label}
                </span>
              </span>

              <span className="mt-3 block text-[clamp(0.8rem,0.95vw,1rem)] leading-relaxed text-mist">
                {concept.recap}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-4 grid items-center gap-4 rounded-2xl border border-line bg-navy-900/45 p-4 lg:grid-cols-[1fr_auto] lg:gap-8">
          <div>
            <p className="text-[clamp(1.15rem,2vw,2rem)] leading-tight font-medium tracking-tight text-chalk">
              Now go and build something rough.
            </p>

            <p className="mt-2 max-w-2xl text-[clamp(0.9rem,1.1vw,1.15rem)] leading-relaxed text-mist">
              The first version is meant to be wrong. Describe it, run it, then
              say what to fix — that loop is the whole skill.
            </p>
          </div>

          {quizResult ? (
            <div className="flex items-center gap-4 rounded-2xl border border-vibe-coral/35 bg-vibe-coral/6 px-5 py-4">
              <Sparkles
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-vibe-coral"
              />

              <div>
                <p className="font-mono text-[0.7rem] tracking-[0.24em] text-dim uppercase">
                  Quiz score
                </p>

                <p className="mt-0.5 font-mono text-[clamp(1.35rem,2.2vw,2rem)] text-chalk tabular-nums">
                  <span className="text-vibe-coral">{quizResult.score}</span>
                  <span className="mx-1 text-dim">/</span>
                  <span className="text-dim">{quizResult.total}</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-[clamp(0.88rem,1.05vw,1.08rem)] text-dim">
              Finish the quiz to see your score here.
            </p>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.26}>
        <div className="mt-4 rounded-2xl border border-vibe-violet/25 bg-navy-950/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-[clamp(1.05rem,1.5vw,1.35rem)] font-semibold text-chalk">
                Your first real prompt
              </p>

              <p className="mt-1 text-sm text-mist">
                Copy this, open Claude Code in a project folder, and paste it in.
              </p>
            </div>

            <ActionButton
              icon={copied ? CheckCheck : Copy}
              variant={copied ? "accent" : "outline"}
              onClick={copyStarterPrompt}
            >
              {copied ? "Copied!" : "Copy Prompt"}
            </ActionButton>
          </div>

          <textarea
            value={STARTER_PROMPT}
            readOnly
            aria-label="Starter prompt for your first Claude Code session"
            className="mt-4 min-h-[180px] w-full resize-y rounded-xl border border-line bg-navy-950/80 p-4 font-mono text-[0.82rem] leading-6 text-chalk outline-none"
          />

          <div className="mt-3 grid gap-2 text-sm text-mist sm:grid-cols-4">
            <span>1. Copy the prompt</span>
            <span>2. Open a project folder</span>
            <span>3. Run claude</span>
            <span>4. Paste it in and go</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.28}>
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            variant="accent"
            icon={RotateCcw}
            onClick={() => goTo(SLIDE_INDEX["what-is-vibe-coding"] ?? 1)}
          >
            Practice Again
          </ActionButton>

          <ActionButton
            variant="outline"
            icon={ExternalLink}
            onClick={() =>
              window.open(CLAUDE_CODE_URL, "_blank", "noopener,noreferrer")
            }
          >
            Open Claude Code
          </ActionButton>
        </div>
      </Reveal>

      <Reveal delay={0.34}>
        <p className="mt-3 font-mono text-[0.7rem] tracking-[0.18em] text-dim uppercase">
          Describe → Generate → Run → Refine
        </p>
      </Reveal>
    </PresentationSection>
  );
}
