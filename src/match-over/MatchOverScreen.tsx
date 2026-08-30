import { useEffect, useRef } from 'react'

/**
 * One ranked row on the stopping-point screen. `id` (not `key` — that name is React's
 * own reserved prop) is opaque to this component; a consumer's own seat/player
 * identifier only needs to be structurally a `string | number` to pass straight
 * through, the same way `CardFace`'s `card` prop takes a plain string.
 */
export interface MatchOverRow {
  readonly id: string | number
  readonly name: string
  readonly score: number
  readonly isYou: boolean
}

export interface MatchOverScreenProps {
  /** Why it ended, in the player's terms — karu's own `headline()`/andarta's own
   * `matchHeadline()` reads real per-game outcome rules to produce this; this
   * component only renders the resulting string. */
  readonly headline: string
  /** The one line explaining the headline, since endings can look alike on a
   * scoreboard — karu's own `because()`/andarta's own `matchBecause()`. */
  readonly because: string
  /** Rendered in the order given — this component does not sort. Each caller already
   * ranks its own seats (highest score first) before calling in. */
  readonly rows: readonly MatchOverRow[]
  /** The only action: leave the ending. What that means (retiring a stored match,
   * navigating to a title screen) is entirely the caller's own concern. */
  readonly onDone: () => void
  readonly doneLabel?: string
  readonly note?: string
}

/**
 * The stopping-point screen every reference game in this lineup already converged on
 * independently — karu's own real version, "ported wholesale" per both apps' own doc
 * comments before this existed. A full-screen cover rather than a relabelled "next
 * round" button is the whole point of the feature: a match has to end somewhere
 * noticeable, not fade into a footnote under a settlement a player was already
 * dismissing. Deliberately one button and no "play again" — starting another match is
 * a thing a player goes and does, not a thing offered at the moment they just lost.
 *
 * Emits `splash`/`splash__sheet splash__sheet--title`/`splash__title splash__title--table`/
 * `splash__lede`/`splash__play`/`splash__foot splash__foot--nav` — classes this package
 * does **not** style. Both apps' title screens already own that shell (and differ from
 * each other today), so shipping CSS for it here would collide with whichever app's own
 * rule loads second, at equal specificity. Only the ranked-list family
 * (`match-over.css`) is this package's own, because it truly is duplicated CSS, not
 * shared-by-convention CSS.
 */
export function MatchOverScreen({
  headline,
  because,
  rows,
  onDone,
  doneLabel = 'Done',
  note = 'a good place to stop',
}: MatchOverScreenProps) {
  const doneRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    doneRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="splash" role="dialog" aria-modal="true" aria-labelledby="over-title">
      <div className="splash__sheet splash__sheet--title">
        <h2 className="splash__title splash__title--table" id="over-title">
          {headline}
        </h2>

        <p className="splash__lede">{because}</p>

        <ol className="match-over__list">
          {rows.map((row, i) => (
            <li className={`match-over__row${row.isYou ? ' match-over__row--you' : ''}`} key={row.id}>
              <span className="match-over__place">{i + 1}</span>
              <span className="match-over__name">{row.name}</span>
              <span className="match-over__score">{row.score}</span>
            </li>
          ))}
        </ol>

        <button ref={doneRef} type="button" className="splash__play" onClick={onDone}>
          {doneLabel}
        </button>

        <p className="splash__foot splash__foot--nav">
          <span>{note}</span>
        </p>
      </div>
    </div>
  )
}
