import { chromium } from '@playwright/test'
import fs from 'fs'
const BASE = process.env.BASE_URL || 'http://localhost:5174/'
const OUT = 'test-artifacts/screenshots/stack-desktop'
fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(5500)
const stack = await page.evaluate(() => {
  const s = document.querySelector('section[aria-label="Industrial training outcomes"]')
  const r = s.getBoundingClientRect()
  return { top: r.top + window.scrollY, h: s.offsetHeight }
})
const span = Math.round(2.2 * stack.h)
for (let i = 0; i <= 8; i++) {
  const y = Math.round(stack.top + (span * i) / 8)
  await page.evaluate((pos) => { const l = window.__lenis; if (l) l.scrollTo(pos, { immediate: true }); else window.scrollTo(0, pos) }, y)
  await page.waitForTimeout(1100)
  await page.screenshot({ path: `${OUT}/d-${String(i).padStart(2, '0')}.png` })
}
await browser.close()
console.log('DONE desktop')
