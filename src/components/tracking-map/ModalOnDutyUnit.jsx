import { useCallback, useEffect, useState } from 'react'
import ModalLayout from '../ModalLayout'
import { useAppContext } from '@/context'
import { listUnitBussiness } from '@/api/tracking/tracking-map'
import { IconButton, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import 'dayjs/locale/id'

const ModalOnDutyUnit = ({ open, setOpen, user }) => {
    const { unitKerja } = useAppContext()
    const [listUnitKerja, setListUnitKerja] = useState([])
    const [listUnit, setListUnit] = useState([])

    const handleListUnitKerja = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await listUnitBussiness({
            unitKerja: unitKerja.id
        })
        if (data?.data) {
            setListUnitKerja(data?.data)
        }
    }, [unitKerja])

    const handleGetFormatCopy = () => {
        dayjs.locale('id')
        const greeting = () => {
            const hour = dayjs().hour()
            if (hour >= 5 && hour < 12) return 'Selamat Pagi Pak'
            if (hour >= 12 && hour < 15) return 'Selamat Siang Pak'
            if (hour >= 15 && hour < 18) return 'Selamat Sore Pak'
            return 'Selamat Malam Pak'
        }
        const line = '—————————————————'
        const date = `Report On Duty AGF \n _${dayjs().add(1,'month').format('DD MMMM YYYY')} jam ${dayjs().format('HH:mm')}_`
        const report = listUnit.map((item) => (
            `${item.name} (${item.code}) \n • On Duty ${item?.total_onduty} dari ${item.total_user} Personil (${((item?.total_onduty / item?.total_user) * 100).toFixed(1).replace(/\.0$/, '')}%)`
        )).join('\n')
        const closeTag = 'Terima Kasih \n Tim AGF'
        const fullReport = `${greeting()} \n ${date} \n ${line} \n ${report} \n ${line} \n ${closeTag}`
        navigator.clipboard.writeText(fullReport)
    }

    useEffect(() => {
        if (open) {
            handleListUnitKerja()
        }
    }, [handleListUnitKerja, open])

    useEffect(() => {
        if (open, listUnitKerja) {
            const unit = listUnitKerja
            const list = unit.map((item) => ({
                id: item?.unit_id,
                name: item?.unit_nama,
                total_user: item?.unit_users_count,
                total_onduty: user?.filter((user) => item.unit_id.includes(user?.UnitKerja?.Id)).length,
                code: item?.code
            }))
            const sortList = list.sort((a, b) => (b.total_onduty / b.total_user) - (a.total_onduty / a.total_user))
            setListUnit(sortList)
        }
    }, [listUnitKerja, open, user])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            onClose={() => setOpen(false)}
            title={'On Duty Unit'}
        >
            <div className='flex justify-end'>
                <Tooltip title='Copy' arrow>
                    <IconButton
                        size='large'
                        onClick={handleGetFormatCopy}
                    >
                        <Icon icon='fluent:copy-16-regular' />
                    </IconButton>
                </Tooltip>
            </div>
            <div className="h-[50vh] overflow-y-auto pr-2 text-sm">
                {listUnit?.map((item, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 py-2 hover:bg-slate-100 rounded-md px-1">
                        <div className="col-span-2">
                            <h3 className='font-medium'>{item.name} ({item.code})</h3>
                        </div>
                        <div className="col-span-1">
                            <h3 className="text-right">{`${item.total_onduty}/${item.total_user} (${((item?.total_onduty / item?.total_user) * 100).toFixed(1).replace(/\.0$/, '')}%)`}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </ModalLayout>
    )
}

export default ModalOnDutyUnit