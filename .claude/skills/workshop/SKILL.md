---
name: workshop
description: >-
  Build a presenter-driven interactive teaching website — a full-screen slide
  deck in the browser where every slide teaches one idea and gives the room
  something to click — and the presenter script that goes with it. Use this
  whenever someone wants to teach, train, onboard, or run a workshop with a
  website rather than PowerPoint: "a workshop about X", "an interactive lesson
  on Y", "slides for my session", "a teaching site", "a course page", "replace
  my deck", "ورشة تفاعلية". Also for adapting such a deck to a new topic, adding
  slides, or reviewing one for accessibility, layout and RTL problems. Reach for
  it even when they say "presentation" or "slides" without saying "website" — a
  deck that must be interactive is this, not a PowerPoint export. Use it for the
  script alone too, for a deck that already exists: "presenter notes", "speaker
  script", "what do I say on each slide", "سكربت", "ماذا أقول".
---

# Interactive workshop deck

A workshop deck is a website that behaves like a slide deck: full-screen
sections, one per idea, driven from the keyboard by someone standing in front
of a room. This skill builds that, and the bundled `assets/shell/` is a
working presentation shell — chrome, navigation, slide frame, interaction
primitives — so you spend your effort on the teaching, not on rebuilding
scroll-snap and a progress bar.

The approach here was derived from decks that were actually presented, and the
rules below are mostly scar tissue. Where a rule exists, the reason is given —
follow the reasoning, not the letter, when a situation does not match.

## What makes these decks work

Five commitments do most of the work. Hold them and a deck feels designed;
drop one and it degrades into a webpage with headings.

**One idea per slide.** A slide teaches one thing, shows one example, shows
what comes back, and gives the room something to do. If a slide needs the word
"and" to describe it, it is two slides. The audience is following a person
talking, not reading — a slide crowded with a second idea competes with the
presenter instead of supporting them.

**Everything is simulated, deterministically.** When a deck demonstrates a
tool, the "output" is a pure function of the input, written by hand and
committed. Never call a real API, never hit the network, never `eval` learner
input. A live workshop has to behave identically on every run, on conference
wifi, in a room where the projector is the only thing that works. A demo that
fails live costs more than the realism was ever worth.

**Copy lives in one file, never in components.** All teaching text sits in
`src/data/lesson.ts`. Changing a sentence should never mean opening a
component. This is what makes a deck retargetable to a new topic in an
afternoon — and retargeting is the normal life of a good deck.

**The interaction vocabulary is small and reused.** Two or three interaction
patterns, each appearing on more than one slide. The room learns how to use a
card explorer once, on slide 2, and that knowledge pays off again on slide 11.
A deck where every slide invents a new interaction spends the audience's
attention on the interface instead of the subject.

**It must fit on one screen.** Each slide is exactly one viewport tall with no
page-level horizontal scroll, at 1920×1080 *and* 1280×720. The small laptop
is the real constraint: same aspect ratio, far less room once fixed-size type
and the presenter chrome are accounted for. A slide that needs scrolling on
the presenter's actual machine is a broken slide.

## Building a new deck

### 1. Settle the shape before writing code

Get these from the person first — they determine everything downstream, and
guessing wastes a full build:

- **Subject and audience.** "Beginners who have never opened a terminal" and
  "engineers switching stacks" produce different decks from the same topic.
- **Duration**, which sets slide count. Budget roughly 2–4 minutes per slide:
  a 45-minute session is about 12–16 slides including the hero and summary.
- **The centre of gravity.** Most workshops have one thing the room must leave
  knowing. Name it, then give it consecutive slides rather than scattering it.
  Weight is how a deck argues; an even spread says everything matters equally,
  which is never true.
- **Language and direction** — see "Language and direction" below.

Then write the running order as a plain list of slide titles and check it with
them *before* building. A wrong outline discovered at slide 12 is expensive; a
wrong outline discovered as a list costs a minute.

### 2. Scaffold

```bash
scripts/scaffold.sh <target-dir> "<Deck Title>"
```

This creates the Vite + React + TypeScript + Tailwind project, copies
`assets/shell/` into `src/`, writes the config files, and installs
dependencies. Read `references/architecture.md` for what landed where.

### 3. Write the deck

Work in this order — it front-loads the decisions that are expensive to
change:

1. `src/deck.config.ts` — locale and direction.
2. `src/styles/index.css` — the accent pair in `@theme`. Changing
   `--color-accent` and `--color-accent-warm` re-themes the whole deck,
   because nothing hard-codes a hex value. Keep the canvas dark unless asked;
   it reads better on a projector than a light one, and every token below the
   accents was tuned against it.
3. `src/data/slides.ts` — the running order: `id`, `label`, and a presenter
   `cue` (one line, what the presenter says here).
4. `src/data/lesson.ts` — all teaching copy.
5. `src/sections/` — one component per slide, then list them in
   `sections/index.ts`.

`data/slides.ts` and `sections/index.ts` are two parallel arrays that must
stay index-aligned: index N in one is slide N in the other. Nothing enforces
this at compile time, so when adding or reordering a slide, edit both in the
same change and re-check the deck end to end afterwards.

Build each slide on `PresentationSection`, which supplies the number, eyebrow,
heading, lead and body frame. Using it everywhere is what makes fourteen
separate files read as one designed object.

### 4. Verify before declaring it done

A deck that has not been driven has not been built. See
`references/verification.md` for the full pass; the short version:

```bash
npm run build                                  # must be clean
npm run preview &
node scripts/verify.mjs http://127.0.0.1:4173  # structural checks
```

`scripts/verify.mjs` covers 1920×1080, 1280×720 and 390×844, checking for
console errors, horizontal overflow, a broken heading outline, unlabelled
controls, and — in an RTL deck — that code is still pinned left-to-right.
1280×720 is the one that matters; a large monitor always passes.

Then drive every interaction by hand, because that is where the real bugs
are. Click the quiz through to its score. Type into the inputs, including an
empty value and a very long one. Walk the whole deck with the keyboard alone.

Report what you verified and what you did not. "Built cleanly" is not
"works", and a slide that renders is not a slide that works.

### 5. Write the presenter script

The deck is half the deliverable. Whoever asked for it is going to stand in
front of a room with it, often for the first time, and a deck with no script
leaves them improvising the part that decides whether the session lands. Build
it once the deck is finished, from `assets/script/template.html`.

**Write it in the language of the deck.** Read `src/deck.config.ts`: an `ar`
deck gets an Arabic script on an RTL page, an `en` deck gets an English one.
Translate the whole page, not only the spoken lines — headings, chips and
labels too. Slide titles and interface terms stay in the deck's own language
either way, because the presenter is pointing at those words on screen while
saying them.

Every slide gets three separated parts: **Say** (the words, verbatim), **Do**
(the action on screen, never read aloud), and **Bridge** (one sentence into
the next slide). Keep spoken sentences under about fifteen words — one breath
each — so the presenter can look down, take a line, and look back up.

`references/presenter-script.md` has the full method, including timing,
the two appendices, and what to do when the room's language differs from the
deck's. Publish the finished script as an artifact: presenters read it on a
phone while the laptop is showing the deck.

## The content model

`src/data/lesson.ts` holds typed objects, one export per slide, and the
section components read from it. The shape varies by interaction, but the
recurring pieces are:

- `eyebrow` — the tiny uppercase label above the heading. A category, 1–3
  words.
- `title` — the slide heading. Short enough to sit on two lines at most.
- `lead` — one sentence, the idea of the slide in plain language.
- the interaction's own data — cards, steps, questions, prompt lines.

Two rules keep this file useful. Write the copy at the reading level of the
audience you were given, not the level of the person writing it. And keep
sentences short enough to be read from the back of a room — if a line wraps
past two lines at `1280×720`, it is prose, not a slide.

## The interaction vocabulary

The shell ships these. Pick two or three for a deck and reuse them; read
`references/interactions.md` for props and the data each one expects.

| Component | Teaches | Use it for |
| --- | --- | --- |
| `CardExplorer` | a set of parallel things | 4–6 concepts of equal weight, opened one at a time |
| `StepSequence` | an ordered process | a 3–5 step loop, advanced by the presenter |
| `CodeBlock` | exact text | commands, code, prompts — see the variant rule below |
| `ExplanationPanel` | anatomy of an example | breaking one artefact into labelled parts |
| `OutputPanel` | what a tool returns | the simulated response to an input |
| `QuizCard` | recall | 4–6 questions with a live score |

`CodeBlock` has two variants and the distinction matters pedagogically.
`variant="code"` syntax-highlights; use it for commands and real code.
`variant="prompt"` renders plain sentences with no colouring; use it for
prompts written in natural language. Colouring an English sentence like code
teaches the room that prompts are a formal syntax, which is the opposite of
the thing most workshops are trying to say.

## Language and direction

The shell is direction-agnostic by construction, which is worth preserving:
every margin, padding and offset uses a **logical** Tailwind utility
(`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`) rather than a
physical one. Those flip automatically when `dir="rtl"` is set. If you add
`ml-4` or `text-left` to a component, you have quietly made the deck
LTR-only.

To build an Arabic deck, set both values in `src/deck.config.ts`:

```ts
export const DECK_LOCALE = "ar";
export const DECK_DIRECTION: "ltr" | "rtl" = "rtl";
```

`main.tsx` applies these to `<html>`. Everything else follows — except three
things that CSS cannot decide for you, all already handled in the shell and
all worth understanding before you touch them:

1. **Chevrons** point at a physical side. `NavigationControls` picks the
   glyph from `IS_RTL`, because in an RTL deck "next" advances leftwards.
2. **Arrow keys** swap: `ArrowLeft` moves forward in RTL. Vertical arrows
   never swap — the deck always scrolls downwards.
3. **Code stays LTR.** `code`, `pre` and `.font-mono` are pinned to
   `direction: ltr` in `index.css`. Without it the bidirectional algorithm
   reorders a command like `npm run dev -- --host` around its punctuation and
   the learner copies something that does not run.

Read `references/rtl.md` before doing anything more involved — mixed-language
slides, Arabic numerals, or an RTL deck teaching LTR code have sharper edges
than these three.

## Accessibility is part of the build, not a pass at the end

These decks get presented to rooms that include people using screen readers
and people who cannot pick a colour out of a chart. The shell establishes the
contract; keep it:

- Exactly one `<h1>` (the hero). Every other slide heading is `<h2>`, supplied
  by `PresentationSection`.
- A skip link as the first tab stop.
- Every control has an accessible name — icon-only buttons need `aria-label`.
- Correctness is never signalled by colour alone. The quiz pairs colour with
  an icon and text, because roughly one man in twelve cannot use the colour.
- `prefers-reduced-motion` is respected throughout. Someone in the room may
  get motion sick from the transitions that make the deck feel good.

## Reference files

- `references/architecture.md` — project layout, data flow, how to add a slide
- `references/interactions.md` — the interaction components in detail
- `references/rtl.md` — Arabic and bidirectional text
- `references/verification.md` — the verification pass in full
- `references/presenter-script.md` — writing the "what do I say" script
- `assets/script/template.html` — the script page, both directions and themes
- `scripts/scaffold.sh` — create a new deck project
- `scripts/verify.mjs` — structural checks across the three viewports

## When you finish

Write a `CLAUDE.md` at the project root covering: what the deck is, its
running order with the mechanic per slide, where things live, the design
tokens, the decisions that were made deliberately, and what remains open. The
next session — or the next person — should be able to read it and be useful
immediately without re-deriving anything. A deck without this file gets
subtly wrecked by its next well-meaning edit.
