import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { StepSequence } from "@/components/StepSequence";
import { CLAUDE_CODE_STEPS } from "@/data/lesson";

/** Slide 08 — the first of four slides on Claude Code, the workshop's spine. */
export function ClaudeCodeIntroSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Tool two — our main focus"
      title="Claude Code"
      lead="Claude Code is an AI teammate that lives in your terminal and works on your real project."
      width="wide"
    >
      <StepSequence
        steps={CLAUDE_CODE_STEPS}
        completeMessage="That is the loop: open, start, describe, review."
      />

      <Reveal delay={0.16}>
        <div className="glass mt-[clamp(1rem,2.5vh,1.75rem)] rounded-2xl border-vibe-coral/25 p-5 sm:p-6">
          <p className="font-mono text-[0.72rem] tracking-[0.24em] text-vibe-coral uppercase">
            Why it is different
          </p>
          <p className="mt-3 text-[clamp(0.95rem,1.2vw,1.25rem)] leading-relaxed text-mist">
            Lovable and Replit build something new from nothing. Cursor edits
            the file you have open. Claude Code works on{" "}
            <span className="text-chalk">the whole project</span> — it reads
            across files, runs your commands, and uses git, which is what makes
            it useful on code that already exists.
          </p>
        </div>
      </Reveal>
    </PresentationSection>
  );
}
