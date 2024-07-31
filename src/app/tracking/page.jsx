'use client'
import Header from "@/components/Header"
import Layout from "@/components/Layout"
import PhotoView from "@/components/PhotoView"
import { theme } from "@/config/materialui-config"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, ThemeProvider, Tooltip } from "@mui/material"
import { GoogleMap, InfoWindow, LoadScriptNext, Marker, MarkerClusterer } from "@react-google-maps/api"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import dayjs from 'dayjs'
import FilterUser from "@/components/tracking-map/FiltererUser"
import { firestore } from "@/config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore";
import moment from "moment"
import ModalOnDutyUnit from "@/components/tracking-map/ModalOnDutyUnit"
import debounce from 'lodash/debounce';

const Page = () => {
    const { user, unitKerja } = useAppContext()
    const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const mapsLibraries = ['places']
    const [center, setCenter] = useState({ lat: -6.2088, lng: 106.8456 })
    const [zoom, setZoom] = useState(5)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [isSatelliteMode, setIsSatelliteMode] = useState(false)
    const [isClusteringEnabled, setIsClusteringEnabled] = useState(true)
    const [radius, setRadius] = useState(1000)
    const [unitCode, setUnitCode] = useState(null)
    const [person, setPerson] = useState([])
    const [openModalOndutyUnit, setOpenModalOndutyUnit] = useState(false)
    const [bounds, setBounds] = useState(null)
    const [filteredMarkers, setFilteredMarkers] = useState([])
    const mapRef = useRef(null)

    const handleBoundsChanged = useCallback(() => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            const visibleMarkers = person.filter(marker => bounds.contains(marker.position));
            setFilteredMarkers(visibleMarkers);
        }
    }, [person])

    useEffect(() => {
        if (mapRef.current) {
            handleBoundsChanged();
        }
    }, [handleBoundsChanged]);

    const debouncedHandleBoundsChanged = debounce(handleBoundsChanged, 300)

    const handleMarkerClick = (marker) => {
        if (marker?.position) {
            setSelectedMarker(marker);
            setCenter({ lat: marker.position.lat, lng: marker.position.lng })
            setZoom(18)
        }
    }

    useEffect(() => {
        const unitKerjaBase64decode = (code) => {
            return Buffer.from(code, 'base64').toString('ascii').replace("unit_kerja", "")
        }
        if (unitKerja) {
            setUnitCode(unitKerjaBase64decode(unitKerja.unique))
        }

    }, [unitKerja])

    useEffect(() => {
        const streamUser = () => {
            let q = query(collection(firestore, 'Duty'), where('UnitKerjas', 'array-contains-any', [parseInt(unitCode)]))
            if (user?.is_command_center) {
                q = query(collection(firestore, 'Duty'))
            }

            const unsubTrack = onSnapshot(q, (querySnapshot) => {
                const datas = [];
                const onlyOnDuty = [];
                querySnapshot.forEach((doc) => {
                    const d = doc.data().TimeStamp;
                    const getDateNow = new Date();
                    let waktu = `${getDateNow.getDate()}` + getDateNow.getHours() + ':' + getDateNow.getMinutes();
                    if (d !== null) {
                        waktu = moment(d.toDate()).format('D/M/Y HH:mm');
                    }
                    datas.push({ ...doc.data(), id: doc.id, waktu });
                    if (doc.data().IsDuty) {
                        onlyOnDuty.push({
                            ...doc.data(),
                            id: doc.id,
                            position: { lat: doc.data().Location._lat, lng: doc.data().Location._long },
                        })
                    }
                });

                setPerson(onlyOnDuty);
            });

            return () => unsubTrack();
        }
        if (unitCode) {
            streamUser()
        }
    }, [unitCode, user])

    return (
        <ThemeProvider theme={theme}>
            <div className="sr-only">
                <Layout></Layout>
            </div>
            <div className="relative w-screen h-screen text-sm overflow-clip">
                <div className="absolute inset-x-0 z-30 px-6 space-y-4 top-4">
                    <Header isMenuButton />
                </div>
                <FilterUser
                    title={'User On Duty'}
                    handleClick={handleMarkerClick}
                    setZoom={setZoom}
                    setCenter={setCenter}
                    setRadius={setRadius}
                    person={person}
                />
                <ModalOnDutyUnit
                    open={openModalOndutyUnit}
                    setOpen={setOpenModalOndutyUnit}
                    user={person}
                />
                <div className="absolute z-10 flex flex-col gap-3 top-24 left-6">
                    <Tooltip arrow title={isClusteringEnabled ? 'Turn Off Clustering' : 'Turn On Clustering'} placement="right">
                        <IconButton
                            className="bg-white shadow-lg hover:bg-gray-200"
                            onClick={() => setIsClusteringEnabled(prev => !prev)}
                        >
                            <Icon icon='vaadin:cluster' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title={isSatelliteMode ? 'Roadmap' : 'Satellite'} placement="right">
                        <IconButton
                            className="bg-white shadow-lg hover:bg-gray-200"
                            onClick={() => setIsSatelliteMode(prev => !prev)}
                        >
                            <Icon icon={isSatelliteMode ? 'material-symbols:satellite-alt' : 'mdi:roadmap'} />
                        </IconButton>
                    </Tooltip>
                    {user?.is_command_center && (
                        <Tooltip arrow title={'Unit On Duty'} placement="right">
                            <IconButton
                                className="bg-white shadow-lg hover:bg-gray-200"
                                onClick={() => setOpenModalOndutyUnit(true)}
                            >
                                <Icon icon='mdi:account-group' />
                            </IconButton>
                        </Tooltip>
                    )}
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
                        {isClusteringEnabled ? (
                            <MarkerClusterer options={{ imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }}>
                                {(clusterer) =>
                                    filteredMarkers.map((marker, index) => (
                                        <Marker
                                            key={index}
                                            position={marker.position}
                                            clusterer={clusterer}
                                            icon={{
                                                url: getIcon(marker.Role),
                                                scaledSize: new window.google.maps.Size(24, 24),
                                                origin: new window.google.maps.Point(0, 0),
                                                anchor: new window.google.maps.Point(12, 0),
                                            }}
                                            onClick={() => handleMarkerClick(marker)}
                                        />
                                    ))
                                }
                            </MarkerClusterer>
                        ) : (
                            filteredMarkers.map((marker, index) => (
                                <Marker
                                    key={index}
                                    position={marker.position}
                                    icon={{
                                        url: getIcon(marker.Role),
                                        scaledSize: new window.google.maps.Size(24, 24),
                                        origin: new window.google.maps.Point(0, 0),
                                        anchor: new window.google.maps.Point(12, 0),
                                    }}
                                    onClick={() => handleMarkerClick(marker)}
                                />
                            ))
                        )}
                        {selectedMarker && (
                            <InfoWindow
                                position={selectedMarker.position}
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
    return (
        <div className="relative flex flex-col items-center gap-2 w-[200px] jsutify-center">
            <div className="absolute top-0 left-0 px-2 py-1 text-xs font-semibold text-white rounded full bg-primary">
                {data?.Role}
            </div>
            <div className="w-12">
                <PhotoView photo={data.Image} />
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-center">{data.Name}</h3>
                <h3 className="text-center">{data?.UnitKerja?.RoleName}</h3>
            </div>
            <Tooltip title={'hubungi via Whatsapp'} placement="bottom" arrow>
                <Link
                    className="relative px-2 py-1 text-green-700 rounded-md group bg-green-700/20 hover:bg-green-700/30"
                    href={`https://wa.me/${data.Phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="flex items-center gap-1">
                        <Icon icon="tabler:brand-whatsapp" className="" />
                        <h3 className="leading-none">{data.Phone}</h3>
                    </div>

                </Link>
            </Tooltip>

            {/* <div className="px-2 py-1 leading-none rounded-full ring-1 ring-primary">{data?.UnitKerja?.RoleName}</div> */}
            <div className="flex items-center gap-1 text-xs">
                <Icon icon="mdi:clock-time-four-outline" className="" />
                <div className="leading-none ">{dayjs(data.TimeStamp.seconds * 1000).format('DD MMM YYYY HH:mm:ss')}</div>
            </div>
        </div>
    )
}

const getIcon = (type) => {
    let icon = '/onduty/sga-icon.png'
    switch (type) {
        case 'AGP':
            icon = '/onduty/agp-icon.png'
            break;
        default:
            break;
    }
    return icon
}