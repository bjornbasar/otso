# otso — `@twobots/ui-theme`

> A **reading-guide map**, not a tutorial. Short, because the package is small — but it is
> here for a reason worth more than its line count: it is the estate's clearest example of
> **when to extract, and where to draw the line**. Sibling tour: [datvi](../datvi/CODE-TOUR.md).

## 0. Orientation — why this exists at all

Read the [README](README.md) opening before the code. The origin story is the lesson:

> *"Extracted from Tongits TwoBots after a sibling game hand-retyped these same values once
> already and it still took a live side-by-side screenshot comparison to catch what a
> per-property copy missed."*

That sibling game is [andarta](../andarta/CODE-TOUR.md) — read its §2 for the actual
incident (the mat texture, the card-back crosshatch, a `z-index` stacking bug that painted
the mat over an entire menu screen), not just the one-sentence summary. That is the whole
argument for extraction, stated as evidence rather than principle. A per-property copy
**looked** right and was not. The failure was invisible to code review and visible only to
a screenshot diff — which is exactly the class of bug that shared source removes rather
than mitigates.

Note what was *not* claimed: nobody argued the second game would be faster to build. The
claim is narrower and more honest — that "matching the reference game's look" should be an
import rather than a re-authoring exercise each sibling repeats.

## 1. What is in here

| Area | Files | What it carries |
|---|---|---|
| Design tokens | [`src/tokens.css`](src/tokens.css) | The values every sibling must share — the thing that was hand-retyped |
| Table chrome | [`src/table-surface.css`](src/table-surface.css) | The play surface itself |
| Cards | [`src/card/CardFace.tsx`](src/card/CardFace.tsx) | Generic playing-card rendering — deliberately not Tongits-specific |
| Overlays | [`src/overlay/overlay.css`](src/overlay/overlay.css) | Dialog / sheet shell |
| Rail | [`src/rail/RailButton.tsx`](src/rail/RailButton.tsx), [`src/rail/rail.css`](src/rail/rail.css) | Header strip, utility button, control |
| End screen | [`src/match-over/MatchOverScreen.tsx`](src/match-over/MatchOverScreen.tsx) | Ranked stopping-point screen |
| Thinking indicator | [`src/thinking/ThinkingDots.tsx`](src/thinking/ThinkingDots.tsx), [`src/thinking/thinking.css`](src/thinking/thinking.css) | The dots a bot shows while it "considers" a move |

### `ThinkingDots` is the extraction rule's cleanest demonstration

Added after the rest, and worth a stop because of *where its other half went*.

"A bot is thinking" needs two things: dots that animate on screen, and a decision about how
long to wait before the bot acts. They arrived together, as one feature, in one sitting. They
did **not** ship together: the dots are here, and the delay — `botThinkingDelayMs` — is in
[datvi](../datvi/CODE-TOUR.md) under `@twobots/game-kit/timing`.

Nothing forced that. One package would have been more convenient, and a component that owned
its own timing would have been a smaller diff. The split happened because the rule this
package is named for was applied to a feature that straddled it, and the answer came out in
two pieces: **an animation is visual material, and a duration is not.** A `ui-theme` that
shipped the delay would have started lying about itself at exactly the moment it became
convenient to.

That is the test both these packages exist to demonstrate, and it is easier to see here than
in the original extraction, because here there was no prior duplication to respond to — only
the question of which package each half belonged in. Read datvi's side of it too; the two
tours describe the same afternoon from opposite ends.

## 2. The shape decision — ships raw source

This package **ships raw source**; consuming apps compile it with their own
Vite/TypeScript pipeline. No build step, no `dist/`, no bundler config to keep in sync
across three repos.

The trade is real and worth naming: consumers must be able to compile TSX and CSS
themselves, so this is only viable because every sibling is the same stack. A published
package aimed at strangers could not make that assumption.

## 3. What stayed behind

The interesting half of an extraction is what you *don't* move. `karu` still owns its own
`src/ui/botNames.ts` — because the pool is shared but the *joke* is not: karu is Estonian
for bear, so all three seats at the table are the same animal in different languages, and
only karu knows that.

**Generic rendering moved; product identity stayed.** That is the line.

## 4. Active-recall exercises

1. **Why a screenshot diff and not a test?** The README says a per-property copy passed
   review and still diverged. What kind of test would have caught it, and why is sharing the
   source a better answer than writing that test in every sibling?
2. **Why raw source instead of a built `dist/`?** Name the assumption that makes this safe
   here and unsafe for a package published to strangers.
3. **Draw the boundary.** `CardFace` is here; `botNames` is in [datvi](../datvi/CODE-TOUR.md);
   the bot-name *joke* is in karu. State the rule those three placements follow.

---

*Tour covers otso @ `1df3c30`. Companion: [README.md](README.md), [DOCS.md](DOCS.md). Sibling: [datvi](../datvi/CODE-TOUR.md) — the non-visual half.*
