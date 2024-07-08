import { deleteLocationAttendance, listLocationAttendance } from "@/api/settings/attendance-location"
import Container from "@/components/Container"
import Layout from "@/components/Layout"
import ModalDeleteConfirmation from "@/components/ModalDeleteConfirmation"
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from "@/components/Table"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { Alert, Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import ModalAddEditLocationAttendance from "./ModalAddEditLocationAttendance"

const LocationListAttendance = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [search, setSearch] = useState('')
    const [openAddLocation, setOpenAddLocation] = useState(false)
    const [openEditLocation, setOpenEditLocation] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState('')
    const [listLocation, setListLocation] = useState([])
    const [loading, setLoading] = useState(false)

    const [searchLocation] = useDebounce(search, 1000)

    const handleListLocation = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            search: searchLocation
        }
        const { data } = await listLocationAttendance(unitKerja.id, body)
        if (data?.data) {
            setListLocation(data?.data)
        }
        setLoading(false)
    }, [searchLocation, unitKerja])

    const handleDeleteLocation = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await deleteLocationAttendance(unitKerja.id, Number(selectedLocation?.id))
        if (data?.code == 200) {
            handleListLocation()
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menghapus lokasi'
            })
            setOpenModalDelete(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal menghapus lokasi'
            })
        }
        setOpenModalDelete(false)
    }, [handleListLocation, selectedLocation?.id, setOpenSnackbar, unitKerja])

    useEffect(() => {
        handleListLocation()
    }, [handleListLocation])

    return (
        <Container>
            <ModalAddEditLocationAttendance
                open={openAddLocation}
                setOpen={setOpenAddLocation}
                refresh={handleListLocation}
            />
            <ModalAddEditLocationAttendance
                open={openEditLocation}
                setOpen={setOpenEditLocation}
                refresh={handleListLocation}
                id={selectedLocation?.id}
                edit
            />
            <ModalDeleteConfirmation
                open={openModalDelete}
                setOpen={setOpenModalDelete}
                title="Hapus Lokasi"
                description={<h3>Apakah anda yakin ingin menghapus <span className="font-semibold">{selectedLocation?.place_name}</span> dari daftar lokasi?</h3>}
                handleDelete={() => handleDeleteLocation()}
            />
            <div className='space-y-6'>
                <h3 className="font-semibold">Daftar Lokasi Geotagging</h3>
                <Alert severity="info">Pengaturan ini digunakan untuk lokasi check-in attendance dengan metode geotagging.</Alert>
                <div className='flex items-center justify-between gap-3'>
                    <TextField
                        value={search}
                        placeholder='Cari Lokasi'
                        variant='outlined'
                        className='md:w-1/4'
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon={'mdi:magnify'} className="text-xl" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        size="large"
                        variant="contained"
                        onClick={() => setOpenAddLocation(true)}
                    >
                        Tambah Lokasi
                    </Button>
                </div>
                <Table list={listLocation} loading={loading}>
                    <TableHead>
                        <HeadRow className={'align-top'}>
                            <HeadItem start>Nama Tempat</HeadItem>
                            <HeadItem>Radius (meter)</HeadItem>
                            <HeadItem>Alamat</HeadItem>
                            <HeadItem end>Action</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {[...listLocation]?.reverse().map((data, i) => (
                            <BodyRow key={i} className={'align-top'}>
                                <BodyItem start className={'font-medium'}>{data.place_name}</BodyItem>
                                <BodyItem>{data.radius}</BodyItem>
                                <BodyItem>
                                    <h3 className="line-clamp-2">{data.address}</h3>
                                </BodyItem>
                                <BodyItem end>
                                    <div className='flex items-center justify-center gap-2'>
                                        <Tooltip title='Ubah' arrow>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedLocation(data)
                                                    setOpenEditLocation(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:edit'} className="text-lg" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Hapus' arrow>
                                            <IconButton
                                                color="error"
                                                onClick={() => {
                                                    setSelectedLocation(data)
                                                    setOpenModalDelete(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:delete'} className="text-lg" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </BodyItem>
                            </BodyRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Container>
    )
}

export default LocationListAttendance