import { useEffect } from 'react'

const TARGET_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,a,button'
const ENABLE_PARAM = 'type-debug'

function getSectionName(element: Element) {
  const section = element.closest('section,[aria-label],[data-theme],main')
  if (!section) return 'Unknown section'

  return (
    section.getAttribute('aria-label') ||
    section.getAttribute('id') ||
    section.getAttribute('class')?.split(/\s+/).filter(Boolean).slice(0, 2).join('.') ||
    section.tagName.toLowerCase()
  )
}

function createBadge(element: Element) {
  const rect = element.getBoundingClientRect()
  if (rect.width < 8 || rect.height < 8) return null

  const styles = window.getComputedStyle(element)
  const badge = document.createElement('div')
  const tag = element.tagName.toLowerCase()
  const section = getSectionName(element)

  badge.className = 'sixdx-type-inspector-badge'
  badge.textContent = `${tag} | ${section} | ${styles.fontSize} / ${styles.lineHeight}`
  badge.style.position = 'absolute'
  badge.style.left = `${window.scrollX + rect.left}px`
  badge.style.top = `${window.scrollY + rect.top - 18}px`
  badge.style.zIndex = '2147483647'
  badge.style.padding = '2px 5px'
  badge.style.borderRadius = '2px'
  badge.style.background = '#E1A853'
  badge.style.color = '#1C0B05'
  badge.style.font = '500 10px/1.2 Helvetica, Arial, sans-serif'
  badge.style.letterSpacing = '0'
  badge.style.pointerEvents = 'none'
  badge.style.whiteSpace = 'nowrap'
  badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)'

  return badge
}

export default function TypographyInspector() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const enabled = params.get(ENABLE_PARAM) === '1'
    if (!enabled) return

    const root = document.createElement('div')
    root.id = 'sixdx-type-inspector'
    root.style.position = 'absolute'
    root.style.inset = '0'
    root.style.pointerEvents = 'none'
    root.style.zIndex = '2147483647'
    document.body.appendChild(root)

    const style = document.createElement('style')
    style.textContent = `
      body.type-debug-active ${TARGET_SELECTOR} {
        outline: 1px dashed rgba(225, 168, 83, 0.85) !important;
        outline-offset: 2px !important;
      }
    `
    document.head.appendChild(style)
    document.body.classList.add('type-debug-active')

    let rafId = 0

    const render = () => {
      root.innerHTML = ''
      document.querySelectorAll(TARGET_SELECTOR).forEach((element) => {
        if (element.closest('#sixdx-type-inspector')) return
        const badge = createBadge(element)
        if (badge) root.appendChild(badge)
      })
    }

    const scheduleRender = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(render)
    }

    render()
    window.addEventListener('resize', scheduleRender)
    window.addEventListener('scroll', scheduleRender, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', scheduleRender)
      window.removeEventListener('scroll', scheduleRender)
      document.body.classList.remove('type-debug-active')
      root.remove()
      style.remove()
    }
  }, [])

  return null
}
