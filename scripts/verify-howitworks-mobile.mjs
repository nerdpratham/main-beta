// Verify the "How SixDX works" cards have no title/image/copy overlap on mobile.
import { chromium } from '@playwright/test'
import fs from 'fs'

const BASE = process.env.BASE_URL || 'http://localhost:5174/'
const OUT = 'test-artifacts/screenshots/howitworks-mobile'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const page = await ctx.newPage()
await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(5500) // let preloader finish

// Scroll the how-it-works section into view via Lenis.
const top = await page.evaluate(() => {
  const s = document.querySelector('#how-it-works')
  const r = s.getBoundingClientRect()
  return r.top + window.scrollY
})
await page.evaluate((y) => { const l = window.__lenis; if (l) l.scrollTo(y, { immediate: true }); else window.scrollTo(0, y) }, top - 20)
await page.waitForTimeout(800)

const report = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.how-it-works-card')]
  return cards.map((card, i) => {
    const title = card.querySelector('.how-card-title')
    const illo = card.querySelector('.how-card-illo')
    const copy = card.querySelector('.how-card-copy')
    const cr = card.getBoundingClientRect()
    const tr = title.getBoundingClientRect()
    const ir = illo.getBoundingClientRect()
    const pr = copy.getBoundingClientRect()
    const overlapTitleImg = Math.round(tr.bottom - ir.top)   // >0 => overlap
    const overlapImgCopy = Math.round(ir.bottom - pr.top)    // >0 => overlap
    const copyInsideCard = Math.round(cr.bottom - pr.bottom) // >=0 => copy fits inside card
    return {
      card: i,
      cardH: Math.round(cr.height),
      titleBottom: Math.round(tr.bottom),
      imgTop: Math.round(ir.top),
      imgBottom: Math.round(ir.bottom),
      copyTop: Math.round(pr.top),
      overlapTitleImg,
      overlapImgCopy,
      copyInsideCard,
      ok: overlapTitleImg <= 0 && overlapImgCopy <= 0 && copyInsideCard >= -1,
    }
  })
})

console.log(JSON.stringify(report, null, 2))

// Screenshot each card individually for a visual check.
const handles = await page.$$('.how-it-works-card')
for (let i = 0; i < handles.length; i++) {
  await handles[i].scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await handles[i].screenshot({ path: `${OUT}/card-${i}.png` })
}

const allOk = report.every((r) => r.ok)
console.log(allOk ? '✅ ALL CARDS OK — no overlap' : '❌ OVERLAP DETECTED')
await browser.close()
process.exit(allOk ? 0 : 1)
