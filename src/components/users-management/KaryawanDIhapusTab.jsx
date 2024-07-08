import Transition from '../transition'
import Container from '../Container'
import { BodyItem, BodyRow, HeadItem, HeadRow, Table, TableHead, TableBody } from "../Table"
import { IconButton, Pagination, TextField, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { listUserDeleted } from '@/api/users-management/users'
import { useAppContext } from '@/context'

const KaryawanDIhapusTab = () => {
    const { unitKerja } = useAppContext()
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [listKaryawan, setListKaryawan] = useState([])
    const [totalKaryawan, setTotalKaryawan] = useState(0)
    const [loadingListKaryawan, setLoadingListKaryawan] = useState(true)
    const [search, setSearch] = useState('')
    const [searchDebounced] = useDebounce(search, 500)

    const handleListKaryawan = useCallback(async () => {
        if (!unitKerja) return
        setPage(page)
        setLoadingListKaryawan(true)
        const body = {
            page: page,
            search: searchDebounced,
            role_id: "0",
            limit: 10,
        }
        const response = await listUserDeleted(unitKerja.id, body)
        const { data } = response
        setListKaryawan(data?.data)
        setTotalKaryawan(data?.pagination?.total_count)
        setTotalPage(data?.last_page)
        setLoadingListKaryawan(false)
    }, [page, searchDebounced, unitKerja])

    useEffect(() => {
        handleListKaryawan()
    }, [handleListKaryawan])

    return (
        <Transition>
            <Container>
                <div className='space-y-6'>
                    <div className='flex items-center gap-2'>
                        <h3 className='text-lg font-semibold'>Karyawan Dihapus</h3>
                        <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary'>
                            <Icon icon={'ic:delete'} />
                            <h3 className='text-xs font-semibold'>{totalKaryawan}</h3>
                        </div>
                    </div>
                    <TextField
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        label='Cari karyawan'

                    />
                    <Table list={listKaryawan} loading={loadingListKaryawan}>
                        <TableHead>
                            <HeadRow>
                                <HeadItem start>Nama</HeadItem>
                                <HeadItem>Jabatan</HeadItem>
                                <HeadItem>No. telp</HeadItem>
                                <HeadItem end>Action</HeadItem>
                            </HeadRow>
                        </TableHead>
                        <TableBody>
                            {listKaryawan?.map((item, i) => (
                                <BodyRow key={i}>
                                    <BodyItem className={'font-medium'} start>{item.name}</BodyItem>
                                    <BodyItem>{item.role}</BodyItem>
                                    <BodyItem>{item.phone}</BodyItem>
                                    <BodyItem end>
                                        <div className="flex items-center">
                                            <Tooltip title='detail' arrow>
                                                <IconButton>
                                                    <Icon icon='fluent:document-person-16-filled' className='text-xl' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Jurnal' arrow>
                                                <IconButton>
                                                    <Icon icon='solar:clipboard-list-bold' className='text-xl' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </BodyItem>
                                </BodyRow>
                            ))}
                        </TableBody>
                    </Table>
                    {!loadingListKaryawan &&
                        <div className="flex items-center justify-center my-3">
                            <Pagination
                                color="primary"
                                count={totalPage}
                                page={page}
                                defaultPage={1}
                                onChange={(event, value) => setPage(value)}
                            />
                        </div>
                    }
                </div>
            </Container>
        </Transition>
    )
}

export default KaryawanDIhapusTab