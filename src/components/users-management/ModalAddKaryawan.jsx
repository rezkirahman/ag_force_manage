import { useCallback, useEffect, useState } from "react"
import ModalLayout from "../ModalLayout"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useAppContext } from "@/context"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { divisionSuggestion, roleSuggestion } from "@/api/role"
import { Icon } from "@iconify/react"
import { createUser } from "@/api/users-management/users"
import ErrorMessage from "../ErrorMessage"
import PrimaryButton from "../PrimaryButton"

const ModalAddKaryawan = ({ open, setOpen, refresh }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [ID, setID] = useState('')
    const [nik, setNik] = useState('')
    const [Nama, setNama] = useState('')
    const [phone, setPhone] = useState('')
    const [Email, setEmail] = useState('')
    const [gender, setGender] = useState('male')
    const [birthDate, setBirthDate] = useState(dayjs('06/06/1999'))
    const [joinDate, setJoinDate] = useState(dayjs())
    const [jabatan, setJabatan] = useState(null)
    const [listRole, setListRole] = useState([])
    const [listDivision, setListDivision] = useState([])
    const [selectedDivision, setSelectedDivision] = useState(null)
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
            role_id: parseInt(jabatan?.value),
            gender: gender,
            birth_date: dayjs(birthDate).format('YYYY-MM-DD'),
            reference_id: ID,
            divisi_id: selectedDivision?.id || 0,
            join_date: joinDate ? dayjs(joinDate).format('YYYY-MM-DD') : '',
        }
        const response = await createUser(unitKerja.id, body)
        const { data } = response
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Karyawan berhasil ditambahkan',
                severity: 'success'
            })
            refresh()
            setOpen(false)
        } else {
            setErrorMessage(response?.response?.data?.message?.description)
        }
        setLoadingCreateKaryawan(false)
    }, [unitKerja, Nama, Email, phone, jabatan, gender, birthDate, ID, selectedDivision, joinDate, setOpenSnackbar, setOpen, refresh])

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

    const handleListDivision = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await divisionSuggestion({
            unitKerja: unitKerja.id,
        })
        if (data?.data) {
            setListDivision(data?.data)
        }
    }, [unitKerja])

    useEffect(() => {
        if (Nama && Email && jabatan && birthDate && phone && gender) {
            setIsReadySubmit(true)
        } else {
            setIsReadySubmit(false)
        }
    }, [Email, Nama, birthDate, gender, jabatan, phone])

    useEffect(() => {
        if (open) {
            setJabatan(null)
            setSelectedDivision(null)
            handleListRole()
            handleListDivision()
            setID('')
            setNama('')
            setNik('')
            setPhone('')
            setEmail('')
        }
    }, [handleListDivision, handleListRole, open])

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
                    <div className="max-h-[50vh] overflow-y-auto py-2 space-y-4 pr-2">
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
                            maxLength={15}
                            onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 15) {
                                    setPhone(e.target.value)
                                }
                            }}
                            placeholder="08123456789"
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
                                label="Tanggal Lahir"
                                value={birthDate}
                                onChange={(newValue) => setBirthDate(newValue)}
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                        {listRole.length > 0 && (
                            <Autocomplete
                                disablePortal
                                value={jabatan}
                                onChange={(event, newValue) => { setJabatan(newValue) }}
                                options={listRole}
                                getOptionLabel={(option) => option?.label}
                                className="w-full"
                                renderInput={(params) => <TextField {...params} label="Jabatan" />}
                            />
                        )}
                        {listDivision.length > 0 && (
                            <Autocomplete
                                disablePortal
                                value={selectedDivision}
                                onChange={(event, newValue) => { setSelectedDivision(newValue) }}
                                options={listDivision}
                                getOptionLabel={(option) => option?.join_direktorat}
                                className="w-full"
                                renderInput={(params) => <TextField {...params} label="Direktorat - Subdirektorat" />}
                            />
                        )}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className="w-full"
                                label="Tanggal Bergabung"
                                value={joinDate}
                                onChange={(newValue) => setJoinDate(newValue)}
                                format="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="flex justify-end">
                        <PrimaryButton
                            disabled={loadingCreateKaryawan || !isReadySubmit}
                            loading={loadingCreateKaryawan}
                            onClick={handleAddKaryawan}
                            className="w-full md:w-1/4"
                        >
                            Tambahkan
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </ModalLayout>
    )
}

export default ModalAddKaryawan