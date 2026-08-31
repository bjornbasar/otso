# @twobots/ui-theme

Shared visual material for the [twobots.dev](https://twobots.dev) card-game lineup: design
tokens, a generic card face, table-shell chrome, an overlay shell, the rail header strip, and a
ranked stopping-point screen.

```bash
npm install @twobots/ui-theme
```

## What is in it

| Import | Kind | Reference |
|---|---|---|
| `@twobots/ui-theme/tokens.css` | stylesheet | [Stylesheets](styles.md) |
| `@twobots/ui-theme/table-surface.css` | stylesheet | [Stylesheets](styles.md) |
| `@twobots/ui-theme/card.css` + `@twobots/ui-theme/card` | stylesheet + components | [card](api/card.md) |
| `@twobots/ui-theme/overlay.css` | stylesheet **only** | [Stylesheets](styles.md) |
| `@twobots/ui-theme/rail.css` + `@twobots/ui-theme/rail` | stylesheet + component | [rail](api/rail.md) |
| `@twobots/ui-theme/match-over.css` + `@twobots/ui-theme/match-over` | stylesheet + component | [match-over](api/match-over.md) |

Nine entry points, no root barrel. A game that wants the card face should not pull a
stopping-point screen into its bundle.

## Everything here was extracted, never designed up front

Each piece was lifted from a **running app** after a second app had independently converged on
the same shape — usually by hand-copying it. That ordering is the package's whole design rule,
and it is why the surface is small.

The `table-surface.css` header records what happens without it: andarta hand-retyped karu's
token values once, and it still took a live side-by-side screenshot comparison to catch what a
per-property copy had missed. Extraction is a response to duplication that already exists, not a
guess about duplication that might.

The same rule decides what stays out. `overlay.css` ships as CSS with **no React wrapper**,
because both consumers already owned real focus management and Escape handling that does not
belong in a shared component. `MatchOverScreen` emits `splash__*` classes it deliberately does
**not** style, because the two apps' title-screen shells genuinely differ and shipping CSS for
them would collide at equal specificity with whichever app's rule loaded second.

## It ships raw source

`files` is `["src"]`. The `.ts`/`.tsx` entry points are compiled by the consuming app's own
Vite/TypeScript pipeline, and the `.css` entry points are imported directly by its bundler.
There is no `dist` and no build step here.

React 19 is a **peer** dependency, not a dependency — the components must render into the host
app's React tree, and two copies of React in one bundle is a class of bug worth designing out
rather than debugging.

## Sibling package

[`@twobots/game-kit`](https://www.npmjs.com/package/@twobots/game-kit) holds the non-visual
logic — bot naming, feedback primitives, storage primitives. The split is along that line and
not a finer one: a retry queue is not visual material and does not belong under a name that says
`ui-theme`.

## Nothing here knows a game's rules

`CardFace` renders a card; it has no notion of a legal play. `MatchOverScreen` renders a ranked
list; each caller sorts its own rows and writes its own headline from its own outcome rules.
`RailButton` renders a control; what it opens is the app's business.

This is the constraint that keeps one package serving several games. The moment a component
grows a prop for one game's special case — a secret-set peeled corner, a house-rule toggle — it
stops being shared material and becomes that game's component living in the wrong repository.
The answer is always to wrap it in the app.
