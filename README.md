# otso

Shared visual material for the [`twobots.dev`](https://twobots.dev) card-game lineup — design
tokens, generic playing-card rendering, and the woven table-surface background. Published to npm
as **`@twobots/ui-theme`**.

Extracted from [karu](https://github.com/bjornbasar/karu) (Tongits TwoBots) after
[andarta](https://github.com/bjornbasar/andarta) hand-retyped these same values once already and
it still took a live side-by-side screenshot comparison to catch what a per-property copy missed
(see andarta's own `DOCS.md`, issue #26). This package exists so "matching karu's look" is an
import, not a re-authoring exercise every sibling game repeats.

Repo name **otso** — Finnish sacred bear-name ("honey-paw"), matching the workspace's
authorship-naming convention (the repo/package split mirrors how each game's own repo name
differs from its store-facing name, e.g. `karu` → "Tongits TwoBots").

## What's in it, and what deliberately isn't

**In scope** — presentation material with no game logic behind it:
- `tokens.css` — colors, the woven-mat texture tokens, shadows, card geometry, a shared z-index
  scale, the splash/title-screen palette.
- `table-surface.css` — the fixed, full-bleed woven background layer.
- `card/` — `CardFace`, `SuitSprite`, and the generic portion of card rendering (rank/pip/back;
  not any one game's own card treatment).

**Out of scope, stays in each app** — anything with real game rules behind it: melds, discard
piles, settlement sheets, a widow slot, an action console. This is shared *material*, not a
shared game-UI framework. A game that needs a special face-down treatment (a secret-set reveal,
for instance) wraps `CardFace` rather than `CardFace` growing a prop for it.

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
import { CardFace, SuitSprite, type Card } from '@twobots/ui-theme/card'
```

Import `tokens.css` first, before any of your own app's stylesheets — same reasoning as in karu:
two stylesheets defining the same custom property at equal specificity is a cascade-order lottery.

`CardFace`'s `card` prop expects a plain string in `` `${Rank}${Suit}` `` form (e.g. `"AS"`,
`"10H"`). A consuming app's own `Card` type only needs to be structurally the same shape to pass
straight through — no conversion needed if your engine already uses this notation.

## License

MIT — see [LICENSE](LICENSE).
