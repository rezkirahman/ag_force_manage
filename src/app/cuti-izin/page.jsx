'use client'
import Container from '@/components/Container'
import ModalImportSaldoCuti from '@/components/cuti-izin/ModalImportSaldoCuti'
import ModalSaldoCuti from '@/components/cuti-izin/ModalSaldoCuti'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import Layout from '@/components/Layout'
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { listUserRequest } from '@/api/cuti&izin/cutiIzin'
import ModalExportCutiIzin from '@/components/cuti-izin/ModalExportCutiIzin'
import ModalDetailCutiIzin from '@/components/cuti-izin/ModalDetailCutiIzin'
import ModalCofirmationCutiIzin from '@/components/cuti-izin/ModalCofirmationCutiIzin'

const Page = () => {
    const { unitKerja } = useAppContext()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [openModalCuti, setOpenModalCuti] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [openModalReject, setOpenModalReject] = useState(false)
    const [selectedList, setSelectedList] = useState([])
    const [list, setList] = useState([])
    const [loadingList, setLoadingList] = useState(false)

    const handleList = useCallback(async () => {
        if (!unitKerja) return
        setLoadingList(true)
        setList([])
        const { data } = await listUserRequest({ unitKerja: unitKerja.id })
        if (data?.data) {
            setList(data.data)
        }
        setLoadingList(false)
    }, [unitKerja])
    useEffect(() => { handleList() }, [handleList])

    return (
        <Layout>
            <ModalCofirmationCutiIzin
                open={openModalConfirm}
                setOpen={setOpenModalConfirm}
                refresh={handleList}
                user={selectedList}
                approve
            />
            <ModalCofirmationCutiIzin
                open={openModalReject}
                setOpen={setOpenModalReject}
                refresh={handleList}
                user={selectedList}
            />
            <ModalDetailCutiIzin
                open={openModalDetail}
                setOpen={setOpenModalDetail}
                data={selectedList}
            />
            <ModalSaldoCuti
                open={openModalCuti}
                setOpen={setOpenModalCuti}
                refresh={handleList}
            />
            <ModalImportSaldoCuti
                open={openModalImport}
                setOpen={setOpenModalImport}
                refresh={handleList}
            />
            <ModalExportCutiIzin open={openModalExport} setOpen={setOpenModalExport} />
            <Container>
                <div className='space-y-6'>
                    <div className='flex items-center justify-between gap-6'>
                        <div className='flex items-center gap-2'>
                            <h3 className='text-lg font-semibold'>Pengajuan</h3>
                            <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary'>
                                <Icon icon={'ion:document-text'} />
                                <h3 className='text-xs font-semibold leading-none'>{list?.length}</h3>
                            </div>
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
                                    onClick={() => setOpenModalCuti(true)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='mage:book-text' />
                                        <h3>Saldo Cuti</h3>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => setOpenModalImport(true)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='mage:file-upload' />
                                        <h3>Import Saldo Cuti</h3>
                                    </div>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => setOpenModalExport(true)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Icon icon='mage:file-download' />
                                        <h3>Export</h3>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <Table list={list} loading={loadingList}>
                        <TableHead>
                            <HeadRow className={'uppercase align-top'}>
                                <HeadItem start>ID</HeadItem>
                                <HeadItem>NIK</HeadItem>
                                <HeadItem>Nama</HeadItem>
                                <HeadItem>Kategori</HeadItem>
                                <HeadItem end>Aksi</HeadItem>
                            </HeadRow>
                        </TableHead>
                        <TableBody>
                            {list?.map((item, i) => (
                                <BodyRow key={i} className={'align-top'}>
                                    <BodyItem start number>{item.ref_id}</BodyItem>
                                    <BodyItem number>{item.nik}</BodyItem>
                                    <BodyItem>
                                        <Tooltip arrow title={`${item.name} - ${item.role}`}>
                                            <div className="">
                                                <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                                                <h3 className="text-xs line-clamp-1">{item.role}</h3>
                                            </div>
                                        </Tooltip>
                                    </BodyItem>
                                    <BodyItem>{item.category}</BodyItem>
                                    <BodyItem end>
                                        <div className='flex items-center gap-2'>
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
                                            <Tooltip title='Setujui' arrow>
                                                <IconButton
                                                    size='small'
                                                    color='success'
                                                    onClick={() => {
                                                        setSelectedList(item)
                                                        setOpenModalConfirm(true)
                                                    }}
                                                >
                                                    <Icon icon={'iconamoon:check-bold'} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Tolak' arrow>
                                                <IconButton
                                                    size='small'
                                                    color='error'
                                                    onClick={() => {
                                                        setSelectedList(item)
                                                        setOpenModalReject(true)
                                                    }}
                                                >
                                                    <Icon icon={'iconamoon:close-bold'} />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </BodyItem>
                                </BodyRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Container>
        </Layout>
    )
}

export default Page