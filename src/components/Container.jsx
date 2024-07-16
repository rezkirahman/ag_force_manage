import React from 'react'
import { motion } from 'framer-motion'

const Container = ({ children, className, onClick = () => { } }, ref = null) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ y: 20, opacity: 0 }}
      className={`relative rounded-2xl shadow-container w-full bg-white p-4 md:p-6 h-full ${className} oveerflow-clip`}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </motion.div>
  )
}

export default Container