"use client"
import React from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from '../../public/loadingAnimation.json'

const loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Lottie animationData={loadingAnimation} style={{ height: 500, width: 500 }} />
    </div>
  )
}

export default loading