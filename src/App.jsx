import { useEffect, useState } from 'react'
import { Stage } from './three/Stage'
import { Nav } from './components/Nav'
import { Rail } from './components/Rail'
import { Veil } from './components/Veil'
import { Hero } from './components/sections/Hero'
import { Story } from './components/sections/Story'
import { SpecSheet } from './components/sections/SpecSheet'
import { Buy } from './components/sections/Buy'
import { Faq } from './components/sections/Faq'
import { Footer } from './components/Footer'
import { useLenis } from './lib/useLenis'
import { initScrollListeners, registerSections, measure } from './lib/scroll'

function Boot() {
  const [done, setDone] = useState(false)
  useEffect(() => {
    const finish = () => requestAnimationFrame(() => setTimeout(() => setDone(true), 260))
    if (document.fonts?.ready) document.fonts.ready.then(finish)
    else finish()
    const failsafe = setTimeout(() => setDone(true), 2600)
    return () => clearTimeout(failsafe)
  }, [])
  return (
    <div className={`boot ${done ? 'is-done' : ''}`} aria-hidden={done}>
      <img src="/img/logo.webp" alt="" width="46" height="46" />
      <div className="boot__bar">
        <i />
      </div>
      <p className="boot__t">PRIME PRO ANC</p>
    </div>
  )
}

export default function App() {
  useLenis()

  useEffect(() => {
    const cleanup = initScrollListeners()

    const nodes = [...document.querySelectorAll('[data-chapter]')].sort(
      (a, b) => +a.dataset.chapter - +b.dataset.chapter
    )
    registerSections(nodes)

    /* copy blocks arrive as their chapter does, once each */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    )
    document.querySelectorAll('.rise').forEach((el) => io.observe(el))

    const ro = new ResizeObserver(() => measure())
    ro.observe(document.body)

    return () => {
      cleanup()
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <>
      <Boot />
      <a className="skip" href="#hero">
        Skip to content
      </a>
      <Stage />
      <Veil />
      <Nav />
      <Rail />
      <main className="flow">
        <Hero />
        <Story />
        <SpecSheet />
        <Buy />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
