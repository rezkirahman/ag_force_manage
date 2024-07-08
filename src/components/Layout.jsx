"use client"
import Navbar from './Navbar'
import Header from './Header'
import { ThemeProvider } from '@mui/material'
import Transition from './transition'
import { getMe } from '@/api/getMe'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context'
import { useCallback, useEffect } from 'react'
import { theme } from '@/config/materialui-config'
import SnackbarNotification from './SnackbarNotification'

const Layout = ({ children, disablePageScrolling = false }) => {
    const router = useRouter()
    const { setUser} = useAppContext()

    const handleGetMe = useCallback(async () => {
        const response = await getMe()
        if (response?.data?.data) {
            setUser(response?.data?.data)
        } else {
            router.push('/')
        }
    }, [setUser, router])

    useEffect(() => {
        handleGetMe()
    }, [handleGetMe])

    return (
        <ThemeProvider theme={theme}>
            <div className='flex items-start w-full min-h-screen text-sm text-gray-600 lg:gap-6 bg-primary/5 scroll-smooth'>
                <Navbar />
                <div className={`w-full p-2 md:p-6 flex flex-col gap-3 md:gap-6 ${disablePageScrolling && 'h-screen'} container mx-auto`}>
                    <Header />
                    <Transition>
                        <div className='flex flex-col w-full gap-3 md:gap-6'>
                            {children}
                        </div>
                    </Transition>
                </div>
                <SnackbarNotification />
            </div>
        </ThemeProvider>
    )
}

export default Layout