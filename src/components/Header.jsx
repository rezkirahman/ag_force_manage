"use client"
import { Icon } from '@iconify/react'
import { Button, Drawer, IconButton, Menu, Tooltip } from '@mui/material'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import { MobileNavbar } from './Navbar'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/api/auth'
import { useAppContext } from '@/context'
import nookies from 'nookies'
import ModalChangePIN from './ModalChangePIN'

const Header = ({ isMenuButton = false }) => {
    const { user } = useAppContext()
    const [anchorElProfile, setAnchorElProfile] = useState(null)
    const openProfile = Boolean(anchorElProfile);
    const [anchorElNotification, setAnchorElNotification] = useState(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const openNotification = Boolean(anchorElNotification);
    const image = user?.photo
    const name = user?.full_name
    const role = user?.is_command_center ? 'Super Admin' : 'Admin'
    const pathname = usePathname()

    return (
        <div className='sticky top-0 z-20 w-full px-2 py-2 bg-white md:px-6 rounded-2xl shadow-container'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    <div className={isMenuButton ? 'not-sr-only' : 'not-sr-only lg:sr-only'}>
                        <IconButton
                            onClick={() => setOpenDrawer(!openDrawer)}
                        >
                            <Icon icon='heroicons-solid:menu-alt-2' className='text-2xl' />
                        </IconButton>
                    </div>
                    <IconButton
                        onClick={(event) => setAnchorElNotification(event.currentTarget)}
                    >
                        <Icon icon='ph:bell-bold' className='text-2xl' />
                    </IconButton>
                    <MenuNotification
                        anchorEl={anchorElNotification}
                        open={openNotification}
                        setAnchorEl={setAnchorElNotification}
                        name={name}
                        photo={image}
                    />
                </div>
                <Button
                    onClick={(event) => setAnchorElProfile(event.currentTarget)}
                >
                    <div className='flex items-center gap-2 normal-case'>
                        <h3 className='text-gray-600'>{name?.split(' ').slice(0, 2).join(' ')}</h3>
                        <Image
                            src={image || 'https://pai.agforce.co.id/assets/user/f35dca8d2f0a4bf6a0da0fc1a113f71d.png'}
                            width={100}
                            height={100}
                            alt='profile'
                            className='object-cover object-top w-10 h-10 bg-gray-200 rounded-full'
                        />
                    </div>
                </Button>
                <MenuProfile
                    anchorEl={anchorElProfile}
                    open={openProfile}
                    setAnchorEl={setAnchorElProfile}
                    name={name}
                    photo={image}
                    role={role}
                />
            </div>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <MobileNavbar />
            </Drawer>
        </div>
    )
}

export default Header

const MenuProfile = ({ anchorEl, open, setAnchorEl, name, photo, role }) => {
    const [openModalChangePIN, setOpenModalChangePIN] = useState(false)
    const router = useRouter()

    const handleSignOut = useCallback(async () => {
        nookies.destroy(null, 'access_token')
        localStorage.clear()
        router.push('/')
        const response = await signOut()
    }, [router])

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                className: 'menu w-72 mt-2 p-4'
            }}
        >
            <ModalChangePIN
                open={openModalChangePIN}
                setOpen={setOpenModalChangePIN}
            />
            <div className='space-y-6 text-gray-600'>
                <div className='flex items-center justify-between gap-4'>
                    <h3 className='text-base font-semibold'>Profil Pengguna</h3>
                    <Tooltip arrow title="Ubah PIN">
                        <IconButton
                            className='bg-primary/10 hover:bg-primary/20'
                            color='primary'
                            onClick={() => setOpenModalChangePIN(true)}
                        >
                            <Icon icon='icon-park-twotone:key-one' className='text-lg' />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className='flex items-center gap-3'>
                    <Image
                        src={photo || 'https://pai.agforce.co.id/assets/user/f35dca8d2f0a4bf6a0da0fc1a113f71d.png'}
                        width={400}
                        height={400}
                        alt='profile'
                        className='object-cover object-top w-16 h-16 bg-gray-200 rounded-full md:w-24 md:h-24 aspect-square'
                    />
                    <div className='space-y-1 text-sm'>
                        <h3 className='font-semibold'>{name}</h3>
                        <div className='px-3 py-1 text-blue-800 bg-blue-100 rounded-full w-fit'>
                            <h3 className='text-xs font-medium'>{role}</h3>
                        </div>
                    </div>
                </div>
                <hr />
                <Button
                    variant='contained'
                    className='bg-primary'
                    size='large'
                    fullWidth
                    onClick={handleSignOut}
                >
                    Logout
                </Button>
            </div>
        </Menu>
    )
}
const MenuNotification = ({ anchorEl, open, setAnchorEl }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            PaperProps={{
                className: 'menu p-4 w-72 mt-2 p-4'
            }}
        >
            <div className='space-y-4 text-gray-600'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-base font-semibold'>Notifikasi</h3>
                    <div className='px-3 py-2 rounded-full bg-primary'>
                        <h3 className='leading-none text-[10px] text-white'>0 baru</h3>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-3'>
                    <h3 className='text-sm'>Tidak ada notifikasi</h3>
                </div>
                <hr />
                <Button
                    // variant='outlined'
                    className=''
                    fullWidth
                >
                    Lihat Semua
                </Button>
            </div>
        </Menu>
    )
}