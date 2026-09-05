import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { appScreenTexture, deskScreenTexture, C } from '../materials'
import { Beam } from './Beam'
import { near } from '../../lib/scroll'

/** Chapter 6 shows one phone running the app. Chapter 7 keeps the phone and
    adds a laptop, because that is what multipoint actually means. */
export function Devices() {
  const phone = useRef()
  const laptop = useRef()
  const appTex = useMemo(() => appScreenTexture(), [])
  const deskTex = useMemo(() => deskScreenTexture(), [])

  const phoneStrength = () => Math.max(near(6, 1.3), near(7, 1.3))
  const laptopStrength = () => near(7, 1.2)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = phoneStrength()
    const l = laptopStrength()
    if (phone.current) {
      phone.current.visible = p > 0.01
      phone.current.position.x = 2.35 + (1 - p) * 1.6
      phone.current.position.y = 0.15 + Math.sin(t * 0.7) * 0.07
      phone.current.rotation.y = -0.42 - (1 - p) * 0.3
      phone.current.traverse((o) => {
        if (o.material && 'opacity' in o.material) {
          o.material.transparent = true
          o.material.opacity = p
        }
      })
    }
    if (laptop.current) {
      laptop.current.visible = l > 0.01
      laptop.current.position.x = -2.4 - (1 - l) * 1.8
      laptop.current.position.y = -0.5 + Math.sin(t * 0.6 + 2) * 0.05
      laptop.current.traverse((o) => {
        if (o.material && 'opacity' in o.material) {
          o.material.transparent = true
          o.material.opacity = l
        }
      })
    }
  })

  return (
    <group>
      <group ref={phone} position={[2.35, 0.15, -0.5]} rotation={[0.05, -0.42, 0.02]} visible={false}>
        <RoundedBox args={[1.18, 2.4, 0.07]} radius={0.13} smoothness={5}>
          <meshPhysicalMaterial color="#0a0c11" roughness={0.3} metalness={0.7} clearcoat={1} />
        </RoundedBox>
        <mesh position={[0, 0, 0.038]}>
          <planeGeometry args={[1.06, 2.26]} />
          <meshBasicMaterial map={appTex} toneMapped={false} transparent />
        </mesh>
      </group>

      <group ref={laptop} position={[-2.4, -0.5, -0.7]} rotation={[0, 0.5, 0]} visible={false}>
        <group position={[0, 0.68, -0.5]} rotation={[-0.28, 0, 0]}>
          <RoundedBox args={[2.5, 1.6, 0.06]} radius={0.06} smoothness={4}>
            <meshPhysicalMaterial color="#0a0c11" roughness={0.32} metalness={0.75} clearcoat={1} />
          </RoundedBox>
          <mesh position={[0, 0, 0.036]}>
            <planeGeometry args={[2.36, 1.46]} />
            <meshBasicMaterial map={deskTex} toneMapped={false} transparent />
          </mesh>
        </group>
        <RoundedBox args={[2.5, 0.08, 1.7]} radius={0.035} smoothness={4} position={[0, -0.1, 0.35]}>
          <meshPhysicalMaterial color="#11141b" roughness={0.35} metalness={0.8} clearcoat={0.8} />
        </RoundedBox>
      </group>

      <Beam from={[1.15, 0.1, 0]} to={[2.2, 0.3, -0.5]} color={C.flare} offset={0} strength={phoneStrength} />
      <Beam from={[-1.15, 0.1, 0]} to={[2.2, -0.1, -0.5]} color={C.flare} offset={0.45} strength={phoneStrength} />
      <Beam from={[-1.15, 0.1, 0]} to={[-2.2, 0.2, -0.6]} color={C.ice} offset={0.2} strength={laptopStrength} />
      <Beam from={[1.15, 0.1, 0]} to={[-2.2, -0.2, -0.6]} color={C.ice} offset={0.7} strength={laptopStrength} />
    </group>
  )
}
