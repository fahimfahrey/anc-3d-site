/* A single source of scroll truth shared by the DOM and the WebGL stage.
   Mutable object, read every frame — avoids re-rendering React on scroll. */

export const scroll = {
  y: 0,
  max: 1,
  progress: 0,
  /** continuous chapter position, e.g. 3.42 = 42% between chapter 3 and 4 */
  s: 0,
  index: 0,
  local: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  vw: 1,
  vh: 1,
  reduced: false,
  ready: false,
}

let anchors = []
let elements = []

export function registerSections(nodes) {
  elements = nodes.filter(Boolean)
  measure()
}

export function measure() {
  if (!elements.length) return
  const vh = window.innerHeight
  anchors = elements.map((el) => {
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    return top + rect.height / 2 - vh / 2
  })
  scroll.vw = window.innerWidth
  scroll.vh = vh
  scroll.max = Math.max(1, document.documentElement.scrollHeight - vh)
  scroll.ready = anchors.length > 1
  update(window.scrollY)
}

export function update(y) {
  const prev = scroll.y
  scroll.y = y
  scroll.velocity = y - prev
  scroll.progress = scroll.max > 0 ? y / scroll.max : 0

  if (!anchors.length) return
  const n = anchors.length
  if (y <= anchors[0]) {
    scroll.s = 0
  } else if (y >= anchors[n - 1]) {
    scroll.s = n - 1
  } else {
    for (let i = 0; i < n - 1; i++) {
      if (y >= anchors[i] && y <= anchors[i + 1]) {
        const span = anchors[i + 1] - anchors[i] || 1
        scroll.s = i + (y - anchors[i]) / span
        break
      }
    }
  }
  scroll.index = Math.min(n - 1, Math.round(scroll.s))
  scroll.local = scroll.s - Math.floor(scroll.s)
}

/** 1 inside chapter `i`, falling to 0 one chapter away. The workhorse for
    fading an effect in and back out as its chapter passes. */
export function near(i, width = 1) {
  const d = Math.abs(scroll.s - i)
  if (d >= width) return 0
  const t = 1 - d / width
  return t * t * (3 - 2 * t)
}

/** 0 → 1 as we travel from chapter `from` to chapter `to`. */
export function between(from, to) {
  const t = (scroll.s - from) / (to - from || 1)
  return Math.min(1, Math.max(0, t))
}

export function initScrollListeners() {
  const onPointer = (e) => {
    scroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    scroll.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  const onResize = () => measure()

  scroll.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)

  return () => {
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onResize)
  }
}
