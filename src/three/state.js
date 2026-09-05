/* Per-frame scene state derived from scroll. Written once by <Rig/>,
   read by every 3D component — keeps React out of the animation loop. */
export const fx = {
  lid: 0,        // 0 closed → 1 open
  spread: 0,     // buds nested in case → lifted out and apart
  explode: 0,    // right bud teardown
  anc: 0,        // noise cloud collapse
  bass: 0,       // driver pulse rings
  water: 0,      // droplets + ripple
  mic: 0,        // mic array highlight
  speed: 0,      // gaming streaks + aberration
  battery: 0,    // charge arc fill
  led: 1,        // status LED brightness
  caseDrop: 0,   // pushes the case out of frame during bud close-ups
  glitch: 0,
  pos: [0, 0, 0],
  rot: [0, 0, 0],
  scale: 0.68,  // product size, reduced on narrow screens
  narrow: 0,    // 0 landscape → 1 portrait
}

/* dev-only handle so the running scene can be inspected from the console */
if (import.meta.env?.DEV && typeof window !== 'undefined') window.__fx = fx
