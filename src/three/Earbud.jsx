import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { C, markTexture } from './materials'
import { fx } from './state'
import { near } from '../lib/scroll'

/* side: +1 right bud, -1 left bud (mirrored about X) */
export function Earbud({ side = 1, teardown = false, ...props }) {
  const group = useRef()
  const shellMats = useRef([])
  const parts = useRef({})
  const led = useRef()
  const ancRing = useRef()
  const mics = useRef([])
  const mark = useMemo(() => markTexture(), [])

  const collectShell = (m) => {
    if (m && !shellMats.current.includes(m)) shellMats.current.push(m)
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const e = teardown ? fx.explode : 0

    /* shell dissolves so the stack inside can be read */
    for (const m of shellMats.current) {
      m.opacity = 1 - 0.78 * e
      m.transparent = e > 0.005
      m.depthWrite = e < 0.4
    }

    /* the teardown separates along the nozzle axis, outermost travels furthest */
    const p = parts.current
    const push = (ref, dist) => {
      if (ref) ref.position.x = ref.userData.x0 + dist * e * side
    }
    push(p.tip, 1.05)
    push(p.nozzle, 0.78)
    push(p.driver, 0.46)
    push(p.coil, 0.24)
    push(p.magnet, 0.06)
    push(p.housing, -0.3)
    if (p.stem) p.stem.position.y = p.stem.userData.y0 - 0.42 * e
    if (p.cell) p.cell.position.y = p.cell.userData.y0 - 0.95 * e
    if (p.pcb) p.pcb.position.y = p.pcb.userData.y0 - 0.68 * e

    /* status light: breathing at rest, hard pulse under bass */
    if (led.current) {
      const breathe = 2.4 + Math.sin(t * 1.6) * 0.7
      const beat = fx.bass * (2 + Math.abs(Math.sin(t * 5.5)) * 9)
      led.current.emissiveIntensity = (breathe + beat) * fx.led
    }
    if (ancRing.current) {
      const ringOn = near(3, 1.1)
      ancRing.current.material.opacity = ringOn * 0.85
      ancRing.current.scale.setScalar(1 + ringOn * 0.22 + Math.sin(t * 2) * 0.03 * ringOn)
    }
    for (const m of mics.current) {
      if (m) m.emissiveIntensity = 0.4 + fx.mic * (5 + Math.sin(t * 9) * 3)
    }
  })

  const reg = (key, x0 = 0, y0 = 0) => (el) => {
    if (!el) return
    parts.current[key] = el
    el.userData.x0 = el.userData.x0 ?? x0
    el.userData.y0 = el.userData.y0 ?? y0
  }

  return (
    <group ref={group} scale={[side, 1, 1]} {...props}>
      {/* ---------- stem ---------- */}
      <group ref={reg('stem', 0, -0.2)} position={[0, -0.2, 0]}>
        <RoundedBox args={[0.29, 1.26, 0.25]} radius={0.12} smoothness={5}>
          <meshPhysicalMaterial
            ref={collectShell}
            color={C.shell}
            roughness={0.42}
            metalness={0.12}
            clearcoat={0.85}
            clearcoatRoughness={0.22}
          />
        </RoundedBox>

        {/* touch surface, slightly glossier than the body */}
        <RoundedBox args={[0.21, 0.62, 0.02]} radius={0.01} position={[0, 0.16, -0.135]}>
          <meshPhysicalMaterial
            ref={collectShell}
            color={C.gloss}
            roughness={0.16}
            metalness={0.35}
            clearcoat={1}
          />
        </RoundedBox>

        {/* charge LED */}
        <RoundedBox args={[0.055, 0.38, 0.03]} radius={0.026} position={[0, 0.24, 0.132]}>
          <meshStandardMaterial
            ref={led}
            color={C.flare}
            emissive={C.flare}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </RoundedBox>

        {/* ICE mark */}
        <mesh position={[0, -0.28, 0.136]}>
          <planeGeometry args={[0.19, 0.095]} />
          <meshBasicMaterial map={mark} transparent opacity={0.62} toneMapped={false} />
        </mesh>

        {/* two of the four ENC mics live on the stem */}
        {[-0.5, -0.56].map((y, i) => (
          <mesh key={i} position={[0.1 - i * 0.2, y, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.012, 12]} />
            <meshStandardMaterial
              ref={(m) => (mics.current[i] = m)}
              color="#05070c"
              emissive={C.ice}
              emissiveIntensity={0.4}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* internals, only readable once the shell fades */}
        <mesh ref={reg('cell', 0, 0.02)} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.098, 0.098, 0.34, 20]} />
          <meshStandardMaterial color={C.steel} roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh ref={reg('pcb', 0, -0.36)} position={[0, -0.36, 0]}>
          <boxGeometry args={[0.15, 0.4, 0.035]} />
          <meshStandardMaterial color={C.board} roughness={0.6} metalness={0.2} />
        </mesh>
      </group>

      {/* ---------- driver housing ---------- */}
      <group position={[0, 0.46, 0.01]} rotation={[0.1, 0, 0]}>
        <mesh ref={reg('housing', 0)} scale={[1.05, 0.86, 0.98]}>
          <sphereGeometry args={[0.26, 40, 32]} />
          <meshPhysicalMaterial
            ref={collectShell}
            color={C.gloss}
            roughness={0.34}
            metalness={0.24}
            clearcoat={1}
            clearcoatRoughness={0.16}
          />
        </mesh>

        {/* ANC boundary — appears only while noise is being cancelled */}
        <mesh ref={ancRing} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.33, 0.01, 8, 64]} />
          <meshBasicMaterial color={C.ice} transparent opacity={0} toneMapped={false} />
        </mesh>

        {/* feed-forward mic on the outer shell */}
        <mesh position={[0.09, 0.19, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.012, 12]} />
          <meshStandardMaterial
            ref={(m) => (mics.current[2] = m)}
            color="#05070c"
            emissive={C.ice}
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>

        {/* 13mm dual driver stack */}
        <group rotation={[0, 0, -Math.PI / 2]}>
          <mesh ref={reg('magnet', 0)} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.145, 0.042, 12, 32]} />
            <meshStandardMaterial color={C.steel} roughness={0.35} metalness={0.95} />
          </mesh>
        </group>
        <mesh ref={reg('coil', 0.05)} position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.08, 24]} />
          <meshStandardMaterial color={C.copper} roughness={0.3} metalness={1} />
        </mesh>
        <mesh ref={reg('driver', 0.11)} position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.185, 0.038, 32]} />
          <meshStandardMaterial
            color={C.flare}
            emissive={C.flare}
            emissiveIntensity={0.35}
            roughness={0.45}
            metalness={0.5}
          />
        </mesh>

        {/* nozzle + silicone tip */}
        <mesh ref={reg('nozzle', 0.24)} position={[0.24, 0, -0.02]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.12, 0.21, 28]} />
          <meshPhysicalMaterial
            ref={collectShell}
            color={C.shell}
            roughness={0.35}
            metalness={0.2}
            clearcoat={0.7}
          />
        </mesh>
        <mesh ref={reg('tip', 0.38)} position={[0.38, 0, -0.02]} scale={[0.8, 1, 1]}>
          <sphereGeometry args={[0.115, 28, 20]} />
          <meshPhysicalMaterial color={C.silicone} roughness={0.85} sheen={0.4} clearcoat={0.2} />
        </mesh>
      </group>
    </group>
  )
}
