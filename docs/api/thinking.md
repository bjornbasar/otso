# `@twobots/ui-theme/thinking`

Three staggered dots, for a bot turn's pause.

```ts
import { ThinkingDots } from '@twobots/ui-theme/thinking'
```
```ts
import '@twobots/ui-theme/thinking.css'
```

Source: `src/thinking/ThinkingDots.tsx`.

| Symbol | Type | Notes |
|---|---|---|
| `ThinkingDots` | `() => …` | Three animated dots. No props. |

## Why dots, not a spinner

`@twobots/game-kit/timing`'s bot delay can pause several seconds — long enough that a
bare status line reading "Foo is thinking…" starts to feel like nothing is happening. A
spinner is the familiar answer, and the wrong one here: a spinner reads as "the app is
loading or blocked," which is the opposite of what a bot's own turn is. Dots read closer
to a chat typing-indicator, which is the actual beat this is going for.

## No props, because nothing varies

Every caller wants the same three dots. `thinking.css`'s `.thinking-dots span` uses
`background: currentColor`, so the dots inherit whichever text color surrounds them —
karu's status line and andarta's console prompt use different tones today, and this way
the component carries no color opinion of its own, the same reasoning `RailButton`'s SVG
paths use `stroke="currentColor"` for ([rail](rail.md)).

## `aria-hidden`, on purpose

The wrapper is `aria-hidden="true"`. The meaning — who's acting, what's happening — is
already carried by the text each caller renders alongside the dots ("Foo is
thinking…", "Waiting for the other seats…"); the dots themselves are decorative motion,
not new information a screen reader needs announced.

## `prefers-reduced-motion` doesn't remove the cue, it stills it

The reduced-motion fallback is three static dots at a fixed opacity, not nothing. The
signal — a bot's turn is in progress — still has to reach a player who has motion
turned off; only the animation is optional.

## What this doesn't attach to

Each app decides *when* to render `ThinkingDots` — it isn't wired to the `acting` prop
both games already have on their opponent-panel components (karu's `seat--acting`,
andarta's `is-acting`), because that prop marks *whose turn it is*, which starts the
instant a bot's action resolves and the next one begins — not *is a delay currently
pausing*. The dots render alongside each game's own status text for exactly the branch
that already says "waiting"/"thinking," which is the more direct, already-narrated
condition to key off.
