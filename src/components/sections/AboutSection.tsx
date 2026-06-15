import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import type { CSSProperties } from 'react'
import PrimaryButton from '../ui/PrimaryButton'
import { colors, textStyles } from '../../styles/tokens'
import aboutImage from '../../assets/about/about-feature.png'
import differentiationImage from '../../assets/about/about-differentiation.png'

type FeatureDetailProps = {
  title: string
  description: string
}

const ABOUT_IMAGE = aboutImage

const DIFFERENTIATION_IMAGE = differentiationImage

const ABOUT_HIGHLIGHT_TEXT =
  'SixD Engineering a company that has spent the last twenty years inside the heaviest end of industry'

const ABOUT_QUOTE_TEXT =
  "We don't bring technology to your plant. We bring your plant's intelligence back to you."

const FEATURES_LEFT = [
  {
    title: 'Modelled, not imagined',
    description:
      'Every environment is built from your site documentation, P&IDs, and technical drawings. Nothing is approximated for the camera.',
  },
  {
    title: 'Cinematic render standards',
    description:
      'Every module is produced with multi-pass lighting and physically based materials. No asset-library shortcuts. No stock environments.',
  },
]

const FEATURES_RIGHT = [
  {
    title: 'Built to be defensible.',
    description:
      'Every environment is built from your site documentation, P&IDs, and technical drawings. Nothing is approximated for the camera.',
  },
  {
    title: 'Modelled, not imagined',
    description:
      'Every deliverable is engineered for floor use, HSE review, and compliance audit. A training film that cannot survive scrutiny is not a training film.',
  },
]

function FeatureDetail({ title, description }: FeatureDetailProps) {
  return (
    <article className="about-feature">
      <h3 style={{ ...textStyles.featureTitle, color: colors.white, fontWeight: 400 }}>{title}</h3>
      <p style={{ ...textStyles.bodyLarge, color: colors.white70 }}>{description}</p>
    </article>
  )
}

function AnimatedHighlightText({ text }: { text: string }) {
  let charIndex = 0

  return (
    <>
      {text.split(' ').map((word, wordIndex, words) => (
        <span
          className="about-highlight-word"
          key={`${word}-${wordIndex}`}
          style={{ '--word': wordIndex + 1 } as CSSProperties}
        >
          {Array.from(word).map((char, index) => {
            charIndex += 1

            return (
              <span
                className="about-highlight-char"
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

export default function AboutSection() {
  const [isHeadingHighlightActive, setIsHeadingHighlightActive] = useState(false)
  const [isQuoteHighlightActive, setIsQuoteHighlightActive] = useState(false)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const quoteRef = useRef<HTMLQuoteElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const candidates: Array<{ element: Element | null; setActive: (value: boolean) => void }> = [
      { element: headingRef.current, setActive: setIsHeadingHighlightActive },
      { element: quoteRef.current, setActive: setIsQuoteHighlightActive },
    ]
    const targets = candidates.filter(
      (target): target is { element: Element; setActive: (value: boolean) => void } => Boolean(target.element),
    )

    if (!targets.length) return

    const frames = new Map<Element, number>()
    const observer = new IntersectionObserver(
      ([entry]) => {
        const frame = frames.get(entry.target)
        if (frame) window.cancelAnimationFrame(frame)

        const target = targets.find((item) => item.element === entry.target)
        if (!target) return

        if (entry.isIntersecting) {
          target.setActive(false)
          const nextFrame = window.requestAnimationFrame(() => {
            target.setActive(true)
          })
          frames.set(entry.target, nextFrame)
          return
        }

        target.setActive(false)
      },
      { threshold: 0.42 },
    )

    targets.forEach(({ element }) => observer.observe(element))

    return () => {
      frames.forEach((frame) => window.cancelAnimationFrame(frame))
      observer.disconnect()
    }
  }, [])

  // ── Image reveal — GSAP right-to-left wipe ───────────────────────────────────
  useEffect(() => {
    const el = imageRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 0 100%)' },
          { clipPath: 'inset(0 0 0 0%)', duration: 1.8, ease: 'expo.out' },
        )
      },
      { threshold: 0 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'clipPath' })
    }
  }, [])

  const openSixD = () => {
    window.open('https://sixdengineering.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="about" className="about-magicpath" aria-label="About SixDX">
      <style>{ABOUT_CSS}</style>

      <div className="about-inner about-intro" data-theme="light">
        <div className="about-copy-stack">
          <h2 ref={headingRef} style={{ ...textStyles.statement, color: colors.ink }}>
            We are the arm of <span className={`about-heading-highlight${isHeadingHighlightActive ? ' is-active' : ''}`}><AnimatedHighlightText text={ABOUT_HIGHLIGHT_TEXT} /></span>, working with the operators, engineers, and HSE teams.
          </h2>

          <div className="about-summary-row">
            <p style={{ ...textStyles.bodyLarge, color: colors.ink }}>
              We make photorealistic 3D visualisation, animation, and training films for industrial, architecture,
              and product-design clients.
            </p>

            <PrimaryButton label="Explore SixD" onClick={openSixD} className="about-summary-cta" />
          </div>
        </div>

        <div className="about-visual-row">
          <blockquote ref={quoteRef} style={{ ...textStyles.sectionHeading, color: colors.ink, fontWeight: 400 }}>
            <span className={`about-heading-highlight about-quote-highlight${isQuoteHighlightActive ? ' is-active' : ''}`}>
              "<AnimatedHighlightText text={ABOUT_QUOTE_TEXT} />"
            </span>
          </blockquote>

          <div
            ref={imageRef}
            className="about-image"
            role="img"
            aria-label="Industrial environment visual"
          />
        </div>
      </div>

      <div className="about-inner about-differentiation" data-theme="dark">
        <h2 style={{ ...textStyles.eyebrow, color: colors.white }}>THE DIFFERENTIATION</h2>

        <div className="about-feature-grid">
          <div className="about-feature-column">
            {FEATURES_LEFT.map((feature, index) => (
              <div className="about-feature-item" key={feature.title}>
                <FeatureDetail {...feature} />
                {index < FEATURES_LEFT.length - 1 ? <hr /> : null}
              </div>
            ))}
          </div>

          <img src={DIFFERENTIATION_IMAGE} alt="" className="about-differentiation-art" />

          <div className="about-feature-column">
            {FEATURES_RIGHT.map((feature, index) => (
              <div className="about-feature-item" key={`${feature.title}-${index}`}>
                <FeatureDetail {...feature} />
                {index < FEATURES_RIGHT.length - 1 ? <hr /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const ABOUT_CSS = `
  .about-magicpath {
    width: 100%;
    min-height: 1950px;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background:
      linear-gradient(
        180deg,
        rgba(255,255,255,1) 15%,
        rgb(251, 241, 239) 24%,
        rgb(250, 224, 216) 39%,
        rgba(212,105,69,1) 54%,
        rgba(204,77,34,1) 58%,
        rgba(17,7,3,1) 89%
      );
    overflow: hidden;
  }

  .about-inner {
    width: 100%;
    max-width: none;
    box-sizing: border-box;
    padding: 20px;
  }

  .about-intro {
    display: flex;
    flex-direction: column;
    gap: 80px;
  }

  .about-copy-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 40px;
  }

  .about-copy-stack > h2 {
    align-self: stretch;
    padding-block: 0.08em;
    padding-left: 0;
    text-indent: clamp(72px, 9vw, 140px);
    text-align: left;
    overflow: visible;
  }

  .about-heading-highlight {
    --about-lightning-color: #E1A853;
    --about-highlight-ease: cubic-bezier(.215, .61, .855, 1);
    color: #1c0b05;
  }

  .about-highlight-word {
    display: inline;
    color: inherit;
  }

  .about-highlight-char {
    display: inline;
    color: inherit;
  }

  .about-heading-highlight:not(.is-active) .about-highlight-word,
  .about-heading-highlight:not(.is-active) .about-highlight-char {
    animation: none;
    animation-delay: 0s;
  }

  .about-heading-highlight.is-active .about-highlight-word {
    animation: about-titan-blink 0.26s var(--about-highlight-ease) both;
    animation-delay: calc((var(--word) - 1) * 39ms + 0.175s);
  }

  .about-heading-highlight.is-active .about-highlight-char {
    animation: about-titan-text-fade-in 0.32s var(--about-highlight-ease) both;
    animation-delay: calc((var(--char) - 1) * 28ms + 0.125s);
  }

  @keyframes about-titan-blink {
    0% {
      opacity: 1;
    }
    20% {
      opacity: 0.3;
    }
    35% {
      opacity: 0.85;
    }
    55% {
      opacity: 0.2;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes about-titan-text-fade-in {
    0% {
      color: inherit;
      opacity: 1;
    }
    1% {
      color: var(--about-lightning-color);
      opacity: 1;
    }
    15% {
      opacity: 0.2;
    }
    30% {
      opacity: 0.8;
    }
    40% {
      color: var(--about-lightning-color);
      opacity: 1;
    }
    55% {
      opacity: 1;
    }
    70% {
      color: inherit;
      opacity: 0.7;
    }
    85%,
    100% {
      opacity: 1;
    }
  }

  .about-summary-row {
    width: 100%;
    max-width: 690px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
  }

  .about-summary-row p {
    width: 100%;
    max-width: 367px;
  }

  .about-summary-cta {
    align-self: flex-end !important;
  }

  .about-visual-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
  }

  .about-visual-row blockquote {
    width: 100%;
    max-width: 443px;
  }

  .about-image {
    width: 100%;
    max-width: 690px;
    height: 480px;
    flex: 1 1 520px;
    border-radius: 2px;
    overflow: hidden;
    background-image:
      linear-gradient(180deg, rgba(5, 0, 6, 0.4) 0%, rgba(214, 100, 10, 0.2) 100%),
      url("${ABOUT_IMAGE}");
    background-size: cover;
    background-position: center;
    will-change: clip-path;
  }

  .about-differentiation {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding-bottom: 140px;
     padding-top: 60px;
  }

  .about-feature-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0;
  }

  .about-feature-column {
    flex: 0 1 334px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
  }

  .about-feature-column hr {
    width: 100%;
    margin: 40px 0 0;
    border: 0;
    border-top: 1px solid rgba(255,255,255,0.2);
  }

  .about-feature {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 334px;
    min-width: 0;
  }

  .about-feature p {
    width: 100%;
    max-width: 334px;
  }

  .about-differentiation-art {
    width: 128px;
    height: 621px;
    object-fit: cover;
    mix-blend-mode: hard-light;
    flex: 0 0 auto;
  }

  @media (max-width: 1199px) {
    .about-magicpath {
      min-height: auto;
      padding-top: 60px;
      background:
        linear-gradient(
          178.944767463296deg,
          rgb(255, 255, 255) 18.311%,
          rgb(251, 234, 229) 28.084%,
          rgb(235, 181, 163) 45.783%,
          rgb(212, 105, 69) 63.01%,
          rgb(204, 77, 34) 68.299%,
          rgb(17, 7, 3) 103.68%
        );
    }

    .about-inner {
      max-width: none;
      padding: 20px;
    }

    .about-intro {
      gap: 40px;
    }

    .about-copy-stack {
      align-items: stretch;
      gap: 24px;
    }

    .about-copy-stack > h2 {
      padding-block: 0;
      text-indent: 56px;
    }

    .about-summary-row {
      max-width: none;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
    }

    .about-summary-row p {
      max-width: 367px;
    }

    .about-visual-row {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
    }

    .about-visual-row blockquote {
      max-width: 440px;
    }

    .about-image {
      max-width: none;
      height: 480px;
      flex: none;
    }

    .about-differentiation {
      gap: 24px;
      padding: 20px 20px 60px;
    }

    .about-feature-grid {
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      spacebetween: normal;
      gap: 40px;
    }

    .about-feature-column {
      flex: 1 1 0;
      min-width: 0;
      max-width: none;
    }

    .about-feature,
    .about-feature p {
      max-width: none;
    }

    .about-differentiation-art {
      width: 70px;
      height: 338px;
      object-position: center;
    }
  }

  @media (max-width: 809px) {
    .about-magicpath {
      min-height: auto;
      padding-top: 40px;
      background:
        linear-gradient(
          177.74973122637272deg,
          rgb(255, 255, 255) 18.311%,
          rgb(251, 234, 229) 28.084%,
          rgb(235, 181, 163) 45.783%,
          rgb(212, 105, 69) 63.01%,
          rgb(204, 77, 34) 68.299%,
          rgb(17, 7, 3) 103.68%
        );
    }

    .about-inner {
      max-width: none;
      padding: 20px;
    }

    .about-intro {
      gap: 40px;
    }

    .about-copy-stack {
      gap: 24px;
    }

    .about-copy-stack > h2 {
      text-indent: 0px;
    }

    .about-summary-row {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }

    .about-summary-row p {
      max-width: none;
    }

    .about-summary-row .clarte-button {
      width: 100% !important;
      justify-content: center;
      align-self: stretch !important;
    }

    .about-visual-row {
      gap: 20px;
    }

    .about-visual-row blockquote {
      max-width: 350px;
    }

    .about-image {
      height: 360px;
      background-position: center;
    }

    .about-differentiation {
      gap: 20px;
      padding: 24px 20px 40px;
    }

    .about-feature-grid {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }

    .about-feature-column {
      width: 100%;
      flex: none;
      gap: 8px;
    }

    .about-feature-column hr {
      display: none;
    }

    .about-feature-item {
      width: 100%;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    .about-feature-column:last-child .about-feature-item:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    .about-feature {
      width: 100%;
      max-width: none;
    }

    .about-feature p {
      max-width: none;
    }

    .about-differentiation-art {
      display: none;
    }
  }
`
