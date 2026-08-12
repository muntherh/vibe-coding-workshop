import type { ComponentType } from "react";
import type { SectionProps } from "@/components/PresentationSection";
import { DataTypesSection } from "@/sections/DataTypesSection";
import { HeroSection } from "@/sections/HeroSection";
import { HowCodeWorksSection } from "@/sections/HowCodeWorksSection";
import { ListSection } from "@/sections/ListSection";
import { ListVsTupleSection } from "@/sections/ListVsTupleSection";
import { PrintSection } from "@/sections/PrintSection";
import { QuizSection } from "@/sections/QuizSection";
import { StringSection } from "@/sections/StringSection";
import { SummarySection } from "@/sections/SummarySection";
import { TupleSection } from "@/sections/TupleSection";
import { VariablesSection } from "@/sections/VariablesSection";
import { WhatIsPythonSection } from "@/sections/WhatIsPythonSection";

/**
 * Slide components in running order. This array must stay aligned with
 * `SLIDES` in `data/slides.ts` — index N here is slide N there.
 */
export const SECTION_COMPONENTS: Array<ComponentType<SectionProps>> = [
  HeroSection,
  WhatIsPythonSection,
  HowCodeWorksSection,
  PrintSection,
  VariablesSection,
  DataTypesSection,
  StringSection,
  ListSection,
  TupleSection,
  ListVsTupleSection,
  QuizSection,
  SummarySection,
];
