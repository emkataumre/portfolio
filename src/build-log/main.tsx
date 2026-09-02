import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '../index.css'
import BuildLog from './BuildLog.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BuildLog />
    </MotionConfig>
  </StrictMode>,
)
