import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react'
import dayjs from 'dayjs'

const SideBarPanicIncident = ({ user, handleClick }) => {
    const [open, setOpen] = useState(true)
    return (
        <div className={`fixed top-0 right-6 z-20 h-screen pt-24 py-6 w-auto transition-all duration-500 ${open ? 'translate-x-0 pl-6 md:pl-0' : 'translate-x-full'}`}>
            <div className={`relative bg-white rounded-2xl whitespace-nowrap shadow-container h-full w-[86vw] md:w-[50vw] lg:w-[500px]`}>
                <div className="absolute inset-y-0 flex items-center -left-5">
                    <IconButton
                        color="inherit"
                        onClick={() => setOpen(!open)}
                        variant="contained"
                        className="bg-white ring-2 ring-gray-200 hover:bg-gray-100"
                    >
                        <Icon icon="iconamoon:arrow-left-2-bold" className={`duration-500 ${open ? 'rotate-180' : 'rotate-0'}`} />
                    </IconButton>
                </div>
                <div className="flex flex-col h-full gap-6 px-6 py-3">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold">Panic & Incident</h3>
                        {user?.length > 0 && (
                            <div className='flex items-center gap-1 px-4 py-2 text-red-800 rounded-full bg-red-800/10 ring-1 ring-inset ring-red-800 w-fit'>
                                <Icon icon={'tabler:alert-triangle-filled'} />
                                <h3 className='text-xs font-semibold'>{user?.length}</h3>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col pr-2 overflow-y-auto divide-y grow">
                        {user?.map(item => {
                            const milliseconds = (item?.TanggalDibuat?.seconds * 1000) + (item?.TanggalDibuat?.nanoseconds / 1000000);
                            return {
                                ...item,
                                milliseconds,
                                formattedDate: dayjs(milliseconds).format('DD/MM/YYYY HH:mm')
                            };
                        }).sort((a, b) => b.milliseconds - a.milliseconds).map((item, i) => (
                            <div
                                key={i}
                                className="space-y-3 rounded-lg cursor-pointer md:p-2 hover:bg-gray-100"
                                onClick={() => handleClick(item, 0.002)}
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2">
                                        <div className='flex items-center w-full gap-2'>
                                            <Image
                                                src={item.User.Photo}
                                                alt='profile'
                                                className="flex-shrink-0 object-cover object-top w-10 h-10 rounded-full"
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                            <div className=''>
                                                <h3 className="font-medium text-wrap line-clamp-1">{item.User.Fullname}</h3>
                                                <h3 className='text-red-800'>{item.Category.Name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="col-span-1 text-right truncate">{item.formattedDate}</h3>
                                </div>
                                <h3 className='truncate'>{item.Description}</h3>
                            </div>
                        ))}
                        {user?.length === 0 && (<h3 className="text-center">Tidak ada data</h3>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBarPanicIncident