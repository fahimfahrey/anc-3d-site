import { useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PointCloud } from './Points'
import { fx } from '../state'
import { near } from '../../lib/scroll'

/** The world outside the ear. Chaotic while ANC is off; pulled in and
    extinguished as the 45dB cancellation ramps up. */
export function NoiseField({
  chapter = 3,
  color = '#6fd8ff',
  count = 1500,
  getCollapse = () => fx.anc,
  ...props
}) {
  const group = useRef()
  const matRef = useRef()

  const seed = useCallback((count, positions) => {
    const r0 = new Float32Array(count)
    const phi = new Float32Array(count)
    const theta = new Float32Array(count)
    const jitter = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      r0[i] = 0.8 + Math.random() * 1.7
      phi[i] = Math.random() * Math.PI * 2
      theta[i] = Math.acos(2 * Math.random() - 1)
      jitter[i] = 0.4 + Math.random() * 1.6
    }
    return { r0, phi, theta, jitter }
  }, [])

  const sim = useCallback((arr, d, t, dt, obj) => {
    const collapse = getCollapse()
    const chaos = 1 - collapse
    for (let i = 0; i < d.r0.length; i++) {
      const j = i * 3
      const r = d.r0[i] * (1 - collapse * 0.86)
      const wob = Math.sin(t * d.jitter[i] * 2.2 + i) * 0.22 * chaos
      const ph = d.phi[i] + t * 0.12 * d.jitter[i] * chaos
      const th = d.theta[i] + Math.sin(t * 0.5 + i) * 0.06 * chaos
      arr[j] = Math.sin(th) * Math.cos(ph) * (r + wob)
      arr[j + 1] = Math.cos(th) * (r + wob)
      arr[j + 2] = Math.sin(th) * Math.sin(ph) * (r + wob)
    }
    if (obj.material) {
      obj.material.opacity = near(chapter, 1.15) * (1 - collapse) * 0.75
      obj.material.size = 0.05 + collapse * 0.02
    }
  }, [chapter, getCollapse])

  useFrame(() => {
    if (group.current) group.current.visible = near(chapter, 1.3) > 0.01
  })

  return (
    <group ref={group} {...props}>
      <PointCloud count={count} color={color} size={0.05} opacity={0} seed={seed} sim={sim} />
    </group>
  )
}
