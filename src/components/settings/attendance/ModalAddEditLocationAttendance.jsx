import { createLocationAttendance, oneLocationAttendance, updateLocationAttendance } from '@/api/settings/attendance-location'
import ModalLayout from '@/components/ModalLayout'
import PlacesAutocomplete from '@/components/placesAutocomplete'
import PrimaryButton from '@/components/PrimaryButton'
import { useAppContext } from '@/context'
import { GenerateAddress } from '@/helper/generateAddress'
import { Icon } from '@iconify/react'
import { Alert, Button, InputAdornment, TextField } from '@mui/material'
import { Circle, GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'

const ModalAddEditLocationAttendance = ({ open, setOpen, edit, refresh, id }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const mapsLibraries = ["places"]
    const [namaTempat, setNamaTempat] = useState('')
    const [center, setCenter] = useState({ lat: -6.2088, lng: 106.8456 })
    const [address, setAddress] = useState(center)
    const [radius, setRadius] = useState(100)
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [isAllowSubmit, setIsAllowSubmit] = useState(false)

    const handleOneLocation = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await oneLocationAttendance(unitKerja.id, id)
        if (data?.data) {
            setNamaTempat(data?.data.place_name)
            setCenter({ lat: data?.data.latitude, lng: data?.data.longitude })
            setRadius(data?.data.radius)
            setDescription(data?.data.description)
        }
        setLoading(false)
    }, [id, unitKerja])

    const handleAddLocation = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            place_name: namaTempat,
            latitude: center.lat,
            longitude: center.lng,
            radius: radius,
            address: address,
            description: description
        }
        const { data } = await createLocationAttendance(unitKerja.id, body)
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menambahkan lokasi'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal menambahkan lokasi'
            })
        }
        setLoading(false)
    }, [address, center.lat, center.lng, description, namaTempat, radius, refresh, setOpen, setOpenSnackbar, unitKerja])

    const handleEditLocation = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            place_name: namaTempat,
            latitude: center.lat,
            longitude: center.lng,
            radius: radius,
            address: address,
            description: description
        }
        const { data } = await updateLocationAttendance(unitKerja.id, id, body)
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah lokasi'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah lokasi'
            })
        }
    }, [address, center.lat, center.lng, description, id, namaTempat, radius, refresh, setOpen, setOpenSnackbar, unitKerja])

    useEffect(() => {
        GenerateAddress(center.lat, center.lng).then((response) => {
            setAddress(response)
        })
    }, [center])

    useEffect(() => {
        if (selectedLocation) {
            setCenter(selectedLocation)
        }
    }, [selectedLocation])

    useEffect(() => {
        if (namaTempat && center.lat && center.lng && radius) {
            setIsAllowSubmit(true)
        } else {
            setIsAllowSubmit(false)
        }
    }, [namaTempat, center.lat, center.lng, radius])

    useEffect(() => {
        if (open) {
            if (edit) {
                handleOneLocation()
            } else {
                setNamaTempat('')
                setCenter({ lat: -6.2088, lng: 106.8456 })
                setRadius(100)
                setDescription('')
            }
        }
    }, [edit, handleOneLocation, open])


    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={edit ? 'Edit Lokasi' : 'Tambah Lokasi'}
        >
            <div className='space-y-6'>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 py-1">
                    {!edit && (
                        <Alert severity='info'>Lokasi yang ditambahkan akan digunakan sebagai lokasi kehadiran karyawan.</Alert>
                    )}
                    <TextField
                        value={namaTempat}
                        label='Nama Tempat'
                        variant='outlined'
                        className='w-full'
                        onChange={(e) => setNamaTempat(e.target.value)}
                    />
                    <TextField
                        label="Radius"
                        className="w-full"
                        value={radius}
                        variant="outlined"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(value)) {
                                setRadius(Number(value));
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">Meter</InputAdornment>
                            ),
                        }}
                    />
                    <LoadScriptNext googleMapsApiKey={mapKey} libraries={mapsLibraries}>
                        <div className="relative space-y-2">
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '50vh' }}
                                center={center}
                                onClick={(e) => {
                                    setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                                }}
                                zoom={15}
                                options={{
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: false,
                                    mapTypeId: 'roadmap',
                                }}
                            >
                                <Marker position={center} />
                                <Circle
                                    center={center}
                                    radius={radius}
                                    options={{
                                        strokeColor: '#2465B266',
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                        fillColor: '#2465B2',
                                        fillOpacity: 0.35,
                                    }}
                                />
                                <PlacesAutocomplete setSelected={setSelectedLocation} />
                            </GoogleMap>
                            <TextField
                                value={address}
                                variant="standard"
                                fullWidth
                                className="text-sm"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <div className='pt-2 space-y-3'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <TextField
                                        value={center.lat}
                                        onChange={(e) => setCenter({ lat: parseFloat(e.target.value), lng: center.lng })}
                                        variant="outlined"
                                        label="Latitude"
                                    />
                                    <TextField
                                        value={center.lng}
                                        onChange={(e) => setCenter({ lat: center.lat, lng: parseFloat(e.target.value) })}
                                        variant="outlined"
                                        label="Longitude"
                                    />
                                </div>
                                <TextField
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    variant="outlined"
                                    label="Deskripsi"
                                    fullWidth
                                />
                            </div>
                        </div>
                    </LoadScriptNext>
                </div>
                <div className='flex justify-end'>
                    <PrimaryButton
                        loading={loading}
                        disabled={!isAllowSubmit || loading}
                        onClick={edit ? handleEditLocation : handleAddLocation}
                    >
                        {edit ? 'Simpan' : 'Tambahkan'}
                    </PrimaryButton>
                </div>
            </div>
        </ModalLayout>
    )
}

export default ModalAddEditLocationAttendance