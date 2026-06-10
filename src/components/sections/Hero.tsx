  /// ─── HERO SECTION — SixDX ────────────────────────────────────────────────────
// Full-screen video hero. Video currentTime is driven by GSAP ScrollTrigger
// scrub — scroll down = video plays frame-by-frame (Apple-style).
//
// Text interaction: per-character opacity stagger (toptier.relats.com style).
// Each paragraph is split into individual <span> characters.
// GSAP animates opacity 0→1 (enter) and 1→0 (exit) with a left-to-right
// stagger as you scroll. No line measurement, no overflow masks needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../animations/gsap.config'
// import heroVideo from '../../assets/video/cosmos-scrub.mp4'
const heroVideo = 'https://res.cloudinary.com/dj5sqxkpj/video/upload/v1780287272/turbine-scrub_lxh9uu.mp4'
import { colors, textStyles } from '../../styles/tokens'

// ─── RESPONSIVE TEXT TOKENS (Figma-exact) ────────────────────────────────────
// Tab H1  : 44px / -1.76px tracking / lh 1    (Figma: -4% of 44px = -1.76px)
// Mobile/h1: 40px / -0.4px  tracking / lh 1.12 (Figma: -1% of 40px = -0.4px)
const HERO_RESPONSIVE_CSS = `
  .hero-scroll-wrapper {
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
  }
  .hero-text {
    width:          min(46rem, calc(100vw - 10rem));
  }
  .hero-scroll-shimmer {
    display: inline-block;
    position: relative;
    overflow: hidden;
    color: rgba(255,255,255,0.45);
  }
  .hero-scroll-shimmer::after {
    content: attr(data-label);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0) 35%,
      rgba(255,255,255,1) 50%,
      rgba(255,255,255,0) 65%,
      rgba(255,255,255,0) 100%
    );
    background-size: 300% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: hero-scroll-shimmer 4.4s linear infinite;
  }
  @keyframes hero-scroll-shimmer {
    from { background-position: 150% 0; }
    to   { background-position: -150% 0; }
  }
  .hero-scroll-cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    pointer-events: none;
    color: rgb(255,255,255);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 11px;
    line-height: 0.85;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    will-change: transform, opacity;
  }
  .hero-scroll-cursor p {
    display: block;
    margin: 0;
  }
  .hero-highlight-word {
    display: inline;
    position: relative;
    white-space: normal;
    --select-width: 0%;
    --select-width-final: 103%;
    blend-mode: multiply;
    background-image: linear-gradient(rgba(204, 77, 34, 0.05), rgba(204, 77, 34, 0.32));
    background-repeat: no-repeat;
    background-size: var(--select-width) 0.82em;
    background-position: left 0.14em;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  .hero-highlight-word-unit {
    display: inline-block;
    position: relative;
    white-space: nowrap;
  }
  .hero-highlight-word .hx__select {
    display: none;
  }
  .hero-highlight-word .hx__select::before,
  .hero-highlight-word .hx__select::after {
    content: none;
  }
  .hero-highlight-word .char {
    position: relative;
    z-index: 1;
  }
  @media (max-width: 1199px) and (min-width: 810px) {
    .hero-text {
      width:          min(27rem, calc(100vw - 3rem)) !important;
      max-width:      none !important;
      font-size:      2.5rem !important;
      top:            56% !important;
      bottom:         auto !important;
      left:           44% !important;
      right:          auto !important;
      transform:      translateY(-50%) !important;
      text-align:     left !important;
    }
  }
  @media (max-width: 809px) {
    .hero-text {
      width:          min(100%, calc(100vw - 2rem));
      top:            56% !important;
      bottom:         auto !important;
      left:           1rem !important;
      transform:      translateY(-50%) !important;
      text-align:     left !important;
    }
  }
`

// ─── CONTENT — edit freely ────────────────────────────────────────────────────
const HERO_PARAGRAPHS = [
  {
    text: 'Training Intelligence for Industrial Excellence',
    highlight: 'Training Intelligence',
  },
  {
    text: 'Critical operational knowledge only matters when',
    highlight: 'operational knowledge',
  },
  {
    text: 'they are understood, retained, and consistently executed.',
    highlight: 'consistently executed',
  },
] as const
const HERO_CURSOR_LABEL = 'Scroll'
// ─────────────────────────────────────────────────────────────────────────────

// ─── TEXT STYLE — visual style comes from the heroTitle token ────────────────
const TEXT_STYLE: React.CSSProperties = {
  ...textStyles.heroTitle,
  fontStyle: 'normal',
  color: colors.white,
  // Max-width caps line length on desktop. Narrower screens use calc() below.
  maxWidth: '44rem',
}

const HERO_TEXT_LAYOUT_STYLE: React.CSSProperties = {
  ...TEXT_STYLE,
  maxWidth: 'none',
  position: 'absolute',
  top: '56%',
  left: '53%',
  transform: 'translateY(-50%)',
  textAlign: 'left',
  whiteSpace: 'normal',
  pointerEvents: 'none',
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── ANIMATION CONFIG ────────────────────────────────────────────────────────
// Edit these values to tune the scroll rhythm.
const ANIM = {
  // How long the section stays pinned (as % of viewport height stacked on top)
  pinDuration: '+=550%',

  // Text scrub lag only. Video time is updated directly on every scroll tick.
  scrub: 0.35,

  // ── Character opacity fade timings (fraction of the 0→1 scrub timeline) ──
  // fadeIn / fadeOut: how long the opacity sweep takes for each char
  // staggerIn / staggerOut: total time spread across all chars (left→right)
  fadeIn: 0.10,
  fadeOut: 0.08,
  staggerIn: 0.07,   // enter stagger: last char starts 0.07 after first
  staggerOut: 0.04,   // exit stagger: last char starts 0.04 after first

  // ── Highlight timing/effect ─────────────────────────────────────────────
  highlightDelay: 0.02,
  highlightDuration: 0.18,
  highlightStagger: 0.012,
  highlightMarkerDuration: 0.18,
  highlightGlow: 'drop-shadow(0px 0px 20px #ffdbf5)',
  highlightGlowRest: 'drop-shadow(0px 0px 0px #ffdbf5)',

  // ── Per-paragraph timing slots ───────────────────────────────────────────
  // enterAt: position (0–1) where chars start fading IN  (-1 = no enter)
  // exitAt:  position (0–1) where chars start fading OUT (-1 = no exit / stays visible)
  slots: [
    { enter: -1, exit: 0.20 },   // Para 0: visible from page load, only exits
    { enter: 0.32, exit: 0.55 },   // Para 1: fades in, then out
    { enter: 0.68, exit: -1 },   // Para 2: fades in, stays visible to end
  ],

  // ── Page-load mount animation for paragraph 0 ────────────────────────────
  mountDuration: 0.5,    // opacity sweep duration per char
  mountStagger: 0.5,    // total stagger spread across all chars (seconds)
  mountDelay: 0.4,    // delay before first char starts
  mountEase: 'power2.out',
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── SPLIT TEXT TO CHARS ─────────────────────────────────────────────────────
// Replaces the element's text content with per-character <span> elements.
// Returns the array of char spans — these are what GSAP animates via opacity.
//
// DOM structure produced:
//   <div paragraph>
//     <span word>                         ← inline-block; white-space:nowrap
//       <span char>E</span>               ← inline-block; will-change:opacity
//       <span char>v</span>
//       ...
//     </span>
//     (text node " ")                     ← natural word break point
//     <span word>...</span>
//   </div>
//
// Why this works:
//   - word spans are inline-block → browser wraps full words, never mid-word
//   - text-node spaces between word spans provide natural line-break points
//   - char spans are inline-block → no whitespace gap between letters
//   - will-change:opacity → GPU compositing for smooth animation
// ─────────────────────────────────────────────────────────────────────────────
type SplitTextResult = {
  chars: HTMLElement[]
  highlightChars: HTMLElement[]
  highlightMarkers: HTMLElement[]
}

function normalizeHighlightWord(word: string): string {
  return word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '')
}

function appendWordChars(
  parent: HTMLElement,
  word: string,
  charEls: HTMLElement[],
  highlightChars?: HTMLElement[],
) {
  Array.from(word).forEach((char) => {
    const charSpan = document.createElement('span')
    charSpan.className = highlightChars ? 'char hero-highlight-char' : 'char'
    charSpan.style.cssText = 'display:inline-block;will-change:opacity;'
    charSpan.textContent = char
    parent.appendChild(charSpan)
    charEls.push(charSpan)
    highlightChars?.push(charSpan)
  })
}

function splitTextToChars(element: HTMLElement, highlightPhrase = ''): SplitTextResult {
  // Preserve original text so re-calling on resize doesn't lose content
  if (!element.hasAttribute('data-original')) {
    element.setAttribute('data-original', element.innerText.trim())
  }
  const text = element.getAttribute('data-original') ?? ''
  element.innerHTML = ''

  const charEls: HTMLElement[] = []
  const highlightChars: HTMLElement[] = []
  const highlightMarkers: HTMLElement[] = []
  const words = text.split(' ')
  const highlightWords = highlightPhrase
    .split(' ')
    .map(normalizeHighlightWord)
    .filter(Boolean)
  let didHighlight = false

  for (let wordIdx = 0; wordIdx < words.length; wordIdx += 1) {
    const phraseMatches = !didHighlight && highlightWords.length > 0 && highlightWords.every((highlightWord, offset) =>
      normalizeHighlightWord(words[wordIdx + offset] ?? '') === highlightWord,
    )

    if (phraseMatches) {
      const highlightSpan = document.createElement('span')
      highlightSpan.className = 'hero-highlight-word'
      highlightSpan.style.cssText = 'display:inline;white-space:normal;'
      highlightMarkers.push(highlightSpan)

      highlightWords.forEach((_, offset) => {
        if (offset > 0) highlightSpan.appendChild(document.createTextNode(' '))
        const wordUnit = document.createElement('span')
        wordUnit.className = 'hero-highlight-word-unit'
        appendWordChars(wordUnit, words[wordIdx + offset], charEls, highlightChars)
        highlightSpan.appendChild(wordUnit)
      })

      element.appendChild(highlightSpan)
      wordIdx += highlightWords.length - 1
      didHighlight = true

      if (wordIdx < words.length - 1) {
        element.appendChild(document.createTextNode(' '))
      }

      continue
    }

    const wordSpan = document.createElement('span')
    wordSpan.style.cssText = 'display:inline-block;white-space:nowrap;'
    appendWordChars(wordSpan, words[wordIdx], charEls)

    element.appendChild(wordSpan)

    // Regular space text node between words — browser can break line here
    if (wordIdx < words.length - 1) {
      element.appendChild(document.createTextNode(' '))
    }
  }

  return { chars: charEls, highlightChars, highlightMarkers }
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRefs = useRef<(HTMLElement | null)[]>([]) 

  const state = useRef<{
    allChars: HTMLElement[][]
    allHighlightChars: HTMLElement[][]
    allHighlightMarkers: HTMLElement[][]
    mountCtx: gsap.Context | null
    scrollCtx: gsap.Context | null
    mountTween: gsap.core.Tween | null
    resizeTimer: number
    // gsap.matchMedia() instance — killed on unmount
    mediaMatcher: { kill: () => void } | null
  }>({
    allChars: [],
    allHighlightChars: [],
    allHighlightMarkers: [],
    mountCtx: null,
    scrollCtx: null,
    mountTween: null,
    resizeTimer: 0,

    mediaMatcher: null,
  })

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    const s = state.current
    const cursor = cursorRef.current
    const supportsCustomCursor = window.matchMedia('(pointer: fine)').matches
    const cursorXTo = cursor
      ? gsap.quickTo(cursor, 'x', { duration: 0.62, ease: 'power3.out' })
      : null
    const cursorYTo = cursor
      ? gsap.quickTo(cursor, 'y', { duration: 0.62, ease: 'power3.out' })
      : null
    let cursorHasPosition = false

    const showCursor = () => {
      if (!cursor || !supportsCustomCursor) return
      gsap.to(cursor, { autoAlpha: 1, duration: 0.62, ease: 'power3.out', overwrite: 'auto' })
    }

    const moveCursor = (event: PointerEvent) => {
      if (!cursor || !cursorXTo || !cursorYTo || !supportsCustomCursor) return
      const nextX = event.clientX + 29.2
      const nextY = event.clientY

      if (!cursorHasPosition) {
        cursorHasPosition = true
        gsap.set(cursor, { x: nextX, y: nextY })
      }

      cursorXTo(nextX)
      cursorYTo(nextY)
      gsap.to(cursor, { autoAlpha: 1, duration: 0.62, ease: 'power3.out', overwrite: 'auto' })
    }

    const hideCursor = () => {
      if (!cursor || !supportsCustomCursor) return
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.out',
        onComplete: () => {
          cursorHasPosition = false
        },
      })
    }

    if (cursor && supportsCustomCursor) {
      gsap.set(cursor, {
        x: window.innerWidth / 2 + 29,
        y: window.innerHeight / 2,
        autoAlpha: 0,
        force3D: true,
      })
      section.addEventListener('pointerenter', showCursor)
      section.addEventListener('pointermove', moveCursor)
      section.addEventListener('pointerleave', hideCursor)
    }

    const setVideoTime = (progress: number) => {
      if (!video.duration || Number.isNaN(video.duration)) return

      const targetTime = gsap.utils.clamp(
        0,
        Math.max(video.duration - 0.001, 0),
        progress * video.duration,
      )

      if (Math.abs(video.currentTime - targetTime) > 0.001) {
        video.currentTime = targetTime
      }
    }

    const splitHeroText = () => {
      const results = textRefs.current.map((el, i) =>
        el ? splitTextToChars(el, HERO_PARAGRAPHS[i]?.highlight ?? '') : {
          chars: [],
          highlightChars: [],
          highlightMarkers: [],
        },
      )

      s.allChars = results.map(result => result.chars)
      s.allHighlightChars = results.map(result => result.highlightChars)
      s.allHighlightMarkers = results.map(result => result.highlightMarkers)
    }

    const resetHighlights = (paragraphIndex?: number) => {
      const charGroups = paragraphIndex == null ? s.allHighlightChars : [s.allHighlightChars[paragraphIndex]]
      const markerGroups = paragraphIndex == null ? s.allHighlightMarkers : [s.allHighlightMarkers[paragraphIndex]]
      const chars = charGroups.flat().filter(Boolean)
      const markers = markerGroups.flat().filter(Boolean)

      gsap.killTweensOf([...chars, ...markers])
      if (markers.length) gsap.set(markers, { '--select-width': '0%' })
      if (chars.length) gsap.set(chars, { filter: ANIM.highlightGlowRest })
    }

    const addHighlightTween = (tl: gsap.core.Timeline, paragraphIndex: number, at: number) => {
      const chars = s.allHighlightChars[paragraphIndex]
      const markers = s.allHighlightMarkers[paragraphIndex]
      if (!chars?.length && !markers?.length) return

      tl.fromTo(
        chars,
        {
          filter: ANIM.highlightGlowRest,
        },
        {
          filter: ANIM.highlightGlow,
          ease: 'power1.inOut',
          duration: ANIM.highlightDuration,
          stagger: ANIM.highlightStagger,
        },
        at,
      )

      tl.to(
        markers,
        {
          '--select-width': '103%',
          ease: 'expo.out',
          duration: ANIM.highlightMarkerDuration,
        },
        at,
      )
    }

    const addHighlightExitTween = (tl: gsap.core.Timeline, paragraphIndex: number, at: number) => {
      const chars = s.allHighlightChars[paragraphIndex]
      const markers = s.allHighlightMarkers[paragraphIndex]
      if (!chars?.length && !markers?.length) return

      tl.to(
        chars,
        {
          filter: ANIM.highlightGlowRest,
          ease: 'none',
          duration: ANIM.fadeOut,
          stagger: { amount: ANIM.staggerOut, from: 'end' },
        },
        at,
      )

      tl.to(
        markers,
        {
          '--select-width': '0%',
          ease: 'none',
          duration: ANIM.fadeOut,
        },
        at,
      )
    }

    // ── BUILD SCROLL TIMELINE ──────────────────────────────────────────────
    // fromTo() is used throughout so GSAP never reads the element's live
    // opacity value — both "from" and "to" are always explicit.
    const buildScrollTimeline = (scrubVideo = window.matchMedia('(min-width: 1200px)').matches) => {
      s.scrollCtx?.revert()

      s.scrollCtx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: ANIM.pinDuration,
            pin: true,
            scrub: ANIM.scrub,
            refreshPriority: 2,
            invalidateOnRefresh: true,
            fastScrollEnd: false,
            onEnter: () => {
              // Scroll timeline takes over para 0 — kill the mount tween
              s.mountTween?.kill()
              s.mountTween = null
            },
          },
        })

        if (scrubVideo) {
          // Desktop only: video currentTime follows the hero scroll timeline.
          const proxy = { t: 0 }
          tl.to(proxy, { t: 1, ease: 'none', duration: 1, onUpdate: () => setVideoTime(proxy.t) }, 0)
        }

        // Overlay darkens subtly as video progresses
        tl.to(overlayRef.current, { opacity: 0.55, ease: 'none', duration: 1 }, 0)

        // Para 0 is visible on load; scrub its highlighter with the hero timeline
        // so it can replay cleanly when scrolling back to the top.
        addHighlightTween(tl, 0, 0.04)

        // ── Character opacity sequence ────────────────────────────────────
        ANIM.slots.forEach(({ enter, exit }, i) => {
          const chars = s.allChars[i]
          if (!chars?.length) return

          if (enter >= 0) {
            // Enter: chars stagger from transparent → opaque (left to right)
            tl.fromTo(
              chars,
              { opacity: 0 },
              {
                opacity: 1,
                ease: 'none',
                duration: ANIM.fadeIn,
                stagger: { amount: ANIM.staggerIn, from: 'start' },
              },
              enter,
            )

            addHighlightTween(tl, i, enter + ANIM.highlightDelay)
          }

          if (exit >= 0) {
            // Exit: chars stagger from opaque → transparent (right to left)
            tl.fromTo(
              chars,
              { opacity: 1 },
              {
                opacity: 0,
                ease: 'none',
                duration: ANIM.fadeOut,
                stagger: { amount: ANIM.staggerOut, from: 'end' },
              },
              exit,
            )

            addHighlightExitTween(tl, i, exit)
          }
        })
      }, section)

      ScrollTrigger.refresh()
    }

    // ── INIT ───────────────────────────────────────────────────────────────
    const init = async () => {
      await document.fonts.ready

      // Split all paragraphs into char spans (needed at all breakpoints)
      splitHeroText()
      resetHighlights()

      // ── Desktop (≥1200px): full scroll-scrub hero ──────────────────────
      const mm = gsap.matchMedia()
      s.mediaMatcher = mm as unknown as { kill: () => void }

      mm.add('(min-width: 1200px)', () => {
        // Blob-fetch video for frame-accurate scrubbing
        video.pause()
        video.preload = 'auto'
        video.loop = false

        video.src = heroVideo
        video.load()

        // All chars start transparent
        s.mountCtx?.revert()
        s.mountCtx = gsap.context(() => {
          s.allChars.forEach(chars => { if (chars.length) gsap.set(chars, { opacity: 0 }) })
          // Para 0 fades in on page load
          if (s.allChars[0]?.length) {
            s.mountTween = gsap.to(s.allChars[0], {
              opacity: 1,
              ease: ANIM.mountEase,
              duration: ANIM.mountDuration,
              stagger: { amount: ANIM.mountStagger, from: 'start' },
              delay: ANIM.mountDelay,
            })
          }
        }, section)

        // Build immediately so text pinning/scroll interaction never depends on
        // video metadata. setVideoTime() safely no-ops until duration exists.
        buildScrollTimeline(true)

        const refreshAfterMetadata = () => {
          ScrollTrigger.refresh()
        }
        video.addEventListener('loadedmetadata', refreshAfterMetadata, { once: true })

        return () => {
          s.scrollCtx?.revert()
          s.scrollCtx = null
          video.removeEventListener('loadedmetadata', refreshAfterMetadata)
        }
      })

      // ── Tablet + Mobile (≤1199px): pinned scroll-driven text ────────────
      // Video plays normally; only the paragraph/highlight timeline is scrubbed.
      mm.add('(max-width: 1199px)', () => {
        video.muted = true
        video.playsInline = true
        video.preload = 'auto'
        video.loop = true
        video.src = heroVideo
        video.load()
        void video.play().catch(() => {
          // Mobile browsers can defer autoplay until the media is ready.
        })

        // Use the same text timeline as desktop, but without video currentTime writes.
        s.mountCtx?.revert()
        s.mountCtx = gsap.context(() => {
          s.allChars.forEach(chars => { if (chars.length) gsap.set(chars, { opacity: 0 }) })
          if (s.allChars[0]?.length) {
            gsap.set(s.allChars[0], { opacity: 1 })
          }
        }, section)

        resetHighlights()
        buildScrollTimeline(false)

        const refreshAfterMetadata = () => {
          void video.play().catch(() => {})
          ScrollTrigger.refresh()
        }
        video.addEventListener('loadedmetadata', refreshAfterMetadata, { once: true })

        ScrollTrigger.refresh()

        return () => {
          s.scrollCtx?.revert()
          s.scrollCtx = null
          video.removeEventListener('loadedmetadata', refreshAfterMetadata)
          video.pause()
        }
      })
    }

    init()

    // ── RESIZE HANDLER ─────────────────────────────────────────────────────
    // Re-split on resize because text may reflow to different line breaks.
    // Only rebuild the scroll timeline on desktop — matchMedia handles the
    // rest of the breakpoint switching automatically.
    const onResize = () => {
      clearTimeout(s.resizeTimer)
      s.resizeTimer = window.setTimeout(() => {
        splitHeroText()
        resetHighlights()
        // Para 0 fully visible; others hidden (scrub will correct on next scroll)
        s.allChars.forEach((chars, i) => {
          if (chars.length) gsap.set(chars, { opacity: i === 0 ? 1 : 0 })
        })
        if (s.allHighlightMarkers[0]?.length) {
          gsap.set(s.allHighlightMarkers[0], { '--select-width': '103%' })
        }
        if (s.allHighlightChars[0]?.length) {
          gsap.set(s.allHighlightChars[0], { filter: ANIM.highlightGlow })
        }
        buildScrollTimeline()
        ScrollTrigger.refresh()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      section.removeEventListener('pointerenter', showCursor)
      section.removeEventListener('pointermove', moveCursor)
      section.removeEventListener('pointerleave', hideCursor)
      clearTimeout(s.resizeTimer)
      s.mediaMatcher?.kill()
      s.mountCtx?.revert()
      s.scrollCtx?.revert()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="hero-scroll-wrapper">
      <section
        ref={sectionRef}
        aria-label="Hero"
        className="relative w-full overflow-hidden"
        style={{ height: '100svh', minHeight: '100dvh' }}
      >
        {/* Responsive text tokens — injected once, applies to all .hero-text elements */}
        <style>{HERO_RESPONSIVE_CSS}</style>
        {/* ── Background video — currentTime scrubbed by scroll ────────────── */}
        <video
          ref={videoRef}
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: '50% 0%',
            transform: 'translateY(10%) scale(1.2)',
          }}
          playsInline
          muted
          preload="auto"
          aria-hidden="true"
          autoPlay={false}
        />

        {/* ── Dark overlay — starts at 20%, darkens to 55% as video progresses */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(0,0,0,1)', opacity: 0.45 }}
        />

        {/* ── Radial vignette — keeps text readable at all video frames ──────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.50) 100%)',
          }}
        />

        {/* ── Text paragraphs ──────────────────────────────────────────────────
          All three paragraphs are stacked at the same position.
          Visibility is controlled purely by character opacity — whichever
          paragraph is "active" has its chars at opacity 1, others at 0.

          width uses CSS min() with 100vw to guarantee an exact pixel width
          at all times — no ambiguity from ancestor flex/grid contexts.
          ─────────────────────────────────────────────────────────────────── */}
        <h1
          ref={(el) => { textRefs.current[0] = el }}
          aria-hidden={false}
          className="hero-text"
          style={HERO_TEXT_LAYOUT_STYLE}
        >
          {HERO_PARAGRAPHS[0].text}
        </h1>

        <p
          ref={(el) => { textRefs.current[1] = el }}
          aria-hidden={true}
          className="hero-text"
          style={HERO_TEXT_LAYOUT_STYLE}
        >
          {HERO_PARAGRAPHS[1].text}
        </p>

        <p
          ref={(el) => { textRefs.current[2] = el }}
          aria-hidden={true}
          className="hero-text"
          style={HERO_TEXT_LAYOUT_STYLE}
        >
          {HERO_PARAGRAPHS[2].text}
        </p>

        {/* ── Custom hero cursor. Edit HERO_CURSOR_LABEL above to change text. ─ */}
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="hero-scroll-cursor"
        >
          <p>
            {HERO_CURSOR_LABEL}
          </p>
        </div>
      </section>
    </div>
  )
}
