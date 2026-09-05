import { useEffect } from 'react'
import Lenis from 'lenis'
import { scroll, update, measure } from './scroll'

export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      const onScroll = () => update(window.scrollY)
      window.addEventListener('scroll', onScroll, { passive: true })
      update(window.scrollY)
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ({ scroll: y }) => update(y))

    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    /* fonts and images shift layout — remeasure once they land */
    const settle = setTimeout(measure, 400)
    if (document.fonts?.ready) document.fonts.ready.then(measure)

    window.__lenis = lenis
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(settle)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const el = document.querySelector(a.getAttribute('href'))
      if (!el) return
      e.preventDefault()
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, duration: 1.4 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  void scroll
}
