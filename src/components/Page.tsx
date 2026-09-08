import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import Footer, { FooterReveal } from './Footer'
import Nav from './Nav'

function Page({ children }: { children: ReactNode }) {
  const footerTarget = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() === true

  // The browser resolves the URL fragment before React mounts the sections, so
  // a cross-page anchor such as /#work lands at the top. Scroll again after mount.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1))
    if (target) target.scrollIntoView()
  }, [])

  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <div className={reduced ? undefined : 'relative z-10 min-h-screen bg-bg'}>
        <div className={`mx-auto max-w-[1040px] px-8 pt-12 ${reduced ? '' : 'pb-30'}`}>
          <Nav />
          <main>{children}</main>
          {reduced && <Footer id="contact" />}
        </div>
      </div>
      {!reduced && <div ref={footerTarget} id="contact" className="h-32" />}
      {!reduced && <FooterReveal target={footerTarget} />}
    </div>
  )
}

export default Page
