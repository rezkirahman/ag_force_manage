import { useState, useEffect, useCallback } from 'react'
import ModalEditProfilingLayout from '../profiling/ModalEditProfilingLayout'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import FileField from '@/components/FileField'
import { useAppContext } from '@/context'
import { uploadFile } from '@/api/upload'
import { updateProfilingData } from '@/api/users-management/profiling'
import { useParams } from 'next/navigation'

const ModalEditLegal = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [statusPajak, setStatusPajak] = useState(true)
    const [npwp, setNpwp] = useState('')
    const [kartuNpwp, setKartuNpwp] = useState('')
    const [bpjsKes, setBpjsKes] = useState('')
    const [kartuBpjsKes, setKartuBpjsKes] = useState('')
    const [bpjsKet, setBpjsKet] = useState('')
    const [kartuBpjsKet, setKartuBpjsKet] = useState('')

    const handleUploadPDF = useCallback(async (file) => {
        if (file?.type) {
            const fileUploaded = await uploadFile(unitKerja.id, file, 'legal')
            return fileUploaded
        } else {
            return file
        }
    }, [unitKerja.id])


    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            status_pajak: statusPajak,
            npwp: npwp,
            kartu_npwp: await handleUploadPDF(kartuNpwp),
            bpjs_kes: bpjsKes,
            kartu_bpjs_kes: await handleUploadPDF(kartuBpjsKes),
            bpjs_ket: bpjsKet,
            kartu_bpjs_ket: await handleUploadPDF(kartuBpjsKet)
        }
        const { data } = await updateProfilingData({
            type: title,
            unitKerja: unitKerja.id,
            id: params.id,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah data legal'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data legal'
            })
        }
        setLoadingUpdate(false)
    }, [bpjsKes, bpjsKet, handleUploadPDF, kartuBpjsKes, kartuBpjsKet, kartuNpwp, npwp, params.id, refresh, setOpen, setOpenSnackbar, statusPajak, title, unitKerja])

    useEffect(() => {
        if (open) {
            setStatusPajak(data?.status_pajak)
            setNpwp(data?.npwp)
            setKartuNpwp(data?.kartu_npwp)
            setBpjsKes(data?.bpjs_kes)
            setKartuBpjsKes(data?.kartu_bpjs_kes)
            setBpjsKet(data?.bpjs_ket)
            setKartuBpjsKet(data?.kartu_bpjs_ket)
        }
    }, [data, open])

    return (
        <ModalEditProfilingLayout
            open={open}
            setOpen={setOpen}
            title={title}
            refresh={refresh}
            loading={loadingUpdate}
            handleClick={handleUpdate}
        >
            <FormControl fullWidth>
                <InputLabel>Status Pajak</InputLabel>
                <Select
                    label="Status Pajak"
                    value={statusPajak}
                    onChange={(e) => setStatusPajak(e.target.value)}
                >
                    <MenuItem value={true}>Aktif</MenuItem>
                    <MenuItem value={false}>Non Aktif</MenuItem>
                </Select>
            </FormControl>
            <TextField
                value={npwp}
                onChange={(e) => {
                    const value = e.target.value
                    if (!isNaN(value) && !value.includes('.')) {
                        setNpwp(value)
                    }
                }}
                label='Nomor NPWP'
                fullWidth
            />
            <FileField
                file={kartuNpwp}
                setFile={setKartuNpwp}
                title={'Kartu NPWP'}
            />
            <hr />
            <h3>BPJS Kesehatan</h3>
            <TextField
                value={bpjsKes}
                onChange={(e) => {
                    const value = e.target.value
                    if (!isNaN(value) && !value.includes('.')) {
                        setBpjsKes(value)
                    }
                }}
                label='Nomor BPJS Kesehatan'
                fullWidth
            />
            <FileField
                file={kartuBpjsKes}
                setFile={setKartuBpjsKes}
                title={'Kartu BPJS Kesehatan'}
            />
            <hr />
            <h3>BPJS Ketenagakerjaan</h3>
            <TextField
                value={bpjsKet}
                onChange={(e) => {
                    const value = e.target.value
                    if (!isNaN(value) && !value.includes('.')) {
                        setBpjsKet(value)
                    }
                }}
                label='Nomor BPJS Ketenagakerjaan'
                fullWidth
            />
            <FileField
                file={kartuBpjsKet}
                setFile={setKartuBpjsKet}
                title={'Kartu BPJS '}
            />
        </ModalEditProfilingLayout>
    )
}

export default ModalEditLegal