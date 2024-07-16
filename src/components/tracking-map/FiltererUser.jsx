import React, { useEffect, useState, useCallback, useContext, useRef } from "react"
import { Icon } from "@iconify/react"
import { FormControl, InputLabel, MenuItem, Select, Checkbox, Pagination, InputAdornment, Modal, Box, Tab, Tabs, IconButton, Button } from "@mui/material"
import { TextField } from "@mui/material"
import { useAppContext } from "@/context"
import { motion } from "framer-motion"
import { listLocationPenugasan, listLocationUnit } from "@/api/tracking/tracking-map"
import ModalPenugasanTracking from "./ModalPenugasanTracking"

export default function FilterUser({
    dataList,
    handleClick,
    setZoom,
    setCenter,
    setRadius,
    person,
}) {

    const { unitKerja } = useAppContext()
    const [open, setOpen] = useState(true)
    const [openModalPenugasan, setOpenModalPenugasan] = useState(false)
    const [listLocation, setListLocation] = useState([])
    const [dataUserLocation, setDataUserLocation] = useState()
    const [searchLocation, setSearchLocation] = useState('')
    const [searchPenugasan, setSearchPenugasan] = useState('')
    const [kategori, setKategori] = useState('ALL')
    const [userOnduty, setUserOnduty] = useState()
    const [searchUser, setSearchUser] = useState('')
    const [listPenugasan, setListPenugasan] = useState([])
    const [selectedPenugasan, setSelectedPenugasan] = useState()
    const [tab, setTab] = useState(1)

    const calculateTotalUserLocation = (lat, lng, radius = 10000000) => {
        const radiusInKm = radius / 1000
        const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        const deg2rad = (deg) => {
            return deg * (Math.PI / 180)
        }

        const coordinatesWithinRadius = dataUserLocation?.filter(coordinate =>
            getDistanceFromLatLonInKm(lat, lng, coordinate?.latitude, coordinate?.longitude) <= radiusInKm
        );
        return coordinatesWithinRadius?.length
    }

    const getDataListLocation = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await listLocationUnit(unitKerja.id, kategori)
        if (data?.data) {
            setListLocation(data?.data)
        }
    }, [kategori, unitKerja])

    const handleListPenugasan = useCallback(async () => {
        if (!unitKerja) return
        const body = {
            search: searchPenugasan
        }
        const { data } = await listLocationPenugasan(unitKerja.id, body)
        if (data?.data) {
            setListPenugasan(data.data)
        } else {
            setListPenugasan([])
        }
    }, [searchPenugasan, unitKerja])


    useEffect(() => {
        const coordinates = person.map(({ Location }) =>
            Location ? { latitude: Location._lat, longitude: Location._long } : undefined
        ).filter(coordinate => coordinate !== undefined); // This will filter out undefined values
        setDataUserLocation(coordinates);
    }, [person]);

    useEffect(() => {
        setUserOnduty(person)
    }, [dataList, person])

    useEffect(() => {
        getDataListLocation()
    }, [getDataListLocation])

    useEffect(() => {
        handleListPenugasan()
    }, [handleListPenugasan])

    return (
        <div className={`fixed top-0 right-6 z-10 h-screen pt-24 py-6 w-auto transition-all duration-500 ${open ? 'translate-x-0 pl-6 md:pl-0' : 'translate-x-full'}`}>
            <ModalPenugasanTracking
                open={openModalPenugasan}
                setOpen={setOpenModalPenugasan}
                setOpenDrawer={setOpen}
                userOnduty={person}
                penugasan={selectedPenugasan}
                setCenter={setCenter}
                setZoom={setZoom}
                handleClickGoToUser={handleClick}
            />
            <div
                className={`relative bg-white rounded-2xl whitespace-nowrap shadow-container h-full w-[86vw] md:w-[50vw] lg:w-[500px]`}
            >
                <div className="absolute inset-y-0 flex items-center -left-5">
                    <IconButton
                        color=""
                        onClick={() => setOpen(!open)}
                        variant="contained"
                        className="bg-white ring-2 ring-gray-400 hover:bg-gray-100"
                    >
                        <Icon icon="iconamoon:arrow-left-2-bold" className={`duration-500 ${open ? 'rotate-180' : 'rotate-0'}`} />
                    </IconButton>
                </div>
                <div className={`${open ? 'visible' : 'invisible'} px-6 pt-2 pb-6 h-full`}>
                    <div className={`flex flex-col gap-4 h-full w-full`}>
                        <Tabs
                            variant="scrollable"
                            scrollButtons="auto"
                            value={tab}
                            onChange={(event, newValue) => setTab(newValue)}
                        >
                            <Tab label="On Duty" value={1} />
                            <Tab label="Lokasi" value={2} />
                            <Tab label="Penugasan" value={3} />
                        </Tabs>
                        {tab == 1 &&
                            <>
                                <div className="flex flex-row items-start justify-between gap-4">
                                    <TextField
                                        value={searchUser}
                                        onChange={(e) => setSearchUser(e.target.value)}
                                        variant="outlined"
                                        className="w-full"
                                        label="Cari User"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                                        }}
                                    />
                                    <div className='flex items-center gap-1 px-4 py-2 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary w-fit'>
                                        <Icon icon={'ic:round-person'} />
                                        <h3 className='text-xs font-semibold'>{person?.length}</h3>
                                    </div>
                                </div>
                                <div className="overflow-y-auto grow overflow-clip">
                                    {userOnduty?.filter(data => data.Name.toLowerCase().includes(searchUser.toLowerCase())).map((item, i) => (
                                        <div key={i}
                                            className="px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleClick(item)}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <h3>{item.Name}</h3>
                                                <h3 className='px-2 py-1 text-xs leading-none text-gray-500 bg-gray-200 rounded-md'>{item?.UnitKerja?.RoleName}</h3>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </>
                        }
                        {tab == 2 &&
                            <>
                                <div className="grid grid-cols-2 gap-2">
                                    <FormControl>
                                        <InputLabel>Kategori</InputLabel>
                                        <Select
                                            value={kategori}
                                            label="Kategori"
                                            onChange={(e) => setKategori(e.target.value)}
                                            fullWidth
                                        >
                                            <MenuItem value='ALL'>Semua</MenuItem>
                                            <MenuItem value='REGION'>Region</MenuItem>
                                            <MenuItem value='ECI'>Electrionic City</MenuItem>
                                            <MenuItem value='BAG'>Bank Artha Graha</MenuItem>
                                            <MenuItem value='UNIT'>Unit</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        label="Cari"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                                        }}
                                    />
                                </div>
                                <div className="h-full overflow-y-auto">
                                    {listLocation.length !== 0 ?
                                        listLocation.filter(data => data.name.toLowerCase().includes(searchLocation.toLowerCase())).map((data, i) => (
                                            <div key={i}
                                                className="px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                                                onClick={() => { setZoom(data.zoom); setCenter({ lat: data.latitude, lng: data.longitude }); setRadius(data.radius); }}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <h3 className="text-wrap">{data.name}</h3>
                                                    <div className='flex items-center gap-1 px-2 py-1 text-green-700 rounded-full bg-green-700/10 ring-1 ring-inset ring-green-700 w-fit'>
                                                        <Icon icon={'ic:round-person'} />
                                                        <div className="w-6">
                                                            <h3 className='text-xs font-semibold text-right'>{calculateTotalUserLocation(data?.latitude, data?.longitude, data?.radius)}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : <div className="py-1 text-center">
                                            <h3>Data tidak ditemukan</h3>
                                        </div>
                                    }
                                </div>
                            </>
                        }
                        {tab == 3 &&
                            <>
                                <TextField
                                    value={searchPenugasan}
                                    onChange={(e) => setSearchPenugasan(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    label="Cari"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                                    }}
                                />
                                <div className="h-full overflow-y-auto">
                                    {listPenugasan?.filter(item => item.nama_bisnis.toLowerCase().includes(searchPenugasan.toLowerCase())).map((data, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                                setSelectedPenugasan(data)
                                                setOpenModalPenugasan(true)
                                                setCenter({ lat: data.lat, lng: data.long })
                                                setZoom(16)
                                                setOpen(false)
                                            }}
                                        >
                                            <h3 className="text-wrap">{data.nama_bisnis}</h3>
                                            <div className='flex items-center gap-1 px-2 py-1 rounded-full text-primary bg-primary/10 ring-1 ring-inset ring-primary w-fit'>
                                                <Icon icon={'ic:round-person'} />
                                                <div className="w-6">
                                                    <h3 className='text-xs font-semibold text-right'>{data.users.length}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}




