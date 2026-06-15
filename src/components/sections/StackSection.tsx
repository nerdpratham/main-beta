// ─── STACK SECTION — SixDX ───────────────────────────────────────────────────
// Two-phase scroll-pinned section:
//
// Phase 1 (scrub 0 → 1):  "Precision driven · Forward Motion"
//   circle → capsule → full screen via clip-path.
//
// Phase 2 (scrub 1.1 → ~1.8):  Stats appear
//   Heading → subtext → 3 StatCircle cards.
//   Each StatCircle drives ring + number from one GSAP timeline.
// ─────────────────────────────────────────────────────────────────────────────

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { gsap, ScrollTrigger } from '../../animations/gsap.config'
import { lenisInstance } from '../../animations/scroll'
import { fonts, colors, textStyles } from '../../styles/tokens'

const RING_TICKS = 80
const METER_DURATION = 1.65
const METER_START_STAGGER = 0.0

interface StatCircleHandle {
  start: (delay?: number, onDone?: () => void) => void
  reset: () => void
}

const StatCircle = forwardRef<StatCircleHandle, {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  size?: number
}>(function StatCircle({ value, suffix = '', prefix = '', duration = METER_DURATION, size = 260 }, ref) {
  const maskRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const CX = size / 2
  const R_OUT = CX - 3
  const R_IN = R_OUT - Math.round(size * 0.05)
  const SW = 1.5
  const INNER = CX - R_IN + 2

  const ticksData = useMemo(() => Array.from({ length: RING_TICKS }, (_, i) => {
    const a = (i / RING_TICKS) * 2 * Math.PI - Math.PI / 2
    const cos = Math.cos(a), sin = Math.sin(a)
    return {
      x1: +(CX + R_IN * cos).toFixed(3),
      y1: +(CX + R_IN * sin).toFixed(3),
      x2: +(CX + R_OUT * cos).toFixed(3),
      y2: +(CX + R_OUT * sin).toFixed(3),
    }
  }), [CX, R_IN, R_OUT])

  const applyMask = (pct: number) => {
    const p = `${Math.min(100, Math.max(0, pct)).toFixed(1)}%`
    const v = `conic-gradient(from -90deg, white 0% ${p}, transparent ${p} 100%)`
    if (maskRef.current) {
      maskRef.current.style.maskImage = v
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(maskRef.current.style as any).webkitMaskImage = v
    }
  }

  const showNum = (n: number) => {
    if (numRef.current) numRef.current.textContent = `${prefix}${Math.round(n)}${suffix}`
  }

  useImperativeHandle(ref, () => ({
    start(delay = 0, onDone?: () => void) {
      if (hasRun.current) return
      hasRun.current = true
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        applyMask(value); showNum(value); onDone?.(); return
      }
      const state = { val: 0 }
      tlRef.current = gsap.timeline({ delay })
        .to(state, {
          val: value,
          duration,
          ease: 'power1.inOut',
          onUpdate() { applyMask(state.val); showNum(state.val) },
          onComplete() {
            applyMask(value)
            showNum(value)
            onDone?.()
          },
        })
    },
    reset() {
      tlRef.current?.kill()
      hasRun.current = false
      applyMask(0)
      showNum(0)
    },
  }))

  useEffect(() => {
    applyMask(0); showNum(0)
    return () => { tlRef.current?.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="stat-circle-meter" style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg className="stat-meter-track" width={size} height={size} aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {ticksData.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="rgba(255,255,255,0.16)" strokeWidth={SW} strokeLinecap="round"
            style={{ '--tick': i } as CSSProperties} />
        ))}
      </svg>

      <div style={{
        position: 'absolute', inset: INNER, borderRadius: '50%',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        background: 'rgba(0,0,0,0.28)', pointerEvents: 'none',
      }} />

      <div ref={maskRef} className="stat-meter-progress" style={{
        position: 'absolute', inset: 0,
        maskImage: 'conic-gradient(from -90deg, white 0% 0%, transparent 0% 100%)',
        pointerEvents: 'none',
      }}>
        <svg width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
          {ticksData.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke="rgba(255,255,255,0.95)" strokeWidth={SW} strokeLinecap="round"
              style={{ '--tick': i } as CSSProperties} />
          ))}
        </svg>
      </div>

      <span ref={numRef} className="stat-meter-number" style={{
        ...textStyles.metricNumber,
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        color: colors.white, whiteSpace: 'nowrap',
      }} />
    </div>
  )
})

const LEFT_WORDS = ['Precision', 'driven']
const RIGHT_WORD = ['Forward', 'Motion']
const HEADING = 'NUMBERS'
const SUBTEXT = 'A flat animation, a screen-recorded walkthrough, a stock-footage montage. None of it communicates the weight of a pressurised valve, the heat of a furnace floor, or the consequence of a wrong sequence inside a confined space.'

const STATS: { value: number; suffix: string; prefix?: string; label: string; duration?: number }[] = [
  { value: 68, suffix: '%', label: 'Better retention than slide training', duration: 3.0 },
  { value: 40, suffix: '%', label: 'Fewer refresher training cycles', duration: 2.8 },
  { value: 100, suffix: '%', label: 'HSE compliance modules accepted.', duration: 2.4 },
]

function StackAnimatedHighlightText({ text }: { text: string }) {
  let charIndex = 0

  return (
    <>
      {text.split(' ').map((word, wordIndex, words) => (
        <span
          className="stack-highlight-word"
          key={`${word}-${wordIndex}`}
          style={{ '--word': wordIndex + 1 } as CSSProperties}
        >
          {Array.from(word).map((char, index) => {
            charIndex += 1

            return (
              <span
                className="stack-highlight-char"
                key={`${char}-${wordIndex}-${index}`}
                style={{ '--char': charIndex } as CSSProperties}
              >
                {char}
              </span>
            )
          })}
          {wordIndex < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

export default function StackSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const whiteLayerRef = useRef<HTMLDivElement>(null)
  const sceneDivRef = useRef<HTMLDivElement>(null)
  const darkSentinelRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const subtextHighlightRef = useRef<HTMLSpanElement>(null)
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const circleRefs = useRef<(StatCircleHandle | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const whiteLayer = whiteLayerRef.current
    const sceneDiv = sceneDivRef.current
    const leftText = leftTextRef.current
    const rightText = rightTextRef.current
    const heading = headingRef.current
    const subtext = subtextRef.current
    const subtextHighlight = subtextHighlightRef.current
    if (!section || !whiteLayer || !sceneDiv || !leftText || !rightText || !heading || !subtext || !subtextHighlight) return

    const statCards = Array.from(section.querySelectorAll<HTMLDivElement>('[data-stat-card]'))
    const matchMedia = gsap.matchMedia()
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.set(sceneDiv, {
          clipPath: 'none',
          left: '50%',
          top: '50%',
          right: 'auto',
          bottom: 'auto',
          xPercent: -50,
          yPercent: -50,
          width: '100vw',
          height: '100svh',
          borderRadius: 0,
        })
        gsap.set([leftText, rightText], { autoAlpha: 0 })
        gsap.set([heading, subtext, ...statCards], { autoAlpha: 1 })
        section.dataset.theme = 'dark'
        subtextHighlight.classList.add('is-active')
        circleRefs.current.forEach(c => c?.start())
        return
      }

      matchMedia.add(
        { desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' },
        (ctx) => {
          const isMobile = (ctx.conditions as Record<string, boolean>).mobile

          gsap.set(sceneDiv, {
            clipPath: 'none',
            autoAlpha: 1,
            scale: 1,
            left: '50%',
            top: '50%',
            right: 'auto',
            bottom: 'auto',
            xPercent: -50,
            yPercent: -50,
            width: 0,
            height: 0,
            borderRadius: 500,
            force3D: true,
            willChange: 'width, height, border-radius',
          })
          gsap.set([leftText, rightText], { autoAlpha: 1, color: colors.ink, willChange: 'transform, opacity, color' })
          gsap.set(whiteLayer, { autoAlpha: 1 })
          gsap.set(heading, { autoAlpha: 0, y: 40, immediateRender: true })
          gsap.set(subtext, { autoAlpha: 0, y: 30, immediateRender: true })
          gsap.set(statCards, { autoAlpha: 0, y: 24, scale: 0.94, immediateRender: true })
          section.dataset.theme = 'light'
          subtextHighlight.classList.remove('is-active')

          const revealLength = isMobile ? '+=90%' : '+=155%'
          const cardStagger = 0.12
          const startedMeters = new Set<number>()

          const startMeter = (index: number) => {
            const card = statCards[index]
            if (!card || startedMeters.has(index)) return
            startedMeters.add(index)
            card.classList.remove('is-meter-active')
            void card.offsetWidth
            card.classList.add('is-meter-active')
            circleRefs.current[index]?.start(0)
          }

          const resetMeters = () => {
            startedMeters.clear()
            statCards.forEach((card) => {
              card.classList.remove('is-meter-active')
            })
            circleRefs.current.forEach((circle) => circle?.reset())
          }

          // ── MOBILE: scroll the circle column through the pinned screen ───────
          // The three circles are taller than one phone screen, so instead of
          // fading them in place (where the lower ones sit off-screen) we keep
          // the section pinned and translate the content column upward. Each
          // circle's meter fires as it scrolls into view → they reveal one-by-one,
          // and the pin only releases once the last circle has been shown.
          if (isMobile) {
            const content = sceneDiv.querySelector<HTMLElement>('.stack-scene-content')
            gsap.set(statCards, { autoAlpha: 1, y: 0, scale: 1 })
            if (content) gsap.set(content, { y: 0 })
            resetMeters()

            const getOverflow = () =>
              content ? Math.max(0, content.offsetHeight - window.innerHeight) : 0

            const revealMetersInView = () => {
              const vh = window.innerHeight
              statCards.forEach((card, i) => {
                const rect = card.getBoundingClientRect()
                const center = rect.top + rect.height / 2
                if (center > vh * 0.04 && center < vh * 0.92) startMeter(i)
              })
            }

            const mtl = gsap.timeline({
              onReverseComplete: () => {
                resetMeters()
                subtextHighlight.classList.remove('is-active')
                gsap.set([leftText, rightText], { color: colors.ink })
              },
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=320%',
                pin: true,
                scrub: true,
                anticipatePin: 1,
                refreshPriority: -1,
                invalidateOnRefresh: true,
                onUpdate: () => {
                  const sentinel = darkSentinelRef.current
                  const precisionIsGone = mtl.time() >= 1
                  if (sentinel) sentinel.style.display = precisionIsGone ? 'block' : 'none'
                  section.dataset.theme = precisionIsGone ? 'dark' : 'light'
                  revealMetersInView()
                },
                onLeaveBack: () => {
                  if (darkSentinelRef.current) darkSentinelRef.current.style.display = 'none'
                  section.dataset.theme = 'light'
                  resetMeters()
                  subtextHighlight.classList.remove('is-active')
                  gsap.set([leftText, rightText], { color: colors.ink })
                },
              },
            })

            // Phase 1 — circle grows from the screen centre to full screen.
            mtl.fromTo(
              sceneDiv,
              { width: 0, height: 0, borderRadius: 500 },
              { width: '90vw', height: '58svh', borderRadius: 150, ease: 'none', duration: 0.45 },
              0,
            )
            mtl.to(
              sceneDiv,
              { width: '100vw', height: '100svh', borderRadius: 150, ease: 'none', duration: 0.5 },
              0.45,
            )
            mtl.to([leftText, rightText], { color: colors.white, ease: 'power1.inOut', duration: 0.9 }, 0)
            mtl.to([leftText, rightText], { autoAlpha: 0, ease: 'none', duration: 0.08 }, 0.88)
            mtl.set([leftText, rightText], { autoAlpha: 0 }, 0.96)
            mtl.to(sceneDiv, { borderRadius: 0, ease: 'none', duration: 0.18 }, 0.92)

            // Phase 2 — heading + subtext appear, then the whole column scrolls
            // up so every circle passes through the screen one-by-one.
            mtl.fromTo(heading, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.28 }, 0.98)
            mtl.fromTo(
              subtext,
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                ease: 'power3.out',
                duration: 0.28,
                onStart: () => {
                  subtextHighlight.classList.remove('is-active')
                  window.requestAnimationFrame(() => subtextHighlight.classList.add('is-active'))
                },
                onReverseStart: () => subtextHighlight.classList.remove('is-active'),
                onReverseComplete: () => subtextHighlight.classList.remove('is-active'),
              },
              1.06,
            )
            if (content) {
              mtl.to(content, { y: () => -getOverflow(), ease: 'none', duration: 2.6 }, 1.4)
            }
            // Brief hold on the last circle before the pin releases.
            mtl.to({}, { duration: 0.3 }, '>')

            return () => {
              mtl.kill()
            }
          }

          const timeline = gsap.timeline({
            onReverseComplete: () => {
              resetMeters()
              subtextHighlight.classList.remove('is-active')
              gsap.set([leftText, rightText], { color: colors.ink })
            },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: revealLength,
              pin: true,
              scrub: true,
              anticipatePin: 1,
              refreshPriority: -1,
              invalidateOnRefresh: true,
              onUpdate: () => {
                const sentinel = darkSentinelRef.current
                const precisionIsGone = timeline.time() >= 1
                if (sentinel) sentinel.style.display = precisionIsGone ? 'block' : 'none'
                section.dataset.theme = precisionIsGone ? 'dark' : 'light'
              },
              onLeaveBack: () => {
                if (darkSentinelRef.current) darkSentinelRef.current.style.display = 'none'
                section.dataset.theme = 'light'
                resetMeters()
                subtextHighlight.classList.remove('is-active')
                gsap.set([leftText, rightText], { color: colors.ink })
              },
            },
          })

          timeline.fromTo(
            sceneDiv,
            {
              width: 0,
              height: 0,
              borderRadius: 500,
            },
            {
              width: '90vw',
              height: isMobile ? '58svh' : '50svh',
              borderRadius: 150,
              ease: 'none',
              duration: 0.45,
            },
            0,
          )
          timeline.to(
            sceneDiv,
            {
              width: '100vw',
              height: '100svh',
              borderRadius: 150,
              ease: 'none',
              duration: 0.5,
            },
            0.45,
          )
          timeline.to([leftText, rightText], { color: colors.white, ease: 'power1.inOut', duration: 0.9 }, 0)
          timeline.to([leftText, rightText], { autoAlpha: 0, ease: 'none', duration: 0.08 }, 0.88)
          timeline.set([leftText, rightText], { autoAlpha: 0 }, 0.96)
          timeline.to(sceneDiv, { borderRadius: 0, ease: 'none', duration: 0.18 }, 0.92)
          timeline.fromTo(heading, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, ease: 'power3.out', duration: 0.28 }, 0.98)
          timeline.fromTo(
            subtext,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              ease: 'power3.out',
              duration: 0.08,
              onStart: () => {
                subtextHighlight.classList.remove('is-active')
                window.requestAnimationFrame(() => subtextHighlight.classList.add('is-active'))
              },
              onReverseStart: () => subtextHighlight.classList.remove('is-active'),
              onReverseComplete: () => subtextHighlight.classList.remove('is-active'),
            },
            1.06,
          )
          statCards.forEach((card, i) => {
            timeline.fromTo(
              card,
              { autoAlpha: 0, y: 24, scale: 0.94 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                ease: 'power3.out',
                duration: 0.36,
                onStart: () => startMeter(i),
                onReverseComplete: () => {
                  card.classList.remove('is-meter-active')
                  circleRefs.current[i]?.reset()
                  startedMeters.delete(i)
                },
              },
              1.24 + i * cardStagger,
            )
          })
          timeline.to({}, { duration: 0.18 }, 1.24 + statCards.length * cardStagger + 0.36)

          return () => {
            timeline.kill()
          }
        },
      )
    }, section)

    if (import.meta.env.DEV) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).__triggerCircles = () => {
        circleRefs.current.forEach((ref, i) => ref?.start(i * METER_START_STAGGER))
      }
    }

    return () => {
      lenisInstance?.start()
      matchMedia.revert()
      context.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .stack-section {
            height: auto !important;
            min-height: 100svh !important;
            overflow: visible !important;
            background:
              linear-gradient(
                177.74973122637272deg,
                rgb(255,255,255) 18.311%,
                rgb(251,234,229) 28.084%,
                rgb(235,181,163) 45.783%,
                rgb(212,105,69) 63.01%,
                rgb(204,77,34) 68.299%,
                rgb(17,7,3) 103.68%
              );
            background-size: 100% 150%;
            background-position: 50% 56%;
          }

          .stack-viewport {
            height: 100svh !important;
            min-height: 100svh !important;
            overflow: hidden !important;
          }

          .stack-scene {
            position: absolute !important;
            overflow: hidden !important;
            /* No inset/min-height here: let the GSAP timeline drive position + size
               so the scene originates from the centre (left:50%/top:50%, translate -50%)
               and grows from 0 → full screen, identical to the desktop behaviour. */
          }

          .stack-scene-content {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: auto !important;
            height: auto !important;
            min-height: 100svh !important;
            justify-content: flex-start !important;
            padding: calc(152px + env(safe-area-inset-top, 0px)) 20px 72px !important;
            gap: 60px !important;
            z-index: 1;
            overflow: visible !important;
          }

          .stat-circles-row {
            flex-direction: column !important;
            align-items: center !important;
            max-width: 100% !important;
            gap: 40px !important;
          }
          .stat-card-item {
            flex: unset !important;
            width: 100% !important;
            align-items: center !important;
            gap: 4px !important;
          }
          .stat-ring-scale {
            transform: scale(1.32);
            transform-origin: center;
            margin-block: 44px 52px;
          }
          .stat-meter-number {
            font-size: 3.75rem !important;
            line-height: 0.95 !important;
            letter-spacing: -0.05em !important;
            font-weight: 200 !important;
          }
          .stat-card-label {
            max-width: 310px !important;
            color: rgba(255,255,255,0.88) !important;
            font-size: 1.125rem !important;
            line-height: 1.35 !important;
            letter-spacing: -0.02em !important;
            text-align: left !important;
          }
          .stack-text-area {
            max-width: 100% !important;
          }
        }

        @media (max-width: 1199px) {
          .stack-scene {
            background:
              linear-gradient(
                178.944767463296deg,
                rgb(255,255,255) 18.311%,
                rgb(251,234,229) 28.084%,
                rgb(235,181,163) 45.783%,
                rgb(212,105,69) 63.01%,
                rgb(204,77,34) 68.299%,
                rgb(17,7,3) 103.68%
              );
            background-size: 100% 150%;
            background-position: 50% 56%;
          }

          .stack-precision-overlay {
            position: absolute !important;
            inset: 0 !important;
            height: 100svh !important;
            min-height: 100svh !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 20px;
            text-align: center;
          }

          .sixdx-stack-h2 {
            width: min(100%, 42rem) !important;
            flex-wrap: wrap;
            text-align: center;
            white-space: normal;
          }

          .sixdx-stack-h2 > div {
            justify-content: center;
          }
        }

        @media (min-width: 768px) and (max-width: 1199px) {
          .stat-circles-row {
            max-width: calc(100vw - 80px) !important;
            gap: clamp(24px, 4vw, 40px) !important;
          }

          .stat-card-item {
            flex: 0 1 200px !important;
            width: 200px !important;
            min-width: 0 !important;
          }

          .stat-ring-scale {
            transform: scale(0.78);
            transform-origin: center;
            margin: -60px 0 -32px;
          }

          .stat-card-label {
            max-width: 200px !important;
            font-size: 0.75rem !important;
            line-height: 1.3 !important;
          }
        }

        .stack-flash-highlight {
          --stack-lightning-color: #E1A853;
          --stack-highlight-ease: cubic-bezier(.645, .045, .355, 1);
          color: #fff;
        }

        .stack-about-gradient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(17,7,3,1) 20%,
              rgba(204,77,34,1) 75%,
              rgba(212,105,69,1) 100%
            );
          background-size: 100% 100%;
          background-position: 50% 50%;
        }

        .stack-scene-content {
          z-index: 1;
        }

        .stack-reveal-heading {
          opacity: 0;
          visibility: hidden;
          transform: translateY(40px);
        }

        .stack-reveal-copy {
          opacity: 0;
          visibility: hidden;
          transform: translateY(30px);
        }

        .stack-reveal-card {
          opacity: 0;
          visibility: hidden;
          transform: translateY(24px) scale(0.94);
        }

        .stack-highlight-word,
        .stack-highlight-char {
          display: inline;
          color: inherit;
        }

        .stack-flash-highlight:not(.is-active) .stack-highlight-word,
        .stack-flash-highlight:not(.is-active) .stack-highlight-char {
          animation: none;
          animation-delay: 0s;
          opacity: 0;
        }

        .stack-flash-highlight.is-active .stack-highlight-word {
          animation: stack-benefits-color-blink-in 0.32s var(--stack-highlight-ease) both;
          animation-delay: calc((var(--word) - 1) * 32ms + 0.125s);
        }

        .stack-flash-highlight.is-active .stack-highlight-char {
          animation: none;
        }

        @keyframes stack-benefits-color-blink-in {
          0% {
            color: var(--stack-lightning-color);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          35% {
            color: var(--stack-lightning-color);
          }
          55% {
            opacity: 0.6;
          }
          70% {
            color: inherit;
          }
          85%,
          100% {
            opacity: 1;
          }
        }

        .stat-circle-meter {
          transform-origin: center;
        }

        .stat-card-item.is-meter-active .stat-circle-meter {
          animation: stack-meter-blink 0.5s cubic-bezier(.215, .61, .355, 1) both;
        }

        .stat-card-item.is-meter-active .stat-meter-track line,
        .stat-card-item.is-meter-active .stat-meter-progress line {
          animation: stack-meter-tick-blink 0.58s cubic-bezier(.215, .61, .355, 1) both;
          animation-delay: calc(var(--tick) * 2ms);
        }

        .stat-card-item.is-meter-active .stat-meter-number {
          animation: stack-meter-number-blink 0.55s cubic-bezier(.215, .61, .355, 1) both;
          animation-delay: 0.12s;
        }

        @keyframes stack-meter-blink {
          0% {
            opacity: 0;
            transform: scale(0.965);
          }
          20% {
            opacity: 1;
          }
          45% {
            opacity: 0.25;
          }
          72% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes stack-meter-tick-blink {
          0% {
            opacity: 0;
          }
          28% {
            opacity: 1;
          }
          55% {
            opacity: 0.18;
          }
          82%,
          100% {
            opacity: 1;
          }
        }

        @keyframes stack-meter-number-blink {
          0% {
            color: #E1A853;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.96);
          }
          22% {
            opacity: 1;
          }
          45% {
            color: #E1A853;
          }
          70% {
            color: #fff;
            opacity: 0.45;
          }
          100% {
            color: #fff;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        aria-label="Industrial training outcomes"
        data-theme="light"
        className="stack-section relative h-screen overflow-hidden bg-black"
      >
        <div ref={darkSentinelRef} aria-hidden="true"
          style={{ position: 'absolute', inset: 0, display: 'none', pointerEvents: 'none', opacity: 0, zIndex: -1 }}
        />

        <div className="stack-viewport relative h-screen w-full overflow-hidden">
          <div ref={whiteLayerRef} aria-hidden="true" className="absolute inset-0 z-10 bg-white" />

          <div
            ref={sceneDivRef}
            aria-label="Stats section"
            className="stack-scene absolute inset-0 z-20 overflow-hidden"
            style={{ borderRadius: 500 }}
          >
            <div className="stack-about-gradient-bg" aria-hidden="true" />

            <div className="stack-scene-content absolute inset-0 flex flex-col items-center justify-center"
              style={{ padding: '40px 40px', gap: 80 }}>

              <div className="stack-text-area" style={{ textAlign: 'left', width: '100%', maxWidth: 720 }}>
                <h2 ref={headingRef} className="stack-heading stack-reveal-heading" style={{
                  ...textStyles.eyebrow,
                  color: colors.white,
                  marginBottom: 20,
                }}>
                  {HEADING}
                </h2>
                <p ref={subtextRef} className="stack-subtext stack-reveal-copy" style={{
                  ...textStyles.sectionHeading,
                  width: '100%',
                  maxWidth: '45rem',
                  height: 'auto',
                  color: colors.white,
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}>
                  <span ref={subtextHighlightRef} className="stack-flash-highlight">
                    <StackAnimatedHighlightText text={SUBTEXT} />
                  </span>
                </p>
              </div>

              <div className="stat-circles-row"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', maxWidth: 900, gap: 72 }}>
                {STATS.map((stat, i) => (
                  <div
                    key={i}
                    data-stat-card
                    ref={(el) => { statRefs.current[i] = el }}
                    className="stat-card-item stack-reveal-card"
                    style={{
                      flex: '0 0 260px',
                      width: 260,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 24,
                    }}
                  >
                    <div className="stat-ring-scale">
                      <StatCircle
                        ref={(el) => { circleRefs.current[i] = el }}
                        value={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        duration={stat.duration}
                        size={260}
                      />
                    </div>
                    <p className="stat-card-label" style={{
                      ...textStyles.bodySmall,
                      width: '100%',
                      maxWidth: 260,
                      color: 'rgba(255,255,255,0.7)',
                      textAlign: 'center',
                      alignSelf: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div aria-hidden="true"
            className="stack-precision-overlay pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible text-[#15100f]"
            style={{ fontFamily: fonts.hn }}
          >
            <h2
              className="sixdx-stack-h2 relative z-30 m-0 flex w-max items-center justify-center gap-2"
              style={{ ...textStyles.sectionHeading, color: '#15100f' }}
            >
              <div ref={leftTextRef} aria-label="Left text" className="flex items-center gap-2 whitespace-nowrap">
                {LEFT_WORDS.map(w => <span key={w}>{w}</span>)}
              </div>
              <div ref={rightTextRef} aria-label="Right text" className="flex items-center gap-2 whitespace-nowrap">
                {RIGHT_WORD.map(w => <span key={w}>{w}</span>)}
              </div>
            </h2>
          </div>

          <div className="sr-only">
            <ul aria-label="Numbers metrics">
              <li>68% improvement in first-time procedure retention.</li>
              <li>40% reduction in refresher training cycles.</li>
              <li>100% compliance acceptance across reviewed modules.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
