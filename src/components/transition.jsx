"use client"
import { motion } from "framer-motion"

export default function Transition({ children }) {
    return <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        exit={{ y: 20, opacity: 0 }}
    >
        {children}
    </ motion.div>
}