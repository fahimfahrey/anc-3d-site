import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fx } from '../state'
import { near } from '../../lib/scroll'

const SEGMENTS = 64
const RADIUS = 2.0

/** A dashed gauge ring around the product: 64 ticks, filled to the current
    charge. The last eight ticks are the case's reserve, coloured apart. */
export function BatteryArc({ chapter = 2, ...props }) {
  const mesh = useRef()
  const group = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const hot = useMemo(() => new THREE.Color('#ff6a12'), [])
  const cool = useMemo(() => new THREE.Color('#6fd8ff'), [])
  const dim = useMemo(() => new THREE.Color('#141c28'), [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    for (let i = 0; i < SEGMENTS; i++) {
      const a = (i / SEGMENTS) * Math.PI * 2 - Math.PI / 2
      dummy.position.set(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS, 0)
      dummy.rotation.set(0, 0, a)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
      mesh.current.setColorAt(i, dim)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [dummy, dim])

  useFrame((state) => {
    const vis = near(chapter, 1.25)
    if (group.current) {
      group.current.visible = vis > 0.01
      group.current.rotation.z = state.clock.elapsedTime * 0.06
    }
    if (!mesh.current || vis <= 0.01) return
    const filled = fx.battery * SEGMENTS
    for (let i = 0; i < SEGMENTS; i++) {
      const lit = i < filled
      /* the top 10% of the ring is what the case alone gives back */
      const c = lit ? (i > SEGMENTS * 0.9 ? cool : hot) : dim
      mesh.current.setColorAt(i, c)
    }
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.material.opacity = vis
  })

  return (
    <group ref={group} {...props}>
      <instancedMesh ref={mesh} args={[null, null, SEGMENTS]}>
        <boxGeometry args={[0.055, 0.16, 0.02]} />
        <meshBasicMaterial transparent opacity={0} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
