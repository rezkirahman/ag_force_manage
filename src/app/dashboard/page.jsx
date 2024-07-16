'use client'
import { dashboardChartActivity, dashboardChartDuty } from '@/api/dashboard/dashboard';
import Container from '@/components/Container';
import Layout from '@/components/Layout';
import DashboardCarousel from '@/components/dashboard/DashboardCarousel';
import DashboardChart from '@/components/dashboard/dashboardChart';
import { useAppContext } from '@/context';
import React, { useCallback, useEffect, useState } from 'react'

const Dashboard = () => {
    const { unitKerja } = useAppContext()
    const label = ['2 jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan']
    const data = [120, 80, 30, 40, 120, 60, 70, 80]
    const [dutyLast, setDutyLast] = useState()
    const [dutyMonthly, setDutyMonthly] = useState()
    const [activityLast, setActivityLast] = useState()
    const [activityMonthly, setActivityMonthly] = useState()

    const getStatisticDuty = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await dashboardChartDuty(unitKerja.id)
        if (data?.data) {
            setDutyLast({
                total: data.data.duty_last.map(item => item.total_duty).reverse(),
                label: data.data.duty_last.map(item => item.day).reverse(),
            })
            setDutyMonthly({
                total: data.data.duty_monthly.map(item => item.total_duty).reverse(),
                label: data.data.duty_monthly.map(item => item.day).reverse(),
            })
        }
    }, [unitKerja])

    const getStatisticActivity = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await dashboardChartActivity(unitKerja.id)
        if (data?.data) {
            setActivityLast({
                total: data.data.duty_last.map(item => item.total_activity).reverse(),
                label: data.data.duty_last.map(item => item.day).reverse(),
            })
            setActivityMonthly({
                total: data.data.duty_monthly.map(item => item.total_activity).reverse(),
                label: data.data.duty_monthly.map(item => item.day).reverse(),
            })
        }
    }, [unitKerja])

    useEffect(() => {
        getStatisticDuty()
    }, [getStatisticDuty])

    useEffect(() => {
        getStatisticActivity()
    }, [getStatisticActivity])

    return (
        <Layout>
                <DashboardCarousel />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Container>
                    <div className='w-full space-y-3'>
                        <h3 className='font-semibold'>On Duty</h3>
                        <DashboardChart
                            data={dutyLast?.total}
                            label={dutyLast?.label}
                            color='rgba(29, 28, 227, 1)'
                        />
                    </div>
                </Container>
                <Container>
                    <div className='w-full space-y-3'>
                        <h3 className='font-semibold'>Duty Monthly</h3>
                        <DashboardChart
                            data={dutyMonthly?.total}
                            label={dutyMonthly?.label}
                            color='rgba(227, 129, 28, 1)'
                        />
                    </div>
                </Container>
                <Container>
                    <div className='w-full space-y-3'>
                        <h3 className='font-semibold'>Jurnal Activity</h3>
                        <DashboardChart
                            data={activityLast?.total}
                            label={activityLast?.label}
                            color='rgba(150, 28, 227, 1)'
                        />
                    </div>
                </Container>
                <Container>
                    <div className='w-full space-y-3'>
                        <h3 className='font-semibold'>Jurnal Activity Monthly</h3>
                        <DashboardChart
                            data={activityMonthly?.total}
                            label={activityMonthly?.label}
                            color='rgba(24, 126, 13, 1)'
                        />
                    </div>
                </Container>
            </div>
        </Layout>
    )
}

export default Dashboard