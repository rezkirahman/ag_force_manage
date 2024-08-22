import { historyCutiIzin, saldoCutiUser } from '@/api/users-management/cuti-izin'
import Container from '@/components/Container'
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import { Button, IconButton, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import { useState, useEffect, useCallback } from 'react'
import ModalDetailCutiIzin from '@/components/cuti-izin/ModalDetailCutiIzin'
import ModalFilterCutiIzinKaryawan from './ModalFilterCutiIzinKaryawan'

const CutiIzinTab = () => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [filter, setFilter] = useState({
        start: dayjs().startOf('month'),
        end: dayjs(),
        absence_type_id: 0,
        status: ""
    })
    const [openModalFilter, setOpenModalFilter] = useState(false)
    const [saldo, setSaldo] = useState(0)
    const [list, setList] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)

    const handleDetail = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await saldoCutiUser({
            unitKerja: unitKerja.id,
            id: params?.id
        })
        if (data?.data) {
            setSaldo(data?.data?.saldo)
        }
    }, [params, unitKerja])
    useEffect(() => { handleDetail() }, [handleDetail])

    const handleHistory = useCallback(async () => {
        if (!unitKerja) return
        setLoadingList(true)
        const { data } = await historyCutiIzin({
            unitKerja: unitKerja.id,
            id: params?.id,
            body: {
                start: dayjs(filter.start).format('YYYY-MM'),
                end: dayjs(filter.end).format('YYYY-MM'),
                absence_type_id: 0,
                status: ""
            }
        })
        if (data?.data) {
            setList(data?.data)
        }
        setLoadingList(false)
    }, [filter, params?.id, unitKerja])
    useEffect(() => { handleHistory() }, [handleHistory])

    return (
        <Container>
            <ModalFilterCutiIzinKaryawan
                open={openModalFilter}
                setOpen={setOpenModalFilter}
                filter={filter}
                setFilter={setFilter}
            />
            <ModalDetailCutiIzin
                open={openModalDetail}
                setOpen={setOpenModalDetail}
                data={selectedList}
                id={selectedList?.id}
            />
            <div className='space-y-6 min-h-[400px]'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        <h3 className='text-base font-semibold'>Saldo Cuti</h3>
                        <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary'>
                            <h3 className='text-xs font-semibold leading-none'>{saldo} Hari</h3>
                        </div>
                    </div>
                    <Button
                        size='medium'
                        variant='contained'
                        onClick={() => setOpenModalFilter(true)}
                        startIcon={<Icon icon="hugeicons:filter-horizontal" />}
                    >
                        Filter
                    </Button>
                </div>
                <Table list={list} loading={loadingList}>
                    <TableHead>
                        <HeadRow className={'uppercase align-top'}>
                            <HeadItem start>Tanggal</HeadItem>
                            <HeadItem>Kategori</HeadItem>
                            <HeadItem>Status</HeadItem>
                            <HeadItem>Pengurangan Saldo Cuti</HeadItem>
                            <HeadItem end>Aksi</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {list?.map((item, i) => (
                            <BodyRow key={i} className={'align-top'}>
                                <BodyItem start>{item.date}</BodyItem>
                                <BodyItem>{item.type}</BodyItem>
                                <BodyItem>{item.status}</BodyItem>
                                <BodyItem>{item.cut_saldo}</BodyItem>
                                <BodyItem end>
                                    <Tooltip title='Detail' arrow>
                                        <IconButton
                                            size='small'
                                            color='inherit'
                                            onClick={() => {
                                                setSelectedList(item)
                                                setOpenModalDetail(true)
                                            }}
                                        >
                                            <Icon icon={'solar:document-line-duotone'} />
                                        </IconButton>
                                    </Tooltip>
                                </BodyItem>
                            </BodyRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Container>
    )
}

export default CutiIzinTab