import CursorAvatar from './CursorAvatar'
import Reveal from './Reveal'

function Hero() {
  return (
    <section className="mt-22 grid grid-cols-1 items-center gap-14 min-[760px]:grid-cols-[1.3fr_1fr]">
      <div>
        <Reveal
          as="h1"
          delay={0.1}
          className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.035em]"
        >
          Real software, built with AI agents.
        </Reveal>
        <Reveal as="p" delay={0.18} className="mt-5.5 max-w-130 text-xl leading-[1.45] text-muted">
          The agents write the code. The engineering does not change: small steps, tests,
          review, and runtime verification. I own the result. Software engineer in Copenhagen.
        </Reveal>
      </div>
      <Reveal
        delay={0.26}
        className="order-first justify-self-start min-[760px]:order-none min-[760px]:justify-self-end"
      >
        <CursorAvatar />
      </Reveal>
    </section>
  )
}

export default Hero
