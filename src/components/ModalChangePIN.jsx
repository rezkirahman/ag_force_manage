import { Button, IconButton, InputAdornment, TextField } from '@mui/material'
import ModalLayout from './ModalLayout'
import { useState, useCallback, useEffect } from 'react'
import { Icon } from '@iconify/react'
import ErrorMessage from './ErrorMessage'
import { useAppContext } from '@/context'
import { changePIN } from '@/api/getMe'
import PrimaryButton from './PrimaryButton'

const ModalChangePIN = ({ open, setOpen }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [pinLama, setPinLama] = useState('')
    const [showPinLama, setShowPinLama] = useState(false)
    const [pinBaru, setPinBaru] = useState('')
    const [showPinBaru, setShowPinBaru] = useState(false)
    const [konfirmasiPinBaru, setKonfirmasiPinBaru] = useState('')
    const [showKonfirmasiPinBaru, setShowKonfirmasiPinBaru] = useState(false)
    const [readyToSubmit, setReadyToSubmit] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loadingChangePIN, setLoadingChangePIN] = useState(false)

    const handleChangePIN = useCallback(async () => {
        if (!unitKerja) return
        setLoadingChangePIN(true)
        const body = {
            old_pin: pinLama,
            new_pin: pinBaru,
            re_pin: konfirmasiPinBaru
        }
        const response = await changePIN({
            unitKerja: unitKerja.id,
            body: body
        })
        if (response?.data) {
            setOpenSnackbar({
                open: true,
                message: 'PIN berhasil diubah',
                severity: 'success'
            })
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                message: response?.response?.data?.message?.description,
                severity: 'error'
            })
        }
        setLoadingChangePIN(false)
    }, [konfirmasiPinBaru, pinBaru, pinLama, setOpen, setOpenSnackbar, unitKerja])

    useEffect(() => {
        if (open) {
            setPinLama('')
            setShowPinLama(false)
            setPinBaru('')
            setShowPinBaru(false)
            setKonfirmasiPinBaru('')
            setShowKonfirmasiPinBaru(false)
        }
    }, [open])

    useEffect(() => {
        if (pinLama.length === 6 && pinBaru.length === 6 && konfirmasiPinBaru.length === 6 && konfirmasiPinBaru === pinBaru && pinLama !== pinBaru) {
            setReadyToSubmit(true)
        } else {
            setReadyToSubmit(false)
        }
    }, [konfirmasiPinBaru, pinBaru, pinLama])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Ubah PIN'}
            className={'max-w-[400px]'}
        >
            <div className='h-[50vh] flex flex-col justify-between'>
                <div className='h-full py-2 space-y-3 overflow-y-auto'>
                    <ErrorMessage
                        message={errorMessage}
                        setMessage={setErrorMessage}
                    />
                    <TextField
                        value={pinLama}
                        onChange={(e) => {
                            const re = /^[0-9\b]+$/;
                            if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 6) {
                                setPinLama(e.target.value)
                            }
                        }}
                        fullWidth
                        label="PIN Lama"
                        type={showPinLama ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPinLama(prev => !prev)}
                                        className='text-gray-600'
                                    >
                                        <Icon icon={showPinLama ? 'fluent:eye-16-filled' : 'fluent:eye-off-16-filled'} className='text-lg' />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={pinLama.length > 1 && pinLama.length < 6}
                        helperText={(pinLama.length > 1 && pinLama.length < 6) && 'PIN harus 6 digit'}

                    />
                    <TextField
                        value={pinBaru}
                        onChange={(e) => {
                            const re = /^[0-9\b]+$/;
                            if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 6) {
                                setPinBaru(e.target.value)
                            }
                        }}
                        fullWidth
                        label="PIN Baru"
                        type={showPinBaru ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPinBaru(prev => !prev)}
                                        className='text-gray-600'
                                    >
                                        <Icon icon={showPinBaru ? 'fluent:eye-16-filled' : 'fluent:eye-off-16-filled'} className='text-lg' />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={pinBaru.length > 1 && pinBaru.length < 6 || (pinLama === pinBaru && pinBaru.length > 1)}
                        helperText={(pinBaru.length > 1 && pinBaru.length < 6) ? 'PIN harus 6 digit' : (pinLama === pinBaru && pinBaru.length > 1) && 'PIN tidak boleh sama dengan PIN lama'}
                    />
                    <TextField
                        value={konfirmasiPinBaru}
                        onChange={(e) => {
                            const re = /^[0-9\b]+$/;
                            if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 6) {
                                setKonfirmasiPinBaru(e.target.value)
                            }
                        }}
                        fullWidth
                        label="Konfirmasi PIN Baru"
                        type={showKonfirmasiPinBaru ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowKonfirmasiPinBaru(prev => !prev)}
                                        className='text-gray-600'
                                    >
                                        <Icon icon={showKonfirmasiPinBaru ? 'fluent:eye-16-filled' : 'fluent:eye-off-16-filled'} className='text-lg' />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={(konfirmasiPinBaru.length > 1 && konfirmasiPinBaru.length < 6) || (konfirmasiPinBaru !== pinBaru && konfirmasiPinBaru.length > 1)}
                        helperText={(konfirmasiPinBaru.length > 1 && konfirmasiPinBaru.length < 6) ? 'PIN harus 6 digit atau PIN' : (konfirmasiPinBaru !== pinBaru && konfirmasiPinBaru.length > 1) && 'PIN tidak cocok'}
                    />
                </div>
                <PrimaryButton
                    loading={loadingChangePIN}
                    disabled={!readyToSubmit || loadingChangePIN}
                    onClick={handleChangePIN}
                >
                    Ubah
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalChangePIN
