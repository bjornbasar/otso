# otso — DOCS

Internal notes for the `@twobots/ui-theme` package. Public-facing docs live in
[README.md](README.md); this file carries the context that's deliberately kept off the npm page.

## Naming

Repo name **otso** — Finnish sacred bear-name ("honey-paw"), matching this workspace's
authorship-naming convention: the repo carries the bear name, the npm package
(`@twobots/ui-theme`) carries the consumer-facing name — mirrors how each game's own repo name
differs from its store-facing name (e.g. `karu` → "Tongits TwoBots"). See `bear-names.md` in
the personal workspace repo for the naming source-of-truth this drew from.

## Provenance

Extracted from karu (Tongits TwoBots) after andarta hand-retyped these same values once already
and it still took a live side-by-side screenshot comparison to catch what a per-property copy
missed (see andarta's own `DOCS.md`, issue #26).

**`v0.3.0` — `rail.css`.** `.rail`/`.chrome-button` confirmed byte-identical between karu and
andarta before extraction — independent convergence, not a copy either side knew about.

**`v0.4.0` — the `RailButton` component.** karu's own version (`web/App.tsx`) is the superset —
`dialog?: boolean = true` and a `house` glyph andarta's own hand-copied `RailButton.tsx` had
dropped (andarta has no rail Settings button, so `house` sits unused there, harmlessly). Moved
here instead of leaving CSS-only despite the README's own "CSS only" framing not strictly applying
to it — `RailButton` is markup-plus-behavior, not a game-rule decision, and the alternative (each
app re-typing the same word/glyph-toggle button forever) is exactly what this package exists to
prevent. It emits `.rail__help`/`.rail__word`/`.rail__icon`, none of which this package styles —
see the README's own note on that.

**`v0.5.0` — the `MatchOverScreen` component.** Same call as `RailButton`, more explicitly this
time — the README's own "Out of scope" section now documents the exception directly rather than
leaving it implicit. Extracted the shell only (dialog semantics, ranked list, focus-on-mount Done
button, footer); `headline`/`because` arrive as plain strings, computed by karu's own
`headline()`/`because()` and andarta's own `matchHeadline()`/`matchBecause()`, which read real
per-game outcome rules and stay fully local — karu's outcome union has a `'floor'` case (a chip
floor) andarta's has no equivalent of. `match-over.css` ships only the ranked-list family
(renamed `.match-over__*`, `.final*` was too generic a name for this package to claim); the
component itself emits each app's own existing `.splash*` classes and this package ships **no**
CSS for them, because the two apps' `.splash*` shells are not actually identical today (alignment,
footer layout, short-viewport lede-hiding all differ) — confirmed by reading both stylesheets
before writing a line of this. A `.splash` rule shipped here would have collided with whichever
app's own rule loaded second, at equal specificity.
