'use client'
import Layout from '@/components/Layout'
import {useState } from 'react'
import OperasionalTab from '@/components/manage-attendance/operational/OperasionalTab'
import { Tab, Tabs } from '@mui/material'

const Page = () => {
    const [tab, setTab] = useState('Operasional')
    return (
        <Layout>
            <div className='sticky top-0 z-20 p-4 bg-white rounded-2xl shadow-container'>
                <Tabs
                    value={tab}
                    onChange={(e, v) => setTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                >
                    <Tab label='Operasional' value={'Operasional'} />
                    <Tab label='Shift' value={'Shift'} />
                    <Tab label='Piket' value={'Piket'} />
                </Tabs>
            </div>
            <div className=''>
                {tab === 'Operasional' && (
                    <OperasionalTab />
                )}
            </div>

        </Layout>
    )
}

export default Page