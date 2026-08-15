# Architecture

## Layout

```
src/
  deck.config.ts   locale + writing direction (one line each)
  App.tsx          composes context, sections, chrome, overview
  main.tsx         font imports, <html lang/dir>, mount
  components/      reusable UI — the presentation shell
  sections/        one component per slide + index.ts (running order)
  data/
    slides.ts      deck order: id, label, presenter cue
    lesson.ts      ALL teaching copy
  hooks/           useDeckNavigation, useDeckContext, useFullscreen,
                   useElementHeight
  lib/             cn.ts, codeHighlight.ts, simulate.ts
  styles/          index.css — design tokens and base styles
  types/           shared TypeScript types
```

Stack: React 19, Vite 7, TypeScript 5.9, Tailwind CSS 4, Framer Motion 12,
Lucide icons, Fontsource. Needs Node 20.19+ or 22.12+ for Vite 7.

```bash
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve the build
npm run typecheck  # no emit
```

`base: "./"` in `vite.config.ts` is deliberate: `dist/` then works from a
sub-path, a file:// URL, or a USB stick handed to someone at the end of a
workshop. It also means GitHub Pages, Netlify and Vercel all work with no
configuration.

No backend, no database, no API keys.

## How a slide reaches the screen

1. `data/slides.ts` exports `SLIDES` — the running order. Every `index` in
   every hook and control is an index into this array.
2. `sections/index.ts` exports `SECTION_COMPONENTS` — the components, in the
   same order.
3. `App.tsx` maps over `SECTION_COMPONENTS`, passing each one its `index` and
   a `registerRef` callback.
4. `useDeckNavigation` observes the registered elements to track which slide
   is on screen, and drives scrolling when the presenter navigates.
5. Each section renders `PresentationSection`, which reads `SLIDES[index]` for
   its id and anchor, and draws the number, eyebrow, heading, lead and body.

**The two arrays must stay index-aligned.** Index N in `SLIDES` is slide N in
`SECTION_COMPONENTS`. Nothing checks this at compile time — a mismatch shows
up as a slide with the wrong number and a broken anchor, usually noticed on
stage. When you add, remove or reorder a slide, edit both files in the same
change and then walk the whole deck.

## Adding a slide

1. Add an entry to `SLIDES` at the right position — `id` (stable, also the
   DOM id and hash anchor), `label` (shown in the overview menu), `cue` (one
   line for the presenter).
2. Add its copy to `data/lesson.ts`.
3. Create `sections/YourSection.tsx` built on `PresentationSection`.
4. Insert it at the matching index in `sections/index.ts`.
5. Rebuild and walk the deck end to end, checking the slide numbers.

## The deck context

`useDeckContext` exposes `index`, `total`, `goTo`, `next`, `previous`,
`restart`, and the quiz result. A section reaches for it when it needs to
drive navigation itself — the hero's "Start" button calls `next()`, and the
summary reads `quizResult` to report the score.

Keep this surface small. A section that needs to know a lot about the deck is
usually a section that is doing too much.

## Presenter chrome

`DeckChrome` carries the slide counter, progress indicator, navigation
controls, fullscreen and overview toggles. `--chrome-top` and
`--chrome-bottom` in `index.css` reserve its space, and
`PresentationSection` pads slide content clear of it. If you change the
chrome's height, change those tokens — otherwise content slides under the
controls at exactly the moment someone is presenting.

Keyboard: arrows and Page keys move, space advances, `Home`/`End` jump,
`o` toggles the overview, `f` toggles fullscreen, `Escape` closes the
overview. `useDeckKeyboard` refuses to hijack keys while a learner is typing
in an input.

## Design tokens

Everything resolves to a token in the `@theme` block of `styles/index.css`.
Changing `--color-accent` and `--color-accent-warm` re-themes the entire deck
because no component hard-codes a colour. Keep it that way: a hex value in a
component is a colour that will not follow the next re-theme, and re-theming
is how a deck gets reused.

The canvas tokens (`--color-void`, `--color-navy-*`, `--color-line`) are dark
on purpose. It reads better on a projector in a room where the lights cannot
be fully dimmed, and every neutral and glass surface was tuned against it.

`--word-size` controls the hero wordmark and is capped by viewport width and
height together. Re-check it at 1280×720 whenever the title text changes — a
long title is the usual cause of a broken opening slide.
