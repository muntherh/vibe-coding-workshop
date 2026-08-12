import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { StepSequence } from "@/components/StepSequence";
import { HOW_IT_WORKS_STEPS } from "@/data/lesson";

/** Slide 03 — the four-step loop from a sentence to a running thing. */
export function HowItWorksSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="The process"
      title="How vibe coding works"
      lead="Every session follows the same four steps, however big the idea is."
      width="wide"
    >
      <StepSequence
        steps={HOW_IT_WORKS_STEPS}
        completeMessage="That is the whole loop. Describe, generate, run, refine."
      />
    </PresentationSection>
  );
}
