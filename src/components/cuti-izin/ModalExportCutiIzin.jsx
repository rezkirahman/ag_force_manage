import { useState, useEffect, useCallback } from 'react'
import ModalLayout from '../ModalLayout'
import PrimaryButton from '../PrimaryButton'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Autocomplete, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useAppContext } from '@/context'
import { exportSaldoCuti, suggestTypeCutiIzin } from '@/api/cuti&izin/cutiIzin'
import { useRouter } from 'next/navigation'

const ModalExportCutiIzin = ({ open, setOpen }) => {
    const router = useRouter()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [allowSubmit, setAllowSubmit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(dayjs().startOf('month'))
    const [end, setEnd] = useState(dayjs())
    const [suggestType, setSuggestType] = useState([])
    const [selectedtype, setSelectedtype] = useState([])
    const [appliedAllType, setAppliedAllType] = useState(true)

    const handleSuggestType = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await suggestTypeCutiIzin({ unitKerja: unitKerja.id })
        if (data?.data) {
            setSuggestType(data?.data)
        }
    }, [unitKerja])

    const handleExport = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await exportSaldoCuti({
            unitKerja: unitKerja.id,
            body: {
                start_date: dayjs(start).format('YYYY-MM-DD'),
                end_date: dayjs(end).format('YYYY-MM-DD'),
                user_id: [],
                category_id: appliedAllType ? [] : selectedtype.map(item => item.id),
                export_type: 'excel'
            }
        })
        if (data?.data) {
            router.push(data?.data)
            setOpenSnackbar({
                open: true,
                message: 'Export Berhasil',
                severity: 'success'
            })
        }
        setLoading(false)
    }, [appliedAllType, end, router, selectedtype, setOpenSnackbar, start, unitKerja])

    useEffect(() => {
        if (open) {
            setAppliedAllType(true)
            setStart(dayjs().startOf('month'))
            setEnd(dayjs())
            setSelectedtype([])
            handleSuggestType()
        }
    }, [handleSuggestType, open])

    useEffect(() => {
        setAllowSubmit(start && end && (appliedAllType || selectedtype.length > 0) && !start.isAfter(end))
    }, [appliedAllType, end, selectedtype, start])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Export Cuti & Izin'}
        >
            <div className='overflow-y-auto h-[40vh] pr-2 py-2 space-y-4'>
                {!appliedAllType && (
                    <Autocomplete
                        disablePortal
                        disableCloseOnSelect
                        multiple
                        value={selectedtype || []}
                        onChange={(event, newValue) => {
                            setSelectedtype(newValue)
                        }}
                        filterOptions={(options) => options.filter(option => !selectedtype.includes(option))}
                        options={suggestType || []}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label='Kategori' helperText="Dapat dipilih lebih dari satu." />}
                    />
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='flex items-center gap-3'>
                        <DatePicker
                            label="Mulai"
                            className='w-full'
                            value={start}
                            onChange={(value) => setStart(value)}
                            format='DD MMM YYYY'
                            maxDate={end}
                        />
                        <div>-</div>
                        <DatePicker
                            label="Berakhir"
                            className='w-full'
                            value={end}
                            onChange={(value) => setEnd(value)}
                            format='DD MMM YYYY'
                            minDate={start}
                        />
                    </div>
                </LocalizationProvider>
            </div>
            <div className='flex flex-wrap justify-between gap-6'>
                <FormControlLabel
                    label="Semua Kategori"
                    control={
                        <Checkbox
                            checked={appliedAllType}
                            onChange={(e) => setAppliedAllType(e.target.checked)}
                        />
                    }
                />
                <PrimaryButton
                    loading={loading}
                    onClick={handleExport}
                    className={'w-full md:w-1/4'}
                    disabled={loading || !allowSubmit}
                >
                    Export
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalExportCutiIzin