import { useCallback, useEffect, useState } from 'react'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import Container from '@/components/Container'
import { useDebounce } from 'use-debounce'
import { Button, IconButton, InputAdornment, Pagination, TextField, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useAppContext } from '@/context'
import dayjs from 'dayjs'
import ModalFilterJournal from '@/components/journal-activity/ModalFilterJournal'
import ModalDetailJournal from '@/components/journal-activity/ModalDetailJournal'
import ModalExportJournal from '@/components/journal-activity/ModalExportJournal'
import { listAttendance } from '@/api/attendance/attendance'
import ImageView from '../../ImageView'
import { isImageLink } from '@/helper/imageLinkChecker'
import ModalFilterAttendanceOperational from './ModalFilterAttendanceOperational'
import Link from 'next/link'

const OperasionalTab = () => {
    const { unitKerja } = useAppContext()
    const [filter, setFilter] = useState({
        location: 0,
        status: 0,
        date: dayjs(),
        role: null,
    })
    const [list, setList] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [openModalFilter, setOpenModalFilter] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [openModalExport, setOpenModalExport] = useState(false)
    const [selectedJournal, setSelectedJournal] = useState({})
    const [search, setSearch] = useState('')
    const [searchDebounced] = useDebounce(search, 500)
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

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

    const handleList = useCallback(async () => {
        if (!unitKerja) return
        setList([])
        setLoadingList(true)
        const body = {
            search: searchDebounced,
            role_id: filter?.role?.map((item) => parseInt(item?.value)) || [],
            location_id: parseInt(filter?.location?.location_id) || 0,
            status_checkin: filter.status,
            date: filter.date.format("YYYY-MM-DD"),
            is_shift: false,
            paginate: {
                limit: 10,
                page: page
            }
        }
        const { data } = await listAttendance({
            unitKerja: unitKerja.id,
            body: body,
        })
        if (data?.data) {
            setList(data?.data)
            setPage(data?.pagination?.current_page)
            setTotalPage(data?.pagination?.total_pages)
        }

        setLoadingList(false)
    }, [filter, searchDebounced, unitKerja, page])

    useEffect(() => {
        setPage(1)
    }, [filter, unitKerja, searchDebounced])


    useEffect(() => {
        handleList()
    }, [handleList])

    return (
        <Container>
            <ModalExportJournal
                open={openModalExport}
                setOpen={setOpenModalExport}
            />
            <ModalFilterAttendanceOperational
                open={openModalFilter}
                setOpen={setOpenModalFilter}
                filter={filter}
                setFilter={setFilter}
            />
            <ModalDetailJournal
                open={openModalDetail}
                setOpen={setOpenModalDetail}
                user={selectedJournal}
            />
            <div className='space-y-6'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                    <h3 className='text-lg font-semibold'>Operasional</h3>
                    <div className='flex items-center justify-end gap-3 grow md:grow-0'>
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            label='Pencarian'
                            className='grow'
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                            }}
                        />
                        <Button
                        size='large'
                        variant='contained'
                        color='primary'
                        onClick={() => setOpenModalFilter(true)}
                        startIcon={<Icon icon="mage:filter-fill" />}
                    >
                        Filter
                    </Button>
                        <Tooltip title='Unduh' arrow>
                            <IconButton
                                color='primary'
                                size='large'
                                className='ring-1 ring-primary'
                                onClick={() => setOpenModalExport(true)}
                            >
                                <Icon icon={'mage:file-download-fill'} className='' />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <Table list={list} loading={loadingList}>
                    <TableHead>
                        <HeadRow className={'uppercase align-top'}>
                            <HeadItem start>ID</HeadItem>
                            <HeadItem>NIK</HeadItem>
                            <HeadItem>Nama</HeadItem>
                            <HeadItem>Status</HeadItem>
                            <HeadItem>Foto</HeadItem>
                            <HeadItem end>Aksi</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {list?.map((item, i) => (
                            <BodyRow key={i} className={'align-top'}>
                                <BodyItem start number>{item.ref_id}</BodyItem>
                                <BodyItem number>{item.nik}</BodyItem>
                                <BodyItem>
                                    <Tooltip arrow title={`${item.full_name} - ${item.role_name}`}>
                                        <div className="">
                                            <h3 className="font-semibold line-clamp-1">{item.full_name}</h3>
                                            <h3 className="text-xs line-clamp-1">{item.role_name}</h3>
                                        </div>
                                    </Tooltip>
                                </BodyItem>
                                <BodyItem>
                                    <GetStatus status={item.status_check_in} />
                                </BodyItem>
                                <BodyItem>
                                    {isImageLink(item.picture) ?
                                        <div className='w-10 h-10'>
                                            <ImageView photo={item.picture} />
                                        </div>
                                        : '-'
                                    }
                                </BodyItem>
                                <BodyItem end>
                                    <Tooltip title='Detail' arrow>
                                        <Link href={`/users-management/karyawan/${item.user_id}?view=kehadiran`}>
                                            <IconButton
                                                size='small'
                                            >
                                                <Icon icon='mdi:eye' className='' />
                                            </IconButton>
                                        </Link>
                                    </Tooltip>
                                </BodyItem>
                            </BodyRow>
                        ))}
                    </TableBody>
                </Table>
                {list.length > 0 && (
                    <Pagination
                        page={page}
                        count={totalPage}
                        onChange={(e, value) => setPage(value)}
                        color='primary'
                        size='small'
                        className='mx-auto mt-4 w-fit'
                    />
                )}
            </div>
        </Container>
    )
}

export default OperasionalTab