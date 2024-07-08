'use client'
import Layout from "@/components/Layout"
import GroupListAttendance from "@/components/settings/attendance/GroupListAttendance"
import LocationListAttendance from "@/components/settings/attendance/LocationListAttendance"
import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { motion } from "framer-motion"

const Page = () => {
    const [tab, setTab] = useState('group')
    const direction = tab === 'lokasi' ? 1 : -1
    const slideVariants = {
        initial: (direction) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.8 }
        },
        exit: (direction) => ({
            x: direction < 0 ? -1000 : 1000,
            opacity: 0,
            transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.8 }
        }),
    }

    return (
        <Layout>
            <div className='sticky top-0 z-20 p-4 bg-white rounded-2xl shadow-container'>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label='Lokasi' value={'lokasi'} />
                    <Tab label='Group' value={'group'} />
                </Tabs>
            </div>
            <div>
                {tab === 'lokasi' && (
                    <motion.div
                        key="lokasi"
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <LocationListAttendance />
                    </motion.div>
                )}
                {tab === 'group' && (
                    <motion.div
                        key="group"
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <GroupListAttendance />
                    </motion.div>
                )}
            </div>
        </Layout>
    )
}

export default Page
