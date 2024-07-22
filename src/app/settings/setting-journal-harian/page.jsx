'use client'
import Container from '@/components/Container'
import Layout from '@/components/Layout'
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import { Alert, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Tooltip } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { settingJournal, updateSettingJournal } from '@/api/settings/journal-harian'

const Page = () => {
    const [loading, setLoading] = useState(false)
    const { setOpenSnackbar, unitKerja } = useAppContext()
    const [reminder, setReminder] = useState(false)
    const [jumlahReminder, setJumlahReminder] = useState(1)
    const [jamNotifikasiPertama, setJamNotifikasiPertama] = useState('08:00')
    const [jamNotifikasiKedua, setJamNotifikasiKedua] = useState('08:00')
    const [title1, setTitle1] = useState('Jurnal Harian Belum Diisi')
    const [description1, setDescription1] = useState('Halo {nama}, jurnal harian belum diisi. Segera isi jurnal harian ya!')
    const [title2, setTitle2] = useState('Jurnal Harian Belum Diisi')
    const [Description2, setDescription2] = useState('Halo {nama}, jurnal harian belum diisi. Segera isi jurnal harian ya!')
    const [checkedBackDate, setCheckedBackDate] = useState(false)
    const [startBackdate, setStartBackdate] = useState(dayjs())
    const [endBackdate, setEndBackdate] = useState(dayjs())
    const [checkedBatasBackDate, setCheckedBatasBackDate] = useState(false)
    const [approvalHierarchy, setApprovalHierarchy] = useState(false)

    const handleChangeReminder = () => {
        setReminder(!reminder)
        if (!reminder) {
            setJumlahReminder(1)
        } else {
            setJumlahReminder(0)
        }
    }

    const handleGetSettingJournal = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const response = await settingJournal(unitKerja.id)
        console.log(response)
        if (response?.data?.data) {
            const res = response.data.data
            setCheckedBackDate(res.backdate_jurnal)
            setReminder(res.notification_jurnal)
            setApprovalHierarchy(res.is_must_approvel)
            setCheckedBatasBackDate(res.default_backdate_jurnal)
            setStartBackdate(res.start_backdate_jurnal ? dayjs(res.start_backdate_jurnal, 'YYYY-MM-DD HH:mm') : dayjs())
            setEndBackdate(res.end_backdate_jurnal ? dayjs(res.end_backdate_jurnal, 'YYYY-MM-DD HH:mm') : dayjs())
            if (res.notification_jurnal) {
                setJumlahReminder(1)
                setJamNotifikasiPertama(res.jurnal_hour_1)
                setTitle1(res.jurnal_title_1)
                setDescription1(res.jurnal_description_1)
            }
            if (res.jurnal_hour_2) {
                setJumlahReminder(2)
                setJamNotifikasiKedua(res.jurnal_hour_2)
                setTitle2(res.jurnal_title_2)
                setDescription2(res.jurnal_description_2)
            }
        }
        else {
            setOpenSnackbar({
                open: true,
                message: response.message,
                severity: 'error'
            })
        }
        setLoading(false)
    }, [setOpenSnackbar, unitKerja])

    const handleUpdateSettingJournal = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            notif_jurnal: jumlahReminder > 0,
            jurnal_title_1: title1,
            jurnal_title_2: jumlahReminder > 1 ? title2 : '',
            jurnal_description_1: description1,
            jurnal_description_2: jumlahReminder > 1 ? Description2 : '',
            jurnal_hour_1: jamNotifikasiPertama,
            jurnal_hour_2: jumlahReminder > 1 ? jamNotifikasiKedua : '',
            backdate_jurnal: checkedBackDate,
            start_backdate_jurnal: startBackdate ? `${startBackdate.format('YYYY-MM-DD')} 00:00` : '',
            end_backdate_jurnal: endBackdate ? `${endBackdate.format('YYYY-MM-DD')} 23:00` : '',
            default_backdate_jurnal: checkedBatasBackDate,
            is_must_approvel: approvalHierarchy,
        }
        const response = await updateSettingJournal(unitKerja.id, body)
        if (response?.status == 200) {
            setOpenSnackbar({ open: true, message: "Perubahan Berhasil", severity: 'success' })
            handleGetSettingJournal()
        } else {
            setOpenSnackbar({ open: true, message: response?.response?.data?.message?.description, severity: 'error' })
        }
        setLoading(false)
    }, [Description2, approvalHierarchy, checkedBackDate, checkedBatasBackDate, description1, endBackdate, handleGetSettingJournal, jamNotifikasiKedua, jamNotifikasiPertama, jumlahReminder, setOpenSnackbar, startBackdate, title1, title2, unitKerja])

    useEffect(() => {
        handleGetSettingJournal()
    }, [handleGetSettingJournal])


    return (
        <Layout>
            <Container>
                <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">Menggunakan Hirearchy Sebagai Approval</h3>
                    <Switch
                        onChange={() => setApprovalHierarchy(!approvalHierarchy)}
                        checked={approvalHierarchy}
                    />
                </div>
            </Container>
            <Container>
                <div className='space-y-3'>
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">Notifikasi Pengingat</h3>
                        <Switch onChange={handleChangeReminder} checked={reminder} />
                    </div>
                    {reminder &&
                        <Alert severity="info" className='rounded-xl'>
                            Catatan: Jika ingin menyebutkan nama user pada deskripsi notifikasi dapat menggunakan <span className='font-semibold'>{'{nama}'}</span>.
                        </Alert>
                    }
                    <div className='py-2'>
                        <FormControl fullWidth>
                            <InputLabel>Jumlah Notifikasi</InputLabel>
                            <Select
                                label="Jumlah Notifikasi"
                                value={jumlahReminder}
                                onChange={(e) => setJumlahReminder(e.target.value)}
                                disabled={!reminder}
                            >
                                <MenuItem value={1}>1 Kali</MenuItem>
                                <MenuItem value={2}>2 Kali</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="w-full mt-5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex flex-col items-start w-full gap-5 md:flex-row">
                                <div className="w-full">
                                    <div className="w-full space-y-1">
                                        <h3>Notifikasi Pertama</h3>
                                        <TextField
                                            type="time"
                                            value={jamNotifikasiPertama}
                                            onChange={(e) => setJamNotifikasiPertama(e.target.value)}
                                            disabled={!reminder}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="flex flex-col mt-4 space-y-2">
                                        <h3 className="text-disable">Naskah Notifikasi {jumlahReminder == 2 ? 'Pertama' : ''}</h3>
                                        <div className='space-y-3'>
                                            <TextField
                                                variant='outlined'
                                                label="judul"
                                                value={title1}
                                                onChange={(e) => setTitle1(e.target.value)}
                                                className='w-full'
                                                disabled={!reminder}
                                            />
                                            <TextField
                                                label="deskripsi"
                                                value={description1}
                                                onChange={(e) => setDescription1(e.target.value)}
                                                variant='outlined'
                                                className='w-full'
                                                disabled={!reminder}
                                                multiline
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={`${reminder && (jumlahReminder == 2) ? "w-8" : "sr-only"} bg-gray-500 md:h-[2px] rounded-full place-self-center`}></div>
                                <div className={reminder && (jumlahReminder == 2) ? 'w-full' : 'w-0 sr-only'}>
                                    <div className="w-full space-y-1">
                                        <h3>Notifikasi Kedua</h3>
                                        <TextField
                                            value={jamNotifikasiKedua}
                                            onChange={(e) => setJamNotifikasiKedua(e.target.value)}
                                            disabled={jumlahReminder !== 2}
                                            className="w-full"
                                            type='time'
                                        />
                                    </div>
                                    <div className="flex flex-col mt-4 space-y-2">
                                        <h3 className="text-disable">Naskah Notifikasi Kedua</h3>
                                        <div className='space-y-3'>
                                            <TextField
                                                value={title2}
                                                label="judul"
                                                onChange={(e) => setTitle2(e.target.value)}
                                                variant='outlined'
                                                className='w-full'
                                                disabled={jumlahReminder !== 2}
                                            />
                                            <TextField
                                                value={Description2}
                                                label="deskripsi"
                                                onChange={(e) => setDescription2(e.target.value)}
                                                variant='outlined'
                                                className='w-full'
                                                disabled={jumlahReminder !== 2}
                                                multiline
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LocalizationProvider>
                    </div>
                </div>
            </Container>
            <Container>
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <Tooltip title="Pemberitahuan pengisian jurnal harian yang terlewati">
                            <h3 className="font-semibold">Kesempatan Isi Jurnal Harian</h3>
                        </Tooltip>
                        <Switch onChange={() => setCheckedBackDate(!checkedBackDate)} checked={checkedBackDate} />
                    </div>
                    <Alert severity="info" className='rounded-xl'>
                        Pemberitahuan pengisian jurnal harian yang terlewati.
                    </Alert>
                    <div className="">
                        <div className="mt-5">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="flex items-center gap-5">
                                    <DatePicker
                                        label="Mulai"
                                        value={startBackdate ? dayjs(startBackdate) : ''}
                                        onChange={(newValue) => setStartBackdate(newValue)}
                                        className="w-full"
                                        disabled={checkedBackDate ? undefined : true}
                                        format='DD MMM YYYY'
                                    />
                                    <div className={`${checkedBackDate && checkedBatasBackDate ? "w-8" : "sr-only"} bg-gray-500 h-[2px] rounded-full`}></div>
                                    <DatePicker
                                        label="Berakhir"
                                        value={endBackdate ? dayjs(endBackdate) : ''}
                                        onChange={(newValue) => setEndBackdate(newValue)}
                                        className={`${checkedBackDate && checkedBatasBackDate ? "w-full" : "w-0 sr-only"}`}
                                        disabled={!(checkedBatasBackDate && checkedBackDate)}
                                        format='DD MMM YYYY'
                                    />
                                </div>
                            </LocalizationProvider>
                        </div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checkedBatasBackDate}
                                    onChange={(e) => setCheckedBatasBackDate(e.target.checked)}
                                    disabled={!checkedBackDate}
                                />
                            }
                            label="memiliki batas waktu pengisian"
                        />
                    </div>

                </div>
            </Container>
            <Button
                fullWidth
                className='sticky bottom-6'
                size='large'
                variant="contained"
                onClick={handleUpdateSettingJournal}
                disabled={loading}
            >
                {loading ? <Icon icon={'mingcute:loading-fill'} className='text-[27px] animate-spin' /> : 'Simpan'}
            </Button>
        </Layout>
    )


}

export default Page