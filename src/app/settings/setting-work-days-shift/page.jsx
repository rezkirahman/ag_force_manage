'use client'
import Layout from '@/components/Layout'
import Shift from '@/components/settings/Shift'
import WorkDays from '@/components/settings/WorkDays'
import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { duration } from 'moment'

const Page = () => {
    const [tab, setTab] = useState('workdays')
    const direction = tab === 'workdays' ? 1 : -1

    const slideVariants = {
        initial: (direction) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
            transition: { type: 'spring', stiffness: 120, damping: 20 }
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 120, damping: 20 }
        },
        exit: (direction) => ({
            x: direction < 0 ? -1000 : 1000,
            opacity: 0,
            transition: { type: 'spring', stiffness: 120, damping: 20 }
        }),
    }

    return (
        <Layout>
            <div className='sticky top-0 z-20 p-4 bg-white rounded-2xl shadow-container'>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label='Work Days' value={'workdays'} />
                    <Tab label='Shift' value={'shift'} />
                </Tabs>
            </div>
            <div className=''>
                {tab === 'workdays' && (
                    <motion.div
                        key="workdays"
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <WorkDays />
                    </motion.div>
                )}
                {tab === 'shift' && (
                    <motion.div
                        key="shift"
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Shift />
                    </motion.div>
                )}
            </div>
        </Layout>
    )
}



export default Page
