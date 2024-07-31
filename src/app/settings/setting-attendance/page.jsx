'use client'
import Layout from "@/components/Layout"
import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import GroupTab from "@/components/settings/attendance/GroupTab"
import LocationTab from "@/components/settings/attendance/LocationTab"

const Page = () => {
    const [tab, setTab] = useState('location')

    return (
        <Layout>
            <div className='sticky top-0 z-20 p-4 bg-white rounded-2xl shadow-container'>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label='Lokasi' value={'location'} />
                    <Tab label='Group' value={'group'} />
                </Tabs>
            </div>
            <div>
                {tab === 'location' && (
                    <LocationTab />
                )}
                {tab === 'group' && (
                    <GroupTab />
                )}
            </div>
        </Layout>
    )
}

export default Page
