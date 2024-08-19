import { useState, useEffect, useCallback } from 'react'
import ModalLayout from '../ModalLayout'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import { isImageLink } from '@/helper/imageLinkChecker'
import PhotoView from '../PhotoView'
import ImageView from '../ImageView'


const ModalDetailJournal = ({ open, setOpen, user }) => {

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Detail Jurnal'}
            onClose={() => setOpen(false)}
        >
            <div className='space-y-3'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        <Image
                            src={user?.user_photo || 'defaultProfile.png'}
                            alt='profile'
                            width={100}
                            height={100}
                            priority
                            className='w-12 h-12 rounded-full'
                        />
                        <div>
                            <h3 className='font-semibold'>{user?.full_name}</h3>
                            <h3>{user?.role_name}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary w-fit'>
                        <Icon icon='uim:clock' className='' />
                        <h3 className='text-xs font-medium leading-snug'>{user?.date}</h3>
                    </div>
                </div>
                <hr />
                <div className='h-[50vh] overflow-y-auto space-y-3'>
                    <div className='flex items-center justify-between gap-3'>
                        <div className='p-2 rounded-lg bg-slate-200 w-fit'>
                            <h3 className='font-medium'>{user?.is_plan ? 'rencana' : 'realisasi'}</h3>
                        </div>
                        <ApprovalChip status={user?.approval_status} />
                    </div>
                    <div className='flex flex-wrap-reverse items-end justify-between gap-3'>
                        <h3 className='text-xs grow'>{user?.content}</h3>
                        {user?.picture && (
                            <div className='w-16 h-16 aspect-square'>
                                <ImageView photo={user?.picture} />
                            </div>
                        )}
                    </div>
                    {(user?.approval_status && user?.approval_photo && user?.approval_photo) &&
                        <div className='space-y-1'>
                            <h3 className='font-semibold'>Persetujuan</h3>
                            <div className={`bg-slate-100 p-2 rounded-xl space-y-4`}>
                                <div className='flex items-center gap-2 text-xs'>
                                    <div className='w-10 h-10 aspect-square'>
                                        <PhotoView photo={user?.approval_photo} />
                                    </div>
                                    <h3 className='font-semibold'>{user?.approval_full_name}</h3>
                                </div>
                                {user.approval_reason && (
                                    <h3 className='text-xs'>{user.approval_reason}</h3>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </ModalLayout>
    )
}

export default ModalDetailJournal

const ApprovalContainer = ({ status, children }) => {
    return (
        <div className={`bg-slate-100 p-2 rounded-xl space-y-4`}>
            {children}
        </div>
    )
}

const ApprovalChip = ({ status }) => {
    const bgColor = status === 1 ? 'bg-green-700' : status === 2 ? 'bg-red-700' : 'bg-gray-700'
    return (
        <div className={`${bgColor} p-2 text-white w-fit rounded-lg`}>
            <h3 className='text-xs font-medium'>{status == 1 ? 'Disetujui' : status == 2 ? 'Ditolak' : 'Menunggu'}</h3>
        </div>
    )
}