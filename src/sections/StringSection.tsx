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
import { cleanInput, printText, stringLiteral } from "@/lib/simulate";

const DEFAULT_MESSAGE = "Welcome to Python";

/** Slide 07 — strings, and what the quotation marks are actually doing. */
export function StringSection({ index, registerRef }: SectionProps) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const safeMessage = message.trim() === "" ? DEFAULT_MESSAGE : message;

  const code = useMemo(
    () =>
      [`message = ${stringLiteral(safeMessage)}`, "print(message)"].join("\n"),
    [safeMessage],
  );

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow="Text values"
      title="String"
      lead="A string is text written inside quotation marks."
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div className="min-w-0">
          <Reveal delay={0.22}>
            <label
              htmlFor="string-message"
              className="mb-2 block font-mono text-[0.72rem] tracking-[0.2em] text-dim uppercase"
            >
              Type your own message
            </label>
            <input
              id="string-message"
              type="text"
              value={message}
              placeholder={DEFAULT_MESSAGE}
              onChange={(event) =>
                setMessage(cleanInput(event.target.value, 42))
              }
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-line bg-navy-950/70 px-4 py-3.5 font-mono text-[clamp(0.98rem,1.35vw,1.35rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-py-blue/40 focus:border-py-blue/70 focus:outline-none"
            />
          </Reveal>

          <Reveal delay={0.3}>
            <ActionButton
              icon={RotateCcw}
              variant="ghost"
              className="mt-3"
              onClick={() => setMessage(DEFAULT_MESSAGE)}
            >
              Reset
            </ActionButton>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="glass mt-5 rounded-2xl p-5 sm:p-6">
              <p className="font-mono text-[0.72rem] tracking-[0.24em] text-py-yellow uppercase">
                Watch the quotes
              </p>
              <p className="mt-3 text-[clamp(0.92rem,1.12vw,1.18rem)] leading-relaxed text-mist">
                The highlighted{" "}
                <span className="font-mono text-py-yellow">&quot;</span> marks
                are not part of your text. They only tell Python where the text
                starts and where it ends.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.26}>
            <CodeBlock
              code={code}
              fileName="message.py"
              emphasis="quotes"
              size="md"
            />
          </Reveal>
          <Reveal delay={0.34}>
            <OutputPanel
              lines={[printText(safeMessage)]}
              minLines={1}
              placeholder=""
              size="md"
            />
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
