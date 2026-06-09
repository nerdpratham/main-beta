// ─── APP ROOT — SixDX ────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { initScroll, destroyScroll } from './animations/scroll'
import TypographyTokens from './styles/TypographyTokens'
import Preloader     from './components/ui/Preloader'
import TypographyInspector from './components/ui/TypographyInspector'
import Navbar        from './components/layout/Navbar'
import Hero          from './components/sections/Hero'
import StackSection  from './components/sections/StackSection'
import AboutSection  from './components/sections/AboutSection'
import WorkSection          from './components/sections/WorkSection'
import WhatWeCreateSection  from './components/sections/WhatWeCreateSection'
import HowItWorksSection    from './components/sections/HowItWorksSection'
import ContactSection        from './components/sections/ContactSection'
import FooterSection         from './components/layout/FooterSection'

export default function App() {
  // ── Lenis smooth scroll init ───────────────────────────────────────────
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    window.scrollTo(0, 0)
    const lenis = initScroll()
    lenis.scrollTo(0, { immediate: true, force: true })

    return () => destroyScroll()
  }, [])

  return (
    <main className="relative bg-[#0a0a0a]">
      <TypographyTokens />
      <TypographyInspector />
      <Preloader />
      <Navbar />
      <Hero />
      <AboutSection />
      <StackSection />
      <WhatWeCreateSection />
      <HowItWorksSection />
      <WorkSection />
      <ContactSection />
      <FooterSection />
    </main>
  )
}
