import Container from '../Container'
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { listUserDeleted } from '@/api/users-management/users'
import { useAppContext } from '@/context'
import PhotoView from '../PhotoView'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const KaryawanDIhapusTab = () => {
    const { unitKerja } = useAppContext()
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [listKaryawan, setListKaryawan] = useState([])
    const [totalKaryawan, setTotalKaryawan] = useState(0)
    const [loadingListKaryawan, setLoadingListKaryawan] = useState(true)
    const [search, setSearch] = useState('')
    const [searchDebounced] = useDebounce(search, 500)
    const [ref, inView] = useInView({
        threshold: 0.5,
    })

    const handleListKaryawan = useCallback(async () => {
        if (!unitKerja) return
        setLoadingListKaryawan(true)
        const body = {
            page: page,
            search: searchDebounced,
            role_id: "0",
            limit: 24,
        }
        const response = await listUserDeleted(unitKerja.id, body)
        const { data } = response
        setListKaryawan(data?.data)
        setTotalKaryawan(data?.pagination?.total_count)
        setTotalPage(data?.last_page)
        setLoadingListKaryawan(false)
    }, [page, searchDebounced, unitKerja])

    useEffect(() => {
        if (inView && (totalPage > 0)) {
            setPage(prevData => prevData < totalPage ? prevData + 1 : prevData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    useEffect(() => {
        setPage(1)
    }, [unitKerja, searchDebounced])

    useEffect(() => {
        handleListKaryawan()
    }, [handleListKaryawan])

    return (
        <div className='space-y-6'>
            <Container>
                <div className='flex flex-wrap items-center gap-6'>
                    <div className='flex items-center gap-2'>
                        <h3 className='text-lg font-semibold'>Karyawan Dihapus</h3>
                        <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary'>
                            <Icon icon={'ic:delete'} />
                            <h3 className='text-xs font-semibold'>{totalKaryawan}</h3>
                        </div>
                    </div>
                    <TextField
                        className='grow'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        label='Pencarian'
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                        }}
                    />
                </div>
            </Container>
            <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {listKaryawan?.map((item, i) => (
                    <UserCard
                        key={i}
                        user={item}
                    />
                ))}
            </div>
            {listKaryawan?.length > 0 && (
                <div ref={ref}></div>
            )}
            {loadingListKaryawan && (
                <div className="flex justify-center">
                    <Icon icon='mdi:loading' className='text-3xl animate-spin' />
                </div>
            )}
            {(listKaryawan?.length === 0 && !loadingListKaryawan) &&
                <h3 className="text-center">Tidak ada data</h3>
            }
        </div>
    )
}

export default KaryawanDIhapusTab

const UserCard = ({ user }) => {
    return (
        <Container>
            <div className="space-y-4 text-sm">
                <div className="w-12 mx-auto">
                    <PhotoView photo={user.photo} />
                </div>
                <div className="">
                    <h3 className="font-semibold text-center truncate">{user.name}</h3>
                    <h3 className="text-xs text-center truncate">{user.role_name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 space-y-1 text-xs rounded-xl bg-primary/5">
                        <h3>ID</h3>
                        <h3 className="font-medium truncate">{user.ref_id || '-'}</h3>
                    </div>
                    <div className="p-2 space-y-1 text-xs rounded-xl bg-primary/5">
                        <h3>NIK</h3>
                        <h3 className="font-medium truncate">{user.nik || '-'}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2 mx-auto w-fit">
                    <Tooltip arrow title='Detil Karyawan'>
                        <Link href={`/users-management/karyawan/${user.id}`} target="_blank">
                            <IconButton
                                size="small"
                            >
                                <Icon icon='fluent:document-person-16-filled' />
                            </IconButton>
                        </Link>
                    </Tooltip>
                </div>
            </div>
        </Container>
    )
}