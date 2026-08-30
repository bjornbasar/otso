/**
 * The rail's glyphs, as inline paths — karu's own real `RAIL_GLYPH` (web/App.tsx),
 * moved verbatim. Inline rather than a sprite because there are three, they are 16px,
 * and the existing sprite (`@twobots/ui-theme`'s `SuitSprite`) is the card suits — a
 * different concern with a different lifecycle. Not emoji: Android renders those as
 * colour glyphs, which would sit oddly beside a hand-drawn deck and cannot inherit
 * `currentColor`.
 */
export const RAIL_GLYPH = {
  /* an open book */
  rules: 'M2 3.2h4.6c.8 0 1.4.5 1.4 1.2v8c0-.6-.6-1.1-1.4-1.1H2zM14 3.2H9.4c-.8 0-1.4.5-1.4 1.2v8c0-.6.6-1.1 1.4-1.1H14z',
  /* sliders — the house rules are a set of switches */
  house: 'M3 4h10M3 8h10M3 12h10M6 2.6v2.8M10.5 6.6v2.8M5 10.6v2.8',
  /* a door with an arrow out */
  leave: 'M9.5 2.5H4v11h5.5M8 8h5.5M11.5 5.8 13.8 8l-2.3 2.2',
} as const

export type RailGlyph = keyof typeof RAIL_GLYPH

export interface RailButtonProps {
  readonly label: string
  readonly glyph: RailGlyph
  readonly onClick: () => void
  /** Whether this control opens a dialog — adds `aria-haspopup="dialog"`. Defaults to
   * `true`; a control that navigates away instead of opening one (a "leave" action)
   * passes `false`. */
  readonly dialog?: boolean
}

/**
 * A rail control that shows a word on a roomy viewport and a glyph on a narrow one.
 * Emits `.rail__help`/`.rail__word`/`.rail__icon` — classes this package does not
 * style. `.chrome-button` (this package's `rail.css`) supplies the look; each app's
 * own `board.css` controls the narrow-viewport word/icon swap via `.rail__help`.
 */
// No explicit `ReactElement` return type: that would widen `props` to `unknown` on the
// inferred type, and this repo's DOM-free tests call the component as a plain function
// and inspect the returned element's `props` directly (andarta's original convention,
// ported here) — an annotation would break that without a cast at every call site.
export function RailButton({ label, glyph, onClick, dialog = true }: RailButtonProps) {
  return (
    <button
      type="button"
      className="rail__help chrome-button"
      onClick={onClick}
      /* Always present, so the accessible name survives the word being hidden by CSS. */
      aria-label={label}
      title={label}
      {...(dialog ? { 'aria-haspopup': 'dialog' as const } : {})}
    >
      <span className="rail__word">{label}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="rail__icon">
        <path
          d={RAIL_GLYPH[glyph]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
