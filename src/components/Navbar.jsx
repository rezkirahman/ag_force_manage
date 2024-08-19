"use client"
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import { Button, Select, MenuItem, FormControl, InputLabel, Autocomplete, TextField } from '@mui/material'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { getMeRole } from '@/api/getMe'
import { setCookie } from 'nookies'

let globalMenu = []

const Navbar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { unitKerja, setUnitKerja, suggestUnitKerja } = useAppContext()
    const [menu, setMenu] = useState([])
    const [openSetting, setOpenSetting] = useState(false)

    const getMenu = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getMeRole(unitKerja.id)
        if (data?.data) {
            globalMenu = data?.data?.role?.features
            setMenu(data?.data?.role?.features)
        } else {
            globalMenu = []
            setMenu([])
        }
    }, [unitKerja])

    useEffect(() => {
        const currentMenu = menu.find(item => pathname.includes(item.route));
        if (currentMenu) {
            document.title = `${currentMenu.feature_name} - AG Force`
        }
    }, [menu, pathname])

    useEffect(() => {
        const localUnitKerja = localStorage.getItem('unit-kerja-unique')
        if (suggestUnitKerja) {
            if (localUnitKerja) {
                suggestUnitKerja.forEach(element => {
                    if (element.unique == localUnitKerja) {
                        setUnitKerja(element)
                        localStorage.setItem('unit-kerja-unique', element.unique)
                    }
                })
            } else {
                suggestUnitKerja.forEach(element => {
                    if (element.selected) {
                        setUnitKerja(element)
                        localStorage.setItem('unit-kerja-unique', element.unique)
                    }
                })
            }
        }
    }, [setUnitKerja, suggestUnitKerja, unitKerja])

    useEffect(() => {
        const isSettingExpand = pathname.includes('/settings')
        setOpenSetting(isSettingExpand)
    }, [pathname])

    useEffect(() => {
        getMenu()
    }, [getMenu])

    return (
        <div className='sticky top-0 z-10 w-0 h-screen gap-6 py-6 lg:w-96 lg:pl-6 overflow-clip'>
            <div className='flex flex-col h-full gap-4 pr-2 bg-white rounded-2xl overflow-clip shadow-container'>
                <div className='w-full px-8 pt-8 pb-4'>
                    <Image
                        priority
                        alt='logo'
                        src={'/logo.png'}
                        width={500}
                        height={500}
                        className='w-full'
                    />
                </div>
                <div className='px-4'>
                    {(suggestUnitKerja && unitKerja) &&
                        <Autocomplete
                            disableClearable
                            disablePortal
                            value={unitKerja}
                            onChange={(e, value) => {
                                setUnitKerja(value)
                                localStorage.setItem('unit-kerja-unique', value.unique)
                            }}
                            options={suggestUnitKerja}
                            isOptionEqualToValue={(option, value) => option?.unique === value?.unique}
                            getOptionLabel={(option) => option?.name}
                            renderInput={(params) => <TextField {...params} label="Unit Kerja" />}
                        />
                    }
                </div>
                <div className='grow pr-2 space-y-[2px] overflow-y-auto  my-2 mr-2'>
                    {menu.map((item, index) => (
                        <div key={index} className='group/button'>
                            <Button
                                onClick={() => item.is_expand ? setOpenSetting((prev) => !prev) : router.push(item.route)}
                                className={`w-full justify-start group relative flex items-center p-4 cursor-pointer rounded-r-full text-left ${pathname.includes(item.route) ? 'bg-primary/10 font-semibold text-primary hover:bg-transparent' : 'text-gray-600 font-normal'}`}
                            >
                                {!pathname.includes(item.route) &&
                                    < div className={`absolute inset-0 w-0 transition-all duration-500 ease-in-out rounded-r-full opacity-0 bg-primary/10 group-hover/button:w-full group-hover/button:opacity-100`}></div>
                                }
                                <div className='flex items-center justify-between w-full gap-4'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-5 h-5'>
                                            <Icon icon={item.icon} className='z-10 text-xl ' />
                                        </div>
                                        <div className='text-nowrap'>
                                            {item.feature_name}
                                        </div>
                                    </div>
                                    {item.is_expand &&
                                        <Icon icon='akar-icons:chevron-up' className={`text-base ${openSetting ? 'rotate-180' : 'rotate-0'} duration-200`} />
                                    }
                                </div>
                            </Button>
                            {item.is_expand &&
                                <SettingMenu
                                    icon={item.icon}
                                    name={item.feature_name}
                                    open={openSetting}
                                    setOpen={setOpenSetting}
                                />
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Navbar

export const MobileNavbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { unitKerja, setUnitKerja, suggestUnitKerja } = useAppContext()
    const [openSetting, setOpenSetting] = useState(false)

    useEffect(() => {
        if (suggestUnitKerja) {
            if (!unitKerja) {
                setUnitKerja(suggestUnitKerja[0])
            }
        }
    }, [setUnitKerja, suggestUnitKerja, unitKerja])

    useEffect(() => {
        const isSettingExpand = pathname.includes('/settings')
        setOpenSetting(isSettingExpand)
    }, [pathname])

    return (
        <div className='flex flex-col h-full text-gray-500 bg-white w-60 overflow-clip shadow-container'>
            <div className='w-full px-8 py-4'>
                <Image
                    alt='logo'
                    src={'/logo.png'}
                    width={500}
                    height={500}
                    className='w-full'
                />
            </div>
            <div className='px-3'>
                {(suggestUnitKerja && unitKerja) &&
                    <Autocomplete
                        disableClearable
                        disablePortal
                        value={unitKerja}
                        onChange={(e, value) => {
                            setUnitKerja(value)
                            localStorage.setItem('unit-kerja-unique', value.unique)
                        }}
                        options={suggestUnitKerja}
                        isOptionEqualToValue={(option, value) => option?.unique === value?.unique}
                        getOptionLabel={(option) => option?.name}
                        renderInput={(params) => <TextField {...params} label="Unit Kerja" />}
                    />
                }
            </div>
            <div className='grow pr-2 space-y-[2px] overflow-y-auto  my-2 mr-2 text-sm'>
                {globalMenu.map((item, index) => (
                    <div key={index}>
                        <div
                            onClick={() => item.is_expand ? setOpenSetting((prev) => !prev) : router.push(item.route)}
                            className={`group relative p-4 cursor-pointer rounded-r-full ${pathname.includes(item.route) && 'bg-primary/20 font-semibold text-primary'}`}
                        >
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='absolute inset-0 w-0 transition-all duration-500 ease-in-out rounded-r-full opacity-0 bg-primary/20 group-hover:w-full group-hover:opacity-100'></div>
                                    <div>
                                        <Icon icon={item.icon} className='text-xl' />
                                    </div>
                                    <div className='relative z-10'>
                                        {item.feature_name}
                                    </div>
                                </div>
                                {item.is_expand &&
                                    <Icon icon='akar-icons:chevron-up' className={`text-base ${openSetting ? 'rotate-180' : 'rotate-0'} duration-200`} />
                                }
                            </div>
                        </div>
                        {item.is_expand &&
                            <SettingMenu
                                icon={item.icon}
                                name={item.feature_name}
                                open={openSetting}
                                setOpen={setOpenSetting}
                            />
                        }
                    </div>

                ))}
            </div>
        </div>
    )
}

let menuSetting = [
    {
        id: 1,
        name: "Journal Harian",
        route: "/settings/setting-journal-harian",
    },
    {
        id: 2,
        name: "Penugasan",
        route: "/settings/setting-penugasan",
    },
    {
        id: 3,
        name: "Attendance",
        route: "/settings/setting-attendance",
    },
    {
        id: 4,
        name: "Work Days & Shift",
        route: "/settings/setting-work-days-shift",
    },
]

const SettingMenu = ({ open }) => {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <div className={`${open ? 'max-h-screen pl-4 pt-2' : 'max-h-0'} relative space-y-1 overflow-clip transition-all duration-300 bg-transparent`}>
            {menuSetting.map(({ id, name, route }, index) => {
                const isActive = pathname.includes(route)
                return (
                    <div
                        key={index}
                        className={`${isActive ? 'text-gray-900' : ''} p-2 rounded-md flex items-center hover:text-gray-900 hover:font-medium duration-100 gap-3 text-sm z-20 cursor-pointer`}
                        onClick={() => router.push(route)}
                    >
                        <Icon icon="radix-icons:dot-filled" className="" />
                        <h3 className={pathname == route ? 'font-medium' : ''}>{name}</h3>
                    </div>
                );
            })}
        </div>
    )
}