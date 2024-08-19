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

const Page = () => {
    const { unitKerja } = useAppContext()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [openModalCuti, setOpenModalCuti] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [openModalExport, setOpenModalExport] = useState(false)
    const [list, setList] = useState([])
    const [loadingList, setLoadingList] = useState(false)

    const handleList = useCallback(async () => {
        if (!unitKerja) return
        setLoadingList(true)
        setList([])
        const { data } = await listUserRequest({ unitKerja: unitKerja.id })
        if (data?.data) {
            console.log(data?.data);
            setList(data.data)
        }
        setLoadingList(false)
    }, [unitKerja])
    useEffect(() => { handleList() }, [handleList])

    return (
        <Layout>
            <ModalSaldoCuti open={openModalCuti} setOpen={setOpenModalCuti} />
            <ModalImportSaldoCuti open={openModalImport} setOpen={setOpenModalImport} />
            <ModalExportCutiIzin open={openModalExport} setOpen={setOpenModalExport} />
            <Container>
                <div className='space-y-6'>
                    <div className='flex items-center justify-between gap-6'>
                        <h3 className='text-lg font-semibold'>Pengajuan</h3>
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
                                    </BodyItem>
                                    <BodyItem>

                                    </BodyItem>
                                    <BodyItem end>
                                        <Tooltip title='Detail' arrow>

                                        </Tooltip>
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