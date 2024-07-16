'use client'
import Layout from '@/components/Layout'
import { useState } from 'react'
import { Tab, Tabs } from '@mui/material'
import KaryawanTab from '@/components/users-management/KaryawanTab'
import KaryawabDiblokirTab from '@/components/users-management/KaryawabDiblokirTab'
import KaryawanDIhapusTab from '@/components/users-management/KaryawanDIhapusTab'

const Page = () => {
    const [tab, setTab] = useState('karyawan')

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
                    <Tab label='Karyawan' value={'karyawan'} />
                    <Tab label='Diblokir' value={'diblokir'} />
                    <Tab label='Dihapus' value={'dihapus'} />
                </Tabs>
            </div>
            <div className=''>
                {tab === 'karyawan' && (
                    <KaryawanTab />
                )}
                {tab === 'diblokir' && (
                    <KaryawabDiblokirTab />
                )}
                {tab === 'dihapus' && (
                    <KaryawanDIhapusTab />
                )}
            </div>
        </Layout>
    )
}

export default Page