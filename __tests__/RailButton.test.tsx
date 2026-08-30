/**
 * RailButton — a plain function component, called directly as a function rather
 * than rendered, matching andarta's original DOM-free test convention (the assertions
 * ported wholesale from andarta's own `railButton.test.ts`, which tested karu's
 * "ported wholesale" copy before this package existed).
 */
import { describe, it, expect } from 'vitest'
import { RailButton, RAIL_GLYPH } from '../src/rail/index.js'

describe('RailButton', () => {
  it('sets aria-label and title to the label, so the accessible name survives the word being hidden by CSS', () => {
    const el = RailButton({ label: 'Rules', glyph: 'rules', onClick: () => {} })
    expect(el.props['aria-label']).toBe('Rules')
    expect(el.props.title).toBe('Rules')
  })

  it('renders the word in a .rail__word span', () => {
    const el = RailButton({ label: 'Rules', glyph: 'rules', onClick: () => {} })
    const [word] = el.props.children
    expect(word.props.className).toBe('rail__word')
    expect(word.props.children).toBe('Rules')
  })

  it('renders the glyph as an svg path matching RAIL_GLYPH', () => {
    const el = RailButton({ label: 'Rules', glyph: 'rules', onClick: () => {} })
    const [, icon] = el.props.children
    expect(icon.props.className).toBe('rail__icon')
    expect(icon.props.children.props.d).toBe(RAIL_GLYPH.rules)
  })

  it('carries both rail__help and chrome-button classes', () => {
    const el = RailButton({ label: 'Rules', glyph: 'rules', onClick: () => {} })
    expect(el.props.className).toBe('rail__help chrome-button')
  })

  it('wires onClick through', () => {
    let clicked = false
    const el = RailButton({ label: 'Rules', glyph: 'rules', onClick: () => (clicked = true) })
    el.props.onClick()
    expect(clicked).toBe(true)
  })

  it('defaults dialog to true, adding aria-haspopup="dialog"', () => {
    const el = RailButton({ label: 'Rules', glyph: 'rules', onClick: () => {} })
    expect(el.props['aria-haspopup']).toBe('dialog')
  })

  it('omits aria-haspopup when dialog is false — a control that navigates rather than opening one', () => {
    const el = RailButton({ label: 'Leave', glyph: 'leave', onClick: () => {}, dialog: false })
    expect(el.props['aria-haspopup']).toBeUndefined()
  })

  it('renders the house glyph — dropped by andarta\'s local copy, part of the shared superset', () => {
    const el = RailButton({ label: 'House', glyph: 'house', onClick: () => {} })
    const [, icon] = el.props.children
    expect(icon.props.children.props.d).toBe(RAIL_GLYPH.house)
  })
})
