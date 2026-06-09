import type { CSSProperties } from 'react'
import { colors, fonts } from '../../styles/tokens'
import cardBg from '../../assets/how-it-works/how-bg.webp'
import cardIllustration from '../../assets/how-it-works/1-main.webp'
import cardIllustration2 from '../../assets/how-it-works/how-2.png'
import cardIllustration3 from '../../assets/how-it-works/3.png'
import cardBg4 from '../../assets/how-it-works/4th Bg.webp'
import cardBg5 from '../../assets/how-it-works/BG-5.webp'

type HowStepBase = {
  title: string
  body: string
  bg: string
}

type HowStepStandard = HowStepBase & {
  variant?: 'standard'
  illustration: string
  imageScale: number
  imageBlendMode?: CSSProperties['mixBlendMode']
}

type HowStepWide = HowStepBase & {
  variant: 'wide'
}

type HowStep = HowStepStandard | HowStepWide

const isStandardStep = (step: HowStep): step is HowStepStandard => step.variant !== 'wide'
const isWideStep = (step: HowStep): step is HowStepWide => step.variant === 'wide'

// ── WIDE CARD GRADIENT OVERLAY CONTROLS ──────────────────────────────────────
// Controls the bottom gradient overlay inside cards 4 and 5.
// height      — how far upward the gradient reaches from the bottom
// bottom      — vertical position of the overlay
// opacity     — overall overlay strength
// startColor  — transparent/top color
// endColor    — darkest/bottom color
// startAt/endAt — gradient stop positions
const WIDE_CARD_BOTTOM_GRADIENT = {
  height: '58%',
  bottom: 0,
  opacity: 1,
  startColor: 'rgba(28, 11, 5, 0)',
  endColor: 'rgba(28, 11, 5, 0.92)',
  startAt: '0%',
  endAt: '75%',
} as const

const HOW_STEPS: HowStep[] = [
  {
    title: 'Technical Brief & Site Documentation Review',
    body: 'We Begin With Existing P&IDs, SOPs, Site Drawings, HSE Manuals, And Operational Documentation. Our Team Studies Plant Processes, Risk Areas, Maintenance Procedures, And Emergency Protocols. Every Animation Workflow Is Planned Around Actual Site Conditions And Operational Accuracy.',
    bg: cardBg,
    illustration: cardIllustration,
    imageScale: 1.08,
  },
  {
    title: 'SME-Led Storyboarding & Script Development',
    body: 'Our Subject Matter Experts Collaborate With Client Teams To Grasp Real Operational Workflows. We Develop Storyboards And Scripts Based On Maintenance Procedures, Safety Standards, And Domain Expertise, Simplifying Complex Industrial Processes Into Clear Visuals.',
    bg: cardBg,
    illustration: cardIllustration2,
    imageScale: 1,
  },
  {
    title: '3D Environment Modelling & Asset Build',
    body: 'Our Team Creates Precise 3D Models Of Plant Environments, Machinery, And Safety Equipment Using Client References, Site Images, And CAD Files. We Simulate Industrial Workflows And Maintenance Activities To Develop A Realistic Digital Environment For Training And Visualization.',
    bg: cardBg,
    illustration: cardIllustration3,
    imageScale: 1.08,
    imageBlendMode: 'multiply',
  },
  {
    title: 'CGI Production & Render',
    body: 'We Convert Approved Storyboards Into High-Quality CGI Animation Sequences And Simulation Visuals. Lighting, Camera Movement, Equipment Motion, And Human Interaction Are Carefully Designed For Realism. Voiceovers, Safety Instructions, Motion Graphics, And Operational Highlights Are Added During Production. Each Sequence Is Rendered For Smooth Playback Across Training, Presentation, And Learning Platforms.',
    bg: cardBg4,
    variant: 'wide',
  },
  {
    title: 'Review, Compliance Sign-Off & Delivery',
    body: 'Final Animations Are Reviewed With Client Teams For Technical Accuracy And HSE Compliance Validation. Required Corrections, Operational Updates, And Safety Changes Are Incorporated Before Final Delivery. Outputs Can Be Delivered For Training Systems, LMS Platforms, VR Devices, Presentations, Or Digital Campaigns. This Final Stage Ensures The Solution Is Deployment Ready For Industrial Operations And Workforce Training.',
    bg: cardBg5,
    variant: 'wide',
  },
]

const s = {
  section: {
    width: '100%',
    background: colors.ink,
    color: colors.white,
    padding: '100px 28px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 60,
  } satisfies CSSProperties,

  intro: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 24,
    textAlign: 'left',
  } satisfies CSSProperties,

  heading: {
    fontFamily: fonts.hn,
    fontSize: '3.75rem',
    fontWeight: 400,
    lineHeight: 0.9,
    letterSpacing: '-0.06em',
    color: colors.white,
    margin: 0,
  } satisfies CSSProperties,

  introCopy: {
    fontFamily: fonts.hn,
    fontSize: '1.25rem',
    fontWeight: 400,
    lineHeight: 1.32,
    letterSpacing: '-0.01em',
    color: colors.white,
    opacity: 0.6,
    width: '36.5rem',
    maxWidth: '100%',
    margin: 0,
  } satisfies CSSProperties,

  cards: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
    alignItems: 'start',
  } satisfies CSSProperties,

  cardRows: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    overflow: 'hidden',
  } satisfies CSSProperties,

  wideCards: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
    alignItems: 'start',
  } satisfies CSSProperties,

  card: {
    position: 'relative',
    height: 600,
    minWidth: 0,
    padding: 24,
    borderRadius: 2,
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    backgroundColor: colors.brand1,
  } satisfies CSSProperties,

  wideCard: {
    position: 'relative',
    height: 508,
    minWidth: 0,
    padding: 24,
    borderRadius: 2,
    overflow: 'hidden',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    textAlign: 'left',
    backgroundColor: colors.brand1,
  } satisfies CSSProperties,

  cardBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } satisfies CSSProperties,

  wideCardBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
  } satisfies CSSProperties,

  wideCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: WIDE_CARD_BOTTOM_GRADIENT.bottom,
    height: WIDE_CARD_BOTTOM_GRADIENT.height,
    opacity: WIDE_CARD_BOTTOM_GRADIENT.opacity,
    background: `linear-gradient(180deg, ${WIDE_CARD_BOTTOM_GRADIENT.startColor} ${WIDE_CARD_BOTTOM_GRADIENT.startAt}, ${WIDE_CARD_BOTTOM_GRADIENT.endColor} ${WIDE_CARD_BOTTOM_GRADIENT.endAt})`,
    pointerEvents: 'none',
    zIndex: 1,
  } satisfies CSSProperties,

  cardTitle: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    minWidth: '100%',
    fontFamily: fonts.hn,
    fontSize: '1.75rem',
    fontWeight: 400,
    lineHeight: 1.16,
    letterSpacing: '-0.02em',
    color: colors.white,
    opacity: 1,
    mixBlendMode: 'plus-lighter',
    margin: 0,
  } satisfies CSSProperties,

  illustrationWrap: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
    minHeight: 0,
    padding: '10px 0 14px',
    boxSizing: 'border-box',
  } satisfies CSSProperties,

  illustration: {
    height: '100%',
    maxWidth: '100%',
    width: 'auto',
    display: 'block',
    filter: 'drop-shadow(0 26px 36px rgba(0,0,0,0.34))',
    transformOrigin: 'center center',
  } satisfies CSSProperties,

  illustrationFrame: {
    width: '100%',
    height: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    flexShrink: 0,
  } satisfies CSSProperties,

  cardCopy: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    fontFamily: fonts.hn,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '-0.02em',
    color: colors.white,
    opacity: 0.8,
    textTransform: 'capitalize',
    margin: 0,
  } satisfies CSSProperties,
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="how-it-works-section" data-theme="dark" style={s.section}>
      <style>{`
        @media (max-width: 1024px) {
          .how-it-works-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .how-it-works-wide-cards {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 760px) {
          .how-it-works-section {
            padding: 72px 16px !important;
            gap: 40px !important;
          }

          .how-it-works-heading {
            font-size: 2.5rem !important;
            letter-spacing: -0.045em !important;
          }

          .how-it-works-copy {
            font-size: 1rem !important;
          }

          .how-it-works-cards {
            grid-template-columns: 1fr !important;
          }

          .how-it-works-wide-card {
            height: min(110vw, 508px) !important;
            min-height: 420px !important;
          }

          /* Let each card grow to fit its content and stack the title, image
             and copy top-to-bottom with a real gap. The previous fixed height
             + space-between made the (non-shrinking) image overlap the title
             and body once the text wrapped on narrow screens. */
          .how-it-works-card {
            height: auto !important;
            min-height: 0 !important;
            justify-content: flex-start !important;
            gap: 20px !important;
          }

          .how-card-illo {
            flex: 0 0 auto !important;
            padding: 0 !important;
          }

          .how-card-frame {
            height: auto !important;
            max-height: 300px !important;
            flex: 0 0 auto !important;
          }

          /* Drop the scale transform on mobile so the image never visually
             spills past its box into the surrounding text. */
          .how-card-frame img {
            transform: none !important;
            height: auto !important;
            width: auto !important;
            max-height: 280px !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div style={s.intro}>
        <h2 className="how-it-works-heading" style={s.heading}>How SixDX works</h2>
      </div>

      <div style={s.cardRows}>
        <div className="how-it-works-cards" style={s.cards}>
          {HOW_STEPS.filter(isStandardStep).map(step => (
            <article className="how-it-works-card" key={step.title} style={s.card}>
              <img src={step.bg} alt="" aria-hidden="true" style={s.cardBg} />

              <h3 className="how-card-title" style={s.cardTitle}>{step.title}</h3>

              <div className="how-card-illo" style={s.illustrationWrap} aria-hidden="true">
                <div className="how-card-frame" style={s.illustrationFrame}>
                  <img
                    src={step.illustration}
                    alt=""
                    style={{
                      ...s.illustration,
                      transform: `scale(${step.imageScale})`,
                      mixBlendMode: step.imageBlendMode,
                    }}
                  />
                </div>
              </div>

              <p className="how-card-copy" style={s.cardCopy}>{step.body}</p>
            </article>
          ))}
        </div>

        {HOW_STEPS.some(isWideStep) ? (
          <div className="how-it-works-wide-cards" style={s.wideCards}>
            {HOW_STEPS.filter(isWideStep).map(step => (
              <article className="how-it-works-wide-card" key={step.title} style={s.wideCard}>
                <img src={step.bg} alt="" aria-hidden="true" style={s.wideCardBg} />
                <div aria-hidden="true" style={s.wideCardGradient} />
                <h3 style={s.cardTitle}>{step.title}</h3>
                <p style={s.cardCopy}>{step.body}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
