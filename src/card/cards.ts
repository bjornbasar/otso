/**
 * A standard 52-card deck's own vocabulary — nothing about any particular game.
 *
 * A card is a plain string (`"AS"`, `"10H"`), matching the notation karu's own engine
 * already uses internally. This module doesn't import karu's engine types at all — a
 * consuming app's own `Card` type (however it's spelled) only needs to be structurally
 * the same shape (`\`${Rank}${Suit}\``) to pass directly into `CardFace` with no
 * conversion, since TypeScript compares template-literal types by their constituent
 * unions, not by name.
 */

export const SUITS = ['C', 'D', 'H', 'S'] as const
export type Suit = (typeof SUITS)[number]

/** Ordered low to high, the way every game in this lineup orders it. */
export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
export type Rank = (typeof RANKS)[number]

export type Card = `${Rank}${Suit}`

/** `"10"` is the only two-character rank, so slice from the end rather than the start. */
export function rankOf(c: Card): Rank {
  return c.slice(0, -1) as Rank
}

export function suitOf(c: Card): Suit {
  return c.slice(-1) as Suit
}
