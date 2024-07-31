'use client'
import Layout from '@/components/Layout'
import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import ShiftTab from '@/components/settings/work-days-shift/ShiftTab'
import WorkDaysTab from '@/components/settings/work-days-shift/WorkDaysTab'

const Page = () => {
    const [tab, setTab] = useState('workdays')
    const direction = tab === 'workdays' ? 1 : -1

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
                    <WorkDaysTab />
                )}
                {tab === 'shift' && (
                    <ShiftTab />
                )}
            </div>
        </Layout>
    )
}



export default Page
