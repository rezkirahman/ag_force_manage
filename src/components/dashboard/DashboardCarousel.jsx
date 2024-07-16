import { dashboardHeader } from '@/api/dashboard/dashboard'
import { useAppContext } from '@/context'
import NumberTicker from '@/helper/NumberTicker'
import { adjustAlphaColor } from '@/helper/adjustAlphaColor'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const responsive = {
    '2xl': {
        breakpoint: { max: 4000, min: 1536 },
        items: 4
    },
    'xl': {
        breakpoint: { max: 1536, min: 1280 },
        items: 4
    },
    'lg': {
        breakpoint: { max: 1280, min: 1024 },
        items: 3
    },
    'md': {
        breakpoint: { max: 1024, min: 768 },
        items: 2
    },
    'sm': {
        breakpoint: { max: 768, min: 640 },
        items: 2
    },
    'xs': {
        breakpoint: { max: 640, min: 0 },
        items: 1
    }
}

const CarouselCard = ({ title, color, icon, total, description, url='' }) => {
    return (
        <Link href={url}>
            <div  className='duration-200 bg-white rounded-2xl hover:bg-gray-100 hover:translate-y-1 shadow-container'>
            <div
                className='p-4 bg-white rounded-2xl md:aspect-[4/3] cursor-pointer flex flex-col items-start justify-between gap-2'
                style={{ color: color, backgroundColor: adjustAlphaColor(color, 0.1) }}
            >
                <h3 className='text-xl font-semibold'>{title}</h3>
                <div className='flex items-center justify-start gap-2 text-4xl'>
                    <div className='p-3 text-white rounded-full' style={{ backgroundColor: color }}>
                        <Icon icon={icon} className='text-3xl' />
                    </div>
                    <p className='font-bold '>{total ? <NumberTicker value={total} /> : total}</p>
                </div>
                <div className='px-3 py-1 rounded-full' style={{ backgroundColor: adjustAlphaColor(color, 0.5) }}>
                    <h3 className='text-xs font-medium text-white'>{description}</h3>
                </div>
            </div>
            </div>
        </Link>
    )
}

const DashboardCarousel = () => {
    const { unitKerja } = useAppContext()
    const [data, setData] = useState()

    const getDashboardData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await dashboardHeader(unitKerja.id)
        if (data?.data) {
            setData(data.data)
        }
    }, [unitKerja])

    useEffect(() => {
        getDashboardData()
    }, [getDashboardData])

    return (
        <div className='z-10 grid grid-cols-1 transition-all select-none'>
            <Carousel responsive={responsive} itemClass='py-2 px-3'>
                <CarouselCard
                    color={'rgba(29, 28, 227, 1)'}
                    icon={'mage:users-fill'}
                    title={'Total User'}
                    total={data?.total_users?.total_users}
                    description={'All'}
                    url={'/users-management'}
                />
                <CarouselCard
                    color={'rgba(227, 129, 28, 1)'}
                    icon={'clarity:power-solid'}
                    title={'ON Duty'}
                    total={data?.duty?.total_duty_today}
                    description={'Today'}
                    url={'/tracking-map'}
                />
                <CarouselCard
                    color={'rgba(150, 28, 227, 1)'}
                    icon={'fluent:clipboard-note-16-filled'}
                    title={'Activity Report'}
                    total={data?.activity?.total_activity_today}
                    description={'Today'}
                    url={'/journal-activity'}
                />
                <CarouselCard
                    color={'rgba(227, 28, 28, 1)'}
                    icon={'jam:triangle-danger-f'}
                    title={'Incident Report'}
                    total={data?.incident?.total_incident_today}
                    description={'Today'}
                    url={'/incident-report'}
                />
            </Carousel>
        </div>
    )
}

export default DashboardCarousel