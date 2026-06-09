// Standalone Playwright driver to verify the mobile StackSection reveal.
// Usage: node scripts/verify-stack-mobile.mjs  (dev server must be running)
import { chromium } from '@playwright/test'
import fs from 'fs'

const BASE = process.env.BASE_URL || 'http://localhost:5174/'
const OUT = 'test-artifacts/screenshots/stack-mobile'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const page = await ctx.newPage()
page.on('console', (m) => { if (m.type() === 'error') console.log('PAGE ERROR:', m.text()) })

await page.goto(BASE, { waitUntil: 'domcontentloaded' })
// Preloader runs ~4.2s before unmounting.
await page.waitForTimeout(5500)

const measure = async () => page.evaluate(() => {
  const sceneEl = document.querySelector('[aria-label="Stats section"]')
  const sr = sceneEl ? sceneEl.getBoundingClientRect() : null
  const cards = [...document.querySelectorAll('[data-stat-card]')].map((c) => {
    const r = c.getBoundingClientRect()
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      h: Math.round(r.height),
      num: c.querySelector('.stat-meter-number')?.textContent ?? '',
      active: c.classList.contains('is-meter-active'),
    }
  })
  return {
    scene: sr ? { w: Math.round(sr.width), h: Math.round(sr.height), top: Math.round(sr.top), left: Math.round(sr.left) } : null,
    cards,
    innerH: window.innerHeight,
  }
})

const stack = await page.evaluate(() => {
  const s = document.querySelector('section[aria-label="Industrial training outcomes"]')
  const r = s.getBoundingClientRect()
  return { top: r.top + window.scrollY, h: s.offsetHeight }
})
console.log('stackTop=', Math.round(stack.top), 'sectionH=', stack.h)

const span = Math.round(3.2 * stack.h)
const steps = 16
for (let i = 0; i <= steps; i++) {
  const y = Math.round(stack.top + (span * i) / steps)
  await page.evaluate((pos) => {
    const l = window.__lenis
    if (l && typeof l.scrollTo === 'function') l.scrollTo(pos, { immediate: true })
    else window.scrollTo({ top: pos, behavior: 'instant' })
  }, y)
  // let the meter (real-time tween ~3s) make visible progress
  await page.waitForTimeout(1200)
  const data = await measure()
  console.log(`step ${String(i).padStart(2, '0')} y=${y}`, JSON.stringify(data))
  await page.screenshot({ path: `${OUT}/step-${String(i).padStart(2, '0')}.png` })
}

// Scroll a bit past the end to confirm we reach the next section.
await page.evaluate((pos) => {
  const l = window.__lenis
  if (l) l.scrollTo(pos, { immediate: true })
}, Math.round(stack.top + span + stack.h))
await page.waitForTimeout(1000)
await page.screenshot({ path: `${OUT}/step-after.png` })

await browser.close()
console.log('DONE — screenshots in', OUT)
