import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

export function useReveal(threshold = 0.15) {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: false, amount: threshold })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  return { ref, controls }
}

export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [.22,1,.36,1], delay: d * .12 }
  }),
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (d = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay: d * .12 }
  }),
}

export function Reveal({ children, delay = 0, className = '', style = {} }) {
  const { ref, controls } = useReveal()
  return (
    <motion.div
      ref={ref}
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate={controls}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
