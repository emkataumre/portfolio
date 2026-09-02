import { useEffect, type ReactNode } from 'react'
import Footer from './Footer'
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
      <div className="mx-auto max-w-[1040px] px-8 pt-12">
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default Page
