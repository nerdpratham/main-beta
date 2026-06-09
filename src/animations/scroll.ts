// ─── LENIS + SCROLLTRIGGER SYNC ──────────────────────────────────────────────
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap.config'

// ─── SCROLL CONFIG — edit timing here ────────────────────────────────────────
const SCROLL_CONFIG = {
  duration: 1.35,
  easing: (t: number) => 1 - Math.pow(1 - t, 4),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
}
// ─────────────────────────────────────────────────────────────────────────────

let lenisInstance: Lenis | null = null
let rafCallback: ((time: number) => void) | null = null

export function initScroll(): Lenis {
  destroyScroll()

  lenisInstance = new Lenis(SCROLL_CONFIG)

  lenisInstance.on('scroll', ScrollTrigger.update)

  rafCallback = (time) => {
    lenisInstance?.raf(time * 1000)
  }

  gsap.ticker.add(rafCallback)
  gsap.ticker.lagSmoothing(0)

  // Dev-only: expose the Lenis instance so e2e/Playwright can drive scroll
  // deterministically (lenis.scrollTo(y, { immediate: true })).
  if (import.meta.env.DEV) {
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenisInstance
  }

  return lenisInstance
}

export function destroyScroll(): void {
  if (rafCallback) {
    gsap.ticker.remove(rafCallback)
    rafCallback = null
  }

  lenisInstance?.destroy()
  lenisInstance = null
}

export { lenisInstance }
