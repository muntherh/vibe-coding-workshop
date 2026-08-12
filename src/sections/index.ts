import type { ComponentType } from "react";
import type { SectionProps } from "@/components/PresentationSection";
import { ClaudeCodeContextSection } from "@/sections/ClaudeCodeContextSection";
import { ClaudeCodeIntroSection } from "@/sections/ClaudeCodeIntroSection";
import { ClaudeCodePlanSection } from "@/sections/ClaudeCodePlanSection";
import { ClaudeCodeToolbeltSection } from "@/sections/ClaudeCodeToolbeltSection";
import { FirstPromptSection } from "@/sections/FirstPromptSection";
import { HeroSection } from "@/sections/HeroSection";
import { HowItWorksSection } from "@/sections/HowItWorksSection";
import { PromptAnatomySection } from "@/sections/PromptAnatomySection";
import { QuizSection } from "@/sections/QuizSection";
import { ReplitSection } from "@/sections/ReplitSection";
import { ReplitVsClaudeCodeSection } from "@/sections/ReplitVsClaudeCodeSection";
import { SummarySection } from "@/sections/SummarySection";
import { ToolsSection } from "@/sections/ToolsSection";
import { WhatIsVibeCodingSection } from "@/sections/WhatIsVibeCodingSection";

/**
 * Slide components in running order. This array must stay aligned with
 * `SLIDES` in `data/slides.ts` — index N here is slide N there.
 */
export const SECTION_COMPONENTS: Array<ComponentType<SectionProps>> = [
  HeroSection,
  WhatIsVibeCodingSection,
  HowItWorksSection,
  PromptAnatomySection,
  FirstPromptSection,
  ToolsSection,
  ReplitSection,
  ClaudeCodeIntroSection,
  ClaudeCodePlanSection,
  ClaudeCodeContextSection,
  ClaudeCodeToolbeltSection,
  ReplitVsClaudeCodeSection,
  QuizSection,
  SummarySection,
];
