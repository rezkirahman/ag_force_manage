import { useState, useEffect, useCallback } from 'react'
import ModalLayout from '../ModalLayout'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Autocomplete, Button, TextField } from '@mui/material'
import { Icon } from '@iconify/react'
import { useAppContext } from '@/context'
import { exportJournalActivity, userSuggestionsExport } from '@/api/journal/journal'
import { useRouter } from 'next/navigation'

const ModalExportJournal = ({ open, setOpen }) => {
    const router = useRouter()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingExport, setLoadingExport] = useState(false)
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'))
    const [endDate, setEndDate] = useState(dayjs())
    const [suggestionUser, setSuggestionUser] = useState([])
    const [selectedUser, setSelectedUser] = useState([])

    const handleSuggestionUser = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await userSuggestionsExport({
            unitKerja: unitKerja.id
        })
        if (data?.data) {
            setSuggestionUser(data?.data)
        }
    }, [unitKerja])

    const handleExportJournal = useCallback(async () => {
        if (!unitKerja) return
        setLoadingExport(true)
        const { data } = await exportJournalActivity({
            unitKerja: unitKerja.id,
            body: {
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
                user_id: selectedUser.map(item => item.UserId),
                export_type: 'excel',
            }
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Berhasil export jurnal',
                severity: 'success'
            })
            router.push(data?.data)
            setOpen(false)
        }
        setLoadingExport(false)
    }, [endDate, router, selectedUser, setOpen, setOpenSnackbar, startDate, unitKerja])

    useEffect(() => {
        if (open) {
            handleSuggestionUser()
        }
    }, [handleSuggestionUser, open])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Export Jurnal'}
        >
            <div className='space-y-3 h-[50vh] overflow-y-auto py-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='flex items-center gap-3'>
                        <DatePicker
                            label="Mulai"
                            className='w-full'
                            value={startDate}
                            onChange={(value) => setStartDate(value)}
                            format='DD MMM YYYY'
                        />
                        <div>-</div>
                        <DatePicker
                            label="Berakhir"
                            className='w-full'
                            value={endDate}
                            onChange={(value) => setEndDate(value)}
                            format='DD MMM YYYY'
                        />
                    </div>
                </LocalizationProvider>
                <Autocomplete
                    disablePortal
                    disableCloseOnSelect
                    multiple
                    value={selectedUser || []}
                    onChange={(event, newValue) => {
                        setSelectedUser(newValue)
                    }}
                    options={suggestionUser || []}
                    getOptionLabel={(option) => option.FullName}
                    isOptionEqualToValue={(option, value) => option.UserId === value.UserId}
                    renderInput={(params) => <TextField {...params} label='Karyawan' helperText="Kosongkan untuk mendapatkan seluruh karyawan." />}
                />
            </div>
            <Button
                size='large'
                onClick={handleExportJournal}
                fullWidth
                variant="contained"
            >
                {loadingExport ? <Icon icon='mdi:loading' className='text-[27px] animate-spin' /> : 'Export'}
            </Button>
        </ModalLayout>
    )
}

export default ModalExportJournal