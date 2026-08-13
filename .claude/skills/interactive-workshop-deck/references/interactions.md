# The interaction vocabulary

Pick two or three of these for a deck and reuse them across slides. A deck
where every slide invents a new interaction spends the room's attention on
the interface instead of the subject; a deck that reuses `CardExplorer` on
slide 2 and again on slide 11 gets the second one for free.

All shapes referenced here live in `src/types/index.ts`.

## CardExplorer

A grid of cards; picking one reveals a sentence and a matching example.

```tsx
<CardExplorer
  cards={LESSON.cards}          // ExplorerCard[]
  hint="Pick one"               // small instruction above the grid
  placeholder="Choose a card."  // shown before anything is picked
  snippetFileName="prompt"      // label on the revealed panel
/>
```

```ts
interface ExplorerCard {
  id: string;
  title: string;
  icon: LucideIcon;
  example: string;   // one short sentence, revealed on click
  snippet: string;   // a tiny, readable example that matches it
}
```

Use it for 4–6 things of **equal weight** — a grid says "these are
siblings". If one of them matters more than the others, a grid is the wrong
shape and you are fighting the layout to say so. Three cards is thin; more
than six stops being scannable from the back of a room.

## StepSequence

An ordered process, revealed one step at a time.

```tsx
<StepSequence steps={LESSON.steps} completeMessage="That is the whole loop." />
```

```ts
interface SequenceStep {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
}
```

Use it for a 3–5 step loop the presenter walks through out loud. The reveal
is the point: it stops the room reading ahead to step 4 while the presenter
is still on step 1.

## CodeBlock

Exact text, in a window frame.

```tsx
<CodeBlock code={SNIPPET} fileName="terminal" variant="code" showLineNumbers />
<CodeBlock code={PROMPT} variant="prompt" highlight="a to-do list" />
```

**The variant choice is pedagogical, not cosmetic.** `variant="code"`
tokenises and colours; use it for commands and real code. `variant="prompt"`
renders plain sentences with no colouring; use it for prompts written in
natural language. Colouring an English sentence like source code teaches the
room that prompts are a formal syntax with keywords — the opposite of what
most workshops are trying to say.

`highlight` rings an exact substring wherever it appears, so the presenter
can point at the part the learner just changed.

Two mechanical details worth keeping: blank lines inside `code` need a
non-breaking space (U+00A0), because a plain space collapses and the line
loses its height; and ligatures are disabled deck-wide so `!=` and `<-`
render as the characters people actually typed.

## ExplanationPanel

Breaks one artefact into labelled parts, with the parts and the explanation
cross-highlighting.

```tsx
<ExplanationPanel
  items={LESSON.parts}     // ExplanationItem[]
  activeId={activeId}      // you own this state
  onSelect={setActiveId}
  onHover={setActiveId}
  visible={true}
/>
```

Use it once, for the single most important artefact in the workshop — the
prompt, the config file, the command. It rewards close reading, which is
expensive; spend it on the thing that deserves it.

## OutputPanel

What a tool returned.

```tsx
<OutputPanel lines={lines} placeholder="Run it to see the output." minLines={4} />
```

Pair it with `RunButton` and a pure function from `lib/simulate.ts`. Set
`minLines` to the height of the longest output so the layout does not jump
when the output appears — on a projector, a jump reads as a bug.

## QuizCard

```tsx
<QuizCard
  question={q}             // QuizQuestion
  questionNumber={n}
  totalQuestions={total}
  selectedIndex={selected}
  onSelect={handleSelect}
/>
```

Four to six questions near the end. Weight them toward the thing the room
must leave knowing. Correctness is signalled with an icon and text as well as
colour — roughly one man in twelve cannot use the colour, and the quiz is
exactly where being unable to tell right from wrong matters.

## Simulation

Everything a "tool" appears to do lives in `lib/simulate.ts` as pure
functions: input in, fixed output out. No network, no model calls, no `eval`
of learner input.

```ts
export function simulateBuild(idea: string): string[] {
  // deterministic, hand-written, committed
}
```

This is not a shortcut, it is the design. A live workshop has to behave
identically every run, on conference wifi, in a room where the projector is
the only thing that reliably works. A demo that fails live costs the whole
session; the realism you traded away was never worth that.

It also means the deck keeps working years later, when the API it was
pretending to call has changed twice.

## Motion

`Reveal` and `RevealWords` handle entrance animation. Both respect
`prefers-reduced-motion`, and so must anything you add — someone in the room
may get motion sick from the transitions that make the deck feel good.
