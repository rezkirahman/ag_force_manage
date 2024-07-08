'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

const NumberTicker = ({ value }) => {
    const ref = useRef(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
    })

    useEffect(() => {
        motionValue.set(value)
    }, [motionValue, value])

    useEffect(() => {
        const unsubscribe = springValue.on("change", latest => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest)
            }
        })

        return () => unsubscribe()
    }, [springValue])

    return <motion.span ref={ref} />
}

export default NumberTicker