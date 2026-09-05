import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { near } from '../lib/scroll'

function buildTexture(text, weight = 900) {
  const cv = document.createElement('canvas')
  cv.width = 2048
  cv.height = 1024
  const g = cv.getContext('2d')
  g.clearRect(0, 0, cv.width, cv.height)
  g.fillStyle = '#ffffff'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = `${weight} 760px Archivo, Helvetica, Arial, sans-serif`
  g.fillText(text, cv.width / 2, cv.height / 2 + 20)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Set in the scene rather than the DOM so the case genuinely passes in
    front of it, catches the same fog, and blooms with everything else. */
export function BackType({ text = 'ANC', chapter = 0, ...props }) {
  const [tex, setTex] = useState(null)
  const mesh = useRef()

  useEffect(() => {
    let live = true
    const make = () => live && setTex(buildTexture(text))
    if (document.fonts?.ready) document.fonts.ready.then(make)
    else make()
    return () => {
      live = false
    }
  }, [text])

  useFrame((state) => {
    if (!mesh.current) return
    const v = near(chapter, 1.05)
    mesh.current.visible = v > 0.01
    mesh.current.material.opacity = v * 0.055
    mesh.current.position.y = props.position?.[1] ?? 0
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.02
  })

  if (!tex) return null
  return (
    <mesh ref={mesh} {...props}>
      <planeGeometry args={[13, 6.5]} />
      <meshBasicMaterial map={tex} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
