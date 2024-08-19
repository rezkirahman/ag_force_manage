import { useState, useCallback, useEffect } from 'react'
import ModalLayout from '../ModalLayout'
import { useAppContext } from '@/context'
import PrimaryButton from '../PrimaryButton'
import { Alert, Autocomplete, Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import FileField from '../FileField'
import { Icon } from '@iconify/react'
import { templateSaldoCuti } from '@/api/cuti&izin/cutiIzin'
import { useRouter } from 'next/navigation'

const ModalImportSaldoCuti = ({ open, setOpen }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const router = useRouter()
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(true)
    const [openModalResult, setOpenModalResult] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState(false)

    const handleImport = useCallback(async () => {
        setOpenModalResult(false)
    }, [])

    useEffect(() => {
        if (file) setAllowSubmit(true)
    }, [file])

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
                    onClick={() => setOpenModalResult(true)}
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
        </ModalLayout>
    )
}