# Introduction to Vibe Coding

A presenter-driven, fourteen-slide interactive website for a beginner workshop
on **vibe coding** — building software by describing it in plain language. It
replaces a slide deck: every section teaches one idea, shows one prompt, shows
what comes back, and gives the room something to click.

The workshop covers the landscape (Lovable, Replit, Cursor, Claude Code), then
goes hands-on with two tools: **Replit** gets one slide, and **Claude Code**
gets four consecutive slides plus the comparison, quiz and closing prompt.

Runs entirely in the browser. No backend, no database, no API keys, and no
model calls — every response is simulated deterministically in TypeScript, so
a live demo behaves the same way every single time, on any wifi.

---

## Install

Requires **Node.js 20.19+ or 22.12+** (Vite 7).

```bash
git clone <this-repo>
cd vibe-coding-interactive-workshop
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
| Restart | The restart button (top right), or **Practice Again** on slide 14 |
| Scroll / trackpad | Wheel and two-finger scroll move between slides |
| Touch | Swipe up and down |

The current position is always shown as `04 / 14` in the top bar, with a
progress bar and the slide name along the bottom.

**Typing never moves the deck.** While the cursor is in any input — the prompt
fields, the practice box, the plan steps — arrow keys and space behave
normally, and `Esc` releases focus back to the deck.

### Presenter tips

- Press `F` for fullscreen before the room fills up.
- Slide 3 and slide 8 replay their four-step build every time you return to
  them, so you can step back and run them again.
- Slide 4's **Explain This Prompt** highlights each line of the example prompt
  as you hover or tab through the breakdown — good for pointing at from the
  front of the room.
- Slide 5's two fields are the moment to take a suggestion from the room and
  type it in live; the prompt on the right rewrites itself as you type.
- Slide 10 is the one people remember: click a rule and watch Claude Code
  refuse to go around it.
- Slide 14's **Copy Prompt** puts a real, well-formed first prompt on the
  clipboard. If the room has laptops, this is where they start.

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

The one link that leaves the deck is **Open Claude Code** on the last slide.
Everything else works with the network unplugged.

---

## Content

| # | Slide | Teaches |
| --- | --- | --- |
| 01 | Welcome | Title, subtitle, scroll-driven `VIBE CODING` wordmark |
| 02 | What is vibe coding? | Five places people vibe code, each with a prompt |
| 03 | How it works | Describe → generate → run → refine, revealed step by step |
| 04 | The prompt | A four-line prompt taken apart, one line at a time |
| 05 | Your first prompt | Editable `what` / `who` fields driving a live prompt |
| 06 | The tools | Lovable, Replit, Cursor and Claude Code as openable cards |
| 07 | Replit | Type an app idea; watch it become a prompt and a live link |
| 08 | Claude Code | Open, start, describe, review — the terminal loop |
| 09 | Working in steps | Add, reword and drop steps in the plan it writes first |
| 10 | CLAUDE.md | Project rules that hold, with the refusal when you push |
| 11 | The toolbelt | Plan mode, run & test, git, skills, subagents |
| 12 | Replit vs Claude Code | Side-by-side plus a "which tool?" sorting drill |
| 13 | Quick quiz | Five questions, instant feedback, live score |
| 14 | Summary | Every concept covered, the score, and a real starter prompt |

Lesson copy lives in `src/data/` and is deliberately kept away from the
presentation logic, so wording can be edited without touching components.

---

## Project structure

```
src/
  components/     Reusable UI: CodeBlock, OutputPanel, RunButton,
                  ExplanationPanel, PresentationSection, ProgressIndicator,
                  QuizCard, NavigationControls, DeckChrome, OverviewMenu,
                  HeroWordmark, HeroCodeVisual, AmbientBackdrop, Reveal,
                  StepSequence, CardExplorer
  sections/       One component per slide, plus index.ts (running order)
  data/           slides.ts (deck order) and lesson.ts (all teaching copy)
  hooks/          useDeckNavigation, useDeckContext, useFullscreen,
                  useElementHeight
  lib/            codeHighlight.ts (tokenizer), simulate.ts (responses),
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
- **Responses are simulated** by small pure functions in `lib/simulate.ts`.
  There is no model call, no `eval`, and no network. The prompt review on
  slide 5 checks structure only — does the prompt say what, who and what it
  must do — which is exactly what the slide is teaching.
- **Two shared slide bodies** carry the deck's repeated interactions:
  `StepSequence` (slides 3 and 8) and `CardExplorer` (slides 2 and 11). The
  room learns each interaction once and meets it again later.
- **Syntax highlighting** is a small hand-rolled tokenizer in
  `lib/codeHighlight.ts` — no highlighting dependency. It only runs on
  terminal commands and code; prompts render as plain text through
  `CodeBlock`'s `prompt` variant, because colouring English as if it were
  syntax makes it look like something it is not.

---

## Design

The canvas keeps the deep, near-black depth that reads well on a projector.
The accents are **violet** (`--color-vibe-violet`) and **coral**
(`--color-vibe-coral`), defined once as tokens in `src/styles/index.css`.
Changing those two values re-themes the entire deck.

## Accessibility

- Semantic landmarks and one `h1`; every slide has its own heading.
- A skip link is the first tab stop.
- Every control has a label; correctness in the quiz is never signalled by
  colour alone (icons and written feedback back it up).
- Visible focus rings, high-contrast text, and large touch targets.
- `prefers-reduced-motion` is respected throughout: entrance animations,
  the scroll-linked wordmark, smooth scrolling and scroll-snap all stand
  down, and the stepped builds on slides 3 and 8 appear complete immediately.

## Responsive

Designed for a 16:9 laptop on a projector, and verified at 1920×1080,
1280×720 and 390×844. The hero wordmark is capped by viewport height as well
as width so the opening slide fits one screen on short laptops, and no page
scrolls horizontally at any size.

## Tech

React 19 · Vite 7 · TypeScript 5.9 · Tailwind CSS 4 · Framer Motion 12 ·
Lucide React · Fontsource (Inter, JetBrains Mono)

---

## Credits

Built on the structure of the *Python Basics — An Interactive Introduction to
Programming* workshop deck, which supplied the presentation shell, navigation
and interaction patterns reused here.
