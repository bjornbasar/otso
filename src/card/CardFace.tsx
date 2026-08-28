import type { CSSProperties, ReactElement } from 'react'
import { rankOf, suitOf, type Card, type Rank, type Suit } from './cards.js'

/**
 * A playing card — face up, face down, or face down with a stack count. Nothing here
 * is specific to any one game's rules; a game that needs a special face-down treatment
 * (karu's secret-set "peeled corner," for instance) wraps this component rather than
 * this component growing a prop for it.
 *
 * The only component that touches `--suit-*`. Everything else — selection, drop
 * targets, dimming — is a class on the wrapper, so there is no variant artwork and no
 * second copy of a card to keep in step.
 *
 * Deliberately **rank over pip**, not a full pip-layout face. At the sizes this
 * component actually renders at, a conventional 2-10 pip field needs more room than a
 * 30px index card has. A face that renders at no size in the app is not a face, it is
 * dead code.
 */

export type CardSize = 'hand' | 'index' | 'back'

export interface CardFaceProps {
  /** `null` renders a back. */
  readonly card: Card | null
  readonly size: CardSize
  readonly selected?: boolean
  readonly dimmed?: boolean
  /** Stack size, drawn on a face-down pile. */
  readonly count?: number
  /** Overrides the generated screen-reader label. */
  readonly label?: string
  /** Inline custom properties — a fan layout uses it to pass `--i`. */
  readonly style?: CSSProperties
}

const SIZE_CLASS: Record<CardSize, string> = {
  hand: 'card--hand',
  index: 'card--index',
  back: 'card--back',
}

/** Spelled out, never suit letters — "7 of hearts", not "7 H". */
const SPOKEN_RANK: Record<Rank, string> = {
  A: 'ace',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  J: 'jack',
  Q: 'queen',
  K: 'king',
}

const SPOKEN_SUIT: Record<Suit, string> = {
  S: 'spades',
  H: 'hearts',
  D: 'diamonds',
  C: 'clubs',
}

export function CardFace(props: CardFaceProps): ReactElement {
  const className = [
    'card',
    SIZE_CLASS[props.size],
    props.card === null ? 'is-facedown' : '',
    props.selected === true ? 'is-selected' : '',
    props.dimmed === true ? 'is-dimmed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (props.card === null) {
    const label = props.label ?? (props.count !== undefined ? `${props.count} face-down cards` : 'face-down card')
    return (
      <span className={className} style={props.style} role="img" aria-label={label}>
        {props.count !== undefined && <span className="card__count">{props.count}</span>}
      </span>
    )
  }

  const rank = rankOf(props.card)
  const suit = suitOf(props.card)
  return (
    <span
      className={className}
      data-suit={suit}
      data-rank={rank}
      style={props.style}
      role="img"
      aria-label={props.label ?? `${SPOKEN_RANK[rank]} of ${SPOKEN_SUIT[suit]}`}
    >
      <span className="card__rank">{rank}</span>
      <svg className="card__pip" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
        <use href={`#suit-${suit}`} />
      </svg>
    </span>
  )
}
