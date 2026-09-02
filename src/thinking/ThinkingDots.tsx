import type { ReactElement } from 'react'

/**
 * A "thinking" cue — three dots, staggered — for a bot's turn that pauses long enough
 * (`@twobots/game-kit/timing`'s delay) that a bare status line can start to feel like
 * nothing is happening. Dots over a spinner deliberately: a spinner usually signals "the
 * app is loading/blocked," which is the opposite of what a bot's own turn is — a typing-
 * indicator beat reads closer to what's actually true.
 *
 * `aria-hidden`: purely decorative motion. The meaning ("Foo is thinking…", "Waiting for
 * the other seats…") already lives in the text each caller renders alongside this; a
 * screen reader gains nothing from three more DOM nodes announced on top of that.
 *
 * No props: nothing about this varies per caller. `thinking.css`'s `.thinking-dots span`
 * uses `background: currentColor`, so it inherits whatever text color surrounds it —
 * karu's status line and andarta's console prompt use different tones, and this way the
 * component owns no color opinion of its own, same reasoning `RailButton`'s SVG paths
 * use `stroke="currentColor"`.
 */
export function ThinkingDots(): ReactElement {
  return (
    <span className="thinking-dots" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}
