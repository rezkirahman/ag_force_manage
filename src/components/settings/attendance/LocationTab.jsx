import { deleteLocationAttendance, listLocationAttendance } from "@/api/settings/attendance-location"
import Container from "@/components/Container"
import Layout from "@/components/Layout"
import ModalDeleteConfirmation from "@/components/ModalDeleteConfirmation"
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from "@/components/Table"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { Alert, Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebounce } from "use-debounce"
import ModalAddEditLocationAttendance from "./ModalAddEditLocationAttendance"

const LocationTab = () => {
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
                        startIcon={<Icon icon={'mdi:plus'} />}
                    >
                        Tambah
                    </Button>
                </div>
                <Table list={listLocation} loading={loading}>
                    <TableHead>
                        <HeadRow>
                            <HeadItem start>Nama</HeadItem>
                            <HeadItem>Radius</HeadItem>
                            <HeadItem>Alamat</HeadItem>
                            <HeadItem end>Aksi</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {[...listLocation]?.reverse().map((item, i) => (
                            <BodyRow key={i} className={''}>
                                <BodyItem start className={'font-medium'}>
                                    <Tooltip title={item.place_name} arrow>
                                        <h3 className="line-clamp-1">{item.place_name}</h3>
                                    </Tooltip>
                                </BodyItem>
                                <BodyItem>{item.radius} m</BodyItem>
                                <BodyItem>
                                    <div className="w-fit">
                                        <Tooltip title={item.address} arrow>
                                            <h3 className="line-clamp-1">{item.address}</h3>
                                        </Tooltip>
                                    </div>
                                </BodyItem>
                                <BodyItem end>
                                    <div className='flex items-center justify-center gap-2'>
                                        <Tooltip title='Ubah' arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedLocation(item)
                                                    setOpenEditLocation(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:edit'} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Hapus' arrow>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setSelectedLocation(item)
                                                    setOpenModalDelete(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:delete'} />
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

export default LocationTab