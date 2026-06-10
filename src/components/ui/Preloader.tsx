import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../animations/gsap.config'
import { colors } from '../../styles/tokens'

const LOADING_PATH =
  'M1.35676 1.0859H0.0599908V9.71484H5.5864V8.55139H1.35676V1.0859ZM9.57119 9.90875C10.8316 9.90875 11.8496 9.4967 12.6253 8.66046C13.3888 7.83635 13.7766 6.74561 13.7766 5.40037C13.7766 4.06725 13.3888 2.97651 12.6253 2.12816C11.8496 1.30404 10.8316 0.891987 9.57119 0.891987C8.28654 0.891987 7.26852 1.30404 6.51712 2.12816C5.74148 2.97651 5.35367 4.06725 5.35367 5.40037C5.35367 6.75773 5.74148 7.83635 6.51712 8.66046C7.26852 9.4967 8.28654 9.90875 9.57119 9.90875ZM9.57119 8.7453C8.6986 8.7453 7.99568 8.44232 7.48666 7.83635C6.95341 7.2425 6.69891 6.43051 6.69891 5.40037C6.69891 4.38235 6.95341 3.57035 7.48666 2.95227C8.00779 2.35842 8.6986 2.05544 9.57119 2.05544C10.4317 2.05544 11.1225 2.35842 11.6557 2.95227C12.1647 3.55824 12.4313 4.37023 12.4313 5.40037C12.4313 6.44263 12.1647 7.25462 11.6557 7.83635C11.1346 8.44232 10.4438 8.7453 9.57119 8.7453ZM21.898 9.71484L18.4804 1.0859H16.9897L13.6205 9.71484H14.9658L15.802 7.47277H19.6802L20.5286 9.71484H21.898ZM16.3959 5.87302C16.7231 5.00043 17.1715 3.82486 17.729 2.33419C18.1895 3.63095 18.6379 4.80652 19.0742 5.87302L19.256 6.34568H16.2141L16.3959 5.87302ZM22.5943 1.0859V9.71484H25.6726C27.0058 9.71484 28.048 9.33915 28.8237 8.56351C29.5751 7.79999 29.9507 6.74561 29.9507 5.40037C29.9507 4.06725 29.5751 3.01287 28.8237 2.23723C28.048 1.47371 27.0058 1.0859 25.6726 1.0859H22.5943ZM23.8911 8.57563V2.22511H25.6605C26.6058 2.22511 27.3209 2.50386 27.8299 3.04922C28.3389 3.60671 28.5934 4.38235 28.5934 5.40037C28.5934 6.41839 28.3389 7.20615 27.8299 7.75152C27.3209 8.309 26.6058 8.57563 25.6605 8.57563H23.8911ZM32.3888 9.71484V1.0859H31.092V9.71484H32.3888ZM39.69 3.70367C39.69 5.64276 39.7022 7.08495 39.7385 8.0545C39.3265 7.33946 38.769 6.40627 38.0539 5.26706L35.3877 1.0859H33.897V9.71484H35.1574V7.09707C35.1574 5.1701 35.1332 3.72791 35.1089 2.75836C35.4483 3.40068 36.0179 4.32175 36.7935 5.53368L39.4476 9.71484H40.9383V1.0859H39.69V3.70367ZM46.4654 6.28508H49.0104C48.9862 7.01224 48.7075 7.59396 48.1984 8.0545C47.6773 8.52715 47.0471 8.75742 46.2957 8.75742C45.4231 8.75742 44.7323 8.45444 44.2112 7.84847C43.6901 7.25462 43.4356 6.44263 43.4356 5.40037C43.4356 4.37023 43.6901 3.55824 44.2112 2.95227C44.7202 2.3463 45.3989 2.04332 46.2715 2.04332C46.9138 2.04332 47.4592 2.21299 47.9197 2.55233C48.3802 2.89167 48.6711 3.35221 48.7923 3.93393H50.1254C49.98 3.01287 49.5679 2.27359 48.8892 1.7161C48.1863 1.17073 47.3137 0.891987 46.2594 0.891987C44.9868 0.891987 43.9809 1.30404 43.2295 2.12816C42.466 2.95227 42.0903 4.04301 42.0903 5.40037C42.0903 6.75773 42.466 7.83635 43.2174 8.66046C43.9446 9.4967 44.9384 9.90875 46.1866 9.90875C47.4107 9.90875 48.3439 9.46034 48.9983 8.56351L49.2286 9.71484H50.2224V5.18222H46.4654V6.28508Z'

const Corner = () => (
  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" aria-hidden="true">
    <path d="M1 0L0.999996 28H29" stroke="currentColor" />
  </svg>
)

const TinyLine = () => (
  <svg width="32" height="2" viewBox="0 0 32 2" fill="none" aria-hidden="true">
    <path d="M32 1H0" stroke="currentColor" />
  </svg>
)

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [shouldAnimateLines, setShouldAnimateLines] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const overlay = overlayRef.current
    const progress = progressRef.current
    if (!overlay || !progress) return

    const html = document.documentElement
    const previousHtmlOverflow = html.style.overflow
    const previousHtmlOverscroll = html.style.overscrollBehavior
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyOverscroll = document.body.style.overscrollBehavior
    const previousBodyTouchAction = document.body.style.touchAction
    const previousBodyPosition = document.body.style.position
    const previousBodyInset = document.body.style.inset
    const previousBodyWidth = document.body.style.width

    window.scrollTo(0, 0)
    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    document.body.style.touchAction = 'none'
    document.body.style.position = 'fixed'
    document.body.style.inset = '0'
    document.body.style.width = '100%'

    gsap.set(progress, { '--progress': 0.2 })
    const progressTween = gsap.to(progress, {
      '--progress': 1,
      duration: 2,
      ease: 'expo.out',
    })

    const minDone = new Promise<void>(resolve => {
      progressTween.eventCallback('onComplete', resolve)
    })
    const fontsDone = document.fonts.ready as Promise<unknown>
    const winLoad = new Promise<void>(resolve => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })

    Promise.all([minDone, fontsDone, winLoad]).then(() => {
      setIsFinished(true)
      setShouldAnimateLines(true)
      window.setTimeout(() => {
        html.style.overflow = previousHtmlOverflow
        html.style.overscrollBehavior = previousHtmlOverscroll
        document.body.style.overflow = previousBodyOverflow
        document.body.style.overscrollBehavior = previousBodyOverscroll
        document.body.style.touchAction = previousBodyTouchAction
        document.body.style.position = previousBodyPosition
        document.body.style.inset = previousBodyInset
        document.body.style.width = previousBodyWidth
        window.scrollTo(0, 0)
        ScrollTrigger.refresh()
        setMounted(false)
      }, 4200)
    })

    return () => {
      progressTween.kill()
      html.style.overflow = previousHtmlOverflow
      html.style.overscrollBehavior = previousHtmlOverscroll
      document.body.style.overflow = previousBodyOverflow
      document.body.style.overscrollBehavior = previousBodyOverscroll
      document.body.style.touchAction = previousBodyTouchAction
      document.body.style.position = previousBodyPosition
      document.body.style.inset = previousBodyInset
      document.body.style.width = previousBodyWidth
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={overlayRef}
      className={[
        'sixdx-preloader',
        isFinished ? 'sixdx-preloader--finished' : '',
        shouldAnimateLines ? 'sixdx-preloader--lines' : '',
      ].join(' ')}
      role="status"
      aria-label="Loading SixDX website"
    >
      <style>{`
        .sixdx-preloader {
          --loader-bg: ${colors.ink};
          --loader-line-dark: #000000;
          --loader-track: rgba(255,255,255,0.20);
          --loader-accent: ${colors.brand1};
          --loader-white: ${colors.white};
          pointer-events: none;
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 9999;
          color: var(--loader-white);
        }

        .sixdx-preloader__pt1 {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--loader-white);
          background: var(--loader-bg);
        }

        .sixdx-preloader--finished .sixdx-preloader__pt1 {
          opacity: 0;
          transition: opacity 0.2s 2s;
        }

        .sixdx-preloader__loadingSvg {
          text-align: center;
          margin-bottom: max(0.9375rem, 1.0416666667vw);
        }

        .sixdx-preloader__loadingSvg svg {
          display: block;
          width: auto;
          height: 0.625rem;
        }

        .sixdx-preloader__loadingSvg path {
          fill: var(--loader-white);
          opacity: 0;
          animation: sixdx-loader-glitch 2s forwards;
        }

        .sixdx-preloader--finished .sixdx-preloader__loadingSvg {
          opacity: 0;
          transition: opacity 0.5s;
        }

        .sixdx-preloader__track {
          position: relative;
          height: 2px;
          width: max(8.25rem, 9.1666666667vw);
          overflow: hidden;
          border-radius: 0.2em;
          background-color: var(--loader-track);
        }

        .sixdx-preloader--finished .sixdx-preloader__track {
          opacity: 0;
          transition: opacity 0.5s;
        }

        .sixdx-preloader__progressWrapper {
          position: absolute;
          inset: 0;
          animation: sixdx-loader-track-scale 2s cubic-bezier(0.19, 1, 0.22, 1);
          transform-origin: 0 50%;
        }

        .sixdx-preloader__progress {
          position: absolute;
          inset: 0;
          background: var(--loader-accent);
          transform: scaleX(var(--progress));
          transition: transform 0.5s cubic-bezier(1, 0, 0, 1);
          transform-origin: 0 50%;
        }

        .sixdx-preloader__frame {
          position: absolute;
          top: 10%;
          left: 10%;
          right: 10%;
          bottom: 10%;
          color: var(--loader-accent);
          animation: sixdx-loader-scale-up 1s cubic-bezier(0.19, 1, 0.22, 1) 0.1s both;
        }

        .sixdx-preloader--finished .sixdx-preloader__frame {
          animation: sixdx-loader-scale-down 1.1s cubic-bezier(1, 0, 0, 1) 0.9s both;
        }

        .sixdx-preloader__corner {
          position: absolute;
          display: block;
          width: 29px;
          height: 29px;
          animation: sixdx-loader-glitch 1s 1s both;
        }

        .sixdx-preloader__corner:nth-child(1) {
          top: 0;
          left: 0;
          transform: rotate(90deg);
        }

        .sixdx-preloader__corner:nth-child(2) {
          top: 0;
          right: 0;
          transform: rotate(180deg);
        }

        .sixdx-preloader__corner:nth-child(3) {
          right: 0;
          bottom: 0;
          transform: rotate(270deg);
        }

        .sixdx-preloader__corner:nth-child(4) {
          bottom: 0;
          left: 0;
        }

        .sixdx-preloader__tinyLines {
          animation: sixdx-loader-glitch 1s infinite;
        }

        .sixdx-preloader__tinyLine {
          position: absolute;
          --offset: 25%;
          display: block;
          width: 32px;
          height: 2px;
          color: var(--loader-accent);
          transform: scaleX(0);
          animation: sixdx-loader-tiny-line 1s infinite forwards;
        }

        .sixdx-preloader__tinyLine:nth-child(1) {
          bottom: var(--offset);
          left: 0;
          animation-delay: 1.1s;
        }

        .sixdx-preloader__tinyLine:nth-child(2) {
          right: 0;
          bottom: var(--offset);
          animation-delay: 1s;
        }

        .sixdx-preloader__tinyLine:nth-child(3) {
          top: var(--offset);
          right: 0;
          animation-delay: 1.2s;
        }

        .sixdx-preloader__tinyLine:nth-child(4) {
          top: var(--offset);
          left: 0;
          animation-delay: 0.9s;
        }

        .sixdx-preloader__pt2 {
          position: absolute;
          inset: 0;
        }

        .sixdx-preloader--finished .sixdx-preloader__pt2 {
          visibility: hidden;
          transition: visibility 0s 1.95s;
        }

        .sixdx-preloader__pt2Inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        .sixdx-preloader--finished .sixdx-preloader__pt2Inner {
          animation: sixdx-loader-scale-down 1.1s cubic-bezier(1, 0, 0, 1) 1.25s both;
        }

        .sixdx-preloader__mask {
          max-width: 80%;
          overflow: hidden;
        }

        .sixdx-preloader__mark {
          display: block;
          width: min(80vw, 32rem);
          aspect-ratio: 94 / 36;
          background: var(--loader-white);
          transform: translateY(120%);
          -webkit-mask: url('/logo.svg') center / contain no-repeat;
          mask: url('/logo.svg') center / contain no-repeat;
        }

        .sixdx-preloader--finished .sixdx-preloader__mark {
          animation: sixdx-loader-uncover-y 1s cubic-bezier(0.19, 1, 0.22, 1) 0.2s forwards;
        }

        .sixdx-preloader__lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        .sixdx-preloader__group {
          position: absolute;
          top: 0;
          width: 33.34%;
          height: 100%;
        }

        .sixdx-preloader__group:nth-child(1) {
          left: 0;
        }

        .sixdx-preloader__group:nth-child(2) {
          left: 33.33%;
        }

        .sixdx-preloader__group:nth-child(3) {
          right: 0;
        }

        .sixdx-preloader__line {
          position: absolute;
          inset: 0;
          transform: translateY(-100%);
          animation: sixdx-loader-zero-one-zero 1.5s cubic-bezier(0.86, 0, 0.07, 1) paused;
        }

        .sixdx-preloader__line:nth-child(1) {
          background: linear-gradient(
            180deg,
            rgb(244, 178, 1) 0%,
            rgba(212,105,69,1) 42%,
            rgba(204,77,34,1) 50%,
            rgba(17,7,3,1) 89%
          );
          animation-delay: 1.3s;
        }

        .sixdx-preloader__line:nth-child(2) {
          background-color: var(--loader-line-dark);
          animation-delay: 1.4s;
        }

        .sixdx-preloader__line:nth-child(3) {
          background: linear-gradient(
            180deg,
            rgb(244, 178, 1) 0%,
            rgba(212,105,69,1) 42%,
            rgba(204,77,34,1) 50%,
            rgba(17,7,3,1) 89%
          );
          animation-delay: 1.5s;
        }

        .sixdx-preloader__group:nth-child(2) .sixdx-preloader__line:nth-child(1) {
          animation-delay: 1.2s;
        }

        .sixdx-preloader__group:nth-child(2) .sixdx-preloader__line:nth-child(2) {
          animation-delay: 1.3s;
        }

        .sixdx-preloader__group:nth-child(2) .sixdx-preloader__line:nth-child(3) {
          animation-delay: 1.4s;
        }

        .sixdx-preloader--lines .sixdx-preloader__line {
          animation-play-state: running;
        }

        @keyframes sixdx-loader-glitch {
          0%, 8%, 13%, 25% { opacity: 0; }
          10%, 20% { opacity: 0.5; }
          35%, 100% { opacity: 1; }
        }

        @keyframes sixdx-loader-track-scale {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes sixdx-loader-scale-up {
          0% {
            opacity: 0;
            transform: scale(0.25);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes sixdx-loader-scale-down {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }

        @keyframes sixdx-loader-tiny-line {
          0% {
            transform: scaleX(0);
            transform-origin: 0 50%;
            opacity: 0;
          }
          49% {
            transform: scaleX(1);
            transform-origin: 0 50%;
            opacity: 1;
          }
          51% {
            transform: scaleX(1);
            transform-origin: 100% 50%;
            opacity: 1;
          }
          100% {
            transform: scaleX(0);
            transform-origin: 100% 50%;
            opacity: 0;
          }
        }

        @keyframes sixdx-loader-uncover-y {
          100% { transform: translateY(0); }
        }

        @keyframes sixdx-loader-zero-one-zero {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @media (min-width: 1000px) {
          .sixdx-preloader__mark {
            width: min(80vw, 44rem);
          }
        }

        @media (max-width: 809px) {
          .sixdx-preloader__frame {
            left: 10%;
            right: 10%;
          }

          .sixdx-preloader__mark {
            width: min(80vw, 24rem);
          }
        }
      `}</style>

      <div className="sixdx-preloader__pt1">
        <div className="sixdx-preloader__loadingSvg" aria-hidden="true">
          <svg width="51" height="10" viewBox="0 0 51 10" fill="none">
            <path d={LOADING_PATH} />
          </svg>
        </div>

        <div className="sixdx-preloader__track" aria-hidden="true">
          <div className="sixdx-preloader__progressWrapper">
            <div ref={progressRef} className="sixdx-preloader__progress" />
          </div>
        </div>

        <div className="sixdx-preloader__frame" aria-hidden="true">
          <div>
            <span className="sixdx-preloader__corner"><Corner /></span>
            <span className="sixdx-preloader__corner"><Corner /></span>
            <span className="sixdx-preloader__corner"><Corner /></span>
            <span className="sixdx-preloader__corner"><Corner /></span>
          </div>
          <div className="sixdx-preloader__tinyLines">
            <span className="sixdx-preloader__tinyLine"><TinyLine /></span>
            <span className="sixdx-preloader__tinyLine"><TinyLine /></span>
            <span className="sixdx-preloader__tinyLine"><TinyLine /></span>
            <span className="sixdx-preloader__tinyLine"><TinyLine /></span>
          </div>
        </div>
      </div>

      <div className="sixdx-preloader__pt2" aria-hidden="true">
        <div className="sixdx-preloader__pt2Inner">
          <div className="sixdx-preloader__mask">
            <div className="sixdx-preloader__mark" />
          </div>
        </div>
      </div>

      <div className="sixdx-preloader__lines" aria-hidden="true">
        {[0, 1, 2].map(group => (
          <div className="sixdx-preloader__group" key={group}>
            <div className="sixdx-preloader__line" />
            <div className="sixdx-preloader__line" />
            <div className="sixdx-preloader__line" />
          </div>
        ))}
      </div>
    </div>
  )
}
