import { useState, useCallback, useEffect } from 'react'
import ModalLayout from '../ModalLayout'
import { useAppContext } from '@/context'
import PrimaryButton from '../PrimaryButton'
import { Alert, Autocomplete, Button, Checkbox, Chip, FormControlLabel, TextField, Tooltip } from '@mui/material'
import FileField from '../FileField'
import { Icon } from '@iconify/react'
import { importSaldoCuti, templateSaldoCuti } from '@/api/cuti&izin/cutiIzin'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import { useRouter } from 'next/navigation'

const ModalImportSaldoCuti = ({ open, setOpen, refresh }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(true)
    const [openModalResult, setOpenModalResult] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState(false)
    const [result, setResult] = useState([])

    const handleImport = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await importSaldoCuti({
            unitKerja: unitKerja.id,
            file: file
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Import Saldo Cuti Berhasil',
                severity: 'success',
            })
            setResult(data.data?.detail)
            refresh()
            setOpenModalResult(true)
        }
        setLoading(false)
    }, [file, refresh, setOpenSnackbar, unitKerja])

    const handleDownloadTemplate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingDownload(true)
        const { data } = await templateSaldoCuti({ unitKerja: unitKerja.id })
        if (data?.data) {
            const url = `${data?.data}?${Math.random()}`
            router.push(url)
        }
        setLoadingDownload(false)
    }, [router, unitKerja])

    useEffect(() => {
        if (open) {
            setFile(null)
            setOpenModalResult(false)
        }
    }, [open])

    useEffect(() => {
        if (file) {
            setAllowSubmit(true)
        } else {
            setAllowSubmit(false)
        }
    }, [file])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Import Saldo Cuti'}
            transparent={openModalResult}
        >
            <ModalResult
                open={openModalResult}
                setOpen={setOpenModalResult}
                setOpenParent={setOpen}
                list={result}
            />
            <div className='overflow-y-auto h-[40vh] pr-2 py-2 space-y-4'>
                <Button
                    onClick={handleDownloadTemplate}
                    variant='outlined'
                    startIcon={<Icon icon={loadingDownload ? 'line-md:downloading-loop' : 'iconoir:download'} />}
                >
                    Download Template
                </Button>
                <FileField
                    file={file}
                    setFile={setFile}
                    type='excel'
                />
            </div>
            <div className='flex justify-end'>
                <PrimaryButton
                    loading={loading}
                    onClick={handleImport}
                    className={'w-full md:w-1/4'}
                    disabled={loading || !allowSubmit}
                >
                    Import
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalImportSaldoCuti

const ModalResult = ({ open, setOpen, setOpenParent, list }) => {

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Berhasil'}
            handleClose={() => {
                setOpenParent(false)
            }}
        >
            <Alert severity='success'>
                Berhasil import saldo cuti karyawan
            </Alert>
            <Table list={list} loading={false} className={'h-[50vh]'}>
                <TableHead>
                    <HeadRow className={'uppercase align-top'}>
                        <HeadItem start>Karyawan</HeadItem>
                        <HeadItem>Saldo</HeadItem>
                        <HeadItem end>Status</HeadItem>
                    </HeadRow>
                </TableHead>
                <TableBody>
                    {list?.map((item, i) => (
                        <BodyRow key={i} className={'align-top'}>
                            <BodyItem start>
                                <div className="">
                                    <h3 className="font-semibold line-clamp-1">{item.nama}</h3>
                                    <h3 className="text-xs line-clamp-1">{item.telepon}</h3>
                                </div>
                            </BodyItem>
                            <BodyItem>{item.saldo}</BodyItem>
                            <BodyItem end>
                                <Chip
                                    label={item.status == 'success' ? 'Berhasil' : 'Gagal'}
                                    color={item.status == 'success' ? 'success' : 'error'}
                                    variant="contained"
                                />
                            </BodyItem>
                        </BodyRow>
                    ))}
                </TableBody>
            </Table>
        </ModalLayout>
    )
}