import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BEATS, KEYS } from './beats'
import { fx } from './state'
import { scroll } from '../lib/scroll'

const smooth = (t) => t * t * (3 - 2 * t)
const tmpA = new THREE.Vector3()
const tmpB = new THREE.Vector3()

/** Reads the scroll position, resolves the two surrounding beats, and writes
    every animated value for the frame. The single place scroll becomes motion. */
export function Rig() {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3())
  const px = useRef(0)
  const py = useRef(0)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const last = BEATS.length - 1
    const s = THREE.MathUtils.clamp(scroll.s, 0, last)
    const i = Math.min(Math.floor(s), last)
    const j = Math.min(i + 1, last)
    const t = smooth(s - i)
    const a = BEATS[i]
    const b = BEATS[j]

    /* camera */
    tmpA.fromArray(a.cam).lerp(tmpB.fromArray(b.cam), t)
    const parallax = scroll.reduced ? 0 : 1
    px.current = THREE.MathUtils.damp(px.current, scroll.pointer.x * 0.5 * parallax, 3, dt)
    py.current = THREE.MathUtils.damp(py.current, scroll.pointer.y * 0.3 * parallax, 3, dt)

    camera.position.x = THREE.MathUtils.damp(camera.position.x, tmpA.x + px.current, 7, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, tmpA.y + py.current, 7, dt)
    const aspectNow = state.size.width / Math.max(1, state.size.height)
    const pull = 1 + THREE.MathUtils.clamp((1.05 - aspectNow) / 0.55, 0, 1) * 0.34
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tmpA.z * pull, 7, dt)

    tmpA.fromArray(a.look).lerp(tmpB.fromArray(b.look), t)
    look.current.lerp(tmpA, 1 - Math.exp(-8 * dt))
    camera.lookAt(look.current)

    const fov = THREE.MathUtils.lerp(a.fov, b.fov, t)
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 6, dt)
      camera.updateProjectionMatrix()
    }

    /* product transform */
    for (let k = 0; k < 3; k++) {
      fx.pos[k] = THREE.MathUtils.lerp(a.pos[k], b.pos[k], t)
      fx.rot[k] = THREE.MathUtils.lerp(a.rot[k], b.rot[k], t)
    }

    /* Portrait screens have no room for a side-by-side composition: centre the
       product, lift it clear of the copy, shrink it and back the camera off.
       The lift is a fraction of the visible frame so close-ups move less than
       wide shots and nothing sails off the top. */
    const aspect = state.size.width / Math.max(1, state.size.height)
    const narrow = THREE.MathUtils.clamp((1.05 - aspect) / 0.55, 0, 1)
    fx.narrow = narrow
    fx.scale = THREE.MathUtils.lerp(0.68, 0.48, narrow)
    const focus = -THREE.MathUtils.lerp(a.focus, b.focus, t) * fx.scale
    fx.pos[0] = THREE.MathUtils.lerp(fx.pos[0], focus, narrow)
    const halfFrame = camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
    fx.pos[1] += narrow * halfFrame * 0.46
    if (!scroll.reduced) {
      fx.rot[1] += Math.sin(state.clock.elapsedTime * 0.22) * 0.05
      fx.pos[1] += Math.sin(state.clock.elapsedTime * 0.45) * 0.025
    }

    /* scalar channels */
    for (const key of KEYS) fx[key] = THREE.MathUtils.lerp(a[key], b[key], t)

    /* scroll energy feeds the aberration and the streaks */
    fx.glitch = THREE.MathUtils.damp(
      fx.glitch,
      Math.min(1, Math.abs(scroll.velocity) * 0.02) + fx.speed * 0.55,
      5,
      dt
    )
  })

  return null
}
