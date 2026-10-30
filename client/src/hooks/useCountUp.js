import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to `end` over `duration` ms.
 * Respects prefers-reduced-motion.
 */
export function useCountUp(end, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0)
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (!enabled || end === 0) {
      setValue(end)
      return
    }
    if (prefersReduced.current) {
      setValue(end)
      return
    }
    let start = 0
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setValue(end)
        clearInterval(timer)
      } else {
        setValue(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, enabled])

  return value
}
