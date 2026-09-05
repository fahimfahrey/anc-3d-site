import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Case } from './Case'
import { Earbud } from './Earbud'
import { fx } from './state'
import { NoiseField } from './fx/NoiseField'
import { BassRings } from './fx/BassRings'
import { Droplets } from './fx/Droplets'
import { BatteryArc } from './fx/BatteryArc'
import { VoiceWave } from './fx/VoiceWave'
import { Devices } from './fx/Devices'
import { C } from './materials'

const smooth = (t) => t * t * (3 - 2 * t)
const lerp = THREE.MathUtils.lerp

/* where a bud sits when it is seated in the case vs presented in the air */
function budTransform(side, t, out) {
  const caseY = -0.15 - fx.spread * 1.25
  const sp = smooth(fx.spread)
  const bob = Math.sin(t * 0.9 + side) * 0.04

  const nestedY = caseY - 0.4 + 1.2 * fx.lid
  out.position.set(
    lerp(side * 0.42, side * 1.18, sp),
    lerp(nestedY, 0.05 + bob, sp),
    lerp(0.06, 0.35, sp)
  )
  out.rotation.set(lerp(0.3, 0.02, sp), 0, lerp(-side * 0.08, -side * 0.3, sp))
}

export function Product() {
  const anchor = useRef()
  const spinner = useRef()
  const caseRef = useRef()
  const budL = useRef()
  const budR = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (anchor.current) {
      anchor.current.position.set(...fx.pos)
      anchor.current.scale.setScalar(fx.scale)
    }
    const budsOut = fx.lid > 0.03
    if (spinner.current) spinner.current.rotation.set(...fx.rot)
    if (caseRef.current) {
      caseRef.current.position.y = -0.15 - fx.spread * 1.25 - fx.caseDrop * 2.9 * (1 + fx.narrow * 1.1)
      caseRef.current.rotation.x = fx.spread * 0.14
      caseRef.current.scale.setScalar(1 - fx.caseDrop * 0.35)
    }
    if (budL.current) {
      budL.current.visible = budsOut
      budTransform(-1, t, budL.current)
      budL.current.position.x -= fx.explode * 1.9
      budL.current.scale.setScalar(1 - fx.explode * 0.5)
    }
    if (budR.current) {
      budR.current.visible = budsOut
      budTransform(1, t, budR.current)
    }
  })

  return (
    <group ref={anchor}>
      <group ref={spinner}>
        <group ref={caseRef}>
          <Case />
        </group>

        <group ref={budL}>
          <Earbud side={-1} />
        </group>
        <group ref={budR}>
          <Earbud side={1} teardown />
        </group>

        {/* effects pinned to the hardware they explain */}
        <NoiseField chapter={3} position={[-1.18, 0.35, 0.35]} />
        <NoiseField
          chapter={8}
          count={700}
          color="#3f7fa8"
          position={[-1.18, -0.3, 0.9]}
          getCollapse={() => fx.mic}
        />
        <BassRings chapter={4} position={[1.18, 0.55, 0.35]} />
        <Droplets chapter={5} position={[0, 0.3, 0.2]} />
        <VoiceWave chapter={8} position={[-1.1, -0.95, 0.75]} />
      </group>

      <BatteryArc chapter={2} position={[0, 0.1, -0.6]} />
      <Devices />

      {/* the two lights the product carries with it */}
      <pointLight position={[1.6, 0.4, 1.4]} intensity={3.4} distance={9} color={C.flare} />
      <pointLight position={[-2.2, 0.9, -1.2]} intensity={2.4} distance={11} color={C.ice} />
    </group>
  )
}
