import { useCallback } from 'react'
import { PointCloud } from './Points'
import { scroll } from '../../lib/scroll'
import { Q } from '../quality'

/** Ambient particulate. Present the whole way down so the volume never
    reads as empty, but slow enough that it stays background. */
export function Dust() {
  const seed = useCallback((count, positions) => {
    const vel = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2
      vel[i] = 0.04 + Math.random() * 0.16
    }
    return { vel }
  }, [])

  const sim = useCallback((arr, { vel }, t, dt) => {
    const drift = 1 + Math.min(3, Math.abs(scroll.velocity) * 0.06)
    for (let i = 0; i < vel.length; i++) {
      const j = i * 3
      arr[j + 1] += vel[i] * dt * drift
      arr[j] += Math.sin(t * 0.3 + i) * dt * 0.03
      if (arr[j + 1] > 7) arr[j + 1] = -7
    }
  }, [])

  return (
    <PointCloud
      count={Q.dust}
      color="#9fc4e8"
      size={0.028}
      opacity={0.22}
      seed={seed}
      sim={sim}
    />
  )
}
