import * as THREE from 'three'

export const C = {
  shell: '#0b0c10',
  shellLit: '#15171d',
  gloss: '#101218',
  tray: '#f26a12',
  trayDeep: '#c2500b',
  flare: '#ff6a12',
  ember: '#ffb066',
  ice: '#6fd8ff',
  silicone: '#24262c',
  steel: '#78838f',
  copper: '#c98a4b',
  board: '#0e2a24',
}

/* ---- lazy canvas textures: no network, no asset pipeline ---- */

const cache = new Map()
function canvasTexture(key, w, h, draw) {
  if (cache.has(key)) return cache.get(key)
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  draw(cv.getContext('2d'), w, h)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  cache.set(key, tex)
  return tex
}

/** the ICE wordmark etched on each stem */
export function markTexture() {
  return canvasTexture('mark', 256, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.fillStyle = '#d8dde6'
    g.font = '700 78px Archivo, Helvetica, Arial, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.letterSpacing = '4px'
    g.fillText('ICE', w / 2, h / 2 + 4)
  })
}

/** the Original Sound app screen shown floating beside the buds */
export function appScreenTexture() {
  return canvasTexture('app', 512, 1024, (g, w, h) => {
    g.fillStyle = '#080b11'
    g.fillRect(0, 0, w, h)

    g.fillStyle = '#e9eef6'
    g.font = '700 34px Archivo, sans-serif'
    g.fillText('Prime Pro ANC', 40, 96)
    g.fillStyle = '#8a97ab'
    g.font = '400 24px Manrope, sans-serif'
    g.fillText('Connected', 40, 136)

    /* battery pills */
    const pills = [
      ['Buds', 0.75],
      ['Case', 1.0],
    ]
    pills.forEach(([label, pct], i) => {
      const y = 200 + i * 100
      g.fillStyle = '#101722'
      g.beginPath()
      g.roundRect(40, y, w - 80, 72, 18)
      g.fill()
      g.fillStyle = '#8a97ab'
      g.font = '500 22px Manrope, sans-serif'
      g.fillText(label, 68, y + 44)
      g.fillStyle = '#1b2432'
      g.beginPath()
      g.roundRect(180, y + 28, 240, 16, 8)
      g.fill()
      g.fillStyle = i ? '#6fd8ff' : '#ff6a12'
      g.beginPath()
      g.roundRect(180, y + 28, 240 * pct, 16, 8)
      g.fill()
      g.fillStyle = '#e9eef6'
      g.font = '600 22px Manrope, sans-serif'
      g.fillText(Math.round(pct * 100) + '%', 440, y + 45)
    })

    /* mode selector */
    g.fillStyle = '#8a97ab'
    g.font = '500 22px Manrope, sans-serif'
    g.fillText('Noise control', 40, 440)
    const modes = ['ANC', 'Transparency', 'Off']
    modes.forEach((m, i) => {
      const x = 40 + i * 150
      const on = i === 0
      g.fillStyle = on ? '#ff6a12' : '#101722'
      g.beginPath()
      g.roundRect(x, 470, 138, 64, 16)
      g.fill()
      g.fillStyle = on ? '#08090c' : '#8a97ab'
      g.font = '600 20px Manrope, sans-serif'
      g.textAlign = 'center'
      g.fillText(m, x + 69, 508)
      g.textAlign = 'left'
    })

    /* EQ curve */
    g.fillStyle = '#8a97ab'
    g.font = '500 22px Manrope, sans-serif'
    g.fillText('Turbo Bass EQ', 40, 620)
    g.strokeStyle = '#1b2432'
    g.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      g.beginPath()
      g.moveTo(40, 680 + i * 48)
      g.lineTo(w - 40, 680 + i * 48)
      g.stroke()
    }
    g.strokeStyle = '#ff6a12'
    g.lineWidth = 6
    g.beginPath()
    for (let x = 0; x <= 100; x++) {
      const t = x / 100
      const y = 800 - Math.cos(t * 2.4) * 110 - Math.sin(t * 9) * 10
      const px = 40 + t * (w - 80)
      x === 0 ? g.moveTo(px, y) : g.lineTo(px, y)
    }
    g.stroke()

    g.fillStyle = '#5d6a7d'
    g.font = '400 20px Manrope, sans-serif'
    g.fillText('Gaming mode · 45ms', 40, 940)
    g.fillStyle = '#6fd8ff'
    g.beginPath()
    g.roundRect(w - 120, 918, 60, 32, 16)
    g.fill()
  })
}

/** the laptop screen for the dual-device chapter */
export function deskScreenTexture() {
  return canvasTexture('desk', 1024, 640, (g, w, h) => {
    g.fillStyle = '#070a10'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#0e131d'
    g.fillRect(0, 0, w, 60)
    ;['#ff6a12', '#ffb066', '#6fd8ff'].forEach((c, i) => {
      g.fillStyle = c
      g.beginPath()
      g.arc(36 + i * 28, 30, 8, 0, Math.PI * 2)
      g.fill()
    })
    /* waveform, because the laptop is the thing playing */
    g.strokeStyle = '#6fd8ff'
    g.lineWidth = 3
    for (let b = 0; b < 64; b++) {
      const x = 60 + b * 14
      const amp = (Math.sin(b * 0.7) * 0.5 + 0.5) * 160 + 20
      g.strokeStyle = b % 3 === 0 ? '#ff6a12' : '#1e3a4a'
      g.beginPath()
      g.moveTo(x, 340 - amp / 2)
      g.lineTo(x, 340 + amp / 2)
      g.stroke()
    }
    g.fillStyle = '#8a97ab'
    g.font = '500 26px Manrope, sans-serif'
    g.fillText('Call in progress — laptop', 60, 520)
    g.fillStyle = '#5d6a7d'
    g.font = '400 22px Manrope, sans-serif'
    g.fillText('Phone stays linked. Switch without re-pairing.', 60, 560)
  })
}

/** soft radial sprite used for dust, sparks and the noise cloud */
export function sparkTexture() {
  return canvasTexture('spark', 128, 128, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.25, 'rgba(255,255,255,0.55)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, h)
  })
}

/** L / R seat markers moulded into the orange tray */
export function letterTexture(ch) {
  return canvasTexture('letter-' + ch, 128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h)
    g.strokeStyle = 'rgba(255,255,255,0.85)'
    g.lineWidth = 6
    g.beginPath()
    g.arc(w / 2, h / 2, 44, 0, Math.PI * 2)
    g.stroke()
    g.fillStyle = 'rgba(255,255,255,0.9)'
    g.font = '700 52px Archivo, Helvetica, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(ch, w / 2, h / 2 + 3)
  })
}
