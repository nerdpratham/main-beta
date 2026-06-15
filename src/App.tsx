// ─── APP ROOT — SixDX ────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
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
import PrivacyPolicyPage     from './components/pages/PrivacyPolicyPage'

const PRIVACY_POLICY_PATH = '/privacy-policy'

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)

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

  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const isPrivacyPolicyPage = pathname === PRIVACY_POLICY_PATH

  return (
    <main className={isPrivacyPolicyPage ? 'relative bg-white' : 'relative bg-[#0a0a0a]'}>
      <TypographyTokens />
      <TypographyInspector />
      <Preloader />
      <Navbar />
      {isPrivacyPolicyPage ? (
        <PrivacyPolicyPage />
      ) : (
        <>
          <Hero />
          <AboutSection />
          <StackSection />
          <WhatWeCreateSection />
          <HowItWorksSection />
          <WorkSection />
          <ContactSection />
        </>
      )}
      <FooterSection />
    </main>
  )
}
