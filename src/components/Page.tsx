import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import Contact from './Contact'
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
        <div
          className="mx-auto grid max-w-[1240px] gap-x-12 px-6 pt-8 min-[900px]:grid-cols-[152px_minmax(0,1040px)] min-[900px]:px-8 min-[900px]:pt-12"
        >
          <aside className="relative z-30 self-start min-[900px]:sticky min-[900px]:top-12">
            <Nav />
          </aside>
          <div className="min-w-0">
            <main>{children}</main>
            <Contact />
            {reduced && <Footer />}
          </div>
        </div>
      </div>
      {!reduced && <div ref={footerTarget} className="h-32" />}
      {!reduced && <FooterReveal target={footerTarget} />}
    </div>
  )
}

export default Page
