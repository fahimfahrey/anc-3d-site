import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fx } from '../state'
import { near } from '../../lib/scroll'
import { C } from '../materials'
import { Q } from '../quality'

const DROPS = Q.drops

/** IPX5: water arrives, beads on the shell, runs off. One instanced draw for
    every bead, and faked refraction — cheaper than a transmission pass and it
    reads the same at this scale. */
export function Droplets({ chapter = 5, ...props }) {
  const group = useRef()
  const mesh = useRef()
  const rings = useRef([])
  const dummy = useMemo(() => new THREE.Object3D(), [])

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
    if (vis <= 0.01) return
    const w = fx.water

    if (mesh.current) {
      for (let i = 0; i < DROPS; i++) {
        const s = seeds[i]
        const phase = (t * s.speed * 0.28 + s.off) % 1
        const pop = Math.sin(phase * Math.PI)
        dummy.position.set(
          Math.cos(s.a) * s.r,
          s.y0 - phase * 3.2,
          Math.sin(s.a) * s.r + 0.1
        )
        dummy.scale.setScalar(s.s * (0.35 + pop * 1.1) * (0.3 + w * 0.7))
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      }
      mesh.current.instanceMatrix.needsUpdate = true
      mesh.current.material.opacity = vis * 0.82
    }

    for (let i = 0; i < rings.current.length; i++) {
      const m = rings.current[i]
      if (!m) continue
      const phase = (t * 0.5 + i / rings.current.length) % 1
      m.scale.setScalar(0.5 + phase * 3.4)
      m.material.opacity = (1 - phase) * 0.5 * vis * w
    }
  })

  return (
    <group ref={group} {...props}>
      <instancedMesh ref={mesh} args={[null, null, DROPS]}>
        <sphereGeometry args={[1, 12, 10]} />
        {Q.glass ? (
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
        ) : (
          <meshStandardMaterial
            color="#bfe9ff"
            transparent
            opacity={0}
            roughness={0.12}
            metalness={0.1}
            depthWrite={false}
          />
        )}
      </instancedMesh>

      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => (rings.current[i] = el)}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.1, 0]}
        >
          <torusGeometry args={[0.6, 0.008, 8, 80]} />
          <meshBasicMaterial color={C.ice} transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
