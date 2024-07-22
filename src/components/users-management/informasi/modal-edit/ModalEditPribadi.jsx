import { useParams } from "next/navigation"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"
import { useCallback, useState, useEffect } from "react"
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import dayjs from "dayjs"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useAppContext } from "@/context"
import AddressForm from "../profiling/AddressForm"
import { updatePribadiProfiling, updateProfilingData } from "@/api/users-management/profiling"

const ModalEditPribadi = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [jenisIdentitas, setJenisIdentitas] = useState('')
    const [nomorIdentitas, setNomorIdentitas] = useState('')
    const [tempatLahir, setTempatLahir] = useState('')
    const [tanggalLahir, setTanggalLahir] = useState('')
    const [shio, setShio] = useState('')
    const [agama, setAgama] = useState('')
    const [statusPerkawinan, setStatusPerkawinan] = useState('')
    const [idAlamatKTP, setIdAlamatKTP] = useState(0)
    const [alamatKTP, setAlamatKTP] = useState('')
    const [idAlamatDomisili, setIdAlamatDomisili] = useState(0)
    const [alamatDomisili, setAlamatDomisili] = useState('')
    const [rodaDua, setRodaDua] = useState('')
    const [rodaEmpat, setRodaEmpat] = useState('')
    const [facebook, setFacebook] = useState('')
    const [twitter, setTwitter] = useState('')
    const [instagram, setInstagram] = useState('')
    const [linkedIn, setLinkedIn] = useState('')

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            jenis_identitas: jenisIdentitas,
            nomer_identitas: nomorIdentitas,
            tempat_lahir: tempatLahir,
            tanggal_lahir: dayjs(tanggalLahir).format('DD/MM/YYYY'),
            shio: shio,
            agama: agama,
            type_menikah: statusPerkawinan,
            alamat_ktp_id: idAlamatKTP,
            alamat_ktp: alamatKTP,
            alamat_domisili_id: idAlamatDomisili,
            alamat_domisili: alamatDomisili,
            roda_dua: Number(rodaDua),
            roda_empat: Number(rodaEmpat),
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
            linked_in: linkedIn,
        }
        const { data } = await updateProfilingData({
            type: title,
            unitKerja: unitKerja.id,
            id: params.id,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah data pribadi'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data pribadi'
            })
        }
        setLoadingUpdate(false)
    }, [agama, alamatDomisili, alamatKTP, facebook, idAlamatDomisili, idAlamatKTP, instagram, jenisIdentitas, linkedIn, nomorIdentitas, params.id, refresh, rodaDua, rodaEmpat, setOpen, setOpenSnackbar, shio, statusPerkawinan, tanggalLahir, tempatLahir, title, twitter, unitKerja])

    useEffect(() => {
        if (open) {
            setJenisIdentitas(data?.jenis_identitas)
            setNomorIdentitas(data?.nomer_identitas)
            setTempatLahir(data?.tempat_lahir)
            setTanggalLahir(data?.tanggal_lahir ? dayjs(data?.tanggal_lahir, 'DD/MM/YYYY') : dayjs('10/08/1999'))
            setShio(data?.shio)
            setAgama(data?.agama)
            setStatusPerkawinan(data?.type_menikah)
            setAlamatKTP(data?.alamat_ktp)
            setAlamatDomisili(data?.alamat_domisili)
            setRodaDua(data?.roda_dua)
            setRodaEmpat(data?.roda_empat)
            setFacebook(data?.facebook)
            setTwitter(data?.twitter)
            setInstagram(data?.instagram)
            setLinkedIn(data?.linked_in)
        }
    }, [data, open])

    useEffect(() => {
        const siklusShio = ['Monyet', 'Ayam', 'Anjing', 'Babi', 'Tikus', 'Kerbau', 'Macan', 'Kelinci', 'Naga', 'Ular', 'Kuda', 'Kambing']
        setShio(siklusShio[dayjs(tanggalLahir, 'DD/MM/YYYY').year() % 12])
    }, [tanggalLahir])

    return (
        <ModalEditProfilingLayout
            open={open}
            setOpen={setOpen}
            title={title}
            loading={loadingUpdate}
            handleClick={handleUpdate}
        >
            <FormControl fullWidth>
                <InputLabel>Jenis Identitas</InputLabel>
                <Select
                    value={jenisIdentitas}
                    label="Jenis Identitas"
                    onChange={(e) => setJenisIdentitas(e.target.value)}
                >
                    <MenuItem value={"KTP"}>KTP</MenuItem>
                    <MenuItem value={"SIM"}>SIM</MenuItem>
                    <MenuItem value={"PASPOR"}>PASPOR</MenuItem>
                </Select>
            </FormControl>
            <TextField
                value={nomorIdentitas}
                onChange={(e) => {
                    const value = e.target.value
                    if (!isNaN(value) && !value.includes('.')) {
                        setNomorIdentitas(value)
                    }
                }}
                label='Nomor Identitas'
                fullWidth
            />
            <TextField
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                label='Tempat Lahir'
                fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="grid gap-3 md:grid-cols-3">
                    <DatePicker
                        label="Tanggal Lahir"
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e)}
                        className='md:col-span-2'
                        format="DD MMM YYYY"
                    />
                    <TextField
                        label="Shio"
                        value={shio}
                        fullWidth
                        disabled
                    />
                </div>
            </LocalizationProvider>
            <FormControl fullWidth>
                <InputLabel>Agama</InputLabel>
                <Select
                    value={agama?.toLowerCase()}
                    label="Agama"
                    onChange={(e) => setAgama(e.target.value)}
                >
                    <MenuItem value={"protestan"}>Protestan</MenuItem>
                    <MenuItem value={"islam"}>Islam</MenuItem>
                    <MenuItem value={"katolik"}>Katolik</MenuItem>
                    <MenuItem value={"budha"}>Budha</MenuItem>
                    <MenuItem value={"hindu"}>Hindu</MenuItem>
                    <MenuItem value={"kong hu chu"}>Kong Hu Chu</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Status Perkawinan</InputLabel>
                <Select
                    value={statusPerkawinan}
                    label="Status Perkawinan"
                    onChange={(e) => setStatusPerkawinan(e.target.value)}
                >
                    <MenuItem value={"Belum Menikah"}>Belum Menikah</MenuItem>
                    <MenuItem value={"Sudah Menikah"}>Sudah Menikah</MenuItem>
                    <MenuItem value={"Cerai Hidup"}>Cerai Hidup</MenuItem>
                    <MenuItem value={"Cerai Mati"}>Cerai Mati</MenuItem>
                </Select>
            </FormControl>
            <hr />
            <h3>Alamat KTP</h3>
            <AddressForm
                setID={setIdAlamatKTP}
                data={data?.postal_code_ktp}
            />
            <TextField
                value={alamatKTP}
                onChange={(e) => setAlamatKTP(e.target.value)}
                label='Alamat Lengkap'
                variant='outlined'
                className='w-full'
            />
            <hr />
            <h3>Alamat Domisili</h3>
            <AddressForm
                setID={setIdAlamatDomisili}
                data={data?.postal_code_domisili}
            />
            <TextField
                value={alamatDomisili}
                onChange={(e) => setAlamatDomisili(e.target.value)}
                label='Alamat Lengkap'
                variant='outlined'
                className='w-full'
            />
            <hr />
            <h3>Kepemilikan Kendaraan</h3>
            <TextField
                value={rodaDua}
                onChange={(e) => setRodaDua(e.target.value)}
                label='Roda Dua'
                fullWidth
                type="number"
            />
            <TextField
                value={rodaEmpat}
                onChange={(e) => setRodaEmpat(e.target.value)}
                label='Roda Empat'
                fullWidth
                type="number"
            />
            <hr />
            <h3>Sosial Media</h3>
            <TextField
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                label='Facebook'
                fullWidth
            />
            <TextField
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                label='Twitter'
                fullWidth
            />
            <TextField
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                label='Instagram'
                fullWidth
            />
            <TextField
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                label='LinkedIn'
                fullWidth
            />
        </ModalEditProfilingLayout>
    )
}

export default ModalEditPribadi