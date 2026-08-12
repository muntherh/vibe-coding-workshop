# CLAUDE.md — Introduction to Vibe Coding (workshop deck)

> Handoff file. A fresh session should be able to read this and be useful
> immediately, without re-deriving anything.

## 0. Who you're working with

The owner (**muntherh**) is a **No-Code developer/designer**, not a traditional
software engineer. He runs a small student startup (Forsa) and gets deliverables
assigned with deadlines. He relies on Claude Code to handle the engineering side
end to end.

- **He writes in Arabic. Reply in Arabic.** The codebase and all deck copy are
  in English — keep it that way.
- Explain diagnoses and plans in plain language before touching code. Don't
  assume familiarity with React, git, or build tooling.
- He often verifies things himself in dashboards (GitHub, Vercel) via
  screenshots rather than CLI — walk him through exact clicks when that is the
  only path.
- Get explicit approval before commits/pushes/deploys on anything beyond
  trivial docs.

## 1. What this project is

**Introduction to Vibe Coding** — a presenter-driven, **14-slide interactive
website** for a beginner workshop on vibe coding: building software by
describing it in plain language.

It replaces a slide deck. Every slide teaches one idea, shows one prompt, shows
what comes back, and gives the room something to click.

**The workshop's centre of gravity is Claude Code.** That was an explicit
requirement, not a preference:
- Slide 6 shows the landscape (Lovable, Replit, Cursor, Claude Code) with
  Claude Code badged **"MAIN FOCUS"**.
- Replit gets **one** hands-on slide (07).
- Claude Code gets **four consecutive slides** (08–11) plus the comparison
  drill (12), the heaviest weighting in the quiz (13), and the closing starter
  prompt (14).

**Do not dilute this balance** without the owner asking for it.

## 2. IMMEDIATE PENDING TASK — push to GitHub

The work is finished, verified, and committed locally. It has **never been
pushed**, because the previous session was hard-scoped to a different repo
(`muntherh/forsa-backend`) and every push path was blocked:

| Attempt | Result |
| --- | --- |
| `add_repo` with `access: "push"` | `MCP tool call requires approval` — approval never arrived |
| `git push` | `access denied by the git proxy: ... not in this session's authorized repository set` |
| GitHub MCP (`create_branch`, `push_files`) | `Access denied: repository is not configured for this session` |
| GitHub MCP `create_repository` | `403 Resource not accessible by integration` |

The owner has since created the target repo himself:

**`https://github.com/muntherh/vibe-coding-workshop`** (private)

It contains **one auto-init commit** (a README), so the first push needs
`--force` to replace it. That is safe — there is nothing else in it.

**If this session has `muntherh/vibe-coding-workshop` attached as a source,
just push:**

```bash
git remote set-url origin https://github.com/muntherh/vibe-coding-workshop
git branch -M main
git push -u --force origin main
```

If it is still not attached, say so plainly and give the owner the local
commands — do not silently retry the same blocked tool call more than once.

Local history is two commits, deliberately:

```
d4138b3  Rebuild the deck as "Introduction to Vibe Coding"
4cf8485  baseline: python-basics-interactive-workshop @ f7d229b
```

The baseline commit exists so the diff shows what actually changed versus the
deck this was built from. Keep both.

## 3. Where this came from

Built on **`muntherh/python-basics-interactive-workshop`** (commit `f7d229b`),
a 12-slide beginner Python workshop by the same owner. That project supplied
the presentation shell: navigation, deck chrome, the slide frame, and all the
interaction mechanics.

The subject matter was replaced end to end. The original repo is **untouched**
— nothing was pushed to it.

The README keeps one credits line naming the Python workshop. That mention of
"Python" is intentional attribution — **do not "fix" it.**

## 4. Stack and how to run it

React 19 · Vite 7 · TypeScript 5.9 · Tailwind CSS 4 · Framer Motion 12 ·
Lucide React · Fontsource (Inter, JetBrains Mono)

Requires **Node 20.19+ or 22.12+** (Vite 7).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve the build (port 4173)
npm run typecheck  # no emit
```

No backend, no database, no API keys, no model calls. `base: "./"` in
`vite.config.ts` so `dist/` works from a sub-path or a USB stick.

## 5. The deck

| # | id | Slide | Mechanic |
| --- | --- | --- | --- |
| 01 | `hero` | Welcome | Scroll-linked `VIBE CODING` wordmark |
| 02 | `what-is-vibe-coding` | What is vibe coding? | `CardExplorer` — 5 cards |
| 03 | `how-it-works` | How it works | `StepSequence` — 4-step build |
| 04 | `the-prompt` | The prompt | Line-by-line breakdown + explain panel |
| 05 | `write-a-prompt` | Your first prompt | Editable `what`/`who` → live prompt |
| 06 | `the-tools` | The tools | Openable cards, Claude Code badged |
| 07 | `replit` | Replit | Type an idea → prompt + simulated build log |
| 08 | `claude-code` | Claude Code | `StepSequence` — the terminal loop |
| 09 | `claude-code-plan` | Working in steps | Add/edit/remove plan steps |
| 10 | `claude-code-context` | CLAUDE.md | Locked rules that refuse to break |
| 11 | `claude-code-toolbelt` | What else it can do | `CardExplorer` — 5 cards |
| 12 | `replit-vs-claude-code` | Replit vs Claude Code | Comparison + sorting drill |
| 13 | `quiz` | Quick quiz | 5 questions, live score |
| 14 | `summary` | You learned | Recap chips + copyable starter prompt |

`data/slides.ts` (order) and `sections/index.ts` (components) **must stay
index-aligned** — index N in one is slide N in the other.

## 6. Where things live

```
src/
  components/   Reusable UI. Two carry repeated slide bodies:
                  StepSequence  → slides 3 and 8
                  CardExplorer  → slides 2 and 11
  sections/     One component per slide + index.ts (running order)
  data/         slides.ts (deck order), lesson.ts (ALL teaching copy)
  hooks/        useDeckNavigation, useDeckContext, useFullscreen,
                useElementHeight
  lib/          codeHighlight.ts (tokenizer), simulate.ts (fake responses),
                cn.ts
  styles/       index.css — design tokens and base styles
  types/        Shared TypeScript types
```

**All teaching copy lives in `src/data/lesson.ts`.** Wording changes should
never require touching a component.

## 7. Design tokens

Defined once in `src/styles/index.css` under `@theme`. Changing two values
re-themes the whole deck:

```css
--color-vibe-violet: #8b7ff0;   /* primary accent */
--color-vibe-coral:  #ff8f6b;   /* highlight accent */
```

The dark canvas (`--color-void`, `--color-navy-*`, `--color-line`) was kept
close to the original deck's depth on purpose — it reads well on a projector.
Only the accent pair moved (the original was Python blue + yellow).

Use the tokens. Do not hard-code hex values in components.

## 8. Rules and gotchas (learned the hard way — do not regress these)

1. **Everything is simulated, deterministically.** `lib/simulate.ts` holds pure
   functions. No model calls, no network, no `eval`. A live workshop must behave
   identically every run, on any wifi. **Never add a real API call to this deck.**
2. **The hero wordmark's space is an explicit box.** In `HeroWordmark.tsx` each
   letter is an `inline-block` inside its own mask; a plain space between two
   inline-blocks collapses to nothing and the title renders as "VIBECODING".
   The `letter === " "` branch renders a sized spacer instead. Keep it.
3. **`--word-size` is roughly half the original.** "VIBE CODING" is far wider
   than a six-letter word, so **width**, not height, decides whether slide 1
   fits. If the wordmark text changes, re-check this value at 1280×720.
4. **Prompts are not syntax-highlighted.** `CodeBlock` has a `variant="prompt"`
   that skips the tokenizer and renders plain sentences. Prompts are English —
   colouring them like code makes them look like something they are not. Use
   `variant="code"` only for terminal commands and real code.
5. **Blank lines in `CodeBlock` use a non-breaking space (U+00A0)**, not a
   regular space. A regular one collapses and the line loses its height.
6. **`CardExplorer` and `StepSequence` are shared.** Editing one changes two
   slides. That is intended — the room learns each interaction once — so check
   both slides after touching either.
7. **Logical layout only where it matters.** This deck is LTR-only English; no
   RTL requirement here (unlike the owner's Forsa project).
8. **Accessibility is not decoration.** One `h1`, a skip link as first tab stop,
   every control labelled, quiz correctness never signalled by colour alone,
   `prefers-reduced-motion` respected throughout. Keep all of it.

## 9. Decisions already made (don't re-litigate without asking)

- **Closing link → `https://claude.com/claude-code`.** The source deck linked to
  the owner's own "Journey AI" product; he was asked and chose Claude Code,
  since the workshop's axis is Claude Code. It is a single constant
  (`CLAUDE_CODE_URL`) at the top of `SummarySection.tsx`.
- **14 slides, not 12.** Two extra slides exist specifically to give Claude Code
  its four-slide run.
- **The tool list is Lovable / Replit / Cursor / Claude Code.** The owner named
  the first, second and fourth; Cursor was added to round out the landscape.
- **The canvas stayed dark and structurally identical.** The brief was "simple,
  consistent palette changes," not a redesign.
- **The starter prompt on slide 14 is deliberately a *good* prompt** — it names
  the thing, says who it is for, lists requirements, and asks Claude Code to
  explain itself and go step by step. It demonstrates the four habits taught on
  slides 4–5. Don't shorten it into a generic one-liner.

## 10. Verification status

Verified with a production build plus Playwright (Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`):

- **Viewports**: 1920×1080, 1280×720, 390×844 — zero console errors, zero
  horizontal overflow on every slide.
- **Interactions driven end to end**: explain-the-prompt panel; live prompt
  rewrite when the `what` field changes; opening the Claude Code tool card;
  adding and removing plan steps (numbering re-derives correctly); a CLAUDE.md
  rule refusing and showing the blocked panel; the sorting drill at 4/4; the
  quiz at 5/5 with the score reaching the summary slide.

Two bugs were found and fixed during that pass: the collapsing wordmark space
(§8.2) and the `what`/`who` box labels being clipped by the slide's scroll
container (fixed with `pt-3` on their wrapper in `FirstPromptSection.tsx`).

The Playwright scripts were scratch files and are **not** in the repo. There is
**no automated test suite** — see §11.

## 11. Known open items

1. **Not pushed to GitHub yet** — see §2. This is the only blocking item.
2. **No test suite.** All validation so far is a production build plus manual
   Playwright passes. Regressions are easy; a Playwright happy-path in-repo
   would be the highest-value addition.
3. **Not deployed anywhere.** `dist/` is a static bundle with a relative base,
   so Vercel / GitHub Pages / Netlify all work with no configuration.
4. **The repo is private.** Fine for presenting locally; if it should be
   deployed publicly or shared with the team, the owner flips it in GitHub
   settings.
5. **`npm install` may report advisories** inherited from the source project's
   dependency set. Not triaged.
