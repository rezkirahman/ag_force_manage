import { useEffect, useCallback, useState } from "react"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"
import { useParams } from "next/navigation"
import { useAppContext } from "@/context"
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Icon } from "@iconify/react"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { updateProfilingData, suggestRelationship, createProfilingData, updateProfilingKeluarga } from "@/api/users-management/profiling"
import ImageField from "@/components/ImageField"
import AddressForm from "../profiling/AddressForm"
import { toLower } from "lodash"
import { uploadFile } from "@/api/upload"

const ModalAddEditKeluarga = ({ open, setOpen, refresh, title, family, edit = false }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [suggestRelationshipFamily, setSuggestRelationshipFamily] = useState([])
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [selectedRelationship, setSelectedRelationship] = useState('')
    const [name, setName] = useState('')
    const [photo, setPhoto] = useState('')
    const [birthPlace, setBirthPlace] = useState('')
    const [birthDate, setBirthDate] = useState(dayjs())
    const [lastEducation, setLastEducation] = useState('')
    const [phone, setPhone] = useState('')
    const [work, setWork] = useState('')
    const [alive, setAlive] = useState(true)
    const [postalCodeDomisili, setPostalCodeDomisili] = useState({})
    const [postalCodeDomisiliId, setPostalCodeDomisiliId] = useState(0)
    const [alamatDomisili, setAlamatDomisili] = useState('')
    const [postalCodeKTP, setPostalCodeKTP] = useState({})
    const [postalCodeKTPId, setPostalCodeKTPId] = useState(0)
    const [alamatKTP, setAlamatKTP] = useState('')

    const handleClick = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            relationship: selectedRelationship,
            name: name,
            photo: photo?.type ? await uploadFile(unitKerja.id, photo, 'family') : photo,
            place_birth: birthPlace,
            date_birth: dayjs(birthDate).format('DD/MM/YYYY'),
            last_education: lastEducation,
            phone: phone,
            work: work,
            alive: alive,
            postal_code_domisili_id: postalCodeDomisiliId,
            alamat_domisili: alamatDomisili,
            postal_code_ktp_id: postalCodeKTPId,
            alamat_ktp: alamatKTP,
            is_alamat_sama: false,
            is_emergency: false
        }
        const { data } = await (edit ? updateProfilingKeluarga : createProfilingData)({
            type: toLower(title),
            unitKerja: unitKerja.id,
            id: params.id,
            body: body,
            childId: family?.id
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah family'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah family'
            })
        }
        setLoadingUpdate(false)
    }, [alamatDomisili, alamatKTP, alive, birthDate, birthPlace, edit, family?.id, lastEducation, name, params.id, phone, photo, postalCodeDomisiliId, postalCodeKTPId, refresh, selectedRelationship, setOpen, setOpenSnackbar, title, unitKerja, work])

    const handleSuggestRelationship = useCallback(async () => {
        if (!unitKerja) return

        const { data } = await suggestRelationship({ unitKerja: unitKerja.id })
        if (data?.data) {
            setSuggestRelationshipFamily(data?.data?.relation_family)
        }
    }, [unitKerja])

    useEffect(() => {
        if (open) {
            handleSuggestRelationship()
            if (edit) {
                setSelectedRelationship(family?.relationship)
                setName(family?.name)
                setPhoto(family?.photo)
                setBirthPlace(family?.place_birth)
                setBirthDate(dayjs(family?.date_birth, 'DD/MM/YYYY'))
                setLastEducation(family?.last_education)
                setPhone(family?.phone)
                setWork(family?.work)
                setAlive(family?.alive)
                setPostalCodeDomisili(family?.postal_code_domisili)
                setPostalCodeDomisiliId(family?.postal_code_domisili_id)
                setAlamatDomisili(family?.alamat_domisili)
                setPostalCodeKTP(family?.postal_code_ktp)
                setPostalCodeKTPId(family?.postal_code_ktp_id)
                setAlamatKTP(family?.alamat_ktp)
            } else {
                setSelectedRelationship('')
                setName('')
                setPhoto('')
                setBirthPlace('')
                setBirthDate(dayjs('22 May 1999'))
                setLastEducation('')
                setPhone('')
                setWork('')
                setAlive(true)
                setPostalCodeDomisili({})
                setPostalCodeDomisiliId(0)
                setAlamatDomisili('')
                setPostalCodeKTP({})
                setPostalCodeKTPId(0)
                setAlamatKTP('')
            }
        }
    }, [open, edit, handleSuggestRelationship, family])

    return (
        <ModalEditProfilingLayout
            open={open}
            setOpen={setOpen}
            title={title}
            refresh={refresh}
            loading={loadingUpdate}
            handleClick={handleClick}
            edit={edit}
        >
            <div className="space-y-4">
                <FormControl fullWidth>
                    <InputLabel>Hubungan</InputLabel>
                    <Select
                        label="Hubungan"
                        value={selectedRelationship}
                        onChange={(e) => setSelectedRelationship(e.target.value)}
                    >
                        {suggestRelationshipFamily?.map((item, i) => (
                            <MenuItem key={i} value={item}>{item}</MenuItem>
                        ))}

                    </Select>
                </FormControl>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Nama"
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
                <div className="w-1/2 md:w-1/4">
                    <h3 className="font-medium">Foto</h3>
                    <div className="w-full aspect-square">
                        <ImageField
                            imageFile={photo}
                            setImageFile={setPhoto}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            className="w-full"
                            label="Tanggal Lahir"
                            format="DD MMM YYYY"
                            value={birthDate}
                            onChange={(newValue) => {
                                setBirthDate(newValue)
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        label="Tempat Lahir"
                        fullWidth
                    />
                </div>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <FormControl fullWidth>
                        <InputLabel>Pendidikan Terakhir</InputLabel>
                        <Select
                            label="Pendidikan Terakhir"
                            value={lastEducation}
                            onChange={(e) => setLastEducation(e.target.value)}
                        >
                            <MenuItem value='SD'>SD</MenuItem>
                            <MenuItem value='SMP'>SMP</MenuItem>
                            <MenuItem value='SMA'>SMA</MenuItem>
                            <MenuItem value='S1'>S1</MenuItem>
                            <MenuItem value='S2'>S2</MenuItem>
                            <MenuItem value='S3'>S3</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={alive}
                            onChange={(e) => setAlive(e.target.value)}
                        >
                            <MenuItem value={true}>Hidup</MenuItem>
                            <MenuItem value={false}>meninggal Dunia</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <TextField
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    label="pekerjaan Terakhir"
                    fullWidth
                />
                <h3 className="font-medium">Alamat KTP</h3>
                <AddressForm
                    data={postalCodeKTP}
                    setID={setPostalCodeKTPId}
                />
                <TextField
                    value={alamatKTP}
                    onChange={(e) => setAlamatKTP(e.target.value)}
                    label="Alamat KTP"
                    fullWidth
                />
                <h3 className="font-medium">Alamat Domisili</h3>
                <AddressForm
                    data={postalCodeDomisili}
                    setID={setPostalCodeDomisiliId}
                />
                <TextField
                    value={alamatDomisili}
                    onChange={(e) => setAlamatDomisili(e.target.value)}
                    label="Alamat Domisili"
                    fullWidth
                />
            </div>
        </ModalEditProfilingLayout>
    )
}

export default ModalAddEditKeluarga