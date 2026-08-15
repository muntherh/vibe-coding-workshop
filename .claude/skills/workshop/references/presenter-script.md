# The presenter script

A deck is half the deliverable. The other half is knowing what to say over it.
Most people who ask for a workshop site are going to stand in front of a room
and present it, often for the first time, and a deck without a script leaves
them to improvise the part that actually decides whether the session lands.

Build the script after the deck is finished and verified, using
`assets/script/template.html`.

## The language rule

**The script is written in the language of the deck.** Read
`src/deck.config.ts` and follow it:

| `DECK_LOCALE` | Script language | `dir` on the page |
| --- | --- | --- |
| `en` | English | `ltr` |
| `ar` | Arabic | `rtl` |

Translate *everything* — the headings, the chips, the "Do" tag, the section
titles, the pre-flight list. A script whose spoken lines are Arabic but whose
furniture is English reads as unfinished, and the presenter has to translate
your section headers in their head while presenting.

Two things stay in the deck's own language regardless, because the presenter
is pointing at them on screen while saying them: **slide titles** and
**interface terms**. In an Arabic script for an English deck, say
`Claude Code`, not a translation of it — the room is looking at those words.
Wrap them in `<bdi>` so the bidi algorithm does not reorder them.

Ask which language only when the deck's locale genuinely does not settle it —
for instance an English deck being presented to an Arabic-speaking room, which
is common and where the right answer is usually an Arabic script with English
interface terms.

## Write it to be spoken, not read

This is the part that separates a useful script from a summary of the deck.
The presenter is reading in a dim room, glancing down between sentences, very
often in their second language. Write for that.

**One sentence, one breath.** Keep spoken lines under about fifteen words and
break paragraphs after two or three. The presenter looks down, takes a line,
and looks back up — long paragraphs lose their place on the way up.

**Plain words over precise ones.** Say "the most important slide", not "the
centre of gravity". Avoid idioms, phrasal verbs and anything hard to
pronounce. If a word would make a non-native speaker hesitate, it costs more
than the nuance it buys.

**Write the actual sentences.** "Introduce the four tools" is not a script —
it hands the hard part back to the presenter. Write the words they will say.

**Say it out loud as you write.** Anything you stumble over, they will
stumble over in front of a room.

## The three-part structure

Every slide gets exactly three things, visually separated so the eye can tell
them apart at a glance:

1. **Say** (`.say`, orange) — the words, verbatim.
2. **Do** (`.do`, grey) — the action on screen. Never read aloud. Say *why*
   when the reason is not obvious: "Reveal the steps one at a time, or the
   room reads ahead of you."
3. **Bridge** (`.bridge`) — one sentence that carries the room into the next
   slide. Without it, presenters stop dead at each slide change, and the deck
   feels like fourteen separate talks.

## Timing

Give each slide a duration **and** a cumulative range: `4 min · 27→31`. The
cumulative number is the useful one — mid-session, the presenter needs to know
whether they are behind, and "4 minutes" cannot tell them that.

Budget 2–4 minutes per slide, more for interactive ones, then total it up and
put the real number in the header. If the total comes out different from what
you estimated earlier, print the real number rather than the round one.

## Mark what changes the preparation

Chips on the slide header, for the things that need something extra:

- `chip talk` — the room participates. The presenter must plan to stop.
- `chip net` — the slide needs the network, so it needs a fallback.

## The two appendices

Both come from the same question: what will actually go wrong?

**Questions you should expect.** Write the three or four questions an
attendee will really ask, in their words, with answers written to be spoken.
Include the uncomfortable one — for a vibe-coding workshop that is "so we do
not need to learn programming any more?" A presenter who has an answer ready
handles that moment well; one who does not loses the room's trust.

**If something goes wrong.** Cover at minimum: the network drops, time runs
short, the room is silent, and the room is more expert than expected. For the
time one, say which slides to cut *and which never to cut* — under pressure
people cut the wrong things, usually the interactive slides that are the whole
lesson.

## Delivering it

Publish it as an artifact rather than leaving it as a file. Presenters open it
on a phone while the laptop is showing the deck, and a link is what they can
actually reach from there.
