import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { CodeBlock } from "@/components/CodeBlock";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { cleanInput, simulateReplit } from "@/lib/simulate";

const DEFAULT_IDEA = "a quiz app about Oman";

/** Slide 07 — Replit: describe an app, and it is running and shareable. */
export function ReplitSection({ index, registerRef }: SectionProps) {
  const [idea, setIdea] = useState(DEFAULT_IDEA);

  const safeIdea = idea.trim() === "" ? DEFAULT_IDEA : idea;

  const prompt = useMemo(
    () =>
      [
        `Build ${safeIdea}.`,
        "Keep the whole thing in one page.",
        "Give me a link I can share.",
      ].join("\n"),
    [safeIdea],
  );

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Tool one"
      title="Replit"
      lead="Replit writes, runs and hosts your app in one browser tab. Nothing to install."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.22}>
            <label
              htmlFor="replit-idea"
              className="mb-2 block font-mono text-[0.72rem] tracking-[0.2em] text-dim uppercase"
            >
              Describe the app you want
            </label>
            <input
              id="replit-idea"
              type="text"
              value={idea}
              placeholder={DEFAULT_IDEA}
              onChange={(event) => setIdea(cleanInput(event.target.value, 42))}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-line bg-navy-950/70 px-4 py-3.5 font-mono text-[clamp(0.95rem,1.3vw,1.3rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-vibe-violet/40 focus:border-vibe-violet/70 focus:outline-none"
            />
          </Reveal>

          <Reveal delay={0.3}>
            <ActionButton
              icon={RotateCcw}
              variant="ghost"
              className="mt-3"
              onClick={() => setIdea(DEFAULT_IDEA)}
            >
              Reset
            </ActionButton>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="glass mt-5 rounded-2xl p-5 sm:p-6">
              <p className="font-mono text-[0.72rem] tracking-[0.24em] text-vibe-coral uppercase">
                What Replit does for you
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-[clamp(0.9rem,1.1vw,1.15rem)] leading-relaxed text-mist">
                {[
                  "Writes the files.",
                  "Installs what the code needs.",
                  "Starts the server.",
                  "Gives you a link you can send to anyone.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-vibe-coral/70"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.26}>
            <CodeBlock
              code={prompt}
              variant="prompt"
              fileName="prompt"
              highlight={safeIdea}
              size="md"
            />
          </Reveal>
          <Reveal delay={0.34}>
            <OutputPanel
              lines={simulateReplit(safeIdea)}
              title="Replit"
              minLines={3}
              placeholder=""
              size="md"
            />
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
