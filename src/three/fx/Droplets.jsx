import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { fx } from '../state'
import { near } from '../../lib/scroll'
import { C } from '../materials'

const DROPS = 34

/** IPX5: water arrives, beads on the shell, runs off. Faked refraction —
    cheaper than a transmission pass and reads the same at this scale. */
export function Droplets({ chapter = 5, ...props }) {
  const group = useRef()
  const drops = useRef([])
  const rings = useRef([])

  const seeds = useMemo(
    () =>
      Array.from({ length: DROPS }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 0.42 + Math.random() * 0.5,
        y0: 0.9 + Math.random() * 1.4,
        speed: 0.5 + Math.random() * 1.5,
        s: 0.03 + Math.random() * 0.075,
        off: Math.random(),
      })),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const vis = near(chapter, 1.2)
    if (group.current) group.current.visible = vis > 0.01
    const w = fx.water

    for (let i = 0; i < DROPS; i++) {
      const m = drops.current[i]
      const s = seeds[i]
      if (!m) continue
      const phase = (t * s.speed * 0.28 + s.off) % 1
      const y = s.y0 - phase * 3.2
      m.position.set(Math.cos(s.a) * s.r, y, Math.sin(s.a) * s.r + 0.1)
      const pop = Math.sin(phase * Math.PI)
      m.scale.setScalar(s.s * (0.4 + pop * 0.9) * (0.3 + w * 0.7))
      m.material.opacity = vis * pop * 0.9
    }

    for (let i = 0; i < rings.current.length; i++) {
      const m = rings.current[i]
      if (!m) continue
      const phase = ((t * 0.5 + i / rings.current.length) % 1)
      m.scale.setScalar(0.5 + phase * 3.4)
      m.material.opacity = (1 - phase) * 0.5 * vis * w
    }
  })

  return (
    <group ref={group} {...props}>
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => (drops.current[i] = el)}>
          <sphereGeometry args={[1, 14, 12]} />
          <meshPhysicalMaterial
            color="#bfe9ff"
            transparent
            opacity={0}
            roughness={0.09}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={1.33}
            reflectivity={1}
            depthWrite={false}
          />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
          <torusGeometry args={[0.6, 0.008, 8, 80]} />
          <meshBasicMaterial color={C.ice} transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
