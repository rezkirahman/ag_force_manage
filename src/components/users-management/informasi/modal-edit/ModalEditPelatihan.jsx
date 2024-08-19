import { useEffect, useCallback, useState, useRef } from "react"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"
import { useParams } from "next/navigation"
import { useAppContext } from "@/context"
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material"
import { Icon } from "@iconify/react"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { updateProfilingData } from "@/api/users-management/profiling"

const ModalEditPelatihan = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [items, setItems] = useState([])
    const divRef = useRef(null)

    const handleAddPelatihan = () => {
        setItems([...items, {
            name: "",
            type: "",
            position: "",
            location: "",
            start: "02/11/2021",
            end: "02/012/2021",
            detail: ""
        }])
    }

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

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = items.map((v) => ({
            name: v?.name,
            is_agp: v?.is_agp,
            type: v?.type,
            location: v?.location,
            position: v?.position,
            start: v?.start,
            end: v?.end,
            detail: v?.detail
        }))
        const { data } = await updateProfilingData({
            type: title,
            unitKerja: unitKerja.id,
            id: params.id,
            body: {
                pelatihan: body
            }
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah data kegiatan'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data kegiatan'
            })
        }
        setLoadingUpdate(false)
    }, [unitKerja, title, params.id, items, setOpenSnackbar, setOpen, refresh])

    useEffect(() => {
        if (open) {
            setItems(data || [])
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
            edit
        >
            <div className="space-y-4">
                <div className="sticky z-10 flex items-start justify-between bg-white -top-2">
                    <h3 className="font-semibold">Riwayat Pelatihan</h3>
                    <Button
                        onClick={() => {
                            handleAddPelatihan()
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
                <div ref={divRef} className="space-y-4">
                    {items?.map((data, index) => (
                        <div key={index} className="p-4 space-y-2 rounded-xl ring-2 ring-inset ring-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Pelatihan {index + 1}</h3>
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
                                    label="Nama"
                                    value={data.name}
                                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                    fullWidth
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Jenis</InputLabel>
                                    <Select
                                        value={data.type || ''}
                                        onChange={(e) => handleItemChange(index, "type", e.target.value)}
                                        label="Jenis"
                                    >
                                        <MenuItem value={'Teknologi & Rekayasa'}>Teknologi & Rekayasa</MenuItem>
                                        <MenuItem value={'Teknologi Informasi'}>Teknologi Informasi</MenuItem>
                                        <MenuItem value={'energi & Pertambangan'}>energi & Pertambangan</MenuItem>
                                        <MenuItem value={'Teknologi & Komunikasi'}>Teknologi & Komunikasi</MenuItem>
                                        <MenuItem value={'kesehatan & Pekerjaan'}>kesehatan & Pekerjaan</MenuItem>
                                        <MenuItem value={'Beladiri'}>Beladiri</MenuItem>
                                        <MenuItem value={'Seni Tari'}>Seni Tari</MenuItem>
                                        <MenuItem value={'Seni Musik'}>Seni Musik</MenuItem>
                                        <MenuItem value={'Seni Rupa'}>Seni Rupa</MenuItem>
                                        <MenuItem value={'Lainnya'}>Lainnya</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Lokasi"
                                    value={data.location}
                                    onChange={(e) => handleItemChange(index, "location", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Posisi"
                                    value={data.position}
                                    onChange={(e) => handleItemChange(index, "position", e.target.value)}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div className="flex items-center justify-between gap-3">
                                        <DatePicker
                                            value={dayjs(data.start, 'DD/MM/YYYY')}
                                            onChange={(date) => handleItemChange(index, "start", date.format('DD/MM/YYYY'))}
                                            label="Mulai"
                                            format="DD MMM YYYY"
                                            className="w-full"
                                            maxDate={dayjs(data.end, 'DD/MM/YYYY')}
                                        />
                                        <h3>-</h3>
                                        <DatePicker
                                            value={dayjs(data.end, 'DD/MM/YYYY')}
                                            onChange={(date) => handleItemChange(index, "end", date.format('DD/MM/YYYY'))}
                                            label="berakhir"
                                            format="DD MMM YYYY"
                                            className="w-full"
                                        />
                                    </div>
                                </LocalizationProvider>
                                <TextField
                                    label="Deskripsi"
                                    value={data.detail}
                                    onChange={(e) => handleItemChange(index, "detail", e.target.value)}
                                    fullWidth
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ModalEditProfilingLayout>
    )
}

export default ModalEditPelatihan