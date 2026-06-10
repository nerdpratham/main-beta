// ─── NAVBAR — SixDX ──────────────────────────────────────────────────────────
// Desktop  (≥1200px): logo + glass nav pills + CTA button
// Tablet  (810–1199px): logo height 32px + hamburger → full-screen menu
// Mobile   (≤809px) : logo height 32px + hamburger → full-screen menu
//
// Open state (tablet + mobile):
//   Full-screen #0a0a0a overlay. GSAP staggers nav links in from below.
//   Close via menu button, nav-link click, or Escape key.
//
// Light / Dark theme: dual IntersectionObserver on [data-theme] attributes.
//   Dark wins whenever any dark section overlaps the navbar.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { gsap } from '../../animations/gsap.config'
import { lenisInstance } from '../../animations/scroll'
import PrimaryButton from '../ui/PrimaryButton'
import { textStyles } from '../../styles/tokens'

// ─── CONTENT — edit freely ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#how-it-works' },
  { label: 'Work', href: '#work' },
] as const

const CTA = { label: 'Get in touch', href: '#contact' }
// ─── END CONTENT ─────────────────────────────────────────────────────────────

// ─── NAV SCROLL OFFSET CONTROLS ──────────────────────────────────────────────
// More negative = section lands lower below the navbar.
// More positive = section lands closer to the top of the viewport.
const NAV_SCROLL_OFFSETS: Record<string, number> = {
  '#about': -20,
  '#services': 0,
  '#how-it-works': 60,
  '#work': -20,
  '#contact': 100,
}
// ─── END NAV SCROLL OFFSET CONTROLS ──────────────────────────────────────────

const GLASS_ITEM: React.CSSProperties = {
  ...textStyles.bodySmall,
  paddingLeft: 'var(--nav-link-padding-x, 1rem)',
  paddingRight: 'var(--nav-link-padding-x, 1rem)',
  paddingTop: 'var(--nav-link-padding-y, 0.25rem)',
  paddingBottom: 'var(--nav-link-padding-y, 0.25rem)',
  borderRadius: 0,
  color: 'var(--nav-text, #ffffff)',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.25s ease, color 0.3s ease',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

// ─── GOOEY SVG FILTER — referenced by PrimaryButton ──────────────────────────
const GooeyFilterDef = () => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
  >
    <defs>
      <filter id="goo-effect">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -18"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)

// ─── ICONS ────────────────────────────────────────────────────────────────────
function HamburgerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="24" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="4" y="15.25" width="24" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="4" y="20.5" width="24" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  )
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const ctaWrapRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const getScrollOffset = (href: string) => {
    const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0
    return -headerHeight + (NAV_SCROLL_OFFSETS[href] ?? 0)
  }

  const scrollToTarget = (href: string) => {
    if (href === '/' || href === '#') {
      lenisInstance?.scrollTo(0, { offset: 0, duration: 1.15 })
      if (!lenisInstance) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.querySelector<HTMLElement>(href)
    if (!target) return

    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset: getScrollOffset(href),
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      })
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
    closeOverlay = false,
  ) => {
    if (!href.startsWith('#') && href !== '/') return

    event.preventDefault()

    if (closeOverlay) {
      closeMenu()
      window.setTimeout(() => scrollToTarget(href), 420)
      return
    }

    scrollToTarget(href)
  }

  // ── Light / dark theme sampler ─────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0
    let lastTheme: 'light' | 'dark' | null = null

    const getThemeElementAt = (x: number, y: number) => {
      const header = headerRef.current
      const originalPointerEvents = header?.style.pointerEvents
      if (header) header.style.pointerEvents = 'none'
      const stack = document.elementsFromPoint(x, y)
      if (header) header.style.pointerEvents = originalPointerEvents ?? ''
      return stack.find((el) => el instanceof HTMLElement && el.dataset.theme) as HTMLElement | undefined
    }

    const sampleTheme = () => {
      rafId = 0
      const header = headerRef.current
      if (!header) return

      const rect = header.getBoundingClientRect()
      const sampleY = Math.min(window.innerHeight - 1, Math.max(0, rect.bottom + 2))
      const sampleXs = [rect.left + rect.width * 0.2, rect.left + rect.width * 0.5, rect.left + rect.width * 0.8]
      const sampledThemes = sampleXs
        .map((x) => getThemeElementAt(Math.min(window.innerWidth - 1, Math.max(0, x)), sampleY)?.dataset.theme)
        .filter(Boolean)

      const nextTheme = sampledThemes.includes('dark') ? 'dark' : sampledThemes.includes('light') ? 'light' : 'dark'
      if (nextTheme === lastTheme) return
      lastTheme = nextTheme
      header.classList.toggle('theme-light', nextTheme === 'light')
    }

    const schedule = () => {
      if (!rafId) rafId = window.requestAnimationFrame(sampleTheme)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  // ── Open ──────────────────────────────────────────────────────────────────
  const openMenu = () => {
    setMenuOpen(true)
    document.body.style.overflow = 'hidden'

    const menu = menuRef.current
    const links = linkRefs.current.filter(Boolean)
    const cta = ctaWrapRef.current
    if (!menu) return

    tlRef.current?.kill()
    gsap.set(menu, { autoAlpha: 0 })
    gsap.set([links, cta], { y: 28, autoAlpha: 0 })

    tlRef.current = gsap.timeline()
      .to(menu, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      .to(links, { y: 0, autoAlpha: 1, stagger: 0.09, duration: 0.5, ease: 'power3.out' }, '-=0.15')
      .to(cta, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, '-=0.25')
  }

  // ── Close ─────────────────────────────────────────────────────────────────
  const closeMenu = () => {
    const menu = menuRef.current
    const links = linkRefs.current.filter(Boolean)
    const cta = ctaWrapRef.current

    tlRef.current?.kill()
    tlRef.current = gsap.timeline({
      onComplete: () => {
        setMenuOpen(false)
        document.body.style.overflow = ''
      },
    })
      .to([links, cta], { y: -10, autoAlpha: 0, stagger: 0.03, duration: 0.18, ease: 'power2.in' })
      .to(menu, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, '-=0.08')
  }

  // ── Escape key closes menu ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <style>{`
        /* ── Theme CSS variables ─────────────────────────────────────────── */
        header.sixdx-nav {
          --nav-bar-bg:    rgba(28,11,5,0.3);
          --nav-link-bg:   #ffffff19;
          --nav-link-hover-bg: rgba(28,11,5,0);
          --nav-link-blur: 4px;
          --nav-link-hover-blur: 0px;
          --nav-logo-height: 2.75rem;
          --nav-link-padding-x: 1rem;
          --nav-link-padding-y: 0.25rem;
          --nav-padding-x: 28px;
          --nav-padding-y: 8px;
          --nav-overlay-padding: 20px;
          --nav-overlay-header-gap: 60px;
          --nav-overlay-logo-width: 102px;
          --nav-overlay-logo-height: 40px;
          --nav-overlay-link-gap: 8px;
          --nav-overlay-link-size: 2.25rem;
          --nav-overlay-link-line-height: 1.1;
          --nav-text:      #ffffff;
          --cta-bg:        #ffffff;
          --cta-text:      #000000;
        }
        /* theme-light must override COLOURS only. It must NOT re-declare layout
           vars (logo height, paddings, overlay sizes): redeclaring them here at
           higher specificity clobbered the responsive tablet/mobile overrides,
           which made the dark (light-theme) logo render at the desktop 2.75rem
           height on mobile while the white logo stayed 32px. */
        header.sixdx-nav.theme-light {
          --nav-bar-bg:    rgba(28,11,5,0.08);
          --nav-link-bg:   #FCF4F2;
          --nav-link-hover-bg: rgba(255,255,255,0);
          --nav-text:      #1C0B05;
          --cta-bg:        #CC4D22;
          --cta-text:      #ffffff;
        }

        /* ── Logo — Figma-exact sizes per breakpoint ─────────────────────── */
        .sixdx-logo      {
          display: block;
          height: var(--nav-logo-height, 2.75rem);
          width: auto;
          aspect-ratio: 102 / 40;
        }  /* desktop */
        .sixdx-logo-link { margin-right: 0; flex-shrink: 0; display: flex; align-items: center; }

        /* Open-menu (overlay) logo. The overlay is a sibling of the header, so it
           can't read the header's --nav-overlay-* vars — size it directly here.
           Default = mobile (unchanged); tablet matches the desktop logo size. */
        .sixdx-overlay-logo {
          display: block;
          height: 3rem;
          width: 102px;
          aspect-ratio: 102 / 40;
        }

        /* Overlay container padding (default = tablet, unchanged). On mobile this
           is overridden to match the header bar so the logo doesn't shift on open. */
        .sixdx-menu-overlay {
          padding: 20px;
        }

        .nav-pill-link {
          background-color: var(--nav-link-bg);
          backdrop-filter: blur(var(--nav-link-blur));
          -webkit-backdrop-filter: blur(var(--nav-link-blur));
          border: 0;
          outline: 0;
          box-shadow: none;
          overflow: hidden;
          isolation: isolate;
          contain: paint;
          background-clip: padding-box;
        }
        .nav-pill-link:hover {
          background-color: var(--nav-link-hover-bg);
          backdrop-filter: blur(var(--nav-link-hover-blur));
          -webkit-backdrop-filter: blur(var(--nav-link-hover-blur));
        }

        /* ── Responsive show / hide ──────────────────────────────────────── */
        .nav-pills     { display: flex; }
        .nav-hamburger { display: none; }

        /* Tablet: 810–1199px */
        @media (min-width: 810px) and (max-width: 1199px) {
          header.sixdx-nav {
            /* Tablet logo matches the desktop size (header + open-menu overlay) */
            --nav-logo-height: 2.75rem;
            --nav-padding-x: 24px;
            --nav-padding-y: 12px;
            --nav-overlay-padding: 20px;
            --nav-overlay-header-gap: 60px;
            --nav-overlay-logo-width: 112px;
            --nav-overlay-logo-height: 2.75rem;
            --nav-overlay-link-gap: 8px;
            --nav-overlay-link-size: 2.25rem;
            --nav-overlay-link-line-height: 1.1;
          }
          .nav-pills {
            display: none;
          }
          .nav-hamburger {
            display: flex;
            width: 44px;
            height: 44px;
            margin-left: auto;
          }
          .sixdx-logo-link {
            margin-right: 0;
          }
          /* Open-menu logo matches the desktop header logo (44px tall, auto width) */
          .sixdx-overlay-logo {
            height: 2.75rem;
            width: auto;
          }
          /* Overlay padding matches the tablet header bar so the logo stays put on open */
          .sixdx-menu-overlay {
            padding: 12px 24px;
          }
        }

        /* Mobile: ≤809px — smaller logo, tighter side padding (12px) */
        @media (max-width: 809px) {
          header.sixdx-nav {
            --nav-logo-height: 32px;
            --nav-padding-x: 16px;
            --nav-padding-y: 10px;
            --nav-overlay-padding: 20px;
            --nav-overlay-header-gap: 60px;
            --nav-overlay-logo-width: 102px;
            --nav-overlay-logo-height: 40px;
            --nav-overlay-link-gap: 12px;
            --nav-overlay-link-size: 1.5rem;
            --nav-overlay-link-line-height: 1;
          }
          .nav-pills {
            display: none;
          }
          .nav-hamburger {
            display: flex;
            width: 44px;
            height: 44px;
            margin-left: auto;
          }
          .sixdx-logo-link {
            margin-right: 0;
          }
          /* Open-menu logo + padding match the closed header so nothing shifts on open */
          .sixdx-overlay-logo {
            height: 32px;
            width: auto;
          }
          .sixdx-menu-overlay {
            padding: 10px 16px;
          }
          .sixdx-menu-cta .clarte-button {
            width: 100% !important;
          }
        }
      `}</style>

      <GooeyFilterDef />

      {/* ════════════════════════════════════════════════════════════════════════
          HEADER BAR
      ════════════════════════════════════════════════════════════════════════ */}
      <header
        ref={headerRef}
        className="sixdx-nav"
        aria-label="Site navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingLeft: 'var(--nav-padding-x, 28px)',
          paddingRight: 'var(--nav-padding-x, 28px)',
          paddingTop: 'var(--nav-padding-y, 4px)',
          paddingBottom: 'var(--nav-padding-y, 4px)',
          borderRadius: 0,
          background: 'var(--nav-bar-bg, rgba(28, 11, 5, 0.1))',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: 'none',
          transition: 'background 0.3s ease',
        }}
      >
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <a
          href="/"
          aria-label="SixDX home"
          className="sixdx-logo-link"
          onClick={(event) => handleNavClick(event, '/')}
        >
          <div
            className="sixdx-logo"
            aria-label="SixDX"
            style={{
              backgroundColor: 'var(--nav-text, #ffffff)',
              WebkitMaskImage: 'url(/sixdx-logo.svg)',
              maskImage: 'url(/sixdx-logo.svg)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              transition: 'background-color 0.3s ease',
            }}
          />
        </a>

        {/* ── Desktop: glass pills + CTA ────────────────────────────────────── */}
        <nav
          className="nav-pills"
          aria-label="Primary navigation"
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: '0 0 auto',
            gap: '0.125rem',
            minHeight: '3.5rem',
          }}
        >
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="nav-pill-link"
              onClick={(event) => handleNavClick(event, item.href)}
              style={{ ...GLASS_ITEM, flex: '0 0 auto', alignSelf: 'center' }}
            >
              {item.label}
            </a>
          ))}
          <PrimaryButton
            label={CTA.label}
            href={CTA.href}
            className="clarte-button--nav"
            onClick={(event) => handleNavClick(event, CTA.href)}
          />
        </nav>

        {/* ── Tablet / mobile: hamburger ───────────────────────────────────── */}
        <button
          className="nav-hamburger"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={openMenu}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: 'var(--nav-text, #ffffff)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HamburgerIcon />
        </button>
      </header>

      {/* ════════════════════════════════════════════════════════════════════════
          FULL-SCREEN MENU OVERLAY (tablet + mobile)
          Always in the DOM — GSAP controls visibility via autoAlpha.
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
        className="sixdx-menu-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: '#0A0402',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 'var(--nav-overlay-header-gap, 60px)',
          visibility: 'hidden',
          opacity: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Header bar: logo + close */}
        <div
          className="sixdx-menu-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexShrink: 0,
          }}
        >
          <a
            href="/"
            aria-label="SixDX home"
            onClick={(event) => handleNavClick(event, '/', true)}
            style={{ display: 'flex' }}
          >
            <div
              aria-label="SixDX"
              className="sixdx-overlay-logo"
            style={{
                backgroundColor: '#ffffff',
                WebkitMaskImage: 'url(/sixdx-logo.svg)',
                maskImage: 'url(/sixdx-logo.svg)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
            />
          </a>

          <button
            aria-label="Close navigation menu"
            onClick={closeMenu}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              width: 44,
              height: 44,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HamburgerIcon />
          </button>
        </div>

        {/* Nav links — vertically centered, large Marund */}
        <nav
          className="sixdx-menu-links"
          aria-label="Mobile navigation"
          style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 'var(--nav-overlay-link-gap, 8px)',
            width: '100%',
          }}
        >
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              ref={el => { linkRefs.current[i] = el }}
              onClick={(event) => handleNavClick(event, item.href, true)}
              style={{
                ...textStyles.sectionHeading,
                fontSize: 'var(--nav-overlay-link-size, clamp(2rem, 6vw, 3rem))',
                lineHeight: 'var(--nav-overlay-link-line-height, 1.1)',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'block',
                width: '100%',
                padding: 0,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.45')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA at bottom */}
        <div
          ref={ctaWrapRef}
          className="sixdx-menu-cta"
          style={{
            marginTop: 'calc(-1 * var(--nav-overlay-header-gap, 60px) + 20px)',
            flexShrink: 0,
            width: '100%',
          }}
        >
          <PrimaryButton
            label={CTA.label}
            href={CTA.href}
            className="sixdx-menu-button"
            onClick={(event) => handleNavClick(event, CTA.href, true)}
          />
        </div>
      </div>
    </>
  )
}
