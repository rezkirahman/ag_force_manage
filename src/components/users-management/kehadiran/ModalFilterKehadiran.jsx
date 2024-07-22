import { useCallback, useEffect, useState } from 'react'
import ModalLayout from '@/components/ModalLayout'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { useAppContext } from '@/context'
import { suggestLocationAttendance } from '@/api/attendance/attendance'

const ModalFilterKehadiran = ({ open, setOpen, filter, setFilter }) => {
    const { unitKerja } = useAppContext()
    const [startDate, setStartDate] = useState(dayjs().startOf('month'))
    const [endDate, setEndDate] = useState(dayjs())
    const [status, setStatus] = useState(0)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [listLocation, setListLocation] = useState([])

    const handleSubmit = () => {
        setFilter({
            starDate: startDate,
            endDate: endDate,
            status: status,
            location: selectedLocation
        })
        setOpen(false)
    }

    const handleReset = () => {
        setFilter({
            starDate: dayjs().startOf('month'),
            endDate: dayjs(),
            location: 0,
            status: 0,
        })
        setOpen(false)
    }

    const handleListLocation = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await suggestLocationAttendance({ unitKerja: unitKerja.id })
        if (data?.data) {
            setListLocation(data?.data)
        }
    }, [unitKerja])

    useEffect(() => {
        if (open) {
            handleListLocation()
        }
    }, [handleListLocation, open])

    useEffect(() => {
        if (open) {
            setStartDate(filter.starDate)
            setEndDate(filter.endDate)
            setStatus(filter.status)
            setSelectedLocation(filter.location)
        }
    }, [open, filter])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title="Filter Kehadiran"
        >
            <div className='space-y-3 h-[50vh] overflow-y-auto py-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='flex items-center gap-3'>
                        <DatePicker
                            label="Awal"
                            className='w-full'
                            value={startDate}
                            onChange={(value) => setStartDate(value)}
                            disableFuture
                            format='DD MMM YYYY'
                        />
                        <div>-</div>
                        <DatePicker
                            label="Akhir"
                            className='w-full'
                            value={endDate}
                            onChange={(value) => setEndDate(value)}
                            disableFuture
                            format='DD MMM YYYY'
                        />

                    </div>
                </LocalizationProvider>
                {listLocation &&
                    <Autocomplete
                        disablePortal
                        value={selectedLocation || null}
                        onChange={(event, newValue) => setSelectedLocation(newValue)}
                        options={listLocation || []}
                        getOptionLabel={(option) => option?.location_name}
                        className="w-full"
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Lokasi"
                                helperText="Kosongkan untuk mendapatkan seluruh lokasi"
                            />
                        }
                    />
                }
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value={0}>Semua</MenuItem>
                        <MenuItem value={1}>Tepat Waktu</MenuItem>
                        <MenuItem value={2}>Terlambat</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <Button
                    variant='outlined'
                    size='large'
                    onClick={handleReset}
                >
                    Reset
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleSubmit}
                >
                    Terapkan
                </Button>
            </div>
        </ModalLayout>
    )
}

export default ModalFilterKehadiran