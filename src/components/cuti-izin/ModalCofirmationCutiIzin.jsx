import { useState, useCallback, useEffect } from 'react'
import ModalLayout from '../ModalLayout'
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import PrimaryButton from '../PrimaryButton'
import { useAppContext } from '@/context'
import { confirmationCutiIzin } from '@/api/cuti&izin/cutiIzin'

const ModalCofirmationCutiIzin = ({ open, setOpen, approve = false, refresh, user }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [allowSubmit, setAllowSubmit] = useState(true)
    const [reconfirm, setReconfirm] = useState(false)
    const [cutSaldo, setCutSaldo] = useState(false)
    const [description, setDescription] = useState('')

    const handleConfirmation = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await confirmationCutiIzin({
            unitKerja: unitKerja.id,
            id: user?.id,
            body: {
                confirm: approve,
                reason: description,
                cut_saldo: cutSaldo,
            },
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: `Berhasil ${approve ? 'menyetujui' : 'menolak'} pengajuan`,
                severity: 'success',
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                message: `Gagal ${approve ? 'menyetujui' : 'menolak'} pengajuan`,
                severity: 'error',
            })
        }
        setLoading(false)
    }, [unitKerja, approve, description, cutSaldo, refresh, setOpen, setOpenSnackbar, user])

    useEffect(() => {
        if (!open) {
            setCutSaldo(false)
            setDescription('')
            setReconfirm(false)
        }
    }, [open])

    useEffect(() => {
        setAllowSubmit(!!description && !!reconfirm)
    }, [description, reconfirm])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Konfirmasi Pengajuan'}
        >
            <div className='h-[40vh] md:h-[50vh] overflow-y-auto py-2 space-y-4'>
                {(approve && user?.category == 'Cuti Tahunan') && (
                    <FormControl fullWidth>
                        <InputLabel>Pengurangan Saldo Cuti Tahunan</InputLabel>
                        <Select
                            value={cutSaldo}
                            onChange={(e) => setCutSaldo(e.target.value)}
                            label='Pengurangan Saldo Cuti Tahunan'
                        >
                            <MenuItem value={true}>Ya</MenuItem>
                            <MenuItem value={false}>Tidak</MenuItem>
                        </Select>
                    </FormControl>
                )}
                <TextField
                    multiline
                    minRows={3}
                    maxRows={8}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    label='Keterangan'
                    fullWidth
                />
            </div>
            <div className='flex flex-wrap justify-between gap-6'>
                <FormControlLabel
                    label="Pengajuan telah diperiksa dengan benar"
                    control={
                        <Checkbox
                            checked={reconfirm}
                            onChange={(e) => setReconfirm(e.target.checked)}
                        />
                    }
                />
                <PrimaryButton
                    loading={loading}
                    onClick={handleConfirmation}
                    className={'w-full md:w-1/4'}
                    disabled={loading || !allowSubmit}
                >
                    {approve ? 'Setujui' : 'Tolak'}
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalCofirmationCutiIzin