# Python Basics — An Interactive Introduction to Programming

A presenter-driven, twelve-slide interactive website for a beginner Python
workshop. It replaces a slide deck: every section teaches one idea, shows one
code example, shows the expected output, and gives the room something to
click.

Runs entirely in the browser. No backend, no database, no API keys, and no
Python interpreter — all output is simulated deterministically in TypeScript,
so a live demo behaves the same way every single time.

---

## Install

Requires **Node.js 20.19+ or 22.12+** (Vite 7).

```bash
git clone https://github.com/muntherh/python-basics-interactive-workshop.git
cd python-basics-interactive-workshop
npm install
```

## Develop

```bash
npm run dev
```

Then open the printed URL (default <http://localhost:5173>).

## Build

```bash
npm run build     # type-checks the project, then bundles to dist/
npm run preview   # serve the production build locally
```

Other scripts:

```bash
npm run typecheck  # TypeScript project references, no emit
```

---

## Presentation controls

| Action | Control |
| --- | --- |
| Next slide | `→` · `↓` · `Space` · `Page Down` · **Next** button |
| Previous slide | `←` · `↑` · `Page Up` · **Previous** button |
| First / last slide | `Home` / `End` |
| Jump to any slide | Progress markers along the bottom bar |
| Slide overview | `O`, or the grid button (top right) — `Esc` closes it |
| Fullscreen | `F`, or the expand button (top right) |
| Restart | The restart button (top right), or **Restart Presentation** on slide 12 |
| Scroll / trackpad | Wheel and two-finger scroll move between slides |
| Touch | Swipe up and down |

The current position is always shown as `04 / 12` in the top bar, with a
progress bar and the slide name along the bottom.

**Typing never moves the deck.** While the cursor is in any input — the name,
age, message, or list fields — arrow keys and space behave normally, and
`Esc` releases focus back to the deck.

### Presenter tips

- Press `F` for fullscreen before the room fills up.
- Slide 3 replays its four-step build every time you return to it, so you can
  step back and run it again.
- Slide 4's **Explain This Code** highlights each part of
  `print("Hello, Python!")` as you hover or tab through the breakdown — good
  for pointing at from the front of the room.
- Slide 12 shows the quiz score if the room played along on slide 11.

---

## Offline use

The build has **zero external requests**: fonts (Inter and JetBrains Mono,
both SIL Open Font License) are bundled into `dist/`, all icons are inline
SVG, and there are no analytics, CDNs, or remote images.

Once `npm install` has run once with a network connection, everything else
works offline:

```bash
npm run build
npm run preview     # fully offline
```

`dist/` is built with a relative base path, so you can also copy the folder to
a USB stick or any static host and open it behind any path. Serve it over
HTTP rather than opening `index.html` from `file://` — browsers block ES
module loading from the filesystem.

---

## Content

| # | Slide | Teaches |
| --- | --- | --- |
| 01 | Welcome | Title, subtitle, scroll-driven `PYTHON` wordmark |
| 02 | What is Python? | Five fields Python is used in, each with an example |
| 03 | How code works | Write → read → follow → result, revealed step by step |
| 04 | print() | `print("Hello, Python!")` taken apart piece by piece |
| 05 | Variables | Editable `name` / `age` shown as labelled storage boxes |
| 06 | Data types | String, Integer, Float, Boolean as openable cards |
| 07 | String | Type your own message; quotation marks are highlighted |
| 08 | List | Add, edit, remove, reset — the code updates as you go |
| 09 | Tuple | Locked items that refuse to change, with the real error |
| 10 | List vs Tuple | Side-by-side comparison plus a sorting drill |
| 11 | Quick quiz | Four questions, instant feedback, live score |
| 12 | Summary | Every concept covered, the final score, and a restart |

Lesson copy lives in `src/data/` and is deliberately kept away from the
presentation logic, so wording can be edited without touching components.

---

## Project structure

```
src/
  components/     Reusable UI: CodeBlock, OutputPanel, RunButton,
                  ExplanationPanel, PresentationSection, ProgressIndicator,
                  QuizCard, NavigationControls, DeckChrome, OverviewMenu,
                  HeroWordmark, HeroCodeVisual, AmbientBackdrop, Reveal
  sections/       One component per slide, plus index.ts (running order)
  data/           slides.ts (deck order) and lesson.ts (all teaching copy)
  hooks/          useDeckNavigation, useDeckContext, useFullscreen,
                  useElementHeight
  lib/            pythonHighlight.ts (tokenizer), simulate.ts (output),
                  cn.ts
  styles/         index.css — design tokens and base styles
  types/          Shared TypeScript types
```

### How it works

- **Navigation** is a plain vertical scroller with CSS scroll-snap. That gives
  wheel, trackpad and touch navigation for free and keeps the hero animation
  genuinely scroll-linked; buttons, markers and the keyboard all funnel
  through one `goTo`. The current slide is derived from an
  `IntersectionObserver`, so every input method stays in sync.
- **Code output** is simulated by small pure functions in `lib/simulate.ts`.
  There is no `eval`, no `Function` constructor, and no interpreter.
- **Syntax highlighting** is a ~150-line Python tokenizer in
  `lib/pythonHighlight.ts` — no highlighting dependency. It can also ring the
  brackets or the quotation marks on demand, which is what slides 7–9 use to
  point at the syntax being taught.

---

## Accessibility

- Semantic landmarks and one `h1`; every slide has its own heading.
- A skip link is the first tab stop.
- Every control has a label; correctness in the quiz is never signalled by
  colour alone (icons and written feedback back it up).
- Visible focus rings, high-contrast text, and large touch targets.
- `prefers-reduced-motion` is respected throughout: entrance animations,
  the scroll-linked wordmark, smooth scrolling and scroll-snap all stand
  down, and the four-step build on slide 3 appears complete immediately.

## Responsive

Designed for a 16:9 laptop on a projector, and verified at 1920×1080,
1440×900, 1366×768, 1280×720, 768×1024 and 390×844. The hero wordmark is
capped by viewport height as well as width so the opening slide fits one
screen on short laptops, and no page scrolls horizontally at any size.

## Tech

React 19 · Vite 7 · TypeScript 5.9 · Tailwind CSS 4 · Framer Motion 12 ·
Lucide React · Fontsource (Inter, JetBrains Mono)
