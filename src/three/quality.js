/* One device probe at startup. Geometry and particle budgets are fixed from
   this so nothing has to be rebuilt mid-scroll; resolution and the optional
   post passes are then trimmed live by <PerformanceMonitor/>. */

function probe() {
  if (typeof navigator === 'undefined') return 'high'
  const cores = navigator.hardwareConcurrency || 8
  const mem = navigator.deviceMemory || 8
  const coarse = window.matchMedia?.('(pointer: coarse)').matches
  const small = Math.min(window.innerWidth, window.innerHeight) < 560
  const dpr = window.devicePixelRatio || 1

  if (cores <= 4 || mem <= 2 || (coarse && small)) return 'low'
  /* a phone with plenty of cores still shades a 3x buffer, so treat it as mid */
  if (coarse || cores <= 6 || dpr > 2.5) return 'mid'
  return 'high'
}

const tier = probe()
const pick = (low, mid, high) => (tier === 'low' ? low : tier === 'mid' ? mid : high)

export const Q = {
  tier,
  dust: pick(180, 340, 520),
  noise: pick(500, 900, 1500),
  encNoise: pick(240, 440, 700),
  streaks: pick(60, 100, 150),
  drops: pick(14, 22, 34),
  bars: pick(20, 26, 34),
  maxDpr: pick(1.2, 1.5, 1.75),
  minDpr: pick(0.6, 0.66, 0.72),
  /* Hard ceiling on shaded pixels per frame. Ratio and screen size stop
     mattering: a 21:9 ultrawide and a 4:3 tablet both render the same load. */
  pixelBudget: pick(0.7e6, 1.15e6, 1.6e6),
  bloomLevels: pick(4, 5, 6),
  aberration: tier !== 'low',
  grain: tier === 'high',
  smoothness: pick(4, 6, 8),
  glass: tier !== 'low',
}
