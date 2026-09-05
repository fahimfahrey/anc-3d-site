import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fx } from '../state'
import { near } from '../../lib/scroll'
import { Q } from '../quality'

const N = Q.streaks

/** 45ms, rendered as distance covered. Streaks run past the camera on the
    gaming beat and nowhere else. */
export function SpeedStreaks({ chapter = 9 }) {
  const mesh = useRef()
  const group = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const seeds = useMemo(
    () =>
      Array.from({ length: N }, () => ({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 8,
        z: Math.random() * 26 - 22,
        v: 6 + Math.random() * 22,
        len: 0.6 + Math.random() * 3.4,
      })),
    []
  )

  useLayoutEffect(() => {
    if (!mesh.current) return
    const hot = new THREE.Color('#ff6a12')
    const cool = new THREE.Color('#6fd8ff')
    const pale = new THREE.Color('#dfe9f5')
    for (let i = 0; i < N; i++) {
      mesh.current.setColorAt(i, i % 7 === 0 ? cool : i % 3 === 0 ? pale : hot)
    }
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [])

  useFrame((state, dt) => {
    const vis = near(chapter, 1.1)
    if (group.current) group.current.visible = vis > 0.01
    if (!mesh.current || vis <= 0.01) return
    const boost = 0.3 + fx.speed * 1.4
    for (let i = 0; i < N; i++) {
      const s = seeds[i]
      s.z += s.v * dt * boost
      if (s.z > 5) {
        s.z = -24
        s.x = (Math.random() - 0.5) * 12
        s.y = (Math.random() - 0.5) * 8
      }
      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.set(1, 1, s.len * (0.4 + fx.speed * 2.2))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.material.opacity = vis * (0.12 + fx.speed * 0.55)
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[null, null, N]}>
        <boxGeometry args={[0.02, 0.02, 1]} />
        <meshBasicMaterial transparent opacity={0} toneMapped={false} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}
