import { CardExplorer } from "@/components/CardExplorer";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { USE_CASES } from "@/data/lesson";

/** Slide 02 — what vibe coding actually is, and where people use it. */
export function WhatIsVibeCodingSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="The idea"
      title="What is vibe coding?"
      lead="You describe what you want in plain language, and an AI writes the code for you."
      width="wide"
    >
      <CardExplorer
        cards={USE_CASES}
        hint="Pick one to see an example"
        placeholder="One skill — describing what you want — used in very different places."
      />
    </PresentationSection>
  );
}
