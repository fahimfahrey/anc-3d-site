import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { fx } from '../state'
import { near } from '../../lib/scroll'
import { Q } from '../quality'

const BARS = Q.bars

/** What the four mics keep. The bar field is the voice the array locks on to;
    it stays steady while the surrounding noise cloud is thrown out. */
export function VoiceWave({ chapter = 8, ...props }) {
  const mesh = useRef()
  const group = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const hot = useMemo(() => new THREE.Color('#ff6a12'), [])
  const warm = useMemo(() => new THREE.Color('#ffb066'), [])

  useLayoutEffect(() => {
    if (!mesh.current) return
    for (let i = 0; i < BARS; i++) mesh.current.setColorAt(i, i % 4 === 0 ? warm : hot)
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [hot, warm])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const vis = near(chapter, 1.2)
    if (group.current) group.current.visible = vis > 0.01
    if (!mesh.current || vis <= 0.01) return
    for (let i = 0; i < BARS; i++) {
      const u = i / (BARS - 1)
      /* speech-shaped envelope: loud in the middle, tapered at the edges */
      const env = Math.sin(u * Math.PI) ** 0.7
      const h =
        env *
        (0.12 +
          Math.abs(Math.sin(t * 6.2 + i * 0.55)) * 0.34 +
          Math.abs(Math.sin(t * 2.1 + i * 0.2)) * 0.18) *
        (0.35 + fx.mic * 0.65)
      dummy.position.set((u - 0.5) * 1.7, 0, 0)
      dummy.scale.set(1, Math.max(0.02, h), 1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.material.opacity = vis * (0.35 + fx.mic * 0.65)
  })

  return (
    <group ref={group} {...props}>
      <instancedMesh ref={mesh} args={[null, null, BARS]}>
        <boxGeometry args={[0.03, 1, 0.03]} />
        <meshBasicMaterial transparent opacity={0} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
