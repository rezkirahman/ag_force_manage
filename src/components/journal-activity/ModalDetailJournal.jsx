import { useState, useEffect, useCallback } from 'react'
import ModalLayout from '../ModalLayout'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import ImageView from '../ImageView'
import { isImageLink } from '@/helper/imageLinkChecker'


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
                            src={user?.user_photo || 'https://pai.agforce.co.id/assets/user/f35dca8d2f0a4bf6a0da0fc1a113f71d.png'}
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
                <Table list={[1]} loading={false} className={'max-h-[40vh]'}>
                    <TableHead>
                        <HeadRow className={'uppercase align-top bg-white'}>
                            {/* <HeadItem >Waktu</HeadItem> */}
                            <HeadItem start>Kategori</HeadItem>
                            <HeadItem>Jurnal</HeadItem>
                            <HeadItem>Persetujuan</HeadItem>
                            {/* <HeadItem>Jumlah</HeadItem> */}
                            <HeadItem end>Foto</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        <BodyRow className={'align-top'}>
                            <BodyItem start>{user.ref_id}</BodyItem>
                            <BodyItem>{user.content}</BodyItem>
                            <BodyItem>

                            </BodyItem>
                            {/* <BodyItem>{user.total_activity}</BodyItem> */}
                            <BodyItem end>
                                <div className='w-12'>
                                    {isImageLink(user?.picture) ?
                                        <ImageView photo={user?.picture} /> : '-'
                                    }
                                </div>
                            </BodyItem>
                        </BodyRow>
                    </TableBody>
                </Table>
            </div>
        </ModalLayout>
    )
}

export default ModalDetailJournal