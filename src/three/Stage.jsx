import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, PerformanceMonitor, Preload } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { Rig } from './Rig'
import { Warmup } from './Warmup'
import { Product } from './Product'
import { BackType } from './BackType'
import { Dust } from './fx/Dust'
import { SpeedStreaks } from './fx/SpeedStreaks'
import { fx } from './state'
import { Q } from './quality'
import { C } from './materials'

/** Studio IBL built from lightformers — no HDRI to download, and every
    highlight on the shell is placed on purpose. Baked once. */
function Studio() {
  return (
    <Environment resolution={Q.tier === 'low' ? 128 : 256} frames={1}>
      {/* key: broad soft box, high and camera-left */}
      <Lightformer form="rect" intensity={3.4} color="#ffffff" scale={[5, 5, 1]} position={[-4.5, 4, 5]} target={[0, 0, 0]} />
      {/* fill: cold, low and behind, to separate the shell from the void */}
      <Lightformer form="rect" intensity={1.7} color="#7fbfff" scale={[9, 5, 1]} position={[6, -2, -5]} target={[0, 0, 0]} />
      {/* rim: the brand orange, raking across the top edge */}
      <Lightformer form="rect" intensity={2.7} color="#ff8a3d" scale={[6, 1.2, 1]} position={[2, 4.2, -3.5]} target={[0, 0, 0]} />
      {/* long strip highlight down the gloss */}
      <Lightformer form="rect" intensity={2.3} color="#dbe9ff" scale={[0.55, 9, 1]} position={[4.2, 1, 3]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={1.1} color="#6fd8ff" scale={5} position={[-4, -3, 2]} target={[0, 0, 0]} />
    </Environment>
  )
}

function Grade({ extras, samples }) {
  const ca = useRef()
  const bloom = useRef()

  useFrame(() => {
    if (ca.current) {
      const g = fx.glitch
      ca.current.offset.set(0.00012 + g * 0.0026, 0.00006 + g * 0.0013)
    }
    if (bloom.current) bloom.current.intensity = 0.68 + fx.bass * 0.45 + fx.speed * 0.35
  })

  return (
    <EffectComposer multisampling={samples} enableNormalPass={false}>
      <Bloom
        ref={bloom}
        intensity={0.72}
        luminanceThreshold={0.45}
        luminanceSmoothing={0.5}
        mipmapBlur
        levels={Q.bloomLevels}
        radius={0.72}
      />
      {extras && Q.aberration ? (
        <ChromaticAberration
          ref={ca}
          offset={[0.00012, 0.00006]}
          radialModulation
          modulationOffset={0.55}
        />
      ) : null}
      <Vignette offset={0.24} darkness={0.82} blendFunction={BlendFunction.NORMAL} />
      {extras && Q.grain ? (
        <Noise opacity={0.028} blendFunction={BlendFunction.OVERLAY} />
      ) : null}
    </EffectComposer>
  )
}

/** Highest device pixel ratio that keeps the frame inside the pixel budget. */
function ceilingFor(w, h) {
  const device = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  const css = Math.max(1, w * h)
  const byBudget = Math.sqrt(Q.pixelBudget / css)
  return Math.max(Q.minDpr, Math.min(Q.maxDpr, device, byBudget))
}

export function Stage() {
  const [ceiling, setCeiling] = useState(() =>
    typeof window === 'undefined' ? 1 : ceilingFor(window.innerWidth, window.innerHeight)
  )
  const [dpr, setDpr] = useState(ceiling)
  const [extras, setExtras] = useState(Q.tier !== 'low')
  const [awake, setAwake] = useState(true)

  /* Re-derive the budget whenever the window changes shape, and never let the
     live value sit above the new ceiling. */
  useEffect(() => {
    let frame
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const next = ceilingFor(window.innerWidth, window.innerHeight)
        learned.current = Infinity
        setCeiling(next)
        setDpr((d) => Math.min(d, next))
      })
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  /* MSAA is the most bandwidth-hungry thing here, so it only survives on a
     small buffer. Larger buffers lean on bloom to soften edges instead. */
  const samples = useMemo(() => {
    if (typeof window === 'undefined') return 0
    const rendered = window.innerWidth * window.innerHeight * dpr * dpr
    if (Q.tier === 'low') return 0
    if (rendered <= 1.3e6) return 4
    if (rendered <= 2.2e6) return 2
    return 0
  }, [dpr, ceiling])

  /* Nothing on screen means nothing to draw. Also stops the frame backlog
     that makes a returning tab feel like it stutters. */
  useEffect(() => {
    const onVisibility = () => setAwake(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* What the device has already proven it cannot hold. Without this the
     monitor climbs back to a resolution it just failed at, and the scene
     visibly pops between two sharpnesses forever. */
  const learned = useRef(Infinity)

  const decline = useCallback(() => {
    setDpr((d) => {
      const next = Math.max(Q.minDpr, +(d - 0.18).toFixed(2))
      learned.current = next + 0.06
      return next
    })
  }, [])

  const incline = useCallback(() => {
    setDpr((d) => Math.min(ceiling, learned.current, +(d + 0.06).toFixed(2)))
  }, [ceiling])

  /* Three straight declines means resolution alone will not save it — drop the
     optional passes and hold the floor. */
  const fallback = useCallback(() => {
    learned.current = Q.minDpr
    setDpr(Q.minDpr)
    setExtras(false)
  }, [])

  return (
    <div className="stage-canvas" aria-hidden="true">
      <Canvas
        style={{ width: '100%', height: '100%' }}
        dpr={dpr}
        frameloop={awake ? 'always' : 'never'}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0.55, 7.4], fov: 32, near: 0.1, far: 90 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.15
          scene.fog = new THREE.FogExp2('#05070c', 0.055)
          /* dev-only handle for profiling draw calls from the console */
          if (import.meta.env?.DEV) window.__gl = gl
        }}
      >
        <color attach="background" args={['#05070c']} />
        <ambientLight intensity={0.18} />
        <directionalLight position={[-4, 6, 5]} intensity={1.1} color="#eaf2ff" />
        <directionalLight position={[5, -2, -4]} intensity={0.5} color={C.ice} />

        <Suspense fallback={null}>
          <Studio />
          <BackType text="80H" chapter={2} position={[2.2, 0.2, -7]} />
          <BackType text="45MS" chapter={9} position={[1.6, 0, -8]} />
          <Product />
          <Dust />
          <SpeedStreaks />
          <Preload all />
          <Warmup />
        </Suspense>

        <Rig />
        <Grade extras={extras} samples={samples} />

        {/* 60fps is the target on every panel, including 120Hz ones. The upper
            bound has to sit under that target or vsync makes climbing back
            impossible and the scene stays stuck at its lowest resolution. */}
        <PerformanceMonitor
          ms={300}
          iterations={12}
          bounds={(refreshRate) => {
            const target = Math.min(refreshRate || 60, 60)
            return [target * 0.8, target * 0.95]
          }}
          flipflops={5}
          onDecline={decline}
          onIncline={incline}
          onFallback={fallback}
        />
      </Canvas>
    </div>
  )
}
