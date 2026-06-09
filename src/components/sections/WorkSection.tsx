// ─── WORK SECTION — SixDX ─────────────────────────────────────────────────────
// Figma source: SixDX / Sections / Work Section (node 963:6315)
//
// To edit projects, change WORK_ITEMS only. The right-side media blocks use the
// current site videos as placeholders for future case-study videos.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { textStyles } from '../../styles/tokens'

const WORK_TEXT_COLOR = '#0A0402'

type WorkItem = {
  title: string
  description: string
  tags: string[]
  videoSrc: string
  theme: 'light' | 'dark'
}

const WORK_ITEMS: WorkItem[] = [
  {
    title: 'Hall Isolation',
    description:
      'Every environment is built from your site documentation, P&IDs, and technical drawings. Nothing is approximated for the camera.',
    tags: ['Steel', 'Steel'],
    videoSrc: 'https://res.cloudinary.com/dj5sqxkpj/video/upload/v1780287263/vid_1_f6goo6.mp4',
    theme: 'dark',
  },
  {
    title: 'Shutdown Procedure',
    description:
      'Every environment is built from your site documentation, P&IDs, and technical drawings. Nothing is approximated for the camera.',
    tags: ['Steel', 'Steel'],
    videoSrc: 'https://res.cloudinary.com/dj5sqxkpj/video/upload/v1780287265/vid_3_x54bll.mp4',
    theme: 'dark',
  },
  {
    title: 'Hall Isolation',
    description:
      'Every environment is built from your site documentation, P&IDs, and technical drawings. Nothing is approximated for the camera.',
    tags: ['Steel', 'Steel'],
    videoSrc: 'https://res.cloudinary.com/dj5sqxkpj/video/upload/v1780287275/vid_4_y7izvf.mp4',
    theme: 'light',
  },
  {
    title: 'Hall Isolation',
    description:
      'Every environment is built from your site documentation, P&IDs, and technical drawings. Nothing is approximated for the camera.',
    tags: ['Steel', 'Steel'],
    videoSrc: 'https://res.cloudinary.com/dj5sqxkpj/video/upload/v1780287266/vid_5_df5pnu.mp4',
    theme: 'light',
  },
]

function WorkTitleHighlightText({ text }: { text: string }) {
  let charIndex = 0

  return (
    <>
      {text.split(' ').map((word, wordIndex, words) => (
        <span
          className="work-title-highlight-word"
          key={`${word}-${wordIndex}`}
          style={{ '--word': wordIndex + 1 } as CSSProperties}
        >
          {Array.from(word).map((char, index) => {
            charIndex += 1

            return (
              <span
                className="work-title-highlight-char"
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

const s = {
  section: {
    width: '100%',
    minHeight: 2330,
    padding: '100px 20px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 80,
    background: '#FFFFFF',
  } satisfies CSSProperties,

  eyebrowWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  } satisfies CSSProperties,

  eyebrow: {
    ...textStyles.eyebrow,
    textTransform: 'uppercase',
    color: WORK_TEXT_COLOR,
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  } satisfies CSSProperties,

  row: {
    width: '100%',
    minHeight: 480,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 40,
  } satisfies CSSProperties,

  copyCol: {
    width: 555,
    minHeight: 249,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 80,
    flexShrink: 1,
  } satisfies CSSProperties,

  copyStack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  } satisfies CSSProperties,

  title: {
    ...textStyles.projectTitle,
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  description: {
    ...textStyles.bodyLarge,
    width: 334.426,
    textTransform: 'capitalize',
  } satisfies CSSProperties,

  tag: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: '4px 12px',
    background: 'rgba(28, 11, 5, 0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: 999,
  } satisfies CSSProperties,

  tagText: {
    ...textStyles.bodySmall,
    color: '#FFFFFF',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,

  mediaTags: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 2,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  } satisfies CSSProperties,

  mediaFrame: {
    position: 'relative',
    width: 690,
    height: 480,
    borderRadius: 2,
    overflow: 'hidden',
    flexShrink: 0,
    background: 'transparent',
  } satisfies CSSProperties,

  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 2,
    display: 'block',
  } satisfies CSSProperties,

}

function WorkMedia({ src, title, tags }: { src: string; title: string; tags: string[] }) {
  return (
    <div className="work-media-frame" style={s.mediaFrame}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={`${title} video`}
        style={s.video}
      />
      <div style={s.mediaTags} aria-label={`${title} tags`}>
        {tags.map((tag, tagIndex) => (
          <div key={`${tag}-${tagIndex}`} style={s.tag}>
            <p style={s.tagText}>{tag}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WorkSection() {
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const [activeTitles, setActiveTitles] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const titles = titleRefs.current.filter((title): title is HTMLHeadingElement => Boolean(title))
    if (!titles.length) return

    const frames = new Map<Element, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.workTitleIndex)
          const frame = frames.get(entry.target)
          if (frame) window.cancelAnimationFrame(frame)

          if (!entry.isIntersecting) {
            setActiveTitles((current) => ({ ...current, [index]: false }))
            return
          }

          setActiveTitles((current) => ({ ...current, [index]: false }))
          const nextFrame = window.requestAnimationFrame(() => {
            setActiveTitles((current) => ({ ...current, [index]: true }))
          })
          frames.set(entry.target, nextFrame)
        })
      },
      { threshold: 0.45 },
    )

    titles.forEach((title) => observer.observe(title))

    return () => {
      frames.forEach((frame) => window.cancelAnimationFrame(frame))
      observer.disconnect()
    }
  }, [])

  return (
    <section id="work" aria-label="Selected works" data-theme="light" className="work-section" style={s.section}>
      <style>{`
        .work-title-highlight {
          --work-title-highlight-color: #E1A853;
          --work-title-highlight-ease: cubic-bezier(0.215, 0.61, 0.355, 1);
          color: inherit;
          display: inline;
        }

        .work-title-highlight-word {
          display: inline;
          color: inherit;
        }

        .work-title-highlight-char {
          display: inline;
          color: inherit;
          opacity: 1;
          will-change: color, opacity;
        }

        .work-title-highlight.is-active .work-title-highlight-word {
          animation: work-title-word-blink 0.26s var(--work-title-highlight-ease) both;
          animation-delay: calc((var(--word) - 1) * 39ms + 0.175s);
        }

        .work-title-highlight.is-active .work-title-highlight-char {
          animation: work-title-char-flash 0.32s var(--work-title-highlight-ease) both;
          animation-delay: calc((var(--char) - 1) * 28ms + 0.125s);
        }

        .work-title-highlight:not(.is-active) .work-title-highlight-word,
        .work-title-highlight:not(.is-active) .work-title-highlight-char {
          animation: none;
        }

        @keyframes work-title-word-blink {
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
          70%,
          100% {
            opacity: 1;
          }
        }

        @keyframes work-title-char-flash {
          0% {
            color: inherit;
            opacity: 1;
          }
          1% {
            color: var(--work-title-highlight-color);
            opacity: 1;
          }
          15% {
            opacity: 0.2;
          }
          30% {
            opacity: 0.8;
          }
          40% {
            color: var(--work-title-highlight-color);
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
      `}</style>
      <div style={s.eyebrowWrap}>
        <h2 style={s.eyebrow}>SELECTED WORKS</h2>
      </div>

      <div className="work-list" style={s.list}>
        {WORK_ITEMS.map((item, index) => {
          const textColor = WORK_TEXT_COLOR

          return (
            <div key={`${item.title}-${index}`} className="work-row-group">
              <article className="work-row" style={s.row}>
                <div className="work-copy-col" style={s.copyCol}>
                  <div style={{ ...s.copyStack, color: textColor }}>
                    <h3
                      ref={(el) => { titleRefs.current[index] = el }}
                      data-work-title-index={index}
                      className="work-title"
                      style={{ ...s.title, color: textColor }}
                    >
                      <span className={`work-title-highlight${activeTitles[index] ? ' is-active' : ''}`}>
                        <WorkTitleHighlightText text={item.title} />
                      </span>
                    </h3>
                    <p className="work-description" style={{ ...s.description, color: textColor }}>
                      {item.description}
                    </p>
                  </div>

                </div>

                <WorkMedia src={item.videoSrc} title={item.title} tags={item.tags} />
              </article>

            </div>
          )
        })}
      </div>
    </section>
  )
}
