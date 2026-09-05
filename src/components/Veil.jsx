import { useEffect, useRef } from 'react'
import { CHAPTERS } from '../lib/product'
import { scroll } from '../lib/scroll'

/** Copy needs a darker ground than the 3D stage gives it. A per-section
    gradient meant twelve large elements repainting as they scrolled, so this is
    one fixed pair of gradients that never moves: the compositor rasterises them
    once and only crossfades opacity as the story swaps sides. */
export function Veil() {
  const left = useRef()
  const right = useRef()
  const last = useRef(null)

  useEffect(() => {
    let raf
    const tick = () => {
      const i = Math.min(CHAPTERS.length - 1, Math.max(0, Math.round(scroll.s)))
      const side = CHAPTERS[i].side
      if (side !== last.current) {
        last.current = side
        if (left.current) left.current.style.opacity = side === 'left' ? '1' : '0'
        if (right.current) right.current.style.opacity = side === 'right' ? '1' : '0'
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="veil" aria-hidden="true">
      <div className="veil__side veil__side--left" ref={left} />
      <div className="veil__side veil__side--right" ref={right} />
    </div>
  )
}
