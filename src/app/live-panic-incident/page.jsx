'use client'
import Header from "@/components/Header"
import Layout from "@/components/Layout"
import { theme } from '@/config/materialui-config'
import { Icon } from "@iconify/react"
import { Button, IconButton, ThemeProvider, Tooltip } from '@mui/material'
import { GoogleMap, LoadScriptNext, InfoWindow, Marker } from '@react-google-maps/api'
import { debounce } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { collection, query, onSnapshot } from "firebase/firestore";
import { firestore } from "@/config/firebase-config"
import moment from 'moment'
import Image from "next/image"
import SideBarPanicIncident from "@/components/live-panic-incident/SideBarPanicIncident"
import PhotoView from "@/components/PhotoView"
import Link from "next/link"
import ImageView from "@/components/ImageView"
import ModalSolve from "@/components/live-panic-incident/ModalSolve"
import { useAppContext } from "@/context"
import SnackbarNotification from "@/components/SnackbarNotification"

const Page = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const [data, setData] = useState([])
    const [user, setUser] = useState([])
    const [center, setCenter] = useState({ lat: -6.2088, lng: 106.8456 })
    const [zoom, setZoom] = useState(12)
    const [isSatelliteMode, setIsSatelliteMode] = useState(false)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [filteredMarkers, setFilteredMarkers] = useState([])
    const [isMobile, setIsMobile] = useState(false)
    const mapRef = useRef(null)

    const handleMarkerClick = (marker, offsetLng = 0.0) => {
        const offsetLat = 0.003
        if (marker.Latitude && marker.Longitude) {
            setSelectedMarker(marker)
            setCenter({ lat: marker.Latitude + offsetLat, lng: marker.Longitude + (isMobile ? 0.0 : offsetLng) })
            setZoom(17)
        }
    }

    const handleBoundsChanged = useCallback(() => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            const visibleMarkers = user.filter(marker => bounds?.contains({
                lat: marker.Latitude,
                lng: marker.Longitude
            }))
            setFilteredMarkers(visibleMarkers)
        }
    }, [user])

    const debouncedHandleBoundsChanged = debounce(handleBoundsChanged, 300)

    useEffect(() => {
        if (mapRef.current) {
            handleBoundsChanged()
        }
    }, [handleBoundsChanged])

    useEffect(() => {
        const streamUser = () => {
            let q = query(collection(firestore, "incidents"));
            // }
            let datas = [];
            let dataIncident = [];
            onSnapshot(q, (querySnapshot) => {
                datas = []
                dataIncident = []
                setData([])
                querySnapshot.forEach((doc) => {
                    const formated = {
                        id: doc.id,
                        ...doc.data(),
                        waktu: moment(doc.data().Time).format('HH:mm:ss'),
                        alamat: 'lihat',
                    };
                    let changeIt = data.findIndex((res) => res.id === doc.id)
                    if (changeIt === -1) {
                        datas.push(formated);
                    } else {
                        data[changeIt] = formated
                    }
                    if (!doc.data().Expired) {
                        dataIncident.push({
                            id: doc.id,
                            ...doc.data(),
                            waktu: moment(doc.data().Time).format('HH:mm:ss'),
                            alamat: 'lihat',
                        });
                    }
                });
                data.push(...datas)
                const filteredArr = data.reduce((acc, current) => {
                    return acc.concat([current]);
                }, []);
                setData(filteredArr)
            });
        }
        const streamUserPanic = () => {
            streamUser()
            const q = query(collection(firestore, "Panic"));
            let dataPanic = [];
            let datasz = [];
            onSnapshot(q, (querySnapshot) => {
                datasz = []
                dataPanic = []
                querySnapshot.forEach((doc) => {
                    const formated = {
                        id: doc.id,
                        User: {
                            Photo: doc.data().PhotoUser,
                            Fullname: doc.data().Name,
                            Rolename: doc.data().Role
                        },
                        Description: doc.data().AdditionalData ?? 'Description',
                        Category: {
                            Image: 'https://cdn.discordapp.com/attachments/1019963512312836206/1089811506478190592/SOS.png',
                            Icon: 'https://cdn.discordapp.com/attachments/1019963512312836206/1089811506478190592/SOS.png',
                            Name: 'Panic'
                        },
                        waktu: moment(doc.data().Time).format('HH:mm:ss'),
                        alamat: 'lihat',
                        Latitude: doc.data().Location._lat,
                        Longitude: doc.data().Location._long,
                        Expired: doc.data().Expired,
                    }
                    let changeIt = data.findIndex((res) => res.id === doc.id)
                    if (changeIt === -1) {
                        datasz.push(formated);
                    } else {
                        data[changeIt] = formated
                    }
                    if (!doc.data().Expired) {
                        dataPanic.push({
                            id: doc.id,
                            User: {
                                Photo: doc.data().PhotoUser,
                                Fullname: doc.data().Name,
                                Rolename: doc.data().Role
                            },
                            Description: doc.data().AdditionalData ?? 'Description',
                            Category: {
                                Image: 'https://cdn.discordapp.com/attachments/1019963512312836206/1089811506478190592/SOS.png',
                                Icon: 'https://cdn.discordapp.com/attachments/1019963512312836206/1089811506478190592/SOS.png',
                                Name: 'Panic'
                            },
                            waktu: moment(doc.data().Time).format('HH:mm:ss'),
                            Latitude: doc.data().Location._lat,
                            Longitude: doc.data().Location._long,
                            alamat: 'lihat',
                            Expired: doc.data().Expired,
                        });
                    }
                });

                data.push(...datasz)
                const filteredArr = data.reduce((acc, current) => {
                    return acc.concat([current]);
                }, []);
                setUser(filteredArr.filter((item) => !item.Expired))
            });
        }
        streamUserPanic()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }

        handleResize() // Check on initial render
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => { console.log(user); }, [user])

    return (
        <ThemeProvider theme={theme}>
            <SnackbarNotification />
            <div className='sr-only'>
                <Layout></Layout>
            </div>
            <div className="relative w-screen h-screen text-sm overflow-clip">
                <SideBarPanicIncident
                    user={user}
                    handleClick={handleMarkerClick}
                />
                <div className="absolute z-10 flex flex-col gap-3 top-24 left-6">
                    <Tooltip arrow title={isSatelliteMode ? 'Roadmap' : 'Satellite'} placement="right">
                        <IconButton
                            className="bg-white shadow-lg hover:bg-gray-200"
                            onClick={() => setIsSatelliteMode(prev => !prev)}
                        >
                            <Icon icon={isSatelliteMode ? 'material-symbols:satellite-alt' : 'mdi:roadmap'} />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="absolute inset-x-0 z-30 px-6 space-y-4 top-4">
                    <Header isMenuButton />
                </div>
                <LoadScriptNext googleMapsApiKey={mapKey}>
                    <GoogleMap
                        id="google-map"
                        mapContainerStyle={{
                            height: '100vh',
                            width: '100%',
                        }}
                        center={center}
                        zoom={zoom}
                        options={{
                            fullscreenControl: false,
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            mapTypeId: isSatelliteMode ? 'satellite' : 'roadmap',
                        }}
                        onLoad={map => { mapRef.current = map }}
                        onBoundsChanged={debouncedHandleBoundsChanged}
                        onZoomChanged={() => {
                            if (mapRef.current) {
                                setZoom(mapRef.current.getZoom())
                            }
                        }}
                    >
                        {filteredMarkers.map((marker, i) => (
                            <Marker
                                key={i}
                                position={{ lat: marker.Latitude, lng: marker.Longitude }}
                                icon={{
                                    url: marker.User.Photo,
                                    scaledSize: new window.google.maps.Size(24, 24),
                                    origin: new window.google.maps.Point(0, 0),
                                    anchor: new window.google.maps.Point(12, 0),
                                }}
                                onClick={() => handleMarkerClick(marker)}
                            />
                        ))}
                        {selectedMarker && (
                            <InfoWindow
                                position={{ lat: selectedMarker.Latitude, lng: selectedMarker.Longitude }}
                                onCloseClick={() => setSelectedMarker(null)}
                            >
                                <DetailInfoWindow data={selectedMarker} />
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScriptNext>
            </div>
        </ThemeProvider>
    )
}

export default Page

const DetailInfoWindow = ({ data }) => {
    const [openModalsolveIncident, setOpenModalsolveIncident] = useState(false)

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(data?.User?.phone || '08100000000');
    }, [data])

    return (
        <div className="shadow-lg overflow-clip w-60">
            <ModalSolve
                open={openModalsolveIncident}
                setOpen={setOpenModalsolveIncident}
                id={data?.id}
            />
            <div className="relative flex flex-col items-center w-full gap-2">
                <Image
                    src={data?.Category?.Image}
                    width={20}
                    height={20}
                    alt={'s'}
                    className="absolute left-1 top-1"
                />
                <div className="w-10">
                    <PhotoView photo={data?.User?.Photo} />
                </div>
                <h3 className="text-[16px] font-semibold text-center">{data.User.Fullname}</h3>
                {data?.User?.Phone && (
                    <div className="flex items-center justify-between gap-2 px-2 py-1 bg-gray-100 rounded-md cursor-pointer text white">
                        <Link
                            className="relative p-1 rounded-md group hover:bg-black/20"
                            href={`https://wa.me/${data.User.Phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Tooltip arrow title="Whatsapp">
                                <h3 className="text-sm font-semibold text-slate-700">{data?.User?.Phone}</h3>
                            </Tooltip>
                        </Link>
                        <div onClick={() => copyToClipboard()}>
                            <Tooltip arrow title="Copy">
                                <Icon icon="solar:copy-bold" className="text-xl" />
                            </Tooltip>

                        </div>
                    </div>
                )}
                <div className="flex items-center justify-center w-full gap-3 px-1 text-xs font-medium rounded-2xl">
                    <div className="px-2 py-1 text-gray-700 rounded-full ring-1 ring-gray-700 bg-gray-700/10">
                        <h3 className="text-center line-clamp-2">{data?.User?.UnitKerja}</h3>
                    </div>
                    <div className="p-1 text-gray-700 rounded-full ring-1 ring-gray-700 bg-gray-700/10">
                        <h3 className="text-center line-clamp-2">{data?.User?.RoleName}</h3>
                    </div>
                </div>

                {data?.Photo &&
                    <ImageView photo={data?.Photo} />
                }
                <div className="overflow-y-auto max-h-20">
                    <h3 className="text-sm">{data?.Description}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${data?.Latitude},${data?.Longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outlined"
                            startIcon={<Icon icon={'logos:google-maps'} />}
                            fullWidth
                        >
                            Direction
                        </Button>
                    </Link>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setOpenModalsolveIncident(true)}
                    >
                        Selesaikan
                    </Button>
                </div>
            </div>
        </div>
    )
}

