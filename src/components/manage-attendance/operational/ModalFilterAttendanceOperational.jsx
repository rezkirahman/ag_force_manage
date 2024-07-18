import { useCallback, useEffect, useState } from 'react'
import ModalLayout from '@/components/ModalLayout'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { useAppContext } from '@/context'
import { roleSuggestion } from '@/api/role'
import { suggestLocationAttendance } from '@/api/attendance/attendance'

const ModalFilterAttendanceOperational = ({ open, setOpen, filter, setFilter }) => {
    const { unitKerja } = useAppContext()
    const [date, setDate] = useState(dayjs())
    const [status, setStatus] = useState(0)
    const [selectedRole, setSelectedRole] = useState(null)
    const [listRole, setListRole] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [listLocation, setListLocation] = useState([])
    const [loadingListLocation, setLoadingListLocation] = useState(false)

    const handleSubmit = () => {
        setFilter({
            date: date,
            role: selectedRole,
            status: status,
            location: selectedLocation
        })
        setOpen(false)
    }

    const handleReset = () => {
        setFilter({
            date: dayjs(),
            role: null,
            locationId: 0,
            status: 0,
        })
        setDate(dayjs())
        setSelectedRole(null)
        setStatus(0)
        setOpen(false)
    }

    const handleListRole = useCallback(async () => {
        if (!unitKerja) return
        const body = {
            limit: 1000,
            page: 1,
            search: ''
        }
        const { data } = await roleSuggestion(unitKerja.id, body)
        if (data?.data) {
            setListRole(data?.data)
        }
    }, [unitKerja])

    const handleListLocation = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await suggestLocationAttendance({ unitKerja: unitKerja.id })
        if (data?.data) {
            setListLocation(data?.data)
        }
    }, [unitKerja])

    useEffect(() => {
        if (open) {
            handleListRole()
        }
    }, [handleListRole, open])

    useEffect(() => {
        if (open) {
            handleListLocation()
        }
    }, [handleListLocation, open])

    useEffect(() => {
        if (open) {
            setDate(filter?.date)
            setStatus(filter?.status)
            setSelectedLocation(filter?.location)
            setSelectedRole(filter?.role)
        }
    }, [open, filter])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title="Filter"
        >
            <div className='space-y-3 h-[50vh] overflow-y-auto py-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Tanggal"
                        className='w-full'
                        value={filter.date}
                        onChange={(value) => setDate(value)}
                    />
                </LocalizationProvider>
                {listRole &&
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        value={selectedRole || []}
                        onChange={(event, newValue) => setSelectedRole(newValue)}
                        options={listRole || []}
                        getOptionLabel={(option) => option?.label}
                        isOptionEqualToValue={(option, value) => option?.value === value?.value}
                        className="w-full"
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Jabatan"
                                helperText="Kosongkan untuk mendapatkan seluruh jabatan"
                            />
                        }
                    />
                }
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

export default ModalFilterAttendanceOperational