import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { C, markTexture, letterTexture } from './materials'
import { fx } from './state'

const OPEN_ANGLE = -1.28

export function Case(props) {
  const lidPivot = useRef()
  const bar = useRef()
  const barCore = useRef()
  const mark = useMemo(() => markTexture(), [])
  const texL = useMemo(() => letterTexture('L'), [])
  const texR = useMemo(() => letterTexture('R'), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (lidPivot.current) {
      /* a touch of overshoot so the lid feels sprung, not linear */
      const e = fx.lid
      const eased = e < 1 ? e * e * (3 - 2 * e) : 1
      lidPivot.current.rotation.x = OPEN_ANGLE * eased - Math.sin(e * Math.PI) * 0.09
    }
    const pulse = 1.6 + Math.sin(t * 1.9) * 0.5 + fx.battery * 2.6
    if (bar.current) bar.current.emissiveIntensity = pulse * fx.led
    if (barCore.current) barCore.current.emissiveIntensity = (pulse + 3) * fx.led
  })

  const shell = (
    <meshPhysicalMaterial
      color="#07080b"
      roughness={0.56}
      metalness={0.14}
      clearcoat={1}
      clearcoatRoughness={0.2}
    />
  )

  return (
    <group {...props}>
      {/* ---------- base ---------- */}
      <RoundedBox args={[2.5, 1.3, 2.0]} radius={0.3} smoothness={9}>
        {shell}
      </RoundedBox>

      {/* status bar on the front face */}
      <group position={[-0.42, 0.02, 1.005]}>
        <RoundedBox args={[0.66, 0.09, 0.035]} radius={0.042} smoothness={4}>
          <meshStandardMaterial
            ref={bar}
            color={C.flare}
            emissive={C.flare}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </RoundedBox>
        <RoundedBox args={[0.6, 0.035, 0.05]} radius={0.017} smoothness={4}>
          <meshStandardMaterial
            ref={barCore}
            color="#ffd9b8"
            emissive="#ffd9b8"
            emissiveIntensity={5}
            toneMapped={false}
          />
        </RoundedBox>
      </group>

      {/* wordmark on the front face, where it sits on the real case */}
      <mesh position={[0.36, 0.28, 1.008]}>
        <planeGeometry args={[0.34, 0.17]} />
        <meshBasicMaterial map={mark} transparent opacity={0.3} toneMapped={false} />
      </mesh>

      {/* USB-C */}
      <RoundedBox args={[0.34, 0.11, 0.06]} radius={0.05} position={[0, -0.3, -0.99]}>
        <meshStandardMaterial color="#05060a" roughness={0.9} metalness={0.4} />
      </RoundedBox>

      {/* ---------- orange seat tray ---------- */}
      <RoundedBox args={[2.14, 0.5, 1.66]} radius={0.16} smoothness={7} position={[0, 0.44, 0]}>
        <meshPhysicalMaterial
          color="#e2620f"
          roughness={0.46}
          metalness={0.04}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>

      {/* bud wells, cut visually with recessed dark blocks */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <RoundedBox
            args={[0.46, 0.5, 1.0]}
            radius={0.19}
            smoothness={5}
            position={[s * 0.4, 0.56, 0.05]}
          >
            <meshPhysicalMaterial color="#0a0b0f" roughness={0.6} metalness={0.1} />
          </RoundedBox>
          <mesh
            position={[s * 0.93, 0.68, 0.24]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial
              map={s < 0 ? texL : texR}
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* ---------- lid ---------- */}
      <group ref={lidPivot} position={[0, 0.6, -0.9]}>
        <group position={[0, 0.42, 0.9]}>
          <RoundedBox args={[2.5, 0.95, 2.0]} radius={0.28} smoothness={9}>
            {shell}
          </RoundedBox>
          {/* moulded orange liner, visible the moment the lid swings back */}
          <RoundedBox
            args={[2.24, 0.74, 1.76]}
            radius={0.2}
            smoothness={7}
            position={[0, -0.13, 0]}
          >
            <meshPhysicalMaterial
              color="#d95c0d"
              roughness={0.52}
              metalness={0.04}
              clearcoat={0.5}
            />
          </RoundedBox>
          <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.21]} />
            <meshBasicMaterial map={mark} transparent opacity={0.4} toneMapped={false} />
          </mesh>
        </group>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 2.24, 20]} />
          <meshStandardMaterial color="#1a1d24" roughness={0.35} metalness={0.85} />
        </mesh>
      </group>
    </group>
  )
}
