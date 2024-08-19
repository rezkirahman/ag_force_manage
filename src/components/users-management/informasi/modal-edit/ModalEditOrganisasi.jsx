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

const ModalEditKeagamaan = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [items, setItems] = useState([])
    const divRef = useRef(null)

    const handleAddPelatihan = () => {
        setItems([...items, {
            name: "",
            status: false,
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
        const body = items?.map((v) => ({
            name: v?.name,
            status: v?.status,
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
                organisasi: body
            }
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
                <div className="sticky z-10 flex items-start justify-between bg-white -top-[9px] py-1">
                    <h3 className="font-semibold">Riwayat Organisasi</h3>
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
                                <h3 className="font-medium">Organisasi {index + 1}</h3>
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
                                    <InputLabel>Status Keanggotaan</InputLabel>
                                    <Select
                                        value={data.status}
                                        onChange={(e) => handleItemChange(index, "status", e.target.value)}
                                        label="Status Keanggotaan"
                                    >
                                        <MenuItem value={true}>Aktif</MenuItem>
                                        <MenuItem value={false}>Tidak Aktif</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Lokasi"
                                    value={data.location}
                                    onChange={(e) => handleItemChange(index, "location", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Jabatan Keanggotaan"
                                    value={data.position}
                                    onChange={(e) => handleItemChange(index, "position", e.target.value)}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div className="flex items-center justify-between gap-3">
                                        <DatePicker
                                            views={["month", "year"]}
                                            value={dayjs(data.start, 'MM/YYYY')}
                                            onChange={(date) => handleItemChange(index, "start", date.format('MM/YYYY'))}
                                            label="Mulai"
                                            format="MMM YYYY"
                                            className="w-full"
                                            maxDate={dayjs(data.end, 'MM/YYYY')}
                                        />
                                        <h3>-</h3>
                                        <DatePicker
                                            views={["month", "year"]}
                                            value={dayjs(data.end, 'MM/YYYY')}
                                            onChange={(date) => handleItemChange(index, "end", date.format('MM/YYYY'))}
                                            label="berakhir"
                                            format="MMM YYYY"
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

export default ModalEditKeagamaan