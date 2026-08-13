# Verifying a deck

A deck that has not been driven has not been built. These decks fail in front
of a room, at which point the cost is not a bug report — it is the session.

## 1. The build must be clean

```bash
npm run build     # tsc -b && vite build
```

TypeScript errors here are the cheap ones. Fix them before looking at
anything else.

## 2. Structural checks, all three viewports

Serve the production build, not the dev server — dev-only warnings and
un-minified layout make the result unrepresentative.

```bash
npm run preview &
node scripts/verify.mjs http://127.0.0.1:4173
```

It checks, at 1920×1080, 1280×720 and 390×844:

- zero console errors and zero page errors
- zero horizontal overflow at the document level
- exactly one `<h1>`
- no button or link without an accessible name
- in an RTL deck, that code blocks are still `direction: ltr`

**1280×720 is the viewport that matters.** It has the same aspect ratio as
1920×1080 but far less room once fixed-size type and the presenter chrome are
accounted for, and it is what the presenter's laptop usually is. A large
monitor always passes; it proves nothing.

## 3. Drive every interaction by hand

This is the part that cannot be automated away, and it is where the real bugs
live. Rendering is not working. For each interactive slide:

- Click every card, open every panel, answer every question.
- Take the quiz to completion and check the score reaches the summary slide.
- Type in every input and watch the output change. Try an empty value and a
  very long one — long input is what breaks a fixed-height panel.
- Add and remove items where a slide allows it, and check that anything
  derived from them (numbering, counts) re-derives correctly.
- Walk the whole deck with the keyboard alone: arrows, space, `Home`, `End`,
  `o`, `f`, `Escape`. Then walk it again with the on-screen controls.

## 4. Accessibility

- Tab from the top of the page: the skip link must be the first stop.
- Check the heading outline is one `<h1>` then `<h2>` per slide.
- Confirm nothing signals correctness by colour alone.
- Turn on reduced motion at the OS level and reload. The deck must still be
  navigable, with the animation gone rather than the content.

## 5. RTL decks

Add the checks in `rtl.md`: direction and lang on `<html>`, code still LTR,
arrow keys moving the way the chevrons say, and — this one needs a person who
reads Arabic — text that is actually in the right order. Automated checks
cannot see reversed word order, and a deck full of Latin text set in an RTL
paragraph will pass every structural check while being unreadable.

## Reporting

Say what you verified and what you did not. "Builds cleanly" is not "works",
and "I checked slide 3" is not "I checked the deck". If you could not test
something — no browser available, a font that would not load, an interaction
that needs a real projector — say so plainly rather than implying coverage
you do not have.
