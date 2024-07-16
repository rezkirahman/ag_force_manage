import { useCallback, useEffect, useState } from 'react'
import ModalLayout from '../ModalLayout'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { useAppContext } from '@/context'
import { roleSuggestion } from '@/api/role'

const ModalFilterJournal = ({ open, setOpen, filter, setFilter }) => {
    const { unitKerja } = useAppContext()
    const [date, setDate] = useState(dayjs())
    const [selectedRole, setSelectedRole] = useState([])
    const [listRole, setListRole] = useState([])
    const [loadingListRole, setLoadingListRole] = useState(false)
    const [status, setStatus] = useState(false)
    const [category, setCategory] = useState([])

    const handleSubmit = () => {
        setFilter({
            date: date,
            role: selectedRole.map((item) => parseInt(item?.value)),
            status: status,
            category: category,
        })
        setOpen(false)
    }

    const handleReset = () => {
        setFilter({
            date: dayjs(),
            role: [],
            status: 0,
            category: []
        })
        setDate(dayjs())
        setSelectedRole([])
        setStatus(0)
        setCategory([])
        setOpen(false)
    }

    const handleListRole = useCallback(async () => {
        if (!unitKerja) return
        setLoadingListRole(true)
        const body = {
            limit: 1000,
            page: 1,
            search: ''
        }
        const { data } = await roleSuggestion(unitKerja.id, body)
        if (data?.data) {
            setListRole(data?.data)
        }
        setLoadingListRole(false)
    }, [unitKerja])

    useEffect(() => {
        handleListRole()
    }, [handleListRole])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title="Filter Jurnal"
        >
            <div className='space-y-3 h-[50vh] overflow-y-auto py-2'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='flex items-center gap-3'>
                        <DatePicker
                            label="Mulai"
                            className='w-full'
                            value={filter.date}
                            onChange={(value) => setDate(value)}
                        />
                        <div>-</div>
                        <DatePicker
                            label="Berakhir"
                            className='w-full'
                            value={filter.date}
                            onChange={(value) => setDate(value)}
                        />
                    </div>
                </LocalizationProvider>
                <Autocomplete
                    disablePortal
                    disableCloseOnSelect
                    multiple
                    loading={loadingListRole}
                    value={selectedRole}
                    onChange={(event, newValue) => { setSelectedRole(newValue) }}
                    options={listRole}
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
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value={0}>Semua</MenuItem>
                        <MenuItem value={true}>Jurnal Terisi</MenuItem>
                        <MenuItem value={false}>Jurnal Kosong</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Kategori Persetujuan</InputLabel>
                    <Select
                        multiple
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        input={<OutlinedInput label="Kategori Persetujuan" />}
                    >
                        <MenuItem value={'disetujui'} key={'disetujui'}>Disetujui</MenuItem>
                        <MenuItem value={'ditolak'} key={'ditolak'}>Ditolak</MenuItem>
                        <MenuItem value={'menunggu'} key={'menunggu'}>Menunggu</MenuItem>
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

export default ModalFilterJournal