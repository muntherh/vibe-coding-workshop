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
import { SLIDE_INDEX } from "@/data/slides";
import { useDeck } from "@/hooks/useDeckContext";

/* ضع رابط Journey AI الحقيقي هنا */
const JOURNEY_AI_URL = "https://journey-ai.replit.app";
const JOURNEY_AI_PROMPT = `I am a complete beginner in Python.

Create a simple 6-week learning roadmap for me.

My goal is to understand Python fundamentals and build one small beginner project.

I can study 30 minutes per day, 5 days per week.

Please include:

- Python basics
- Variables and data types
- Strings
- Lists and tuples
- Input and output
- Conditions
- Loops
- Functions
- One small final project

For each week, include:

- Clear learning goals
- Simple tasks
- One beginner-friendly practice activity
- Recommended free learning resources
- A short weekly check-in

Keep everything simple, practical, and suitable for a complete beginner.`;
/** Slide 12 — final learning summary and next steps. */
export function SummarySection({ index, registerRef }: SectionProps) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const { goTo, quizResult } = useDeck();

  const learnedConcepts = [
    {
      label: "print()",
      description: "Display information on the screen.",
    },
    {
      label: "Variables",
      description: "Store information for later use.",
    },
    {
      label: "Data Types",
      description: "Understand text, numbers, and true or false values.",
    },
    {
      label: "Lists",
      description: "Store multiple items that can be changed.",
    },
    {
      label: "Tuples",
      description: "Store multiple items that normally cannot be changed.",
    },
  ];

  function openJourneyAI() {
    if (!JOURNEY_AI_URL.startsWith("https")) {
      window.alert("Add the Journey AI URL inside SummarySection.tsx first.");
      return;
    }

    window.open(JOURNEY_AI_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Great work"
      title="You learned"
      lead="You have completed your first introduction to Python."
      width="wide"
    >
      <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
        {learnedConcepts.map((concept, conceptIndex) => (
          <motion.li
            key={concept.label}
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
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ok/45 bg-ok/12 text-ok"
              >
                <Check className="h-4 w-4" />
              </span>

              <span className="font-mono text-[clamp(0.95rem,1.2vw,1.2rem)] text-chalk">
                {concept.label}
              </span>
            </span>

            <p className="mt-3 text-[clamp(0.8rem,0.95vw,1rem)] leading-relaxed text-mist">
              {concept.description}
            </p>
          </motion.li>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-4 grid items-center gap-4 rounded-2xl border border-line bg-navy-900/45 p-4 lg:grid-cols-[1fr_auto] lg:gap-8">
          <div>
            <p className="text-[clamp(1.15rem,2vw,2rem)] leading-tight font-medium tracking-tight text-chalk">
              Your Python journey has just started.
            </p>

            <p className="mt-2 max-w-2xl text-[clamp(0.9rem,1.1vw,1.15rem)] leading-relaxed text-mist">
              Practice the basics again or continue with a personalized learning
              roadmap in Journey AI.
            </p>
          </div>

          {quizResult ? (
            <div className="flex items-center gap-4 rounded-2xl border border-py-yellow/35 bg-py-yellow/6 px-5 py-4">
              <Sparkles
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-py-yellow"
              />

              <div>
                <p className="font-mono text-[0.7rem] tracking-[0.24em] text-dim uppercase">
                  Quiz score
                </p>

                <p className="mt-0.5 font-mono text-[clamp(1.35rem,2.2vw,2rem)] text-chalk tabular-nums">
                  <span className="text-py-yellow">{quizResult.score}</span>
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
  <div className="mt-4 rounded-2xl border border-py-blue/25 bg-navy-950/70 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-display text-[clamp(1.05rem,1.5vw,1.35rem)] font-semibold text-chalk">
          Continue with Journey AI
        </p>

        <p className="mt-1 text-sm text-mist">
          Copy this prompt and paste it into Journey AI to create your learning roadmap.
        </p>
      </div>

      <ActionButton
        icon={copied ? CheckCheck : Copy}
        variant={copied ? "accent" : "outline"}
        onClick={async () => {
          await navigator.clipboard.writeText(JOURNEY_AI_PROMPT);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Copied!" : "Copy Prompt"}
      </ActionButton>
    </div>

    <textarea
      value={JOURNEY_AI_PROMPT}
      readOnly
      aria-label="Journey AI Python learning prompt"
      className="mt-4 min-h-[180px] w-full resize-y rounded-xl border border-line bg-navy-950/80 p-4 font-mono text-[0.82rem] leading-6 text-chalk outline-none"
    />

    <div className="mt-3 grid gap-2 text-sm text-mist sm:grid-cols-4">
      <span>1. Copy the prompt</span>
      <span>2. Open Journey AI</span>
      <span>3. Paste the prompt</span>
      <span>4. Generate your roadmap</span>
    </div>
  </div>
</Reveal>
      <Reveal delay={0.28}>
        <div className="mt-4 flex flex-wrap gap-3">
          <ActionButton
            variant="accent"
            icon={RotateCcw}
            onClick={() => goTo(SLIDE_INDEX["what-is-python"] ?? 1)}
          >
            Practice Again
          </ActionButton>

          <ActionButton
            variant="outline"
            icon={ExternalLink}
            onClick={openJourneyAI}
          >
            Continue with Journey AI
          </ActionButton>
        </div>
      </Reveal>

      <Reveal delay={0.34}>
        <p className="mt-3 font-mono text-[0.7rem] tracking-[0.18em] text-dim uppercase">
          Learn → Practice → Build your roadmap
        </p>
      </Reveal>
    </PresentationSection>
  );
}