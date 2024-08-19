import { roleSuggestion } from "@/api/role"
import { updateProfileProfiling, updateProfilingData } from "@/api/users-management/profiling"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"


const ModalEditProfil = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingListRole, setLoadingListRole] = useState(false)
    const [listRole, setListRole] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [id, setId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [nik, setNik] = useState('')
    const [jk, setJk] = useState('laki-laki')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [bisnisUnit, setBisnisUnit] = useState('')

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
            const origin = data?.data
            setListRole(origin.map(obj => ({
                role_id: Number(obj.value),
                role_name: obj.label
            })))
        }
        setLoadingListRole(false)
    }, [unitKerja])

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            first_name: firstName,
            last_name: lastName,
            nik: nik,
            gender: jk == "Laki-laki" ? 'L' : 'P',
            phone: phone,
            email: email,
            ref_id: id,
            role_id: selectedRole?.map(item => item?.role_id)
        }
        const { data } = await updateProfilingData({
            type: (title + 'e'),
            unitKerja: unitKerja.id,
            id: params.id,
            body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah profil'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah profil'
            })
        }
        setLoadingUpdate(false)
    }, [email, firstName, id, jk, lastName, nik, params.id, phone, refresh, selectedRole, setOpen, setOpenSnackbar, title, unitKerja])

    useEffect(() => {
        if (open) {
            setId(data?.ref_id)
            setFirstName(data?.first_name)
            setLastName(data?.last_name)
            setNik(data?.nik)
            setJk(data?.gender)
            setPhone(data?.phone)
            setEmail(data?.email)
            setBisnisUnit(data?.bisnis_unit)
            setSelectedRole(data?.role)
            handleListRole()
        }
    }, [handleListRole, open, data])

    return (
        <ModalEditProfilingLayout
            open={open}
            setOpen={setOpen}
            title={title}
            loading={loadingUpdate}
            handleClick={handleUpdate}
            edit
        >
            <TextField
                value={id}
                onChange={(e) => setId(e.target.value)}
                label='ID'
                fullWidth
            />
            <TextField
                value={firstName}
                onChange={(e) => setName(e.target.value)}
                label='Nama Depan'
                fullWidth
            />
            <TextField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                label='Nama Belakang'
                fullWidth
            />
            <TextField
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                label='Nomor Induk Karyawan'
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel >Jenis Kelamin</InputLabel>
                <Select
                    value={jk}
                    label="Jenis Kelamin"
                    onChange={(e) => setJk(e.target.value)}
                >
                    <MenuItem value={'Laki-laki'}>Laki-laki</MenuItem>
                    <MenuItem value={'Perempuan'}>Perempuan</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label='No. Telepon'
                placeholder="081234567890"
                variant="outlined"
                className='w-full'
                value={phone}
                onChange={(e) => {
                    const re = /^[0-9\b+-]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      setPhone(e.target.value)
                    }
                }}
            />
            <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label='Email'
                fullWidth
                placeholder='example@gmail.com'
            />
            <Autocomplete
                multiple
                disableCloseOnSelect
                options={listRole}
                filterSelectedOptions
                getOptionLabel={(option) => option?.role_name}
                isOptionEqualToValue={(option, value) => option?.role_id === value?.role_id}
                loading={loadingListRole}
                value={selectedRole}
                onChange={(event, newValue) => {
                    setSelectedRole(newValue)
                }}
                className="w-full"
                renderInput={(params) => <TextField {...params} label="Jabatan" />}
            />
            <TextField
                value={bisnisUnit}
                label='Jabatan'
                fullWidth
                disabled
            />
        </ModalEditProfilingLayout>
    )
}

export default ModalEditProfil