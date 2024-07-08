import { useCallback, useEffect, useState } from "react"
import ModalLayout from "../ModalLayout"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useAppContext } from "@/context"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { roleSuggestion } from "@/api/role"
import { Icon } from "@iconify/react"
import { createUser } from "@/api/users-management/users"
import ErrorMessage from "../ErrorMessage"

const ModalAddKaryawan = ({ open, setOpen, refresh }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [ID, setID] = useState('')
    const [nik, setNik] = useState('')
    const [Nama, setNama] = useState('')
    const [phone, setPhone] = useState('')
    const [Email, setEmail] = useState('')
    const [gender, setGender] = useState('male')
    const [birthDate, setBirthDate] = useState(dayjs())
    const [jabatan, setJabatan] = useState({})
    const [listRole, setListRole] = useState([])
    const [loadingListRole, setLoadingListRole] = useState(false)
    const [loadingCreateKaryawan, setLoadingCreateKaryawan] = useState(false)
    const [isReadySubmit, setIsReadySubmit] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleAddKaryawan = useCallback(async () => {
        if (!unitKerja) return
        setLoadingCreateKaryawan(true)
        setErrorMessage('')
        const body = {
            name: Nama,
            email: Email,
            phone: phone,
            role_id: Number(jabatan?.value),
            gender: gender,
            birth_date: dayjs(birthDate).format('YYYY-MM-DD'),
            reference_id: ID
        }
        const response = await createUser(unitKerja.id, body)
        const { data } = response
        console.log(response?.response?.data?.message?.description)
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Karyawan berhasil ditambahkan',
                severity: 'success'
            })
            setOpen(false)
            refresh()
        } else {
            setErrorMessage(response?.response?.data?.message?.description)
        }
        setLoadingCreateKaryawan(false)
    }, [unitKerja, Nama, Email, phone, jabatan, gender, birthDate, ID, setOpenSnackbar, setOpen, refresh])

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
        if (Nama && Email && jabatan && birthDate && phone &&gender) {
            setIsReadySubmit(true)
        } else {
            setIsReadySubmit(false)
        }
    }, [Email, Nama, birthDate, gender, jabatan, phone])

    useEffect(() => {
        if (open) {
            handleListRole()
            setID('')
            setNama('')
            setPhone('')
            setEmail('')
        }
    }, [handleListRole, open])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title="Tambah Karyawan"
        >
            <div className="space-y-6">
                <form className="space-y-6">
                    <ErrorMessage
                        message={errorMessage}
                        setMessage={setErrorMessage}
                    />
                    <div className="max-h-[50vh] overflow-y-auto py-2 space-y-4">
                        <TextField
                            label="ID"
                            value={ID}
                            onChange={(e) => setID(e.target.value)}
                            fullWidth
                            placeholder="Opsional"
                        />
                        <TextField
                            label="NIK"
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Nama Lengkap"
                            value={Nama}
                            onChange={(e) => setNama(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Nomor Telepon"
                            value={phone}
                            onChange={(e) => {
                                const re = /^[+]?[0-9\b]+$/;
                                if (e.target.value === '' || re.test(e.target.value)) {
                                    setPhone(e.target.value);
                                }
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            type="email"
                        />
                        <FormControl fullWidth>
                            <InputLabel >Jenis Kelamin</InputLabel>
                            <Select
                                value={gender}
                                label="Jenis Kelamin"
                                onChange={(e) => setGender(e.target.value)}

                            >
                                <MenuItem value={'male'}>Laki-laki</MenuItem>
                                <MenuItem value={'female'}>perempuan</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className="w-full"
                                label="Tanggal Lahir (MM/DD/YYYY)"
                                value={birthDate}
                                onChange={(newValue) => setBirthDate(newValue)}
                            />
                        </LocalizationProvider>
                        <Autocomplete
                            disablePortal
                            loading={loadingListRole}
                            value={jabatan?.name}
                            onChange={(event, newValue) => { setJabatan(newValue) }}
                            options={listRole}
                            className="w-full"
                            renderInput={(params) => <TextField {...params} label="Jabatan" />}
                        />

                    </div>
                    <div className="flex justify-end">
                        <Button
                            className="w-full md:w-fit"
                            variant="contained"
                            size="large"
                            disabled={loadingCreateKaryawan || !isReadySubmit}
                            onClick={handleAddKaryawan}
                        >
                            {loadingCreateKaryawan ? <Icon icon='mdi:loading' className='text-[27px] animate-spin' /> : 'Tambahkan'}
                        </Button>
                    </div>
                </form>
            </div>
        </ModalLayout>
    )
}

export default ModalAddKaryawan