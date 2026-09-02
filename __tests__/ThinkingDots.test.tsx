// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ThinkingDots } from '../src/thinking/index.js'

let root: Root | null = null

function show(): HTMLElement {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const r = createRoot(host)
  root = r
  act(() => {
    r.render(<ThinkingDots />)
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

describe('ThinkingDots', () => {
  it('renders three dots', () => {
    const el = show()
    const wrapper = el.querySelector('.thinking-dots')!
    expect(wrapper.children).toHaveLength(3)
  })

  it('is hidden from screen readers — the surrounding text already carries the meaning', () => {
    const el = show()
    expect(el.querySelector('.thinking-dots')!.getAttribute('aria-hidden')).toBe('true')
  })

  it('takes no props and renders without throwing', () => {
    expect(() => show()).not.toThrow()
  })
})
