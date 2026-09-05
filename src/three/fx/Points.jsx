import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sparkTexture } from '../materials'

/** Shared particle primitive. `sim` runs per frame with the raw position array. */
export function PointCloud({
  count = 600,
  color = '#ffffff',
  size = 0.05,
  opacity = 0.5,
  seed,
  sim,
  blending = THREE.AdditiveBlending,
  ...props
}) {
  const pts = useRef()
  const map = useMemo(() => sparkTexture(), [])

  const { positions, data } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const data = seed(count, positions)
    return { positions, data }
  }, [count, seed])

  useFrame((state, delta) => {
    if (!pts.current) return
    const attr = pts.current.geometry.attributes.position
    const changed = sim(attr.array, data, state.clock.elapsedTime, delta, pts.current)
    if (changed !== false) attr.needsUpdate = true
  })

  return (
    <points ref={pts} {...props}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={blending}
        toneMapped={false}
      />
    </points>
  )
}
