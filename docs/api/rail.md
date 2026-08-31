# `@twobots/ui-theme/rail`

The header strip's utility control, and the glyph set it draws from.

```ts
import { RailButton, RAIL_GLYPH } from '@twobots/ui-theme/rail'
import type { RailButtonProps, RailGlyph } from '@twobots/ui-theme/rail'
```
```ts
import '@twobots/ui-theme/rail.css'
```

Source: `src/rail/RailButton.tsx`.

| Symbol | Type | Notes |
|---|---|---|
| `RAIL_GLYPH` | `{ rules, house, leave }` | SVG path data, `as const`. An open book, sliders, a door with an arrow out. |
| `RailGlyph` | `'rules' \| 'house' \| 'leave'` | `keyof typeof RAIL_GLYPH` — adding a glyph widens the type automatically. |
| `RailButtonProps` | interface | See below. |
| `RailButton` | `(props: RailButtonProps) => …` | A control showing a word on a roomy viewport and a glyph on a narrow one. |

## `RailButtonProps`

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Always the accessible name — see below. |
| `glyph` | `RailGlyph` | Which path to draw. |
| `onClick` | `() => void` | |
| `dialog` | `boolean?` | Adds `aria-haspopup="dialog"`. **Defaults to `true`.** |

`dialog` defaults to `true` because on this rail most controls do open a dialog; a control that
navigates away instead — a "leave" action — passes `false`. Getting this wrong is not cosmetic:
`aria-haspopup="dialog"` promises a screen-reader user that a dialog is about to appear.

## The label survives the word being hidden

`label` is emitted **three times over**: as the visible `.rail__word` text, as `aria-label`, and
as `title`. The redundancy is the point — the narrow-viewport layout hides the word with CSS and
shows only the glyph, and an accessible name that lives in hidden text disappears with it.

## Inline paths, not a sprite

There are three glyphs, they render at 16px, and the package's existing sprite
(`SuitSprite`, in [card](card.md)) is the card suits — a different concern with a different
lifecycle. Inlining three short paths beats coupling the rail's lifetime to the deck's.

Not emoji, for the same reason the suits are not: Android renders those as colour glyphs, which
would sit oddly beside a hand-drawn deck and cannot inherit `currentColor`.

## `RailButton` has no explicit return-type annotation

Deliberate, and worth knowing before you "fix" it. Annotating `ReactElement` widens `props` to
`unknown` on the inferred type, and this repo's DOM-free tests call the component as a plain
function and inspect the returned element's `props` directly. The annotation would break that at
every call site, in exchange for a type the compiler already infers correctly.

## The division of labour with your app

`RailButton` emits `.rail__help` / `.rail__word` / `.rail__icon` — classes **this package does not
style**. `rail.css` supplies `.chrome-button` (the look) and `.rail` (the 3-slot grid: leading
controls, a flexible ticker region, trailing controls). Your app's own CSS controls the
narrow-viewport word/icon swap via `.rail__help`, and supplies the row height and the content of
the three slots.

That grid is not a design proposal — it was verified identical between karu and andarta, down to
`grid-template-columns` and `gap`, before this file existed. It is the column math both had
already converged on independently.
