# `@twobots/ui-theme/card`

A playing card — face up, face down, or face down with a stack count — plus the 52-card
vocabulary it speaks.

```ts
import { CardFace, SuitSprite, RANKS, SUITS, rankOf, suitOf } from '@twobots/ui-theme/card'
import type { Card, Rank, Suit, CardFaceProps, CardSize } from '@twobots/ui-theme/card'
```
```ts
import '@twobots/ui-theme/card.css'
```

Sources: `src/card/CardFace.tsx`, `src/card/SuitSprite.tsx`, `src/card/cards.ts`.

## The deck vocabulary

| Symbol | Type | Notes |
|---|---|---|
| `SUITS` | `readonly ['C','D','H','S']` | Clubs, diamonds, hearts, spades. |
| `Suit` | `'C' \| 'D' \| 'H' \| 'S'` | Derived from `SUITS`, not written twice. |
| `RANKS` | `readonly ['A','2',…,'K']` | **Ordered low to high**, the way every game in this lineup orders it. |
| `Rank` | `'A' \| '2' \| … \| 'K'` | Derived from `RANKS`. |
| `Card` | `` `${Rank}${Suit}` `` | A plain string: `"AS"`, `"10H"`. |
| `rankOf` | `(c: Card) => Rank` | Slices from the **end** — `"10"` is the only two-character rank. |
| `suitOf` | `(c: Card) => Suit` | Last character. |

A card is a **string, not an object**, matching the notation karu's engine already uses
internally. This module imports no engine types at all.

That is what makes the package usable by more than one game. A consuming app's own `Card`
type — whatever it is called in that app — passes straight into `CardFace` with no conversion,
because TypeScript compares template-literal types by their constituent unions rather than by
name. Two independently-declared `` `${Rank}${Suit}` `` types are the same type. An interface
would have required an adapter at every call site, or a shared dependency neither game wanted.

## `CardFaceProps`

| Prop | Type | Notes |
|---|---|---|
| `card` | `Card \| null` | **`null` renders a back.** |
| `size` | `CardSize` | `'hand' \| 'index' \| 'back'`. |
| `selected` | `boolean?` | Adds `is-selected`. |
| `dimmed` | `boolean?` | Adds `is-dimmed`. |
| `count` | `number?` | Stack size, drawn on a face-down pile. |
| `label` | `string?` | Overrides the generated screen-reader label. |
| `style` | `CSSProperties?` | Inline custom properties — a fan layout passes `--i` through it. |

`CardSize` is the size vocabulary, not a pixel value: the CSS owns the dimensions, and a size
here selects `card--hand` / `card--index` / `card--back`.

## `CardFace`

`(props: CardFaceProps) => ReactElement`

**One element, three sizes, no variant artwork.** Every state is a class on the same wrapper, so
there is never a second copy of a card to keep in step. This is also why a game needing a special
face-down treatment — karu's secret-set "peeled corner" — wraps `CardFace` rather than adding a
prop to it.

The face is **rank over pip**, not a full pip layout. At the sizes this actually renders — a 30px
index card — a conventional 2-10 pip field needs more room than there is. A face that renders at
no size in the app is not a face, it is dead code.

### Accessibility is generated, not requested

Every card carries `role="img"` and a spoken label: `"seven of hearts"`, never `"7 H"`. A
face-down card announces `"face-down card"`, or `"N face-down cards"` when `count` is set.

The default is the correct one, so the accessible name exists whether or not the caller thought
about it. `label` is there for the cases where the app knows better.

## `SuitSprite`

`() => ReactElement`

The four suit glyphs as SVG paths, mounted **once at the app root**. `CardFace` references them
with `<use href="#suit-H">`, so the sprite must be in the tree or every pip renders empty.

### Why not Unicode suit characters

This is the most consequential decision in the card design. `♥` (U+2665) and `♦` (U+2666) have
**emoji presentation variants**: on Android (Noto Color Emoji) and Windows (Segoe UI Emoji) they
resolve to full-colour emoji glyphs on a substantial share of font stacks — and a colour-emoji
glyph ignores `color:` entirely.

That would bake red into the artwork and silently no-op any four-colour deck option. Invisibly on
a Linux dev machine; universally on the target platform.

Each path is drawn in a ±50 box centred on the origin and carries **no fill of its own**, so
`fill: currentColor` on the `<use>` is the entire colour mechanism, and one glyph serves every
card size at any scale.

## Styling

`card.css` styles `.card` and its state classes. It deliberately contains no single game's own
card treatments — a pile's tap-target styling, a settlement sheet — which compose on top of
`.card` in each app's own CSS, imported after this file. See [Stylesheets](../styles.md) for the
import order.
