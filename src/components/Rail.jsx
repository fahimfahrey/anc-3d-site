import { useEffect, useRef } from 'react'
import { CHAPTERS } from '../lib/product'
import { scroll } from '../lib/scroll'

/** Reads like a device readout: where you are in the teardown, and what the
    hardware is doing at that point. Updated straight from the scroll store so
    it never triggers a React render. */
export function Rail() {
  const ticks = useRef([])
  const label = useRef()
  const readout = useRef()
  const meter = useRef()
  const last = useRef(-1)
  const lastP = useRef(-1)

  useEffect(() => {
    let raf
    const tick = () => {
      const i = Math.min(CHAPTERS.length - 1, Math.max(0, Math.round(scroll.s)))
      const p = Math.round(scroll.progress * 400) / 400
      if (meter.current && p !== lastP.current) {
        lastP.current = p
        meter.current.style.transform = `translateX(-50%) scaleY(${p})`
      }
      if (i !== last.current) {
        last.current = i
        ticks.current.forEach((el, k) => {
          if (!el) return
          el.classList.toggle('is-on', k === i)
          el.classList.toggle('is-past', k < i)
        })
        if (label.current) label.current.textContent = CHAPTERS[i].rail
        if (readout.current) readout.current.textContent = CHAPTERS[i].readout
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <aside className="rail" aria-hidden="true">
      <div className="rail__meter" ref={meter} />
      <div className="rail__ticks">
        {CHAPTERS.map((c, i) => (
          <span key={c.id} className="rail__tick" ref={(el) => (ticks.current[i] = el)} />
        ))}
      </div>
      <div className="rail__readout" ref={readout}>
        STANDBY
      </div>
      <div className="rail__label" ref={label}>
        Prime Pro ANC
      </div>
    </aside>
  )
}
