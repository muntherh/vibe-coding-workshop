import { CardExplorer } from "@/components/CardExplorer";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { CLAUDE_CODE_TOOLBELT } from "@/data/lesson";

/** Slide 11 — the parts of Claude Code people reach for every day. */
export function ClaudeCodeToolbeltSection({
  index,
  registerRef,
}: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Claude Code — deep dive"
      title="What else it can do"
      lead="Writing code is the smallest part. These are the pieces that turn it from a chatbot into a teammate."
      width="wide"
    >
      <CardExplorer
        cards={CLAUDE_CODE_TOOLBELT}
        hint="Pick one to see how you would ask for it"
        placeholder="Everything here is asked for in the same way: plain language, in the terminal."
      />
    </PresentationSection>
  );
}
