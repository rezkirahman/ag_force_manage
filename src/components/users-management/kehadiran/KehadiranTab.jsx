import Container from '@/components/Container'
import { Icon } from '@iconify/react'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import { Button, IconButton, Pagination, Tooltip } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useAppContext } from '@/context'
import ImageView from '@/components/ImageView'
import { detailAttendance } from '@/api/attendance/attendance'
import { useParams } from 'next/navigation'
import { isImageLink } from '@/helper/imageLinkChecker'
import ModalFilterKehadiran from './ModalFilterKehadiran'

const KehadiranTab = () => {
    const { unitKerja } = useAppContext()
    const params = useParams()
    const [filter, setFilter] = useState({
        starDate: dayjs().startOf('month'),
        endDate: dayjs(),
        location: 0,
        status: 0,
    })
    const [list, setList] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [openModalFilter, setOpenModalFilter] = useState(false)

    const handleList = useCallback(async () => {
        if (!unitKerja) return
        setList([])
        setLoadingList(true)
        const body = {
            checkin: filter.starDate.format('YYYY-MM-DD'),
            checkout: filter.endDate.format('YYYY-MM-DD'),
            location_id: filter?.location?.location_id || 0,
            status_checkin: filter.status,
            paginate: {
                limit: 10,
                page: page
            }
        }
        const { data } = await detailAttendance({
            unitKerja: unitKerja.id,
            id: params.id,
            body: body
        })
        if (data?.data) {
            setList(data.data)
            setPage(data?.pagination?.current_page)
            setTotalPage(data?.pagination?.total_pages)
        }
        setLoadingList(false)
    }, [unitKerja, filter, params, page])

    useEffect(() => {
        handleList()
    }, [handleList])

    useEffect(() => {
        setPage(1)
    }, [filter])

    return (
        <Container>
            <ModalFilterKehadiran
                open={openModalFilter}
                setOpen={setOpenModalFilter}
                filter={filter}
                setFilter={setFilter}
            />
            <div className='space-y-6 min-h-[400px]'>
                <div className='flex items-start justify-between gap-3'>
                    <h3 className='text-base font-semibold'>Kehadiran</h3>
                    <Button
                        size='medium'
                        variant='contained'
                        onClick={() => setOpenModalFilter(true)}
                        startIcon={<Icon icon="hugeicons:filter-horizontal" />}
                    >
                        Filter
                    </Button>
                </div>
                <div className='flex flex-col justify-between h-full gap-6'>
                    <Table list={list} loading={loadingList} className={'h-[300px]'}>
                        <TableHead>
                            <HeadRow className={'align-top'}>
                                <HeadItem start>Tanggal</HeadItem>
                                <HeadItem>Waktu</HeadItem>
                                <HeadItem>Durasi</HeadItem>
                                <HeadItem>Status</HeadItem>
                                <HeadItem>Keterangan</HeadItem>
                                <HeadItem end>Foto</HeadItem>
                            </HeadRow>
                        </TableHead>
                        <TableBody>
                            {list?.map((item, i) => (
                                <BodyRow key={i} className={'align-top'}>
                                    <BodyItem start>{item.date}</BodyItem>
                                    <BodyItem >{`${item.check_in_at} - ${item.check_out_at}`}</BodyItem>
                                    <BodyItem>{item.duration}</BodyItem>
                                    <BodyItem>
                                        <GetStatus status={item.status_check_in} />
                                    </BodyItem>
                                    <BodyItem>
                                        <Tooltip title={item.description} arrow>
                                            <h3 className='line-clamp-2'>{item.reason || '-'}</h3>
                                        </Tooltip>
                                    </BodyItem>
                                    <BodyItem end>
                                        {isImageLink(item.picture) ?
                                            <div className='w-10 h-10'>
                                                <ImageView photo={item.picture} />
                                            </div>
                                            : '-'
                                        }
                                    </BodyItem>
                                </BodyRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination
                        page={page}
                        count={totalPage}
                        onChange={(e, value) => setPage(value)}
                        color='primary'
                        size='small'
                        className='mx-auto w-fit'
                        disabled={loadingList}
                    />
                </div>
            </div>
        </Container>
    )
}

export default KehadiranTab

const GetStatus = ({ status }) => {
    const bgColor = (status) => {
        switch (status) {
            case "Terlambat":
                return "bg-red-100"
            case "Tepat Waktu":
                return "bg-green-100"
            default:
                return "bg-white"
        }
    }

    return (
        <div className={`px-2 py-1 rounded-full ${bgColor(status)} w-fit`}>
            <h3 className={`text-[10px] font-semibold ${status == "Terlambat" ? 'text-red-800' : (status == 'Tepat Waktu' ? 'text-green-800' : '')}`}>{status}</h3>

        </div>
    )
}