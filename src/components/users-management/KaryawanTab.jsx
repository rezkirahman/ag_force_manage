'use client'
import { Icon } from "@iconify/react"
import Container from "../Container"
import Transition from "../transition"
import { useCallback, useEffect, useState } from "react"
import { Autocomplete, IconButton, InputAdornment, Menu, MenuItem, Pagination, TextField, Tooltip } from "@mui/material"
import { useDebounce } from "use-debounce"
import { BodyItem, BodyRow, HeadItem, HeadRow, Table, TableHead, TableBody } from "../Table"
import { useAppContext } from "@/context"
import { roleSuggestion } from "@/api/role"
import ModalDeleteConfirmation from "../ModalDeleteConfirmation"
import ModalAddKaryawan from "./ModalAddKaryawan"
import PhotoView from "../PhotoView"
import { useRouter } from "next/navigation"
import { kickUser, listUsers, resetPINUsers } from "@/api/users-management/users"

const KaryawanTab = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const router = useRouter()
    const [openModalAddKaryawan, setOpenModalAddKaryawan] = useState(false)
    const [page, setPage] = useState(1)
    const [totalUser, setTotalUser] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const [openModalDeleteKaryawan, setOpenModalDeleteKaryawan] = useState(false)
    const open = Boolean(anchorEl)
    const [loadingListKaryawan, setLoadingListKaryawan] = useState(false)
    const [listKaryawan, setListKaryawan] = useState([])
    const [selectedKaryawan, setSelectedKaryawan] = useState(null)
    const [loadingListRole, setLoadingListRole] = useState(false)
    const [listRole, setListRole] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [SearchName, setSearchName] = useState('')
    const [searchNameDebounced] = useDebounce(SearchName, 1000)
    const [totalPage, setTotalPage] = useState(1)

    const handleListRole = useCallback(async () => {
        if (!unitKerja) return
        setLoadingListRole(true)
        const body = {
            limit: 1000,
            page: 1,
            search: ''
        }
        const { data } = await roleSuggestion(unitKerja.id, body)
        if (data?.data) {
            setListRole(data?.data)
        }
        setLoadingListRole(false)
    }, [unitKerja])

    const handlelistUser = useCallback(async () => {
        if (!unitKerja) return
        setListKaryawan([])
        setPage(page)
        setLoadingListKaryawan(true)
        const body = {
            limit: 10,
            search: searchNameDebounced,
            role_id: selectedRole?.value,
            page: page,
            sort_option: true,
            sort_by: 'nama'
        }
        const { data } = await listUsers(unitKerja.id, body)
        if (data?.data) {
            const list = data?.data
            setListKaryawan(list?.users)
            setTotalUser(list?.count?.total_user)
            setTotalPage(data.pagination.total_pages)
            setPage(data.pagination.current_page)
        }
        setLoadingListKaryawan(false)
    }, [page, searchNameDebounced, selectedRole, unitKerja])

    const handleResetPIN = useCallback(async (id) => {
        if (!unitKerja) return
        const body = {
            user_id: id
        }
        const { data } = await resetPINUsers(unitKerja.id, body)
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Berhasil Reset PIN',
                severity: 'success'
            })
        }
    }, [setOpenSnackbar, unitKerja])

    const handleDeleteUser = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await kickUser(unitKerja.id, selectedKaryawan.id)
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Berhasil menghapus karyawan',
                severity: 'success'
            })
            setOpenModalDeleteKaryawan(false)
            handlelistUser()
        }
    }, [handlelistUser, selectedKaryawan, setOpenSnackbar, unitKerja])

    useEffect(() => {
        handleListRole()
    }, [handleListRole])

    useEffect(() => {
        handlelistUser()
    }, [handlelistUser])

    return (
        <Transition>
            <Container>
                <ModalAddKaryawan
                    open={openModalAddKaryawan}
                    setOpen={setOpenModalAddKaryawan}
                    refresh={handlelistUser}
                />
                <ModalDeleteConfirmation
                    open={openModalDeleteKaryawan}
                    setOpen={setOpenModalDeleteKaryawan}
                    title='Hapus Karyawan'
                    description={<h3>Apakah anda yakin ingin menghapus <span className="font-semibold">{selectedKaryawan?.name}</span> dari daftar karyawan?</h3>}
                    handleDelete={handleDeleteUser}
                />
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className='flex items-center gap-2'>
                            <h3 className='text-lg font-semibold'>Karyawan</h3>
                            <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary'>
                                <Icon icon={'solar:user-bold'} />
                                <h3 className='text-xs font-semibold'>{totalUser}</h3>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <IconButton
                                variant='outlined'
                                size='large'
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                <Icon icon='entypo:dots-three-vertical' className='text-lg' />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                PaperProps={{
                                    className: 'menu'
                                }}
                            >
                                <MenuItem
                                    onClick={() => setOpenModalAddKaryawan(true)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='wpf:add-user' />
                                        <h3>Tambah</h3>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => setOpenModalImportWarga(true)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='mage:file-upload-fill' />
                                        <h3>Import</h3>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 md:flex-row lg:w-1/2">
                        <Autocomplete
                            disablePortal
                            loading={loadingListRole}
                            value={selectedRole?.name}
                            onChange={(event, newValue) => {
                                setSelectedRole(newValue)
                                setPage(1)
                            }}
                            options={listRole}
                            className="w-full"
                            renderInput={(params) => <TextField {...params} label="Jabatan" />}
                        />
                        <TextField
                            value={SearchName}
                            onChange={(e) => { setSearchName(e.target.value), setPage(1) }}
                            label='Pencarian'
                            variant='outlined'
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                            }}
                        />
                    </div>
                    <Table list={listKaryawan} loading={loadingListKaryawan}>
                        <TableHead>
                            <HeadRow>
                                <HeadItem start>ID</HeadItem>
                                <HeadItem>Nama</HeadItem>
                                <HeadItem>Jabatan</HeadItem>
                                <HeadItem>No. telp</HeadItem>
                                <HeadItem end>Action</HeadItem>
                            </HeadRow>
                        </TableHead>
                        <TableBody>
                            {listKaryawan?.map((item, i) => (
                                <BodyRow key={i}>
                                    <BodyItem start>{item.ref_id}</BodyItem>
                                    <BodyItem className={'flex items-center gap-2'}>
                                        <div className="flex items-center w-8 h-8">
                                            <PhotoView photo={item.photo} />
                                        </div>
                                        <h3 className="w-full font-medium text-wrap line-clamp-2">{item.name}</h3>
                                    </BodyItem>
                                    <BodyItem>{item.role_name}</BodyItem>
                                    <BodyItem>{item.phone}</BodyItem>
                                    <BodyItem end>
                                        <div className="flex items-center">
                                            <Tooltip title='detail' arrow>
                                                <IconButton
                                                    onClick={() => router.push(`/users-management/karyawan/${item.id}`)}
                                                >
                                                    <Icon icon='fluent:document-person-16-filled' className='text-xl' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Jurnal' arrow>
                                                <IconButton>
                                                    <Icon icon='solar:clipboard-list-bold' className='text-xl' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Reset PIN' arrow>
                                                <IconButton
                                                    onClick={() => handleResetPIN(item.id)}
                                                >
                                                    <Icon icon='fluent:key-reset-20-filled' className='text-xl' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Hapus' arrow>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setSelectedKaryawan(item)
                                                        setOpenModalDeleteKaryawan(true)
                                                    }}
                                                >
                                                    <Icon icon='mdi:delete' className='text-xl' />
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

export default KaryawanTab