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

const ModalEditPendidikan = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [riwayatPendidikan, setRiwayatPendidikan] = useState([])
    const [rencanaPendidikan, setRencanaPendidikan] = useState({})
    const divRef = useRef(null)

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            riwayat: riwayatPendidikan,
            rencana: rencanaPendidikan
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
                message: 'Berhasil mengubah data'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data'
            })
        }
        setLoadingUpdate(false)
    }, [params.id, refresh, rencanaPendidikan, riwayatPendidikan, setOpen, setOpenSnackbar, title, unitKerja])

    useEffect(() => {
        if (open) {
            setRiwayatPendidikan(data?.riwayat_pendidikan || [])
            setRencanaPendidikan(data?.rencana_pendidikan || {
                rencana_sekolah: false,
                nama_sekolah: ''
            })
        }
    }, [data, open])

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
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="sticky z-10 flex items-start justify-between bg-white -top-2">
                        <h3 className="font-semibold">Riwayat Pendidikan</h3>
                        <Button
                            onClick={() => {
                                setRiwayatPendidikan([...riwayatPendidikan, { date: '', tanggal: dayjs().format('DD/MM/YYYY') }])
                                setTimeout(() => {
                                    if (divRef.current) {
                                        divRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                    }
                                }, 0)
                            }}
                            color="primary"
                            size="medium"
                            startIcon={<Icon icon='icon-park-twotone:add-one' />}
                        >
                            Tambah
                        </Button>
                    </div>
                    <div ref={divRef}>
                        <RiwayatPendidikan items={riwayatPendidikan} setItems={setRiwayatPendidikan} />
                    </div>
                    <hr />
                </div>
                <div className="space-y-3">
                    <FormControl fullWidth>
                        <InputLabel>Rencana Pendidikan untuk Bersekolah lagi</InputLabel>
                        <Select
                            label="Rencana Pendidikan untuk Bersekolah lagi"
                            value={rencanaPendidikan.rencana_sekolah}
                            onChange={(e) => setRencanaPendidikan({ ...rencanaPendidikan, rencana_sekolah: e.target.value })}
                        >
                            <MenuItem value={true}>Ya</MenuItem>
                            <MenuItem value={false}>Tidak</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        disabled={!rencanaPendidikan.rencana_sekolah}
                        fullWidth
                        label='Nama Sekolah'
                        value={rencanaPendidikan.nama_sekolah}
                        onChange={(e) => setRencanaPendidikan({ ...rencanaPendidikan, nama_sekolah: e.target.value })}
                    />
                </div>
            </div>
        </ModalEditProfilingLayout>
    )
}

export default ModalEditPendidikan

const RiwayatPendidikan = ({ items, setItems }) => {

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
        <div className='space-y-4'>
            {items?.map((data, index) => (
                <div key={index} className="p-4 space-y-2 rounded-xl ring-2 ring-inset ring-gray-200">
                    <div className='flex items-center justify-between'>
                        <h3 className="font-medium">Riwayat Pendidikan {index + 1}</h3>
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
                    <div className='space-y-3'>
                        <TextField
                            value={data.nama_sekolah}
                            onChange={(e) => handleItemChange(index, 'nama_sekolah', e.target.value)}
                            label='Nama Sekolah/Institusi'
                            fullWidth
                        />
                        <TextField
                            value={data.lokasi_sekolah}
                            onChange={(e) => handleItemChange(index, 'lokasi_sekolah', e.target.value)}
                            label='Lokasi Sekolah/Institusi'
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Tingkat Pendidikan</InputLabel>
                            <Select
                                value={data.tingkat_pendidikan}
                                label="Tingkat Pendidikan"
                                onChange={(e) => handleItemChange(index, 'tingkat_pendidikan', e.target.value)}
                            >
                                <MenuItem value={'Sekolah Dasar'}>Sekolah Dasar</MenuItem>
                                <MenuItem value={'Sekolah Menengah Pertama'}>Sekolah Menengah Pertama</MenuItem>
                                <MenuItem value={'Sekolah Menengah Atas'}>Sekolah Menengah Atas</MenuItem>
                                <MenuItem value={'Diploma 1'}>Diploma 1</MenuItem>
                                <MenuItem value={'Diploma 2'}>Diploma 2</MenuItem>
                                <MenuItem value={'Diploma 3'}>Diploma 3</MenuItem>
                                <MenuItem value={'Diploma 4'}>Diploma 4</MenuItem>
                                <MenuItem value={'Sarjana'}>Sarjana</MenuItem>
                                <MenuItem value={'Magister'}>Magister</MenuItem>
                                <MenuItem value={'Doktor'}>Doktor</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year']}
                                value={dayjs(data.tahun_lulus, 'YYYY')}
                                onChange={(date) => handleItemChange(index, 'tahun_lulus', date.format('YYYY'))}
                                className="w-full"
                                format="DD MMM YYYY"
                            />
                        </LocalizationProvider>
                        <TextField
                            value={data.bidang_studi}
                            onChange={(e) => handleItemChange(index, 'bidang_studi', e.target.value)}
                            label='Bidang Studi/Jurusan'
                            fullWidth
                        />
                        <TextField
                            value={data.gelar_pendidikan}
                            onChange={(e) => handleItemChange(index, 'gelar_pendidikan', e.target.value)}
                            label='Gelar Pendidikan'
                            fullWidth
                        />
                        <TextField
                            value={data.keterangan}
                            onChange={(e) => handleItemChange(index, 'keterangan', e.target.value)}
                            label='Keterangan'
                            fullWidth
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}