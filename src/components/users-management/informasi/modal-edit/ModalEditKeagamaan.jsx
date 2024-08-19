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
            organization: "",
            figure: "",
            location: "",
            date_event: "21/02/2020"
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
            organization: v?.organization,
            figure: v?.figure,
            location: v?.location,
            date_event: v?.date_event
        }))
        const { data } = await updateProfilingData({
            type: title,
            unitKerja: unitKerja.id,
            id: params.id,
            body: {
                agama: body
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
                    <h3 className="font-semibold">Riwayat Keagamaan</h3>
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
                                <h3 className="font-medium">Keagamaan {index + 1}</h3>
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
                                    label="Organisasi"
                                    value={data.organization}
                                    onChange={(e) => handleItemChange(index, "organization", e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Nama Tokoh"
                                    value={data.figure}
                                    onChange={(e) => handleItemChange(index, "figure", e.target.value)}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={dayjs(data.date_event, 'DD/MM/YYYY')}
                                        onChange={(date) => handleItemChange(index, "date_event", date.format('DD/MM/YYYY'))}
                                        label="Tanggal"
                                        format="DD MMM YYYY"
                                        className="w-full"
                                    />
                                </LocalizationProvider>
                                <TextField
                                    label="Lokasi"
                                    value={data.location}
                                    onChange={(e) => handleItemChange(index, "location", e.target.value)}
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