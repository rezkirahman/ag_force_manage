import { useCallback, useEffect, useState } from 'react'
import Container from '../../Container'
import { Icon } from '@iconify/react'
import { Alert, Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { useAppContext } from '@/context'
import { deleteUserShift, listUserShifts } from '@/api/settings/work-days-shift'
import { BodyItem, BodyRow, HeadItem, HeadRow, Table, TableHead, TableBody } from '../../Table'
import ModalDeleteConfirmation from '../../ModalDeleteConfirmation'
import ModalAddUserShift from './ModalAddUserShift'

const ShiftTab = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingListUser, setLoadingListUser] = useState(false)
    const [loadingDeleteUser, setLoadingDeleteUser] = useState(false)
    const [search, setSearch] = useState('')
    const [listUser, setListUser] = useState([])
    const [openModalAddUser, setOpenModalAddUser] = useState(false)
    const [openModalDeleteUser, setOpenModalDeleteUser] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})

    const handleGetUser = useCallback(async () => {
        if (!unitKerja) return
        setLoadingListUser(true)
        const body = {
            search: search
        }
        const { data } = await listUserShifts(unitKerja.id, body)
        if (data?.data) {
            setListUser(data?.data)
        }
        setLoadingListUser(false)
    }, [unitKerja, search])

    const handleDeleteUser = useCallback(async () => {
        if (!unitKerja) return
        setLoadingDeleteUser(true)
        const { data } = await deleteUserShift(unitKerja.id, selectedUser?.id)
        if (data?.code == 200) {
            setOpenModalDeleteUser(false)
            handleGetUser()
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: data?.data
            })
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal menghapus karyawan shift'
            })
        }
        setLoadingDeleteUser(false)
    }, [handleGetUser, selectedUser, setOpenSnackbar, unitKerja])


    useEffect(() => {
        handleGetUser()
    }, [handleGetUser])

    return (
        <Container>
            <ModalAddUserShift
                open={openModalAddUser}
                setOpen={setOpenModalAddUser}
                refresh={handleGetUser}
            />
            <ModalDeleteConfirmation
                open={openModalDeleteUser}
                setOpen={setOpenModalDeleteUser}
                title='Hapus Karyawan Shift'
                description={<h3>Apakah Anda yakin ingin menghapus <span className='font-semibold'>{selectedUser?.full_name}</span> dari shift ?</h3>}
                loading={loadingDeleteUser}
                handleDelete={() => handleDeleteUser()}
            />
            <div className="space-y-6">
                <Alert severity='info'>
                    <h3>Karyawan dalam jam shift diberikan akses <span className='font-semibold'>24/7</span> untuk melakukan check-in & mengisi jurnal.</h3>
                </Alert>
                <div className="flex items-center justify-between gap-3">
                    <TextField
                        value={search}
                        variant="outlined"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari karyawan shift"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <Icon icon={'mdi:magnify'} className="text-xl" />
                            </InputAdornment>,
                        }}
                    />
                    <Button
                        variant='contained'
                        size='large'
                        startIcon={<Icon icon={'mdi:plus'} className="text-xl" />}
                        onClick={() => setOpenModalAddUser(true)}
                    >
                        Tambah
                    </Button>
                </div>
                <Table list={listUser} loading={loadingListUser}>
                    <TableHead>
                        <HeadRow className={'uppercase'}>
                            <HeadItem start>ID</HeadItem>
                            <HeadItem>NIK</HeadItem>
                            <HeadItem>Nama</HeadItem>
                            <HeadItem end>Aksi</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {listUser?.map((item, i) => (
                            <BodyRow key={i} className={'align-top'}>
                                <BodyItem start>{item.ref_id}</BodyItem>
                                <BodyItem>{item.nik}</BodyItem>
                                <BodyItem>
                                    <div className='w-fit'>
                                        <Tooltip arrow title={`${item.full_name} - ${item.role_name}`}>
                                            <h3 className="font-semibold line-clamp-1">{item.full_name}</h3>
                                            <h3 className="text-gray-500 line-clamp-1">{item.role_name}</h3>
                                        </Tooltip>
                                    </div>
                                </BodyItem>
                                <BodyItem end>
                                    <Tooltip title='Hapus' arrow>
                                        <IconButton
                                            size='small'
                                            color='error'
                                            onClick={() => {
                                                setSelectedUser(item)
                                                setOpenModalDeleteUser(true)
                                            }}
                                        >
                                            <Icon icon='material-symbols:delete' className='text-lg' />
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

export default ShiftTab