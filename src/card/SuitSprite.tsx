import type { ReactElement } from 'react'

/**
 * The four suit glyphs, as SVG paths, mounted once at the app root.
 *
 * **Not Unicode characters**, and this is the single most consequential decision in the
 * card design. `♥` (U+2665) and `♦` (U+2666) have *emoji presentation variants*: on
 * Android (Noto Color Emoji) and Windows (Segoe UI Emoji) they resolve to full-colour
 * emoji glyphs on a substantial share of font stacks, and a colour-emoji glyph ignores
 * `color:` entirely.
 *
 * That would bake red into the artwork and silently no-op any four-colour deck option —
 * invisibly on a Linux dev machine, universally on the target platform.
 *
 * Each path is drawn in a ±50 box centred on the origin and carries **no fill of its
 * own**, so `fill: currentColor` on the `<use>` is the entire colour mechanism and one
 * glyph serves every card size at any scale.
 */
export function SuitSprite(): ReactElement {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute' }}
    >
      <defs>
        <g id="suit-H">
          <path
            d="M0,44 C-4,34 -16,24 -26,14 C-38,2 -40,-16 -28,-27
               C-19,-35 -6,-33 0,-22 C6,-33 19,-35 28,-27 C40,-16 38,2 26,14
               C16,24 4,34 0,44 Z"
          />
        </g>
        <g id="suit-S">
          <path
            d="M0,-44 C-4,-34 -16,-24 -26,-14 C-38,-2 -40,16 -28,27
               C-20,33 -8,30 -3,21 C-3,31 -8,40 -17,45 L17,45 C8,40 3,31 3,21
               C8,30 20,33 28,27 C40,16 38,-2 26,-14 C16,-24 4,-34 0,-44 Z"
          />
        </g>
        <g id="suit-D">
          <path
            d="M0,-46 C7,-30 18,-14 30,0 C18,14 7,30 0,46
               C-7,30 -18,14 -30,0 C-18,-14 -7,-30 0,-46 Z"
          />
        </g>
        <g id="suit-C">
          <circle cx="0" cy="-22" r="17" />
          <circle cx="-24" cy="13" r="17" />
          <circle cx="24" cy="13" r="17" />
          <path d="M-3,4 C-3,20 -9,35 -18,45 L18,45 C9,35 3,20 3,4 Z" />
        </g>
      </defs>
    </svg>
  )
}
