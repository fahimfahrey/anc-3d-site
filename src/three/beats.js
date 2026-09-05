/* One keyframe per chapter in src/lib/product.js CHAPTERS.
   The camera stays disciplined; the product does the acting. */

const K = (o) => ({
  cam: [0, 0.5, 7],
  look: [0, 0, 0],
  pos: [0, 0, 0],
  rot: [0, 0, 0],
  fov: 34,
  lid: 0,
  spread: 0,
  explode: 0,
  battery: 0,
  anc: 0,
  bass: 0,
  water: 0,
  mic: 0,
  speed: 0,
  led: 1,
  caseDrop: 0,
  /* local x of whatever this beat is really about, so portrait screens can
     centre the subject instead of the whole rig */
  focus: 0,
  ...o,
})

export const BEATS = [
  /* 0 — hero. Closed, lit, turning slowly. Nothing else on screen. */
  K({
    cam: [0, 0.55, 7.4],
    look: [0, 0.05, 0],
    pos: [1.95, 0.3, 0],
    rot: [0.16, -0.62, 0.04],
    fov: 32,
  }),

  /* 1 — the lid. Camera drops overhead as the case opens. */
  K({
    cam: [0, 2.1, 5.9],
    look: [0, 0.1, 0],
    pos: [1.35, -0.1, 0],
    rot: [0.05, -0.18, 0],
    fov: 36,
    lid: 1,
    spread: 0.26,
  }),

  /* 2 — 80 hours. Buds out, gauge ring wraps the pair. */
  K({
    cam: [0, 0.5, 6.9],
    look: [0, 0.05, 0],
    pos: [1.7, 0.05, 0],
    rot: [0.05, 0.34, 0],
    fov: 34,
    lid: 1,
    spread: 1,
    battery: 1,
  }),

  /* 3 — 45dB. Close on the left bud while the noise shell implodes. */
  K({
    cam: [0, 0.18, 3.6],
    look: [0, 0.08, 0],
    pos: [1.15, -0.05, 0.3],
    rot: [0.02, 0.16, 0],
    fov: 32,
    lid: 1,
    spread: 1,
    anc: 0.62,
    led: 0.7,
    caseDrop: 1,
    focus: -1.18,
  }),

  /* 4 — 13mm. The right bud comes apart along the nozzle axis. */
  K({
    cam: [0, 0.12, 4.1],
    look: [0, 0.02, 0],
    pos: [-0.8, -0.05, 0.3],
    rot: [0.06, 0.05, 0],
    fov: 34,
    lid: 1,
    spread: 1,
    explode: 1,
    bass: 1,
    anc: 1,
    caseDrop: 1,
    focus: 1.55,
  }),

  /* 5 — IPX5. Back off, let water run over the pair. */
  K({
    cam: [0, 0.3, 5.3],
    look: [0, 0, 0],
    pos: [1.2, 0.05, 0.2],
    rot: [0.1, -0.42, 0.02],
    fov: 34,
    lid: 1,
    spread: 1,
    water: 1,
  }),

  /* 6 — app. Product slides left, the phone takes the right third. */
  K({
    cam: [0, 0.3, 6.4],
    look: [0, 0, 0],
    pos: [0.9, 0, 0],
    rot: [0.06, 0.05, 0],
    fov: 36,
    lid: 1,
    spread: 1,
  }),

  /* 7 — two links at once, so both devices are on screen at once. */
  K({
    cam: [0, 0.6, 7.6],
    look: [0, -0.05, 0],
    pos: [2.0, 0.1, 0],
    rot: [0.09, 0, 0],
    fov: 40,
    lid: 1,
    spread: 1,
  }),

  /* 8 — ENC. Down at the stem mics, voice bars in front of them. */
  K({
    cam: [0, 0, 4.6],
    look: [0, -0.04, 0],
    pos: [-0.75, 0.15, 0.3],
    rot: [-0.04, -0.22, 0],
    fov: 34,
    lid: 1,
    spread: 1,
    mic: 1,
    caseDrop: 1,
    focus: -1.1,
  }),

  /* 9 — gaming. Wider lens, hard tilt, everything moving. */
  K({
    cam: [0, 0.2, 4.3],
    look: [0, 0, 0],
    pos: [1.35, 0, 0],
    rot: [-0.22, 0.85, -0.3],
    fov: 52,
    lid: 1,
    spread: 1,
    speed: 1,
  }),

  /* 10 — spec table on the left, product held small and steady on the right. */
  K({
    cam: [0, 0.4, 7.8],
    look: [0, 0, 0],
    pos: [2.45, -0.05, -0.8],
    rot: [0.12, -0.5, 0.03],
    fov: 32,
    lid: 1,
    spread: 0.9,
  }),

  /* 11 — the buy shot. Lid open, buds hovering above it. */
  K({
    cam: [0, 0.35, 8.4],
    look: [0, 0.02, 0],
    pos: [2.6, -0.1, 0],
    rot: [0.14, -0.34, 0.02],
    fov: 33,
    lid: 1,
    spread: 0.72,
    led: 1.3,
  }),
]

export const KEYS = [
  'lid',
  'spread',
  'explode',
  'battery',
  'anc',
  'bass',
  'water',
  'mic',
  'speed',
  'led',
  'caseDrop',
]
