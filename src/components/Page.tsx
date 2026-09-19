import { useEffect, type ReactNode } from 'react'
import Contact from './Contact'
import Nav from './Nav'

function Page({ children }: { children: ReactNode }) {
  // The browser resolves the URL fragment before React mounts the sections, so
  // a cross-page anchor such as /#work lands at the top. Scroll again after mount.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1))
    if (target) target.scrollIntoView()
  }, [])

  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <div className="mx-auto grid max-w-[1240px] gap-x-12 px-6 pt-8 min-[900px]:grid-cols-[152px_minmax(0,1040px)] min-[900px]:px-8 min-[900px]:pt-12">
        <aside className="relative z-30 self-start min-[900px]:sticky min-[900px]:top-12">
          <Nav />
        </aside>
        <div className="min-w-0">
          <main>{children}</main>
          <Contact />
        </div>
      </div>
    </div>
  )
}

export default Page
