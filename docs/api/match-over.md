# `@twobots/ui-theme/match-over`

The stopping-point screen: a full-screen cover with a headline, a one-line explanation, and a
ranked scoreboard.

```ts
import { MatchOverScreen } from '@twobots/ui-theme/match-over'
import type { MatchOverScreenProps, MatchOverRow } from '@twobots/ui-theme/match-over'
```
```ts
import '@twobots/ui-theme/match-over.css'
```

Source: `src/match-over/MatchOverScreen.tsx`.

## `MatchOverRow`

| Field | Type | Notes |
|---|---|---|
| `id` | `string \| number` | Opaque to this component. |
| `name` | `string` | |
| `score` | `number` | |
| `isYou` | `boolean` | Marks the viewer's own row. |

`id`, **not `key`** — that name is React's own reserved prop and cannot be read from within a
component. As with `CardFace`'s `card`, a consumer's own seat identifier only needs to be
structurally a `string | number` to pass straight through.

## `MatchOverScreenProps`

| Prop | Type | Notes |
|---|---|---|
| `headline` | `string` | Why it ended, in the player's terms. |
| `because` | `string` | The one line explaining the headline. |
| `rows` | `readonly MatchOverRow[]` | **Rendered in the order given — this component does not sort.** |
| `onDone` | `() => void` | The only action. |
| `doneLabel` | `string?` | Defaults to `'Done'`. |
| `note` | `string?` | Defaults to `'a good place to stop'`. |

`headline` and `because` are **strings the caller computes**, not outcome data this component
interprets. karu's `headline()`/`because()` and andarta's `matchHeadline()`/`matchBecause()` each
read real per-game rules to produce them. Endings can look alike on a scoreboard — two games can
finish 41-38 for entirely different reasons — so `because` exists to say which one happened, and
only the game knows.

`rows` is rendered as given because each caller already ranks its own seats, highest first,
before calling in. Sorting here would be a second opinion about ranking, and a wrong one for any
game whose tiebreak is not "higher score".

## `MatchOverScreen`

`(props: MatchOverScreenProps) => …`

Renders a `role="dialog" aria-modal="true"` cover and **moves focus to the done button on
mount**, with `preventScroll: true` so the focus call cannot scroll the layout underneath.

### One button, and no "play again"

A full-screen cover rather than a relabelled "next round" button is the entire point of the
feature: a match has to end somewhere noticeable, not fade into a footnote under a settlement the
player was already dismissing.

There is deliberately no "play again". Starting another match is a thing a player goes and does,
not a thing offered at the moment they just lost. What `onDone` *means* — retiring a stored
match, navigating to a title screen — is entirely the caller's concern.

## What it styles, and what it pointedly does not

`match-over.css` owns the ranked-list family (`.match-over__*`) and nothing else. It was lifted
verbatim from karu's `.final*` family, confirmed byte-identical to andarta's independently
converged copy, and renamed — `.final` alone was too generic a name for a published package to
claim. Scores are set in tabular figures, because a column that shifts by a pixel per digit reads
as sloppier than the game is.

The component also emits `splash` / `splash__sheet` / `splash__title` / `splash__lede` /
`splash__play` / `splash__foot` — and this package supplies **no CSS for any of them**. Both
apps' title screens already own that shell and differ from each other today, so shipping rules
here would collide at equal specificity with whichever app's stylesheet loaded second. Only the
ranked list is genuinely duplicated CSS; the rest is shared-by-convention, which is not the same
thing and is not extractable.

**The practical consequence:** the screen renders unstyled above the scoreboard unless your app
provides the `splash__*` shell. That is expected, not a missing import.
