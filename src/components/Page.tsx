import type { ReactNode } from 'react'
import Footer from './Footer'
import Nav from './Nav'

function Page({ children }: { children: ReactNode }) {
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
