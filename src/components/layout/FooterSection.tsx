// ─── FOOTER SECTION — SixDX ──────────────────────────────────────────────────
// Figma node : 408:246  "Footer"
// Layout     : vertical flex, space-between, padding 100px 28px 14px
// Gradient   : #fff → #faece8 → #f3d4c9 → #e49f88 → #d05b34 → #1c0b05
//
// Sections:
//   Upper  — tagline + CTA button + nav pills
//   Middle — two office columns (left) + newsletter card (right)
//   Bottom — policy links (left) + copyright (right)
//
// Newsletter card behaviour:
//   Default  : looping muted video plays in background
//   On click : video fades + signup form slides in
//   On close : form slides out + video resumes
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, type FormEvent, type ChangeEvent } from 'react'
import { colors, textStyles } from '../../styles/tokens'
import PrimaryButton from '../ui/PrimaryButton'

// ── Video ─────────────────────────────────────────────────────────────────────
const MACHINE_VIDEO    = '/video/Machaine000.Png.mp41111.webm'
const NEWSLETTER_VIDEO = MACHINE_VIDEO
const NEWSLETTER_OPEN_BG = 'rgba(0, 0, 0, 0.2)'
const NEWSLETTER_OPEN_BLUR = '4px'
const NEWSLETTER_OPEN_VIDEO_OPACITY = 1
const NEWSLETTER_INPUT_BG = colors.white08
const NEWSLETTER_INPUT_BORDER = colors.white08
const NEWSLETTER_INPUT_BLUR = '6px'

// ── Footer gradient ───────────────────────────────────────────────────────────
// Extracted from Figma. Edit the color stops here to adjust the gradient.
const FOOTER_GRADIENT = `linear-gradient(
  to bottom,
  #ffffff    8.6%,
  #faece8   14.9%,
  #f3d4c9   20.7%,
  #e49f88   28.7%,
  #d05b34   38.2%,
  #1c0b05   68.0%
)`

// ═══════════════════════════════════════════════════════════════════════════════
// ── CONTENT — edit here
// ═══════════════════════════════════════════════════════════════════════════════

const TAGLINE = 'Photorealistic. Technically accurate. Built for the environments where precision matters.'

const NAV_PILLS = [
  { label: 'Differentiators', href: '#' },
  { label: 'How SixDX Works', href: '#' },
  { label: 'Work', href: '#' },
  { label: 'Testimonials', href: '#' },
]

const OFFICES = [
  {
    region: 'India',
    company: 'Six D Engineering Solutions Pvt Ltd',
    address: 'A-167, Ground Floor, Sector - 63, Noida, Uttar Pradesh, 201 301, India',
    email: 'info@sixdengineering.com',
    phone: '+91 84481 79046',
  },
  {
    region: 'UAE',
    company: 'Six D Engineering Solutions FZC',
    address: 'B 49-130, Sharjah Research Technology & Innovation Park (SRTIP), Sharjah, United Arab Emirates',
    email: 'info@sixdengineering.com',
    phone: '+971 58 522 9400, +971 58556 6837',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ── NEWSLETTER CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface NewsletterState {
  email: string
}

function NewsletterCard() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<NewsletterState>({ email: '' })
  const [submitted, setSubmitted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleOpen = () => {
    setOpen(true)
    setSubmitted(false)
  }

  const handleClose = () => {
    setOpen(false)
    setForm({ email: '' })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ email: e.target.value })

	  const handleSubmit = (e: FormEvent) => {
	    e.preventDefault()
	    const email = form.email.trim()
	    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	    if (!isValidEmail) return

	    // TODO: wire to newsletter service (Mailchimp, ConvertKit, etc.)
	    console.log('[Newsletter] subscribe', email)
	    setSubmitted(true)
	  }

  return (
    // Card: 329×186 in Figma, border-radius 12, white bg, overflow hidden
    <div
      onClick={!open ? handleOpen : undefined}
	      className="footer-newsletter-card w-full md:w-[329px]"
      style={{
        height: 186,
        flexShrink: 0,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        cursor: open ? 'default' : 'pointer',
        background: colors.white,
      }}
    >
      {/* ── Video layer ─────────────────────────────────────────────────────
          Plays looped + muted. Fades out when form is open.
      ─────────────────────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src={NEWSLETTER_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.4s ease',
          opacity: open ? NEWSLETTER_OPEN_VIDEO_OPACITY : 1,
        }}
      />

      {/* ── Card label (visible when video is playing) ──────────────────── */}
      <div
        aria-hidden={open}
        style={{
          position: 'absolute',
          inset: 0,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          // Gradient so text stays readable over any video frame
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
          transition: 'opacity 0.3s ease',
          opacity: open ? 0 : 1,
          pointerEvents: 'none',
        }}
      >
        <p style={{
          ...textStyles.featureTitle,
          color: colors.white,
        }}>
          Sign Up to Our<br />Newsletter
        </p>
        <p style={{
          ...textStyles.label,
          color: colors.white70,
          marginTop: 8,
        }}>
	          Tap to subscribe
        </p>
      </div>

      {/* ── Signup form (slides in on click) ────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 16,
          background: NEWSLETTER_OPEN_BG,
          backdropFilter: `blur(${NEWSLETTER_OPEN_BLUR})`,
          WebkitBackdropFilter: `blur(${NEWSLETTER_OPEN_BLUR})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(12px)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* Close button */}
	        <button
	          className={submitted ? 'footer-newsletter-close footer-newsletter-close--success' : 'footer-newsletter-close'}
	          onClick={handleClose}
	          aria-label="Close newsletter form"
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: colors.white,
            lineHeight: 1,
            fontSize: 18,
	          }}
	        >
	          <span className="footer-newsletter-close-icon">✕</span>
	        </button>

	        {submitted ? (
	          // ── Success state ──
	          <div className="footer-newsletter-success-mask" style={{ textAlign: 'center' }}>
	            <p className="footer-newsletter-success-text" style={{ ...textStyles.body, color: colors.white }}>
	              We'll be in touch with the latest from SixDX.
	            </p>
	          </div>
        ) : (
          // ── Input state ──
          <>
            <p style={{
              ...textStyles.featureTitle,
              color: colors.white,
              marginBottom: 12,
            }}>
              Sign Up to Our<br />Newsletter
            </p>
	            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
	              <input
	                type="email"
	                required
	                className="footer-newsletter-input"
	                value={form.email}
	                onChange={handleChange}
	                placeholder="your@email.com"
	                style={{
	                  ...textStyles.body,
	                  width: '100%',
	                  height: 48,
	                  padding: '0 8px',
	                  border: `1px solid ${NEWSLETTER_INPUT_BORDER}`,
	                  borderRadius: 2,
	                  background: NEWSLETTER_INPUT_BG,
	                  backdropFilter: `blur(${NEWSLETTER_INPUT_BLUR})`,
	                  WebkitBackdropFilter: `blur(${NEWSLETTER_INPUT_BLUR})`,
	                  color: colors.white,
	                  outline: 'none',
	                  boxSizing: 'border-box',
	                }}
	              />
	              <PrimaryButton label="Subscribe" type="submit" variant="white" />
	            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function FooterSection() {
  return (
    // ── Outer shell — no background here so the gradient isn't stretched by
    // the Motor section's GSAP spacer (which inflates the element to ~660svh).
    // Each visual block owns its own background instead.
    <footer
      aria-label="Footer"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
	      <style>{`
	        .footer-newsletter-input::placeholder {
	          color: ${colors.white30};
	        }

	        .footer-newsletter-success-mask {
	          overflow: hidden;
	        }

	        .footer-newsletter-success-text {
	          margin: 0;
	          animation: footer-newsletter-reveal-up 0.95s cubic-bezier(0.16, 1, 0.3, 1) both;
	          will-change: transform, clip-path, opacity;
	        }

	        .footer-newsletter-close {
	          overflow: hidden;
	        }

	        .footer-newsletter-close-icon {
	          display: block;
	        }

	        .footer-newsletter-close--success .footer-newsletter-close-icon {
	          animation: footer-newsletter-reveal-down 0.95s cubic-bezier(0.16, 1, 0.3, 1) both;
	          will-change: transform, clip-path, opacity;
	        }

	        @media (min-width: 768px) and (max-width: 1024px) {
	          .footer-main-row {
	            flex-direction: column !important;
	          }

	          .footer-newsletter-card {
	            width: 100% !important;
	            max-width: none !important;
	          }
	        }

	        @keyframes footer-newsletter-reveal-up {
	          0% {
	            opacity: 0;
	            transform: translateY(115%);
	            clip-path: inset(100% 0 0 0);
	          }
	          45% {
	            opacity: 1;
	          }
	          100% {
	            opacity: 1;
	            transform: translateY(0);
	            clip-path: inset(0 0 0 0);
	          }
	        }

	        @keyframes footer-newsletter-reveal-down {
	          0% {
	            opacity: 0;
	            transform: translateY(-115%);
	            clip-path: inset(0 0 100% 0);
	          }
	          45% {
	            opacity: 1;
	          }
	          100% {
	            opacity: 1;
	            transform: translateY(0);
	            clip-path: inset(0 0 0 0);
	          }
	        }

	        @media (max-width: 767px) {
          .footer-bottom-bar {
            left: 16px !important;
            right: 16px !important;
            bottom: 16px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          GRADIENT BLOCK — carries the Figma gradient on a fixed-height div
          so the colour stops work correctly regardless of what comes after.
          Contains: CTA_Container (tagline + button + pills)
                  + Main Container (offices + newsletter)
          Padding matches original footer: 100px top, 28px sides, 60px bottom.
      ══════════════════════════════════════════════════════════════════════ */}
      <div data-theme="light" className="footer-gradient-block flex flex-col gap-10 md:gap-[200px] w-full" style={{
        background: FOOTER_GRADIENT,
        paddingTop: 100,
        paddingRight: 20,
        paddingBottom: 14,
        paddingLeft: 20,
        boxSizing: 'border-box',
      }}>

        {/* ── CTA_CONTAINER — Figma 408:247 ────────────────────────────────── */}
        <div className="flex flex-col gap-16 relative z-10">

          {/* CTA block: tagline + button */}
          <div className="flex flex-col gap-6">
            <h2 className="footer-tagline" style={{
              ...textStyles.sectionHeading,
              color: colors.ink,
              width: 878,
              maxWidth: '36rem',
            }}>
              {TAGLINE}
            </h2>

            <div>
              <PrimaryButton label="Get in touch" href="#contact" variant="white" />
            </div>
          </div>

          {/* Menu Container — nav pills */}
          <div className="footer-nav-pills flex flex-col md:flex-row gap-[2px] w-full">
            {NAV_PILLS.map(pill => (
              <a
                key={pill.label}
                href={pill.href}
                className="footer-nav-pill flex items-center justify-start md:justify-center flex-1 w-full no-underline transition-colors duration-200"
                style={{
                  ...textStyles.bodyMedium,
                  boxSizing: 'border-box',
                   fontSize: 14, 
                   fontWeight: 400,  
                  minHeight: 26,
                  padding: '2px 16px',
                  borderRadius: 2,
                  color: colors.white,
                  background: 'rgba(28, 11, 5, 0.2)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(28, 11, 5, 0.4)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(28, 11, 5, 0.2)')}
              >
                {pill.label}
              </a>
            ))}
          </div>

        </div>

        {/* ── MAIN CONTAINER — offices (left) + newsletter card (right) ─────── */}
        <div className="footer-main-row flex flex-col md:flex-row justify-between items-start w-full gap-10 md:gap-4 relative z-10">

          {/* Office info columns */}
          <div className="footer-offices flex flex-col md:flex-row gap-10 md:gap-[28px] w-full md:w-[560px] shrink-0">
            {OFFICES.map(office => (
              <div
                key={office.region}
                className="flex flex-col gap-4 flex-1 min-w-0"
              >
                <p style={{ ...textStyles.featureTitle, color: colors.white, whiteSpace: 'nowrap' }}>
                  {office.region}
                </p>
                <div style={{ width: '100%', height: 1, background: colors.white08, flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ ...textStyles.label, color: colors.white50 }}>
                    {office.company}<br />{office.address}
                  </p>
                  <p style={{ ...textStyles.label, color: colors.white50 }}>
                    {office.email}
                  </p>
                  <p style={{ ...textStyles.label, color: colors.white50 }}>
                    {office.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <NewsletterCard />
        </div>

      </div>{/* end GRADIENT BLOCK */}

    </footer>
  )
}
