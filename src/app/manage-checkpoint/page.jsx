'use client'
import Container from '@/components/Container'
import Layout from '@/components/Layout'
import CheckpointLocation from '@/components/manage-checkpoint/CheckpointLocation'
import CheckpointRiwayat from '@/components/manage-checkpoint/CheckpointRiwayat'
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { useState } from 'react'

const Page = () => {
    const { unitKerja } = useAppContext()
    const [date, setDate] = useState(dayjs())

    return (
        <Layout>
            <CheckpointLocation />
            <CheckpointRiwayat />
        </Layout>
    )
}

export default Page

