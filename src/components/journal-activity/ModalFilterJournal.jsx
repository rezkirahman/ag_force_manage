import { useCallback, useEffect, useState } from 'react'
import ModalLayout from '../ModalLayout'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Autocomplete, Button, FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { useAppContext } from '@/context'
import { roleSuggestion } from '@/api/role'

const ModalFilterJournal = ({ open, setOpen, filter, setFilter }) => {
    const { unitKerja } = useAppContext()
    const [date, setDate] = useState(dayjs())
    const [selectedRole, setSelectedRole] = useState([])
    const [listRole, setListRole] = useState([])
    const [status, setStatus] = useState(0)
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
                    <DatePicker
                        label="Mulai"
                        className='w-full'
                        value={filter.date}
                        onChange={(value) => setDate(value)}
                        format='DD MMMM YYYY'
                    />
                </LocalizationProvider>
                {listRole.length > 0 && (
                    <Autocomplete
                        disablePortal
                        disableCloseOnSelect
                        multiple
                        value={selectedRole}
                        onChange={(event, newValue) => { setSelectedRole(newValue) }}
                        options={listRole}
                        getOptionLabel={(option) => option?.label}
                        className="w-full"
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Jabatan"
                                helperText="Kosongkan untuk mendapatkan seluruh jabatan"
                            />
                        }
                    />
                )}
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value={0}>Semua</MenuItem>
                        <MenuItem value={1}>Jurnal Terisi</MenuItem>
                        <MenuItem value={2}>Jurnal Kosong</MenuItem>
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
                        <MenuItem value={0} key={'menunggu'}>Menunggu</MenuItem>
                        <MenuItem value={1} key={'disetujui'}>Disetujui</MenuItem>
                        <MenuItem value={2} key={'ditolak'}>Ditolak</MenuItem>
                    </Select>
                    <FormHelperText>Dapat dipilih lebih dari satu</FormHelperText>
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