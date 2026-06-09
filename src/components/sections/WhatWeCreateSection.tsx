// ─── SERVICES — SixDX ────────────────────────────────────────────────────────
// 1. Figma Services intro (node 974:18061), 100vh
// 2. Existing sticky-scroll services system, immediately after intro
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { gsap, ScrollTrigger } from '../../animations/gsap.config'
import { colors, textStyles } from '../../styles/tokens'

type ServiceItem = {
  title: string
  body: string
  media: {
    type: 'image' | 'video'
    src: string
    alt?: string
    poster?: string
  }
}

const INTRO_EYEBROW = 'SERVICES'
const INTRO_HEADING =
  'Training is not one-size-fits-all. Different failures need specific film types. Here are the six production types SixDX offers, each tailored for a unique learning outcome while maintaining high cinematic quality.'

const SERVICES: ServiceItem[] = [
  {
    title: 'SOP-based modules',
    body:
      'Transform standard operating procedures into a cinematic sequence. Use your procedure document as the source to create a film that the workforce can easily follow, minimizing gaps between written protocols and actual execution.',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1779642472369-19ea57235a90?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'SOP-based modules',
    },
  },
  {
    title: 'LFF (Learning From Failure) Based Animations',
    body:
      'LFF-based 3D animations transform equipment failure reports into engaging visual tools. They highlight how failures occurred, identify gaps, and present root causes with preventive measures. These animations aid organizations in embedding learning, preventing repeat incidents, and improving operational reliability and safety culture.',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1773332585698-cba3c91b73e4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Incident reconstruction',
    },
  },
  {
    title: 'Human Fatality & Accident Reconstruction Animations',
    body:
      'Human fatality and accident reconstruction animations depict real industrial and road accidents in realistic 3D settings. They illustrate how incidents happened, highlight unsafe actions, and suggest prevention methods. These animations enhance safety awareness, boost compliance, and help reduce repeat human errors.',
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1777829999062-917dd30ad425?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Plant familiarisation',
    },
  },
]

const T = {
  trackBg: 'rgba(255,255,255,0.35)',
} as const

function ServicesAnimatedHighlightText({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wordIndex, words) => (
        <span
          className="services-highlight-word"
          key={`${word}-${wordIndex}`}
          style={{ '--word': wordIndex + 1 } as CSSProperties}
        >
          {word}
          {wordIndex < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

const introStyles = {
  section: {
    minHeight: '100vh',
    width: '100%',
    padding: 20,
    boxSizing: 'border-box',
    background: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies CSSProperties,

  container: {
    width: 720,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  } satisfies CSSProperties,

  eyebrowWrap: {
    width: 720,
    maxWidth: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  } satisfies CSSProperties,

  eyebrow: {
    ...textStyles.eyebrow,
    textTransform: 'uppercase',
    color: colors.ink,
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  heading: {
    ...textStyles.sectionHeading,
    width: 720,
    maxWidth: '100%',
    color: colors.ink,
  } satisfies CSSProperties,
}

function ServicesIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isHighlightActive, setIsHighlightActive] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsHighlightActive(false)
          return
        }

        setIsHighlightActive(false)
        window.requestAnimationFrame(() => setIsHighlightActive(true))
      },
      { threshold: 0.45 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Services"
      data-theme="light"
      data-node-id="974:18061"
      className="services-intro-section"
      style={introStyles.section}
    >
      <div className="services-intro-container" style={introStyles.container}>
        <div style={introStyles.eyebrowWrap}>
          <p style={introStyles.eyebrow}>{INTRO_EYEBROW}</p>
        </div>

        <h2 className="services-intro-heading" style={introStyles.heading}>
          <span className={`services-flash-highlight${isHighlightActive ? ' is-active' : ''}`}>
            <ServicesAnimatedHighlightText text={INTRO_HEADING} />
          </span>
        </h2>
      </div>
    </section>
  )
}

function StickyServices() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const count = SERVICES.length

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return

    const panels = Array.from(section.querySelectorAll<HTMLDivElement>('[data-panel]'))
    const fills = Array.from(section.querySelectorAll<HTMLDivElement>('[data-fill]'))

    fills.forEach(fill => gsap.set(fill, { transformOrigin: 'top', scaleY: 0 }))
    panels.forEach((panel, index) => {
      gsap.set(panel, {
        clipPath: index === 0 ? 'inset(0% 0 0% 0)' : 'inset(100% 0 0% 0)',
      })
    })

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * count}`,
        pin: sticky,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
      },
    })

    fills.forEach((fill, index) => {
      timeline.to(fill, { scaleY: 1, duration: 1, ease: 'none' }, index)

      if (index > 0) {
        timeline.fromTo(
          panels[index],
          { clipPath: 'inset(100% 0 0% 0)' },
          { clipPath: 'inset(0% 0 0% 0)', duration: 1 },
          index,
        )
      }
    })

    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(refreshId)
      timeline.kill()
      ScrollTrigger.refresh()
    }
  }, [count])

  return (
    <>
      <section
        id="services"
        ref={sectionRef}
        aria-label="Services — sticky scroll"
        data-theme="dark"
        className="wwc-sticky-section"
        style={{ position: 'relative', minHeight: '100svh' }}
      >
        <div ref={stickyRef} style={{ position: 'relative', height: '100svh', overflow: 'hidden', background: colors.white }}>
          {SERVICES.map((item, index) => (
            <div
              key={item.title}
              data-panel={index}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: index + 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
                padding: '0 0 32px',
                boxSizing: 'border-box',
                background: colors.white,
                willChange: 'clip-path',
              }}
            >
              <div
                className="wwc-service-media"
                style={{
                  height: 'clamp(420px, calc(100svh - 116px), 616px)',
                  width: '100%',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  background: colors.brandSec,
                }}
              >
                {item.media.type === 'video' ? (
                  <video
                    src={item.media.src}
                    poster={item.media.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={item.media.src}
                    alt={item.media.alt ?? item.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom' }}
                  />
                )}

                <div
                  aria-hidden="true"
                  className="wwc-service-overlay"
                  style={{
                    position: 'absolute',
                    left: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    width: 1,
                    height: 200,
                    background: T.trackBg,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    data-fill={index}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: colors.white,
                      transform: 'scaleY(0)',
                      transformOrigin: 'top',
                      willChange: 'transform',
                    }}
                  />
                </div>
              </div>

              <div
                className="wwc-details-bar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  flex: 1,
                  padding: '0 20px',
                  background: colors.white,
                  boxSizing: 'border-box',
                  color: colors.ink,
                }}
              >
                <div
                  className="wwc-details-inner"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 24,
                  }}
                >
                  <h3
                    style={{
                      ...textStyles.featureTitle,
                      fontWeight: 500,
                      color: colors.ink,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="wwc-details-body"
                    style={{
                      ...textStyles.bodyLarge,
                      textTransform: 'capitalize',
                      color: colors.ink,
                      width: 452.244,
                      flexShrink: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div aria-hidden="true" className="wwc-sticky-end-spacer" style={{ height: 50, background: colors.white }} />
    </>
  )
}

export default function WhatWeCreateSection() {
  return (
    <>
      <ServicesIntro />
      <StickyServices />
    </>
  )
}
