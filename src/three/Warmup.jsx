import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

/** Most of the scene starts hidden, and `gl.compile` only walks visible
    objects — so the shader for the water, the devices or the streaks would
    otherwise compile the first time you scroll onto that beat, which is
    exactly one long frame in the middle of a scroll. Reveal everything once
    behind the boot screen, compile it all, then put it back. */
export function Warmup() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    let cancelled = false
    const id = requestAnimationFrame(() => {
      if (cancelled) return
      const hidden = []
      scene.traverse((o) => {
        if (o.visible === false) {
          hidden.push(o)
          o.visible = true
        }
      })
      const restore = () => {
        for (const o of hidden) o.visible = false
      }
      const done = gl.compileAsync?.(scene, camera)
      if (done?.then) done.then(restore, restore)
      else {
        gl.compile(scene, camera)
        restore()
      }
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [gl, scene, camera])

  return null
}
