import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { ActionButton } from "@/components/ActionButton";
import { HeroCodeVisual } from "@/components/HeroCodeVisual";
import { HeroWordmark } from "@/components/HeroWordmark";
import type { SectionProps } from "@/components/PresentationSection";
import { useDeck } from "@/hooks/useDeckContext";
import { useElementHeight } from "@/hooks/useElementHeight";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Slide 01 — the opening statement. */
export function HeroSection({ registerRef }: SectionProps) {
  const { next } = useDeck();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // 0 while the hero fills the screen, 1 once it has scrolled fully away.
  //
  // Window scroll rather than a target-relative scroll: framer stops updating
  // a target-based progress once the element leaves the viewport, which would
  // freeze the wordmark part-way through its move.
  const { scrollY } = useScroll();
  const heroHeight = useElementHeight(sectionRef, 1);
  const progress = useTransform(scrollY, [0, Math.max(heroHeight, 1)], [0, 1], {
    clamp: true,
  });

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      ref={(node) => {
        sectionRef.current = node;
        registerRef(node);
      }}
      aria-labelledby="hero-heading"
      className="deck-slide relative flex min-h-[var(--vh-full)] w-full flex-col"
    >
      <h1 id="hero-heading" className="sr-only">
        Introduction to Vibe Coding — Build Software by Describing It
      </h1>

      <HeroWordmark progress={progress} />

      <div
        className="relative z-20 mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-start px-5 text-center sm:px-8"
        style={{
          paddingTop: "var(--hero-pad-top)",
          paddingBottom: "calc(var(--chrome-bottom) - 1rem)",
        }}
      >
        
        <motion.p
          {...fadeUp(1.0)}
          className="flex items-center gap-4 font-display text-[clamp(1.15rem,2.6vw,2.4rem)] font-light tracking-[0.34em] text-vibe-coral uppercase"
        >
          <span aria-hidden="true" className="h-px w-8 bg-vibe-coral/40 sm:w-14" />
          Introduction
          <span aria-hidden="true" className="h-px w-8 bg-vibe-coral/40 sm:w-14" />
        </motion.p>

        <motion.p
          {...fadeUp(1.12)}
          className="mt-[clamp(0.85rem,2vh,2rem)] max-w-[24ch] text-[clamp(1.15rem,2.15vw,2.15rem)] leading-[1.25] font-medium tracking-[-0.02em] text-chalk text-balance-tight sm:max-w-[30ch]"
        >
          Build software by describing it
        </motion.p>

        <motion.p
          {...fadeUp(1.24)}
          className="mt-[clamp(0.5rem,1.6vh,1.1rem)] max-w-[46ch] text-[clamp(0.95rem,1.25vw,1.3rem)] leading-relaxed text-mist"
        >
          Learn to turn plain language into working apps — with Replit and
          Claude Code.
        </motion.p>

        <motion.div
          {...fadeUp(1.38)}
          className="mt-[clamp(1.1rem,2.6vh,2.6rem)] flex flex-col items-center gap-3.5"
        >
          <ActionButton
            variant="accent"
            size="lg"
            icon={ArrowDown}
            onClick={next}
            className="glow-accent"
          >
            Start Learning
          </ActionButton>
          <p className="font-mono text-[0.72rem] tracking-[0.18em] text-dim uppercase">
            or press <kbd className="text-mist">→</kbd> ·{" "}
            <kbd className="text-mist">space</kbd>
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(1.5)}
          className="mt-[clamp(2rem,6vh,3rem)] w-full sm:mt-auto sm:pt-[clamp(0.75rem,1.8vh,2.5rem)]"
        >
          <HeroCodeVisual />
        </motion.div>
      </div>
    </section>
  );
}
