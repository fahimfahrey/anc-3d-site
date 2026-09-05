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

## Notes

- Product photography in `public/img/*-cut.png` is the retail imagery with its
  studio backdrop keyed out so it sits on the dark page.
- Postprocessing (bloom, chromatic aberration, vignette, grain) drops to bloom
  and vignette only on small or low-core devices; see `tier` in `Stage.jsx`.
