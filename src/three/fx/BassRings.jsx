import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { C } from '../materials'
import { fx } from '../state'

const RINGS = 4

/** Pressure waves leaving the 13mm diaphragm. Staggered so they read as a
    beat rather than a single expanding shape. */
export function BassRings({ chapter = 4, ...props }) {
  const refs = useRef([])
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const on = fx.bass
    if (group.current) group.current.visible = on > 0.01
    if (on <= 0.01) return
    for (let i = 0; i < RINGS; i++) {
      const m = refs.current[i]
      if (!m) continue
      const phase = ((t * 0.75 + i / RINGS) % 1)
      const s = 0.3 + phase * 1.8
      m.scale.setScalar(s)
      m.position.x = phase * 0.85
      m.material.opacity = (1 - phase) * (1 - phase) * 0.5 * on
    }
  })

  return (
    <group ref={group} {...props} rotation={[0, 0, Math.PI / 2]}>
      {Array.from({ length: RINGS }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.011, 8, 72]} />
          <meshBasicMaterial
            color={i % 2 ? C.ember : C.flare}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}
