import type { ReactNode } from 'react'

function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1040px] px-8 pt-12">{children}</div>
}

export default Container
