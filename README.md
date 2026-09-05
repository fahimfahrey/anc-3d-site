# ICE Prime Pro ANC — 3D product site

A scroll-driven WebGL rebuild of the ICE Prime Pro ANC (2nd Gen) product page.
All copy, pricing and specification data comes from the live listing at
`iceworld.tech/products/ice-prime-pro-anc-black-2nd-gen`.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview
```

## How it is put together

**One scene, twelve beats.** A single fixed `<Canvas>` sits behind the whole
document. `src/three/beats.js` holds one keyframe per chapter — camera, field of
view, product transform, and a set of scalar channels (`lid`, `spread`,
`explode`, `anc`, `water`, `speed`, …). `src/three/Rig.jsx` reads the scroll
position each frame, finds the two surrounding beats, and writes the interpolated
result into the shared `fx` object in `src/three/state.js`. Every 3D component
reads `fx` inside `useFrame`, so scrolling never triggers a React render.

**Scroll is measured, not guessed.** `src/lib/scroll.js` measures the centre of
every `[data-chapter]` section and converts `window.scrollY` into a continuous
chapter position (`4.42` = 42% of the way from chapter 4 to 5). `near()` and
`between()` are the two helpers effects use to fade themselves in and out.
Lenis provides the smoothing and is bypassed entirely under
`prefers-reduced-motion`.

**The product is modelled in code.** No GLB, no external HDRI. The case and
earbuds in `src/three/Case.jsx` and `src/three/Earbud.jsx` are built from rounded
boxes, spheres and cylinders matched to the retail photography, and the studio
lighting in `src/three/Stage.jsx` is a set of `<Lightformer>` panels rendered to
a 256px environment map. Decals — the ICE wordmark, the L/R seat markers, the
app and laptop screens — are drawn to canvases at runtime in
`src/three/materials.js`.

**Portrait screens get their own framing.** `Rig` centres whatever the current
beat is actually about (`focus` in the keyframe), shrinks the product, lifts it
by a fraction of the visible frame and backs the camera off, so close-ups do not
sail off the top of a phone.

## Layout of the source

```
src/
  lib/          scroll store, Lenis binding, product data
  three/        stage, rig, beats, procedural models, materials
    fx/         particle and instanced effects, one file per idea
  components/   nav, telemetry rail, chapter panels
    sections/   hero, story chapters, spec sheet, order, FAQ
  styles/       design tokens, then interface surfaces
```

## Holding 60fps on anything

The frame budget is enforced rather than hoped for.

- **A pixel budget, not a device pixel ratio.** `ceilingFor()` in
  `src/three/Stage.jsx` picks the highest DPR that keeps shaded pixels under
  `Q.pixelBudget`. A 21:9 ultrawide, a 4:3 tablet and a 3x phone therefore all
  render roughly the same number of pixels — screen size and aspect stop
  mattering. It is recomputed on resize and rotation.
- **A closed loop on top of that.** `<PerformanceMonitor>` steps the DPR down
  when frames slip and back up when there is room. Its upper bound sits *under*
  the refresh rate on purpose: with vsync you can never exceed 60, so a bound of
  60 would mean the scene could never climb back out of a dip. Each decline also
  records a learned ceiling, so the resolution converges instead of oscillating
  between two sharpnesses.
- **A device probe for the fixed costs.** `src/three/quality.js` sets particle
  counts, MSAA, the environment map size and whether the optional post passes
  and glass shaders exist at all. These are chosen once so nothing is rebuilt
  mid-scroll.
- **Effects cost nothing off their chapter.** Every effect in `src/three/fx/`
  early-returns when `near()` says its chapter is out of range, so the water,
  the mic array and the streaks are genuinely free for the other eleven beats.
- **Everything compiles up front.** `Warmup` reveals the whole scene for one
  frame behind the boot screen and runs `gl.compileAsync`, because `gl.compile`
  skips invisible objects and would otherwise leave a shader compile — one long
  frame — waiting on the first scroll into each beat.
- **The page pauses when it is not on screen**, via `frameloop` and
  `visibilitychange`.

On the DOM side, the reading gradient behind the copy is a single fixed
`<Veil/>` rather than one oversized element per section: it rasterises once,
crossfades on opacity, and cannot repaint on scroll. That also removes the last
source of horizontal overflow — `html`, `body` and every `.panel` additionally
carry `overflow-x: clip` so nothing can ever produce a sideways scrollbar on a
short, wide screen.

## Notes

- Product photography in `public/img/*-cut.png` is the retail imagery with its
  studio backdrop keyed out so it sits on the dark page.
- Postprocessing (bloom, chromatic aberration, vignette, grain) drops to bloom
  and vignette only on small or low-core devices; see `tier` in `Stage.jsx`.
