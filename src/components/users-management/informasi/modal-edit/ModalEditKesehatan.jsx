import { useEffect, useCallback, useState, useRef } from "react"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"
import { useParams } from "next/navigation"
import { useAppContext } from "@/context"
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import TagsField from "@/components/TagsField"
import { Icon } from "@iconify/react"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { updateProfilingData } from "@/api/users-management/profiling"


const ModalEditKesehatan = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [sport, setSport] = useState(false)
    const [smoker, setSmoker] = useState(false)
    const [drinker, setDrinker] = useState(false)
    const [height, setHeight] = useState(0)
    const [weight, setWeight] = useState(0)
    const [mata, setMata] = useState({
        dioptri_minus_kiri: 0,
        dioptri_minus_kanan: 0,
        dioptri_plus_kiri: 0,
        dioptri_plus_kanan: 0,
        dioptri_silindris_kiri: 0,
        dioptri_silindris_kanan: 0,
    })
    const [blood, setBlood] = useState('A+')
    const [hospitalized, setHospitalized] = useState(false)
    const [hospitalizedCount, setHospitalizedCount] = useState(0)
    const [hospitalizedReason, setHospitalizedReason] = useState('')
    const [personalDisease, setPersonalDisease] = useState('')
    const [familyDisease, setFamilyDisease] = useState('')
    const [personalMedicine, setPersonalMedicine] = useState('')
    const [allergy, setAllergy] = useState('')
    const [weakness, setWeakness] = useState(false)
    const [weaknessPart, setWeaknessPart] = useState('')
    const [vaccines, setVaccines] = useState([])
    const divRef = useRef(null)

    const handleInputChangeMata = (field, e) => {
        const value = e.target.value;
        if (/^-?\d*\.?\d*$/.test(value)) {
            setMata({ ...mata, [field]: value });
        }
    }

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            is_most_olahraga: sport,
            is_perokok: smoker,
            is_most_alkohol: drinker,
            tinggi_badan: Number(height),
            berat_badan: Number(weight),
            dioptri_minus_kiri: parseFloat(mata.dioptri_minus_kiri),
            dioptri_minus_kanan: parseFloat(mata.dioptri_plus_kanan),
            dioptri_plus_kiri: parseFloat(mata.dioptri_plus_kiri),
            dioptri_plus_kanan: parseFloat(mata.dioptri_plus_kanan),
            dioptri_silindris_kiri: parseFloat(mata.dioptri_silindris_kiri),
            dioptri_silindris_kanan: parseFloat(mata.dioptri_silindris_kanan),
            golongan_darah: blood,
            is_rawat_inap: hospitalized,
            jumlah_rawat_inap: Number(hospitalizedCount),
            reason_rawat_inap: hospitalizedReason,
            penyakit_pribadi: personalDisease,
            penyakit_keluarga: familyDisease,
            obat_pribadi: personalMedicine,
            alergi: allergy,
            is_kelemahan_tubuh: weakness,
            kelamahan_tubuh: weaknessPart,
            vaksins: vaccines
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
                message: 'Berhasil mengubah data kesehatan'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data kesehatan'
            })
        }
        setLoadingUpdate(false)
    }, [allergy, blood, drinker, familyDisease, height, hospitalized, hospitalizedCount, hospitalizedReason, mata, params.id, personalDisease, personalMedicine, refresh, setOpen, setOpenSnackbar, smoker, sport, title, unitKerja, vaccines, weakness, weaknessPart, weight])

    useEffect(() => {
        if (open) {
            setSport(data?.is_most_olahraga)
            setSmoker(data?.is_perokok)
            setDrinker(data?.is_most_alkohol)
            setHeight(data?.tinggi_badan)
            setWeight(data?.berat_badan)
            setMata({
                dioptri_minus_kiri: data?.dioptri_minus_kiri,
                dioptri_minus_kanan: data?.dioptri_minus_kanan,
                dioptri_plus_kiri: data?.dioptri_plus_kiri,
                dioptri_plus_kanan: data?.dioptri_plus_kanan,
                dioptri_silindris_kiri: data?.dioptri_silindris_kiri,
                dioptri_silindris_kanan: data?.dioptri_silindris_kanan
            })
            setBlood(data?.golongan_darah || 'A+')
            setHospitalized(data?.is_rawat_inap)
            setHospitalizedCount(data?.jumlah_rawat_inap)
            setHospitalizedReason(data?.reason_rawat_inap)
            setPersonalDisease(data?.penyakit_pribadi || [])
            setFamilyDisease(data?.penyakit_keluarga || [])
            setPersonalMedicine(data?.obat_pribadi || [])
            setAllergy(data?.alergi || [])
            setWeakness(data?.is_kelemahan_tubuh)
            setWeaknessPart(data?.kelamahan_tubuh)
            setVaccines(data?.vaksins || [])
        }
    }, [open, data])

    return (
        <ModalEditProfilingLayout
            open={open}
            setOpen={setOpen}
            title={title}
            refresh={refresh}
            loading={loadingUpdate}
            handleClick={handleUpdate}
        >
            <FormControl fullWidth>
                <InputLabel htmlFor='sport'>Sering berolahraga</InputLabel>
                <Select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    label='Sering berolahraga'
                >
                    <MenuItem value={true}>Ya</MenuItem>
                    <MenuItem value={false}>Tidak</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel htmlFor='smoker'>Merokok</InputLabel>
                <Select
                    value={smoker}
                    onChange={(e) => setSmoker(e.target.value)}
                    label='Merokok'
                >
                    <MenuItem value={true}>Ya</MenuItem>
                    <MenuItem value={false}>Tidak</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel htmlFor='drinker'>Social Drinker</InputLabel>
                <Select
                    value={drinker}
                    onChange={(e) => setDrinker(e.target.value)}
                    label='Social Drinker'
                >
                    <MenuItem value={true}>Ya</MenuItem>
                    <MenuItem value={false}>Tidak</MenuItem>
                </Select>
            </FormControl>
            <div className="grid grid-cols-2 gap-3">
                <TextField
                    label='Tinggi Badan'
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: <InputAdornment position='end'>cm</InputAdornment>
                    }}
                    type="number"
                />
                <TextField
                    label='Berat Badan'
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    fullWidth
                    InputProps={{
                        endAdornment: <InputAdornment position='end'>kg</InputAdornment>
                    }}
                    type="number"
                />
            </div>
            <FormControl fullWidth>
                <InputLabel>Golongan Darah</InputLabel>
                <Select
                    value={blood}
                    label="Golongan Darah"
                    onChange={(e) => setBlood(e.target.value)}
                >
                    <MenuItem value={'A+'}>A+</MenuItem>
                    <MenuItem value={'B+'}>B+</MenuItem>
                    <MenuItem value={'A-'}>A-</MenuItem>
                    <MenuItem value={'B-'}>B-</MenuItem>
                    <MenuItem value={'AB-'}>AB-</MenuItem>
                    <MenuItem value={'AB+'}>AB+</MenuItem>
                    <MenuItem value={'O+'}>O+</MenuItem>
                    <MenuItem value={'O-'}>O-</MenuItem>
                </Select>
            </FormControl>
            <hr />
            <h3>Pemeriksaan Mata</h3>
            <div className="grid gap-3 md:grid-cols-2">
                <TextField
                    label='Dioptri Minus (Kiri)'
                    value={mata.dioptri_minus_kiri}
                    onChange={(e) => handleInputChangeMata('dioptri_minus_kiri', e)}
                    fullWidth
                />
                <TextField
                    label='Dioptri Plus (Kiri)'
                    value={mata.dioptri_plus_kiri}
                    onChange={(e) => handleInputChangeMata('dioptri_plus_kiri', e)}
                    fullWidth
                />
                <TextField
                    label='Dioptri Silindris (Kiri)'
                    value={mata.dioptri_silindris_kiri}
                    onChange={(e) => handleInputChangeMata('dioptri_silindris_kiri', e)}
                    fullWidth
                />
                <TextField
                    label='Dioptri Minus (Kanan)'
                    value={mata.dioptri_minus_kanan}
                    onChange={(e) => handleInputChangeMata('dioptri_minus_kanan', e)}
                    fullWidth
                />
                <TextField
                    label='Dioptri Plus (Kanan)'
                    value={mata.dioptri_plus_kanan}
                    onChange={(e) => handleInputChangeMata('dioptri_plus_kanan', e)}
                    fullWidth
                />
                <TextField
                    label='Dioptri Silindris (Kanan)'
                    value={mata.dioptri_silindris_kanan}
                    onChange={(e) => handleInputChangeMata('dioptri_silindris_kanan', e)}
                    fullWidth
                />
            </div>
            <hr />
            <h3>Pengalaman Rawat Inap</h3>
            <FormControl fullWidth>
                <InputLabel htmlFor='hospitalized'>Pernah Rawat Inap</InputLabel>
                <Select
                    value={hospitalized}
                    onChange={(e) => setHospitalized(e.target.value)}
                    label='Pernah Rawat Inap'
                >
                    <MenuItem value={true}>Ya</MenuItem>
                    <MenuItem value={false}>Tidak</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label='Jumlah Rawat Inap'
                value={hospitalizedCount}
                onChange={(e) => setHospitalizedCount(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position='end'>Hari</InputAdornment>
                }}
                fullWidth
                type="number"
            />
            <TextField
                label='Penyebab Rawat Inap'
                value={hospitalizedReason}
                onChange={(e) => setHospitalizedReason(e.target.value)}
                fullWidth
            />
            <TagsField
                chipData={personalDisease}
                setChipData={setPersonalDisease}
                title={'Riwayat Penyakit Pribadi'}
                helperText={'Tekan Enter atau Koma (,) untuk menambahkan.'}
            />
            <TagsField
                chipData={familyDisease}
                setChipData={setFamilyDisease}
                title={'Riwayat Penyakit Keluarga'}
                helperText={'Tekan Enter atau Koma (,) untuk menambahkan.'}
            />
            <TagsField
                chipData={personalMedicine}
                setChipData={setPersonalMedicine}
                title={'Obat Pribadi'}
                helperText={'Tekan Enter atau Koma (,) untuk menambahkan.'}
            />
            <TagsField
                chipData={allergy}
                setChipData={setAllergy}
                title={'Alergi'}
                helperText={'Tekan Enter atau Koma (,) untuk menambahkan.'}
            />
            <hr />
            <h3>Kelemahan Anggota Tubuh</h3>
            <FormControl fullWidth>
                <InputLabel htmlFor='weakness'>Kelemahan Pada Anggota Tubuh</InputLabel>
                <Select
                    value={weakness}
                    onChange={(e) => setWeakness(e.target.value)}
                    label='Kelemahan Pada Anggota Tubuh'
                >
                    <MenuItem value={true}>Ya</MenuItem>
                    <MenuItem value={false}>Tidak</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label='Bagian Lemah Anggota Tubuh'
                value={weaknessPart}
                onChange={(e) => setWeaknessPart(e.target.value)}
                fullWidth
            />
            <hr />
            <div className="flex items-start justify-between">
                <h3 className="font-semibold">Vaksin Covid 19</h3>
                <IconButton
                    onClick={() => {
                        setVaccines([...vaccines, { vaksin: '', tanggal: dayjs().format('DD/MM/YYYY') }])
                        setTimeout(() => {
                            if (divRef.current) {
                                divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            }
                        }, 0)
                    }}
                    color="primary"
                    size="medium"
                    className="text-white bg-primary hover:bg-primary"
                >
                    <Icon icon='akar-icons:plus' />
                </IconButton>
            </div>
            <div ref={divRef}>
                <Vaccines vaccines={vaccines} setVaccines={setVaccines} />
            </div>
        </ModalEditProfilingLayout>
    )
}

export default ModalEditKesehatan

const Vaccines = ({ vaccines, setVaccines }) => {

    const handleRemoveVaccine = (index) => {
        const updatedVaccines = [...vaccines]
        updatedVaccines.splice(index, 1)
        setVaccines(updatedVaccines)
    }

    const handleVaccineChange = (index, field, value) => {
        let updatedVaccines = [...vaccines]
        updatedVaccines[index] = { ...updatedVaccines[index], [field]: value }
        setVaccines(updatedVaccines)
    }

    return (
        <div className='space-y-3'>
            {vaccines?.map((data, index) => (
                <div key={index} className='p-4 space-y-2 rounded-xl bg-slate-100'>
                    <div className='flex items-center justify-between'>
                        <h3>Vaksin {index + 1}</h3>
                        <IconButton
                            onClick={() => handleRemoveVaccine(index)}
                            className='text-white bg-red-700 hover:bg-red-700'
                            size="small"
                        >
                            <Icon icon='akar-icons:minus' />
                        </IconButton>
                    </div>
                    <div className='space-y-3'>
                        <TextField
                            value={data.vaksin}
                            onChange={(e) => handleVaccineChange(index, 'vaksin', e.target.value)}
                            label='Jenis Vaksin'
                            variant='outlined'
                            fullWidth
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="tanggal"
                                value={dayjs(data.tanggal, 'DD/MM/YYYY')}
                                onChange={(newValue) => handleVaccineChange(index, 'tanggal', dayjs(newValue).format('DD/MM/YYYY'))}
                                className='w-full'
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            ))}
        </div>
    )
}