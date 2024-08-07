'use client'
import Container from '@/components/Container'
import Layout from '@/components/Layout'
import { Button, IconButton, Menu, MenuItem, Pagination, TextField, Tooltip } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react'
import { useDebounce } from 'use-debounce'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import { useAppContext } from '@/context'
import { deleteRoleManagement, listRoleManagement } from '@/api/role-management/role-management'
import ModalDeleteConfirmation from '@/components/ModalDeleteConfirmation'
import ModalAddEditRole from '@/components/role-management/ModalAddEditRole'
import { useRouter } from 'next/navigation'


const Page = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const router =useRouter()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [search, setSearch] = useState('')
    const [searchDebounced] = useDebounce(search, 1000)
    const [list, setList] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalEditRole, setOpenModalEditRole] = useState(false)
    const [openModalAddRole, setOpenModalAddRole] = useState(false)

    const handleList = useCallback(async () => {
        if (!unitKerja) return
        setLoadingList(true)
        setList([])
        const { data } = await listRoleManagement({
            unitKerja: unitKerja.id,
            body: {
                page: page,
                search: searchDebounced,
                limit: 10
            }
        })
        if (data?.data) {
            setList(data.data)
            setTotalPage(data.pagination.total_pages)
        }
        setLoadingList(false)
    }, [page, searchDebounced, unitKerja])
    useEffect(() => { handleList() }, [handleList])

    const handleDelete = useCallback(async () => {
        if (!unitKerja) return
        setLoadingDelete(true)
        const { data } = await deleteRoleManagement({
            id: parseInt(selectedRole.value),
            unitKerja: unitKerja.id
        })
        if (data?.code == 200) {
            handleList()
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menghapus jabatan'
            })
        }
        setLoadingDelete(false)
        setOpenModalDelete(false)
    }, [handleList, selectedRole, setOpenSnackbar, unitKerja])

    useEffect(() => {
        setPage(1)
    }, [searchDebounced])

    return (
        <Layout>
            <ModalAddEditRole
                open={openModalAddRole}
                setOpen={setOpenModalAddRole}
                refresh={handleList}
            />
            <ModalAddEditRole
                open={openModalEditRole}
                setOpen={setOpenModalEditRole}
                refresh={handleList}
                role={selectedRole}
                edit
            />
            <Container>
                <ModalDeleteConfirmation
                    open={openModalDelete}
                    setOpen={setOpenModalDelete}
                    title={'Hapus Jabatan'}
                    description={<h3>Apakah anda yakin ingin menghapus <span className="font-semibold">{selectedRole?.label}</span> dari daftar jabatan ?</h3>}
                    handleDelete={handleDelete}
                    loading={loadingDelete}
                />
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <Button
                        size='large'
                        variant='contained'
                        startIcon={<Icon icon='hugeicons:structure-02' />}
                        onClick={() => router.push('/role-management/hierarchy')}
                    >
                        Struktur Organisasi
                    </Button>
                    <div className='flex items-center justify-end gap-3 grow md:grow-0'>
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Cari'
                            variant='outlined'
                            className='w-full grow md:grow-0'
                        />
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
                                <MenuItem onClick={() => setOpenModalAddRole(true)}>
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='wpf:add-user' />
                                        <h3>Tambah</h3>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='mage:file-upload-fill' />
                                        <h3>Import</h3>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                </div>
            </Container>
            <Container>
                <Table list={list} loading={loadingList}>
                    <TableHead>
                        <HeadRow className={'uppercase align-top'}>
                            <HeadItem start>Tipe</HeadItem>
                            <HeadItem>jabatan</HeadItem>
                            <HeadItem>Radius</HeadItem>
                            <HeadItem end>Aksi</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {list?.map((item, i) => (
                            <BodyRow key={i} className={'align-top'}>
                                <BodyItem start number>{item.code}</BodyItem>
                                <BodyItem className={'font-medium'}>{item.label}</BodyItem>
                                <BodyItem>{item.radius}</BodyItem>
                                <BodyItem end>
                                    <div className='flex items-center justify-start gap-2'>
                                        <Tooltip title='Ubah' arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedRole(item)
                                                    setOpenModalEditRole(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:edit'} className="text-lg" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Hapus' arrow>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setSelectedRole(item)
                                                    setOpenModalDelete(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:delete'} className="text-lg" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
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
            </Container>
        </Layout>
    )
}

export default Page