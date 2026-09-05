import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, AdaptiveDpr, Preload } from '@react-three/drei'
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
import { Product } from './Product'
import { BackType } from './BackType'
import { Dust } from './fx/Dust'
import { SpeedStreaks } from './fx/SpeedStreaks'
import { fx } from './state'
import { C } from './materials'

/** Studio IBL built from lightformers — no HDRI to download, and every
    highlight on the shell is placed on purpose. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#05070c']} />
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

function Grade({ tier }) {
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
    <EffectComposer multisampling={tier === 'high' ? 4 : 0} enableNormalPass={false}>
      <Bloom
        ref={bloom}
        intensity={0.72}
        luminanceThreshold={0.45}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.72}
      />
      {tier === 'high' ? (
        <ChromaticAberration ref={ca} offset={[0.00012, 0.00006]} radialModulation modulationOffset={0.55} />
      ) : null}
      <Vignette offset={0.24} darkness={0.82} blendFunction={BlendFunction.NORMAL} />
      {tier === 'high' ? <Noise opacity={0.028} blendFunction={BlendFunction.OVERLAY} /> : null}
    </EffectComposer>
  )
}

export function Stage() {
  const tier = useMemo(() => {
    if (typeof window === 'undefined') return 'high'
    const small = window.innerWidth < 820
    const weak = (navigator.hardwareConcurrency || 8) <= 4
    return small || weak ? 'low' : 'high'
  }, [])

  return (
    <div className="stage-canvas" aria-hidden="true">
    <Canvas
      style={{ width: '100%', height: '100%' }}
      dpr={tier === 'high' ? [1, 1.9] : [1, 1.4]}
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
      </Suspense>

      <Rig />
      <Grade tier={tier} />
      <AdaptiveDpr pixelated={false} />
    </Canvas>
    </div>
  )
}
