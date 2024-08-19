import { useEffect, useCallback, useState, useRef } from "react"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"
import { useParams } from "next/navigation"
import { useAppContext } from "@/context"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material"
import dayjs from "dayjs"
import { Icon } from "@iconify/react"
import { updateProfilingData } from "@/api/users-management/profiling"

const ModalEditPekerjaan = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const divRef = useRef(null)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [pekerjaanAG, setPekerjaanAG] = useState({
        start_working: "21/06/2022",
        status_working: "PKWTT",
        duration_status: 0,
        commitment: 0
    })
    const [riwayat, setRiwayat] = useState([])

    const handleAddPekerjaan = () => {
        setRiwayat([...riwayat, {
            company: "",
            location: "",
            position: "",
            type: "",
            start: "05/11/2022",
            end: "05/11/2023",
            reason: "",
            higher_name: ""
        }])
    }

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            pekerjaan_ag: pekerjaanAG,
            pekerjaan: riwayat
        }
        const { data } = await updateProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: title,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: data?.data
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                state: true,
                severity: 'error',
                message: 'Gagal Mengubah Pekerjaan'
            })
        }
        setLoadingUpdate(false)
    }, [params?.id, pekerjaanAG, refresh, riwayat, setOpen, setOpenSnackbar, title, unitKerja])

    useEffect(() => {
        if (open) {
            const agwork = data?.pekerjaan_ag
            setPekerjaanAG({
                start_working: agwork.start_working,
                status_working: agwork.status_working,
                duration_status: agwork.duration_status,
                commitment: agwork.commitment
            })
            setRiwayat(data?.pekerjaan_riwayat || [])
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
            <div className="space-y-3">
                <h3 className="font-semibold">Pekerjaan AG</h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dayjs(pekerjaanAG.start_working, 'DD/MM/YYYY')}
                        onChange={(e) => setPekerjaanAG({ ...pekerjaanAG, start_working: dayjs(e).format('DD/MM/YYYY') })}
                        className="w-full"
                        format="DD MMM YYYY"
                    />
                </LocalizationProvider>
                <FormControl fullWidth>
                    <InputLabel>Status Pekerjaan</InputLabel>
                    <Select
                        value={pekerjaanAG.status_working}
                        onChange={(e) => setPekerjaanAG({ ...pekerjaanAG, status_working: e.target.value })}
                        label="Status Pekerjaan"
                    >
                        <MenuItem value={'PKWT'}>Perjajian Kerja Waktu Tertentu</MenuItem>
                        <MenuItem value={'PKWTT'}>Perjajian Kerja Waktu Tidak Tertentu</MenuItem>
                        <MenuItem value={'internship'}>Intership / Magang</MenuItem>
                    </Select>
                </FormControl>
                {(pekerjaanAG.status_working === 'PKWT' || pekerjaanAG.status_working === 'internship') && (
                    <TextField
                        type="number"
                        value={pekerjaanAG.duration_status}
                        onChange={(e) => setPekerjaanAG({ ...pekerjaanAG, duration_status: e.target.value })}
                        label="Durasi Pekerjaan"
                        fullWidth
                    />
                )}
                <TextField
                type="number"
                    value={pekerjaanAG.commitment}
                    onChange={(e) => setPekerjaanAG({ ...pekerjaanAG, commitment: e.target.value })}
                    label="Komitmen"
                    fullWidth
                />
                <div className="sticky z-10 flex items-center justify-between bg-white -top-[9px] py-1">
                    <h3 className="font-semibold">Riwayat Pekerjaan</h3>
                    <Button
                        onClick={() => {
                            handleAddPekerjaan()
                            setTimeout(() => {
                                if (divRef.current) {
                                    divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                }
                            }, 0)
                        }}
                        startIcon={<Icon icon='icon-park-twotone:add-one' />}
                    >
                        Tambah
                    </Button>
                </div>
                <div ref={divRef}>
                    <RiwayatPekerjaan
                        items={riwayat}
                        setItems={setRiwayat}
                    />
                </div>
            </div>
        </ModalEditProfilingLayout>
    )
}

export default ModalEditPekerjaan

const RiwayatPekerjaan = ({ items, setItems }) => {
    const handleRemoveItem = (index) => {
        const updatedItems = [...items]
        updatedItems.splice(index, 1)
        setItems(updatedItems)
    }

    const handleItemChange = (index, field, value) => {
        let updatedItems = [...items]
        updatedItems[index] = { ...updatedItems[index], [field]: value }
        setItems(updatedItems)
    }

    return (
        <div className="space-y-4">
            {items?.map((data, index) => (
                <div key={index} className="p-4 space-y-2 rounded-xl ring-2 ring-inset ring-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Riwayat Pekerjaan {index + 1}</h3>
                        <Tooltip title="Hapus" arrow>
                            <IconButton
                                onClick={() => handleRemoveItem(index)}
                                size="small"
                                color="error"
                            >
                                <Icon icon="fluent:delete-28-filled" />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="space-y-3">
                        <TextField
                            label='Nama Perusahaan'
                            value={data.company}
                            onChange={(e) => handleItemChange(index, 'company', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label='Lokasi Perusahaan'
                            value={data.location}
                            onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label='Jabatan'
                            value={data.position}
                            onChange={(e) => handleItemChange(index, 'position', e.target.value)}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status Pekerjaan</InputLabel>
                            <Select

                                value={data.type}
                                onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                label="Status Pekerjaan"
                            >
                                <MenuItem value={'PKWT'}>Perjajian Kerja Waktu Tertentu</MenuItem>
                                <MenuItem value={'PKWTT'}>Perjajian Kerja Waktu Tidak Tertentu</MenuItem>
                                <MenuItem value={'internship'}>Intership / Magang</MenuItem>
                            </Select>
                        </FormControl>
                        {(data.type === 'PKWT' || data.type === 'internship') && (
                            <TextField
                                type="number"
                                value={data.duration_status}
                                onChange={(e) => handleItemChange(index, 'duration_status', e.target.value)}
                                label="Durasi Pekerjaan"
                                fullWidth
                            />
                        )}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="flex items-center gap-3">
                                <DatePicker
                                    label="Mulai"
                                    value={dayjs(data.start, 'DD/MM/YYYY')}
                                    onChange={(e) => handleItemChange(index, 'start', dayjs(e).format('DD/MM/YYYY'))}
                                    className="w-full"
                                    format="DD MMM YYYY"
                                    maxDate={dayjs(data.end, 'DD/MM/YYYY')}
                                />
                                <h3>-</h3>
                                <DatePicker
                                    label="Berhenti"
                                    value={dayjs(data.end, 'DD/MM/YYYY')}
                                    onChange={(e) => handleItemChange(index, 'end', dayjs(e).format('DD/MM/YYYY'))}
                                    className="w-full"
                                    format="DD MMM YYYY"
                                />
                            </div>
                        </LocalizationProvider>
                        <TextField
                            value={data.reason}
                            onChange={(e) => handleItemChange(index, 'reason', e.target.value)}
                            label="Keterangan Berhenti"
                            fullWidth
                        />
                        <TextField
                            value={data.higher_name}
                            onChange={(e) => handleItemChange(index, 'higher_name', e.target.value)}
                            label="Nama Atasan Langsung"
                            fullWidth
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}