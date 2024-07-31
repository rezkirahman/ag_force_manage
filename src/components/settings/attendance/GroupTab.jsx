import { deleteGroupAttendance, listGroupAttendance } from '@/api/settings/attendance-group'
import Container from '@/components/Container'
import { BodyItem, BodyRow, HeadItem, HeadRow, Table, TableBody, TableHead } from '@/components/Table'
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import { Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import ModalAddEditGroupAttendance from './ModalAddEditGroupAttendance'
import ModalDeleteConfirmation from '@/components/ModalDeleteConfirmation'

const GroupTab = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [search, setSearch] = useState('')
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const [openEditGroup, setOpenEditGroup] = useState(false)
    const [openDeleteGroup, setOpenDeleteGroup] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [listGroup, setListGroup] = useState([])
    const [loading, setLoading] = useState(false)

    const [searchDebounced] = useDebounce(search, 1000)

    const handleListGroup = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            search: searchDebounced
        }
        const { data } = await listGroupAttendance({
            unitKerja: unitKerja.id,
            body: body
        })
        if (data?.data) {
            setListGroup(data?.data)
        }
        setLoading(false)
    }, [searchDebounced, unitKerja])
    useEffect(() => { handleListGroup() }, [handleListGroup])

    const handleDeleteGroup = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await deleteGroupAttendance({
            unitKerja: unitKerja.id,
            id: selectedGroup?.id
        })
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menghapus group'
            })
            handleListGroup()
            setOpenDeleteGroup(false)
        }
        setLoading(false)
    }, [handleListGroup, selectedGroup, setOpenSnackbar, unitKerja])

    return (
        <Container>
            <ModalAddEditGroupAttendance
                open={openAddGroup}
                setOpen={setOpenAddGroup}
                refresh={handleListGroup}
            />
            <ModalAddEditGroupAttendance
                open={openEditGroup}
                setOpen={setOpenEditGroup}
                edit
                refresh={handleListGroup}
                id={selectedGroup?.id}
            />
            <ModalDeleteConfirmation
                open={openDeleteGroup}
                setOpen={setOpenDeleteGroup}
                title={'Hapus Group'}
                description={
                    <h3>Apakah anda yakin ingin menghapus <span className='font-semibold'>{selectedGroup?.title}</span> dari daftar group ?</h3>
                }
                handleDelete={handleDeleteGroup}
            />
            <div className='space-y-6'>
                <div className='flex items-center justify-between gap-3'>
                    <TextField
                        value={search}
                        placeholder='Cari Group'
                        variant='outlined'
                        className='md::w-1/4'
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon={'mdi:magnify'} className="text-xl" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        size='large'
                        variant="contained"
                        onClick={() => setOpenAddGroup(true)}
                        startIcon={<Icon icon={'mdi:plus'} />}
                    >
                        Tambah
                    </Button>
                </div>
                <Table list={listGroup} loading={loading}>
                    <TableHead>
                        <HeadRow className={'align-top'}>
                            <HeadItem start>Nama</HeadItem>
                            <HeadItem>Karyawan</HeadItem>
                            <HeadItem>Lokasi</HeadItem>
                            <HeadItem end>Action</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {listGroup?.sort((a, b) => b.is_anywhere - a.is_anywhere).map((item, i) => (
                            <BodyRow key={i}>
                                <BodyItem start>
                                    <h3 className={`line-clamp-2 ${item.is_anywhere ? 'font-bold uppercase text-primary' : 'font-medium'}`}>{item.title}</h3>
                                </BodyItem>
                                <BodyItem>{item.total_user}</BodyItem>
                                <BodyItem>
                                    <h3 className='line-clamp-2'>{item.location_names}</h3>
                                </BodyItem>
                                <BodyItem end>
                                    <div className='flex items-center justify-center gap-2'>
                                        <Tooltip title='Ubah' arrow>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedGroup(item)
                                                    setOpenEditGroup(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:edit'} className="text-lg" />
                                            </IconButton>
                                        </Tooltip>
                                        {!item.is_anywhere &&
                                            <Tooltip title='Hapus' arrow>
                                                <IconButton
                                                    color="error"
                                                    size='small'
                                                    onClick={() => {
                                                        setSelectedGroup(item)
                                                        setOpenDeleteGroup(true)
                                                    }}
                                                >
                                                    <Icon icon={'material-symbols:delete'} className="text-lg" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </div>
                                </BodyItem>
                            </BodyRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Container>
    )
}

export default GroupTab