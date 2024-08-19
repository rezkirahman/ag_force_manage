'use client'
import { Icon } from "@iconify/react"
import Container from "../Container"
import { useCallback, useEffect, useState } from "react"
import { Autocomplete, IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip } from "@mui/material"
import { useDebounce } from "use-debounce"
import { useAppContext } from "@/context"
import { roleSuggestion } from "@/api/role"
import ModalDeleteConfirmation from "../ModalDeleteConfirmation"
import ModalAddKaryawan from "./ModalAddKaryawan"
import PhotoView from "../PhotoView"
import { kickUser, listUsers, resetPINUsers } from "@/api/users-management/users"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import ModalResetPINConfirmation from "./ModalResetPINConfirmation"

const KaryawanTab = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [openModalAddKaryawan, setOpenModalAddKaryawan] = useState(false)
    const [page, setPage] = useState(1)
    const [totalUser, setTotalUser] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [openModalDeleteKaryawan, setOpenModalDeleteKaryawan] = useState(false)
    const [openModalResetPIN, setOpenModalResetPIN] = useState(false)
    const [loadingListKaryawan, setLoadingListKaryawan] = useState(false)
    const [loadingResetPIN, setLoadingResetPIN] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [listKaryawan, setListKaryawan] = useState([])
    const [selectedKaryawan, setSelectedKaryawan] = useState(null)
    const [loadingListRole, setLoadingListRole] = useState(false)
    const [listRole, setListRole] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [SearchName, setSearchName] = useState('')
    const [searchNameDebounced] = useDebounce(SearchName, 500)
    const [totalPage, setTotalPage] = useState(1)
    const [ref, inView] = useInView({
        threshold: 0.5,
    })

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
        setLoadingListKaryawan(true)
        const body = {
            limit: 24,
            search: searchNameDebounced,
            role_id: selectedRole?.value,
            page: page,
            sort_option: true,
            sort_by: 'nama'
        }
        const { data } = await listUsers(unitKerja.id, body)
        if (data?.data) {
            const list = data?.data
            if (page > 1) {
                setListKaryawan(prevData => [...prevData, ...list?.users])
            } else {
                setListKaryawan(list?.users)
            }
            setTotalUser(list?.count?.total_user)
            setTotalPage(data.pagination.total_pages)
        } else {
            setListKaryawan([])
            setTotalUser(0)
            setTotalPage(1)
        }
        setLoadingListKaryawan(false)
    }, [page, searchNameDebounced, selectedRole, unitKerja])

    const handleResetPIN = useCallback(async () => {
        if (!unitKerja) return
        setLoadingResetPIN(true)
        const body = {
            user_id: selectedKaryawan.id
        }
        const { data } = await resetPINUsers(unitKerja.id, body)
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Berhasil Reset PIN',
                severity: 'success'
            })
            setOpenModalResetPIN(false)
        }
        setLoadingResetPIN(false)
    }, [selectedKaryawan, setOpenSnackbar, unitKerja])

    const handleDeleteUser = useCallback(async () => {
        if (!unitKerja) return
        setLoadingDelete(true)
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
        setLoadingDelete(false)
    }, [handlelistUser, selectedKaryawan, setOpenSnackbar, unitKerja])

    useEffect(() => {
        handleListRole()
    }, [handleListRole])

    useEffect(() => {
        handlelistUser()
    }, [handlelistUser])

    useEffect(() => {
        if (inView && (totalPage > 0)) {
            setPage(prevData => prevData < totalPage ? prevData + 1 : prevData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView])

    useEffect(() => {
        if (searchNameDebounced || selectedRole) {
            setPage(1)
        }
    }, [searchNameDebounced, selectedRole])

    useEffect(() => {
        setPage(1)
        setTotalPage(1)
    }, [unitKerja])

    return (
        <div className="space-y-6">
            <Container className={'sticky top-0 z-20'}>
                <ModalAddKaryawan
                    open={openModalAddKaryawan}
                    setOpen={setOpenModalAddKaryawan}
                    refresh={handlelistUser}
                />
                <ModalResetPINConfirmation
                    open={openModalResetPIN}
                    setOpen={setOpenModalResetPIN}
                    handle={handleResetPIN}
                    loading={loadingResetPIN}
                    description={<h3>Mereset PIN <span className="font-semibold">{selectedKaryawan?.name}</span> ?</h3>}
                />
                <ModalDeleteConfirmation
                    open={openModalDeleteKaryawan}
                    setOpen={setOpenModalDeleteKaryawan}
                    title='Hapus Karyawan'
                    description={<h3>Apakah anda yakin ingin menghapus <span className="font-semibold">{selectedKaryawan?.name}</span> dari daftar karyawan?</h3>}
                    loading={loadingDelete}
                    handleDelete={handleDeleteUser}

                />
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className='flex items-center gap-2 '>
                        <h3 className='text-lg font-semibold'>Karyawan</h3>
                        <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary'>
                            <Icon icon={'solar:user-bold'} />
                            <h3 className='text-xs font-semibold leading-none'>{totalUser}</h3>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 grow">
                        <div className="flex items-center gap-3 grow lg:w-1/2">
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
                        <div className=''>
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
                                        <Icon icon='mage:user-plus' />
                                        <h3>Tambah</h3>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    // onClick={() => setOpenModalImportWarga(true)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='mage:file-upload' />
                                        <h3>Import</h3>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </Container>
            <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {listKaryawan?.map((item, i) => (
                    <UserCard
                        key={i}
                        user={item}
                        setSelected={setSelectedKaryawan}
                        setOpenModalDelete={setOpenModalDeleteKaryawan}
                        setOpenModalResetPIN={setOpenModalResetPIN}
                    />
                ))}
                {/* <div ref={ref}></div> */}
                {/* {loadingListKaryawan && Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))} */}
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

export default KaryawanTab

const UserCard = ({ user, ref = null, setSelected, setOpenModalDelete, setOpenModalResetPIN }) => {
    return (
        <Container ref={ref}>
            <div className="space-y-4 text-sm">
                <div className="w-12 mx-auto">
                    <PhotoView photo={user.photo} />
                </div>
                <div className="">
                    <h3 className="font-semibold text-center truncate">{user.name}</h3>
                    <h3 className="text-xs text-center truncate">{user.role_name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 text-xs rounded-xl bg-primary/5">
                        <Tooltip arrow title={`ID: ${user.ref_id || '-'}`} placement="top" className="space-y-1">
                            <h3>ID</h3>
                            <h3 className="font-medium truncate">{user.ref_id || '-'}</h3>
                        </Tooltip>
                    </div>

                    <div className="p-2 text-xs rounded-xl bg-primary/5">
                        <Tooltip arrow title={`NIK: ${user.nik || '-'}`} placement="top" className="space-y-1">
                            <h3>NIK</h3>
                            <h3 className="font-medium truncate">{user.nik || '-'}</h3>
                        </Tooltip>
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
                    <Tooltip arrow title='Reset PIN'>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSelected(user)
                                setOpenModalResetPIN(true)
                            }}
                        >
                            <Icon icon='fluent:key-reset-20-filled' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title='Hapus'>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                                setSelected(user)
                                setOpenModalDelete(true)
                            }}
                        >
                            <Icon icon='mdi:delete' />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </Container>
    )
}
