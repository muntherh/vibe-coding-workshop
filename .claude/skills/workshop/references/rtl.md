# Arabic, RTL and bidirectional text

Read this before building an Arabic deck, or before putting English into one.

## Setting the direction

One place, `src/deck.config.ts`:

```ts
export const DECK_LOCALE = "ar";
export const DECK_DIRECTION = "rtl" as DeckDirection;
```

`main.tsx` copies both onto `<html>` at startup. `index.html` also carries
them so the very first paint is not laid out in the wrong direction and then
snapped across.

The `as DeckDirection` assertion is load-bearing. Written as a plain annotated
const, TypeScript narrows the value to the one literal it was assigned and
then rejects `DECK_DIRECTION === "rtl"` as a comparison with no overlap. The
assertion keeps the declared type the full union.

Install the Arabic face when the deck is Arabic:

```bash
npm i @fontsource-variable/noto-sans-arabic
```

and import it in `main.tsx`. The scaffold does this for you with `--lang ar`.
It is a 166 kB subset — worth it when used, waste when not.

## What flips on its own

Everything expressed as a **logical** CSS property. The shell is written this
way throughout, and keeping it that way is what makes a deck work in both
directions with a one-line change:

| Physical (do not use) | Logical (use) |
| --- | --- |
| `ml-4` / `mr-4` | `ms-4` / `me-4` |
| `pl-4` / `pr-4` | `ps-4` / `pe-4` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |

A single `ml-4` added in a hurry makes the deck quietly LTR-only, and it will
not show up in a build — only in the layout, and only if someone looks at it
in RTL. Grep for the physical forms before shipping:

```bash
grep -rnE '\b(ml|mr|pl|pr|left|right)-[0-9a-z[]|text-(left|right)\b' src/
```

## What cannot flip on its own

Three things need a decision in JavaScript. All three are handled in the
shell; understand them before changing them.

**Chevrons.** A chevron points at a physical side, so no CSS property can
turn it around. `NavigationControls` picks the glyph from `IS_RTL`: in RTL the
deck advances leftwards, so the "next" button gets the left-pointing glyph.

**Arrow keys.** In RTL, `ArrowLeft` moves forward and `ArrowRight` moves back.
`useDeckKeyboard` branches on `IS_RTL` for the horizontal pair only —
`ArrowUp` / `ArrowDown` and `PageUp` / `PageDown` never swap, because the deck
scrolls downwards in both directions.

**Code.** `code`, `pre`, `kbd` and `.font-mono` are pinned to
`direction: ltr` in `index.css`. Without it the bidirectional algorithm
reorders a line like `npm run dev -- --host` around its punctuation, and the
learner copies something that does not run. This applies to file paths, URLs
and terminal output as much as to source code.

## The trap: Latin text inside an RTL deck

This is the one that surprises people, and it is not a bug.

When the paragraph direction is RTL, the Unicode bidirectional algorithm lays
out runs of Latin text right-to-left *as runs*, so an English sentence in an
Arabic deck comes out with its words in reverse order — "The first idea"
renders as "idea first The". Punctuation migrates to the wrong end of the
line for the same reason.

Arabic text in an Arabic deck is fine. The problem is only ever mixed
content, and it has two clean fixes:

- **A whole element in the other language** — give it its own direction:
  ```tsx
  <p dir="ltr" className="text-start">Introduction to Vibe Coding</p>
  ```
- **A short foreign phrase inside a sentence** — isolate it with `<bdi>`, so
  it keeps its own ordering without disturbing the sentence around it:
  ```tsx
  <p>سنستخدم <bdi>Claude Code</bdi> في هذه الورشة.</p>
  ```

A product name, a command, a URL, or a version number embedded in Arabic prose
all want `<bdi>`. Reach for it by default when mixing; it costs nothing when
it was not needed.

## Numbers

Arabic decks can use either Western Arabic numerals (1, 2, 3) or Eastern
Arabic-Indic ones (١, ٢, ٣). Pick one and hold it across the whole deck —
mixing them inside one presentation reads as a mistake even to people who
read both comfortably.

The slide numbers in `PresentationSection` are generated with
`String(index + 1).padStart(2, "0")` and stay Western. That is usually right,
because they sit beside Latin-styled chrome, but if the deck commits to
Arabic-Indic numerals throughout, convert them there rather than per slide.

## Verifying an RTL deck

Add these to the normal verification pass (see `verification.md`):

- `document.documentElement.dir` is `rtl` and `lang` is `ar`.
- Computed `direction` on a code block is still `ltr`.
- No horizontal overflow at 1280×720 — RTL exposes different overflow than
  LTR, because content that ran off the right edge now runs off the left.
- Arrow keys move the deck the way the chevrons say they will. Press the key,
  do not assume.
- The text actually reads correctly to someone who reads Arabic. Automated
  checks cannot catch reversed word order; a person has to look.
