#!/usr/bin/env bash
#
# Scaffold a new interactive workshop deck.
#
#   scaffold.sh <target-dir> "<Deck Title>" [--lang ar] [--dir rtl] [--no-install]
#
# Produces a project that builds and runs on the spot: the shell, a hero
# slide and one example content slide, wired together. That matters — a
# scaffold you have to repair before you can see it is a scaffold that hides
# its own mistakes. Run `npm run dev` immediately and look at it, then start
# replacing the example slide with real ones.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TARGET="${1:-}"
TITLE="${2:-}"
LANG_CODE="en"
DIR_CODE="ltr"
INSTALL=1

if [[ -z "$TARGET" || -z "$TITLE" ]]; then
  echo "usage: scaffold.sh <target-dir> \"<Deck Title>\" [--lang ar] [--dir rtl] [--no-install]" >&2
  exit 2
fi

shift 2
while [[ $# -gt 0 ]]; do
  case "$1" in
    --lang) LANG_CODE="$2"; shift 2 ;;
    --dir)  DIR_CODE="$2";  shift 2 ;;
    --no-install) INSTALL=0; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

if [[ "$DIR_CODE" != "ltr" && "$DIR_CODE" != "rtl" ]]; then
  echo "--dir must be ltr or rtl" >&2
  exit 2
fi

if [[ -e "$TARGET" && -n "$(ls -A "$TARGET" 2>/dev/null)" ]]; then
  echo "refusing to scaffold into non-empty directory: $TARGET" >&2
  exit 1
fi

SLUG="$(printf '%s' "$TITLE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
DESCRIPTION="$TITLE — an interactive workshop."
# The wordmark is animated per letter and sized against viewport width, so a
# long title breaks the opening slide. Uppercase reads better at that size.
WORDMARK="$(printf '%s' "$TITLE" | tr '[:lower:]' '[:upper:]')"

mkdir -p "$TARGET"/{src,public}
cp -R "$SKILL_DIR/assets/shell/." "$TARGET/src/"
cp "$SKILL_DIR/assets/project/"{vite.config.ts,tsconfig.json,tsconfig.app.json,tsconfig.node.json,.gitignore} "$TARGET/"

# --- templated files -------------------------------------------------------
subst() {
  sed -e "s|__TITLE__|${TITLE}|g" \
      -e "s|__SLUG__|${SLUG}|g" \
      -e "s|__DESCRIPTION__|${DESCRIPTION}|g" \
      -e "s|__LANG__|${LANG_CODE}|g" \
      -e "s|__DIR__|${DIR_CODE}|g" "$1"
}
subst "$SKILL_DIR/assets/project/index.html"   > "$TARGET/index.html"
subst "$SKILL_DIR/assets/project/package.json" > "$TARGET/package.json"

# --- deck config -----------------------------------------------------------
sed -e "s|^export const DECK_TITLE = .*|export const DECK_TITLE = \"${TITLE}\";|" \
    -e "s|^export const DECK_LOCALE = .*|export const DECK_LOCALE = \"${LANG_CODE}\";|" \
    -e "s|^export const DECK_DIRECTION = .*|export const DECK_DIRECTION = \"${DIR_CODE}\" as DeckDirection;|" \
    "$SKILL_DIR/assets/shell/deck.config.ts" > "$TARGET/src/deck.config.ts"

# The Arabic face is only worth downloading when the deck actually uses it.
if [[ "$LANG_CODE" == "ar" ]]; then
  sed -i 's|import "@fontsource-variable/jetbrains-mono";|import "@fontsource-variable/jetbrains-mono";\nimport "@fontsource-variable/noto-sans-arabic";|' "$TARGET/src/main.tsx"
fi

# --- favicon ---------------------------------------------------------------
cat > "$TARGET/public/favicon.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#05060e"/>
  <path d="M9 12.5 13.5 16 9 19.5" fill="none" stroke="#8b7ff0" stroke-width="2.4"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.5 20.5h6.5" fill="none" stroke="#ff8f6b" stroke-width="2.4"
        stroke-linecap="round"/>
</svg>
SVG

# --- starter deck data -----------------------------------------------------
mkdir -p "$TARGET/src/data" "$TARGET/src/sections"

cat > "$TARGET/src/data/slides.ts" <<TS
import type { SlideMeta } from "@/types";

/**
 * The running order of the deck. \`index\` in every hook and control is an
 * index into this array, so adding a slide means editing this file and the
 * matching entry in \`sections/index.ts\` — they are parallel arrays and
 * nothing checks the alignment for you.
 *
 * \`cue\` is for the presenter: one line saying what they say here.
 */
export const SLIDES: SlideMeta[] = [
  {
    id: "hero",
    label: "Welcome",
    cue: "Set the tone, then start.",
  },
  {
    id: "first-idea",
    label: "The first idea",
    cue: "Replace this slide with the first thing the room must understand.",
  },
];

export const TOTAL_SLIDES = SLIDES.length;

/** Slide indices referenced by name elsewhere in the app. */
export const SLIDE_INDEX = Object.fromEntries(
  SLIDES.map((slide, index) => [slide.id, index]),
) as Record<string, number>;
TS

cat > "$TARGET/src/data/lesson.ts" <<TS
/**
 * Every word the room reads lives here — never inside a component.
 *
 * This is what makes the deck retargetable: changing the subject should mean
 * rewriting this file, not touching the sections. Keep sentences short enough
 * to read from the back of a room.
 */
import { Rocket, Sparkles, Wrench } from "lucide-react";
import type { ExplorerCard } from "@/types";

interface LessonCards {
  eyebrow: string;
  title: string;
  lead: string;
  hint: string;
  placeholder: string;
  cards: ExplorerCard[];
}

export const HERO = {
  /** Short — this is animated per letter and sized against viewport width. */
  wordmark: "__WORDMARK__",
  kicker: "Introduction",
  headline: "One line saying what this session is about",
  lead: "One sentence saying what the room will be able to do afterwards.",
  cta: "Start",
} as const;

export const FIRST_IDEA = {
  eyebrow: "Start here",
  title: "The first idea",
  lead: "One sentence. One idea. If you need the word \"and\", it is two slides.",
  hint: "Pick one",
  placeholder: "Choose a card to see what it looks like.",
  cards: [
    {
      id: "one",
      title: "First thing",
      icon: Sparkles,
      example: "A short explanation, in the audience's vocabulary, not yours.",
      snippet: "An example short enough to read from the back of the room.",
    },
    {
      id: "two",
      title: "Second thing",
      icon: Wrench,
      example: "Parallel in weight to the first — this grid implies equality.",
      snippet: "Another example, the same shape as the one above it.",
    },
    {
      id: "three",
      title: "Third thing",
      icon: Rocket,
      example: "Four to six cards is the comfortable range; two looks unfinished.",
      snippet: "A third example. Keep them the same length as each other.",
    },
  ],
} satisfies LessonCards;
TS
sed -i -e "s|__WORDMARK__|${WORDMARK}|g" -e "s|__TITLE__|${TITLE}|g" "$TARGET/src/data/lesson.ts"

cat > "$TARGET/src/sections/HeroSection.tsx" <<'TSX'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { ActionButton } from "@/components/ActionButton";
import { HeroWordmark } from "@/components/HeroWordmark";
import type { SectionProps } from "@/components/PresentationSection";
import { HERO } from "@/data/lesson";
import { useDeck } from "@/hooks/useDeckContext";
import { useElementHeight } from "@/hooks/useElementHeight";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The opening slide. It carries the deck's only <h1>; every other slide
 * heading is an <h2> supplied by PresentationSection, which is what keeps the
 * document outline honest for screen readers.
 */
export function HeroSection({ registerRef }: SectionProps) {
  const { next } = useDeck();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // 0 while the hero fills the screen, 1 once it has scrolled fully away.
  //
  // Window scroll rather than a target-relative scroll: framer stops updating
  // a target-based progress once the element leaves the viewport, which would
  // freeze the wordmark part-way through its move.
  const { scrollY } = useScroll();
  const heroHeight = useElementHeight(sectionRef, 1);
  const progress = useTransform(scrollY, [0, Math.max(heroHeight, 1)], [0, 1], {
    clamp: true,
  });

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      ref={(node) => {
        sectionRef.current = node;
        registerRef(node);
      }}
      aria-labelledby="hero-heading"
      className="deck-slide relative flex min-h-[var(--vh-full)] w-full flex-col"
    >
      <h1 id="hero-heading" className="sr-only">
        {HERO.headline}
      </h1>

      <HeroWordmark text={HERO.wordmark} progress={progress} />

      <div
        className="relative z-20 mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-start px-5 text-center sm:px-8"
        style={{
          paddingTop: "var(--hero-pad-top)",
          paddingBottom: "calc(var(--chrome-bottom) - 1rem)",
        }}
      >
        <motion.p
          {...fadeUp(1.0)}
          className="flex items-center gap-4 font-display text-[clamp(1.15rem,2.6vw,2.4rem)] font-light tracking-[0.34em] text-accent-warm uppercase"
        >
          <span aria-hidden="true" className="h-px w-8 bg-accent-warm/40 sm:w-14" />
          {HERO.kicker}
          <span aria-hidden="true" className="h-px w-8 bg-accent-warm/40 sm:w-14" />
        </motion.p>

        <motion.p
          {...fadeUp(1.12)}
          className="mt-[clamp(0.85rem,2vh,2rem)] max-w-[24ch] text-[clamp(1.15rem,2.15vw,2.15rem)] leading-[1.25] font-medium tracking-[-0.02em] text-chalk text-balance-tight sm:max-w-[30ch]"
        >
          {HERO.headline}
        </motion.p>

        <motion.p
          {...fadeUp(1.24)}
          className="mt-[clamp(0.5rem,1.6vh,1.1rem)] max-w-[46ch] text-[clamp(0.95rem,1.25vw,1.3rem)] leading-relaxed text-mist"
        >
          {HERO.lead}
        </motion.p>

        <motion.div
          {...fadeUp(1.38)}
          className="mt-[clamp(1.1rem,2.6vh,2.6rem)] flex flex-col items-center gap-3.5"
        >
          <ActionButton
            variant="accent"
            size="lg"
            icon={ArrowDown}
            onClick={next}
            className="glow-accent"
          >
            {HERO.cta}
          </ActionButton>
        </motion.div>
      </div>
    </section>
  );
}
TSX

cat > "$TARGET/src/sections/FirstIdeaSection.tsx" <<'TSX'
import { CardExplorer } from "@/components/CardExplorer";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { FIRST_IDEA } from "@/data/lesson";

/**
 * An example content slide. Replace it — but keep the shape: read the copy
 * from data/lesson.ts, render one interaction, teach one idea.
 */
export function FirstIdeaSection({ index, registerRef }: SectionProps) {
  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={FIRST_IDEA.eyebrow}
      title={FIRST_IDEA.title}
      lead={FIRST_IDEA.lead}
    >
      <CardExplorer
        cards={FIRST_IDEA.cards}
        hint={FIRST_IDEA.hint}
        placeholder={FIRST_IDEA.placeholder}
      />
    </PresentationSection>
  );
}
TSX

cat > "$TARGET/src/sections/index.ts" <<'TS'
import type { ComponentType } from "react";
import type { SectionProps } from "@/components/PresentationSection";
import { HeroSection } from "@/sections/HeroSection";
import { FirstIdeaSection } from "@/sections/FirstIdeaSection";

/**
 * Running order, index-aligned with SLIDES in data/slides.ts. Index N here is
 * slide N there. Add to both in the same change.
 */
export const SECTION_COMPONENTS: ComponentType<SectionProps>[] = [
  HeroSection,
  FirstIdeaSection,
];
TS

echo "Scaffolded ${TITLE} in ${TARGET} (lang=${LANG_CODE}, dir=${DIR_CODE})"

if [[ "$INSTALL" == "1" ]]; then
  (cd "$TARGET" && npm install)
  echo
  echo "Next: cd ${TARGET} && npm run dev"
  echo "Then verify with npm run build before calling it done."
else
  echo "Skipped npm install. Run it before npm run dev."
fi
