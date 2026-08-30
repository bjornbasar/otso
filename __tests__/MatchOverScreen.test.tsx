// @vitest-environment jsdom
/**
 * The generic shell only — the outcome-wording logic (headline/because text per match
 * outcome) stays local to each app and is tested there (karu's own
 * `web/matchOver.test.tsx`, andarta's own `__tests__/web/matchOverText.test.ts`). This
 * file covers what's actually shared: the ranked list, the focus-on-mount Done button,
 * and the dialog semantics, ported from karu's own test before extraction.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MatchOverScreen, type MatchOverRow } from '../src/match-over/index.js'

let root: Root | null = null

function show(rows: readonly MatchOverRow[], onDone: () => void = () => {}): HTMLElement {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const r = createRoot(host)
  root = r
  act(() => {
    r.render(
      <MatchOverScreen headline="You take the match" because="First to 70." rows={rows} onDone={onDone} />,
    )
  })
  return host
}

afterEach(() => {
  act(() => {
    root?.unmount()
  })
  root = null
  document.body.innerHTML = ''
})

const ROWS: readonly MatchOverRow[] = [
  { id: 0, name: 'You', score: 70, isYou: true },
  { id: 1, name: 'Urs', score: 20, isYou: false },
  { id: 2, name: 'Datvi', score: 15, isYou: false },
]

describe('headline and because', () => {
  it('renders the given headline and because text, unmodified', () => {
    const el = show(ROWS)
    expect(el.querySelector('#over-title')!.textContent!.trim()).toBe('You take the match')
    expect(el.querySelector('.splash__lede')!.textContent!.trim()).toBe('First to 70.')
  })
})

describe('the ranked list', () => {
  it('renders rows in the order given — this component does not sort', () => {
    const el = show(ROWS)
    expect([...el.querySelectorAll('.match-over__score')].map((s) => Number(s.textContent))).toEqual([
      70, 20, 15,
    ])
    expect([...el.querySelectorAll('.match-over__name')].map((n) => n.textContent!.trim())).toEqual([
      'You',
      'Urs',
      'Datvi',
    ])
  })

  it('marks exactly the isYou row', () => {
    const el = show(ROWS)
    const rows = [...el.querySelectorAll('.match-over__row')]
    const mine = rows.findIndex((r) => r.className.includes('match-over__row--you'))
    expect(mine).toBe(0)
    expect(rows.filter((r) => r.className.includes('match-over__row--you'))).toHaveLength(1)
  })

  it('shows every row exactly once, numbered by position', () => {
    const el = show(ROWS)
    const rows = el.querySelectorAll('.match-over__row')
    expect(rows).toHaveLength(3)
    expect([...el.querySelectorAll('.match-over__place')].map((p) => p.textContent)).toEqual(['1', '2', '3'])
  })
})

describe('the ending offers exactly one action, and it leads away', () => {
  it('has one button, defaulting to "Done", and holds focus', () => {
    const el = show(ROWS)
    const buttons = [...el.querySelectorAll('button')]
    expect(buttons).toHaveLength(1)
    expect(buttons[0]!.textContent!.trim()).toBe('Done')
    expect(document.activeElement).toBe(buttons[0])
  })

  it('wires onDone through the button', () => {
    let done = false
    const el = show(ROWS, () => (done = true))
    ;(el.querySelector('button') as HTMLButtonElement).click()
    expect(done).toBe(true)
  })

  it('a doneLabel prop overrides the button text', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const r = createRoot(host)
    root = r
    act(() => {
      r.render(
        <MatchOverScreen headline="h" because="b" rows={ROWS} onDone={() => {}} doneLabel="Back to title" />,
      )
    })
    expect(host.querySelector('button')!.textContent!.trim()).toBe('Back to title')
  })

  /** No "Play again" here by default — starting another match is a thing a player goes
   * and does, not a thing offered at the moment they just lost (karu's own reasoning,
   * carried over verbatim). */
  it('offers no way to start another match from the ending', () => {
    const el = show(ROWS)
    expect(el.textContent).not.toMatch(/play again|go again|rematch|one more/i)
  })

  it('names the stop in words rather than in a button, defaulting to "a good place to stop"', () => {
    const el = show(ROWS)
    const foot = el.querySelector('.splash__foot--nav')!
    expect(foot.textContent).toMatch(/a good place to stop/)
    expect(foot.querySelector('button')).toBeNull()
  })

  it('a note prop overrides the footer text', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const r = createRoot(host)
    root = r
    act(() => {
      r.render(<MatchOverScreen headline="h" because="b" rows={ROWS} onDone={() => {}} note="see you next time" />)
    })
    expect(host.querySelector('.splash__foot--nav')!.textContent).toMatch(/see you next time/)
  })

  it('is a dialog a screen reader can announce', () => {
    const el = show(ROWS)
    const dialog = el.querySelector('[role="dialog"]')!
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(el.querySelector(`#${dialog.getAttribute('aria-labelledby')}`)).not.toBeNull()
  })
})
