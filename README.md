# @twobots/ui-theme

Shared visual material for the [`twobots.dev`](https://twobots.dev) card-game lineup — design
tokens, generic playing-card rendering, table-shell chrome, a dialog/sheet overlay shell, and the
rail header strip + utility-button look. Ships raw source; consuming apps compile it with their
own Vite/TypeScript pipeline.

Extracted from Tongits TwoBots after a sibling game hand-retyped these same values once already
and it still took a live side-by-side screenshot comparison to catch what a per-property copy
missed. This package exists so "matching the reference game's look" is an import, not a
re-authoring exercise every sibling game repeats.

Sibling to [`@twobots/game-kit`](https://www.npmjs.com/package/@twobots/game-kit) (non-visual
game logic — a bot-naming pool and feedback-sending primitives) — kept as a separate package
since neither belongs under a name that says "ui-theme."

## What's in it, and what deliberately isn't

**In scope** — presentation material with no game logic behind it:
- `tokens.css` — colors, the woven-mat texture tokens, shadows, card geometry, a shared z-index
  scale, the splash/title-screen palette.
- `table-surface.css` — the fixed, full-bleed woven background layer.
- `card/` — `CardFace`, `SuitSprite`, and the generic portion of card rendering (rank/pip/back;
  not any one game's own card treatment).
- `overlay.css` — `.overlay-backdrop` / `.overlay-panel` (+ `.overlay-panel--elevated`), the
  dimmed, centred dialog shell shared by every reference screen and settlement/reveal sheet.
  CSS only — each app keeps its own focus management, Escape handling, and panel content.
- `rail.css` — `.rail`, the 3-slot header-strip grid (leading controls | flexible ticker/status |
  trailing controls) both apps already had the same column math for; and `.chrome-button`, the
  small utility-button look (Help/Report/Rules/Feedback pills) andarta's own CSS had already
  copied from karu's `.rail__help` by hand. No size opinion beyond the pill's own common one — a
  button that needs a different size (karu's action bar, deliberately large 48px primary tap
  targets rather than a small utility pill) overrides just that, keeping the shared look.

**Out of scope, stays in each app** — anything with real game rules or a real layout decision
behind it: melds, discard piles, settlement sheets, a widow slot, and the action console itself.
karu's action console is a fixed 2-row grid whose action row deliberately never wraps ("wrapping
would push the board up mid-turn") and scrolls horizontally instead; andarta's is a plain
flex-wrap row. Same name, genuinely different layout intent — sharing the mechanism here would be
a real behavior change on whichever side didn't already work that way, not a mechanical dedup.
This is shared *material*, not a shared game-UI framework. A game that needs a special face-down
treatment (a secret-set reveal, for instance) wraps `CardFace` rather than `CardFace` growing a
prop for it.

## Using it

```bash
npm install @twobots/ui-theme
```

Pin an exact version rather than `^`/`latest` — deliberately, not by default. Two apps floating
on "whatever's newest" is exactly the kind of silent divergence this package exists to prevent.

```ts
import '@twobots/ui-theme/tokens.css'
import '@twobots/ui-theme/table-surface.css'
import '@twobots/ui-theme/card.css'
import '@twobots/ui-theme/overlay.css'
import '@twobots/ui-theme/rail.css'
import { CardFace, SuitSprite, type Card } from '@twobots/ui-theme/card'
```

A dialog screen combines `overlay-backdrop`/`overlay-panel` with the app's own dialog markup:

```tsx
<div className="overlay-backdrop">
  <div className="my-screen overlay-panel" role="dialog" aria-modal="true" aria-labelledby="…">
    {/* app-owned: header, close button, focus management, Escape handling, content */}
  </div>
</div>
```

Import `tokens.css` first, before any of your own app's stylesheets — same reasoning as in karu:
two stylesheets defining the same custom property at equal specificity is a cascade-order lottery.

`CardFace`'s `card` prop expects a plain string in `` `${Rank}${Suit}` `` form (e.g. `"AS"`,
`"10H"`). A consuming app's own `Card` type only needs to be structurally the same shape to pass
straight through — no conversion needed if your engine already uses this notation.

## License

MIT — see [LICENSE](LICENSE).
