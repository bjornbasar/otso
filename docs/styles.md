# Stylesheets

Six stylesheets, each its own entry point. Three are standalone; three pair with the components
documented under [API Reference](api/card.md).

## Import order matters, and it is not negotiable

```ts
import '@twobots/ui-theme/tokens.css'          // FIRST, always
import '@twobots/ui-theme/table-surface.css'
import '@twobots/ui-theme/card.css'
import '@twobots/ui-theme/overlay.css'
import '@twobots/ui-theme/rail.css'
import '@twobots/ui-theme/match-over.css'
import './your-app-tokens.css'                 // your additions, on top
import './board.css'                           // your layout and per-game treatments
```

`tokens.css` goes first because **two stylesheets defining the same custom property at equal
specificity is a cascade-order lottery**, and this file is the one place these particular
properties are declared. Everything of your own goes last, so your app's rules compose on top of
the shared ones rather than racing them.

## `@twobots/ui-theme/tokens.css`

`src/tokens.css` — the material, not the layout. Declares one `:root` block:
`color-scheme: dark`, a type scale (`--font-ui`, `--font-display`, `--step--1` … `--step-1`), the
mat/card/panel materials (`--mat*`, `--well*`, `--card*`, `--paper`, `--ink`), suit inks
(`--suit-ink`, `--suit-red`, and the four-colour `--suit-blue` / `--suit-teal`), interaction
colours (`--accent`, `--target`, `--focus-dark`, `--focus-light`), and the weave/shadow values the
surface and card depend on.

**What is deliberately absent:** any token whose value is a rule-specific vocabulary word (a
game's own state names) or a board-geometry number tuned to one game's content shape (hand size,
meld-row height, a review sheet's column count). Those stay in each app's own token file, which
imports this one first and adds on top — the same relationship a theme has to an app that names
things with it. karu's `web/tokens.css` is the worked example of that split.

This file exists because andarta hand-retyped these values from karu once, and it still took a
live side-by-side screenshot comparison to catch what a per-property copy had missed.

## `@twobots/ui-theme/table-surface.css`

`src/table-surface.css` — the mat. One class, `.table-surface`: a fixed, full-bleed woven
background layer. The cleanest single-layer extraction in the package, because no game content is
coupled to it.

Four gradient layers rasterised **once** into a fixed, pointer-transparent layer that never
scrolls, never animates and is never filtered. `position: fixed` rather than
`background-attachment: fixed` — the latter forces a full repaint on every scroll frame on
mobile, which a 60fps table cannot afford.

!!! warning "`z-index: 0` is correct, and `-1` is not a fix"
    That value was read directly from karu's live production CSS during extraction rather than
    assumed. If your app previously used `-1` for this layer, that was a deviation introduced
    independently — revert to `0` when adopting this file.

## `@twobots/ui-theme/card.css`

`src/card/card.css` — pairs with [`CardFace`](api/card.md). One element, three sizes
(`.card--hand` / `.card--index` / `.card--back`), every state a class on the wrapper
(`.is-facedown`, `.is-selected`, `.is-dimmed`), so there is never a second copy of a card to keep
in step.

Contains no single game's own card treatments — a secret-set reveal, a pile's tap-target styling,
a settlement sheet. Those compose on top of `.card` in your CSS, imported after this file.

## `@twobots/ui-theme/overlay.css`

`src/overlay/overlay.css` — `.overlay-backdrop`, `.overlay-panel`, and
`.overlay-panel--elevated`: a dimmed full-viewport backdrop with a centred panel inside it.

**CSS only, with no React wrapper, and that is the interesting part.** Every consumer already
owned real per-screen behaviour — focus management, Escape handling, what goes inside the
panel — that does not belong in a shared component. What was genuinely duplicated was the shell
two apps had each hand-built to the same shape: a `role="dialog" aria-modal="true"` panel a
player cannot see or reach past without closing it first. So only the shell was extracted.

Since there is no component, **you supply the ARIA and the focus trap yourself**. The stylesheet
makes the panel look right; it cannot make it behave right.

`.overlay-panel--elevated` carries a heavier shadow, for a panel that *is* the moment — a round's
reveal, a match's settlement — rather than a reference you consult and dismiss.

## `@twobots/ui-theme/rail.css`

`src/rail/rail.css` — pairs with [`RailButton`](api/rail.md). Supplies `.rail` (a 3-slot grid:
leading controls, a flexible ticker/status region, trailing controls) and `.chrome-button` (the
control's look).

Verified identical between karu and andarta — same `grid-template-columns`, same `gap`, same
`align-items` — before this file existed. Each app supplies its own row height and its own
content for the three slots.

## `@twobots/ui-theme/match-over.css`

`src/match-over/match-over.css` — pairs with
[`MatchOverScreen`](api/match-over.md). Owns the `.match-over__*` ranked-list family and nothing
else. Lifted verbatim from karu's `.final*` family, confirmed byte-identical to andarta's
independently converged copy, then renamed: `.final` alone was too generic a name for a published
package to claim.

The component also emits `splash__*` classes that this package **does not style** — see that
page for why, and for what your app has to supply.
