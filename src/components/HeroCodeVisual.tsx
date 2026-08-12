import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Widths of the abstract "code lines", as a share of the strip. */
const CODE_LINES = [
  { width: "58%", tone: "blue" },
  { width: "100%", tone: "yellow" },
  { width: "42%", tone: "blue" },
] as const;

const TONE_CLASS = {
  blue: "bg-gradient-to-r from-py-blue/70 to-py-blue/10",
  yellow: "bg-gradient-to-r from-py-yellow/60 to-py-yellow/8",
} as const;

/**
 * Original abstract visual for the hero: two oversized bracket glyphs holding
 * a small stack of "code lines" and a terminal caret. Nothing here is copied
 * artwork — it is all type and gradients.
 */
export function HeroCodeVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mx-auto flex w-full max-w-[360px] items-center justify-center gap-4 sm:gap-5"
    >
      <Bracket char="[" delay={1.15} reduceMotion={reduceMotion} />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
        {CODE_LINES.map((line, lineIndex) => (
          <motion.span
            key={line.width}
            className={`block h-[3px] rounded-full sm:h-[4px] ${TONE_CLASS[line.tone]}`}
            initial={reduceMotion ? false : { width: 0, opacity: 0 }}
            animate={{ width: line.width, opacity: 1 }}
            transition={{
              duration: 0.95,
              delay: 1.25 + lineIndex * 0.14,
              ease: EASE,
            }}
          />
        ))}

        <motion.span
          className="mt-1 flex items-center gap-2 font-mono text-[clamp(0.7rem,1vw,0.9rem)] tracking-[0.2em] text-dim uppercase"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.75, ease: EASE }}
        >
          <span className="text-py-blue">&gt;_</span>
          <span>ready</span>
          <motion.span
            className="inline-block h-[0.95em] w-[0.5em] bg-py-yellow/80"
            animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.15, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        </motion.span>
      </div>

      <Bracket char="]" delay={1.15} reduceMotion={reduceMotion} />
    </div>
  );
}

function Bracket({
  char,
  delay,
  reduceMotion,
}: {
  char: string;
  delay: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.span
      className="font-mono text-[clamp(2.6rem,5vw,4.4rem)] leading-none font-light text-py-blue/45"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {char}
    </motion.span>
  );
}
