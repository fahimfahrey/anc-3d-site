import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** A link between a bud and a device. The travelling node is the packet;
    the tube is the route. */
export function Beam({ from, to, color = '#6fd8ff', offset = 0, strength = () => 1 }) {
  const tube = useRef()
  const node = useRef()

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const mid = a.clone().lerp(b, 0.5)
    mid.y += 0.9
    mid.z += 0.6
    return new THREE.QuadraticBezierCurve3(a, mid, b)
  }, [from, to])

  const geo = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.012, 6, false), [curve])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const s = strength()
    if (tube.current) tube.current.material.opacity = s * (0.28 + Math.sin(t * 2 + offset) * 0.1)
    if (node.current) {
      const p = ((t * 0.42 + offset) % 1)
      curve.getPointAt(p, node.current.position)
      node.current.material.opacity = s * (1 - Math.abs(p - 0.5) * 0.9)
      const k = 0.045 + Math.sin(p * Math.PI) * 0.03
      node.current.scale.setScalar(k * (s > 0.02 ? 1 : 0))
    }
  })

  return (
    <group>
      <mesh ref={tube} geometry={geo}>
        <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={node}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  )
}
