# Getting started

## Install

```bash
npm install @twobots/ui-theme
```

React 19 is a **peer** dependency — the components render into your React tree, and two copies of
React in one bundle is a class of bug worth designing out. Requires Node **>= 22.13** and a build
that transpiles this package's TypeScript: it ships raw `src/` with no compiled output. Vite
handles that without configuration; Next.js needs it in `transpilePackages`.

## The three things to get right

**1. Import the stylesheets, in order.** `tokens.css` first, always — see
[Stylesheets](styles.md) for why, and for the full order including your own files.

**2. Mount `SuitSprite` once, at the app root.** `CardFace` draws pips with
`<use href="#suit-H">`, so without the sprite in the tree every card renders blank. It is a
zero-size `<svg>` holding four `<defs>`; where it sits does not matter, only that it is mounted.

**3. Supply your own `splash__*` shell** if you use `MatchOverScreen`. This package styles the
ranked list and nothing above it.

## A minimal table

```tsx
import '@twobots/ui-theme/tokens.css'
import '@twobots/ui-theme/table-surface.css'
import '@twobots/ui-theme/card.css'
import '@twobots/ui-theme/rail.css'

import { CardFace, SuitSprite, type Card } from '@twobots/ui-theme/card'
import { RailButton } from '@twobots/ui-theme/rail'

export function App({ hand, stock }: { hand: readonly Card[]; stock: number }) {
  return (
    <>
      <SuitSprite />                        {/* once, anywhere */}
      <div className="table-surface" />     {/* the fixed mat */}

      <header className="rail">
        <RailButton label="Rules" glyph="rules" onClick={openRules} />
        <span />                            {/* the flexible middle slot is yours */}
        <RailButton label="Leave" glyph="leave" onClick={leave} dialog={false} />
      </header>

      {/* A face-down pile: card={null}, with the stack size. */}
      <CardFace card={null} size="back" count={stock} />

      {hand.map((c, i) => (
        <CardFace key={c} card={c} size="hand" style={{ '--i': i } as React.CSSProperties} />
      ))}
    </>
  )
}
```

`dialog={false}` on the leave control is not cosmetic: the prop defaults to `true` and emits
`aria-haspopup="dialog"`, which promises a screen-reader user that a dialog is about to appear.

`--i` passed through `style` is how a fan layout positions each card — the package leaves the
custom property to your CSS rather than owning the geometry.

## Your card type already fits

You do not need to import `Card`. If your engine declares its own
`` type Card = `${Rank}${Suit}` ``, that **is** this package's `Card`: TypeScript compares
template-literal types by their constituent unions, not by name. Pass your cards straight in.

The same applies to `MatchOverRow['id']` — any `string | number` seat identifier passes through
untouched.

## The stopping-point screen

```tsx
import '@twobots/ui-theme/match-over.css'
import { MatchOverScreen } from '@twobots/ui-theme/match-over'

<MatchOverScreen
  headline={headline(match)}     // YOUR outcome rules produce this string
  because={because(match)}       // and this one
  rows={seats}                   // already sorted, highest first — this does not sort
  onDone={() => retire(match)}
/>
```

Two things it will not do for you: it does not sort `rows`, and it does not decide what the
ending *was*. Both belong to the game — see [match-over](api/match-over.md).

## Where to go next

[card](api/card.md) · [rail](api/rail.md) · [match-over](api/match-over.md) ·
[Stylesheets](styles.md)
