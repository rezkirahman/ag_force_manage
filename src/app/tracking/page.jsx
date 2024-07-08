'use client'
import Header from "@/components/Header"
import Layout from "@/components/Layout"
import PhotoView from "@/components/PhotoView"
import { theme } from "@/config/materialui-config"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { SpeedDial, SpeedDialAction, SpeedDialIcon, ThemeProvider, Tooltip } from "@mui/material"
import { GoogleMap, InfoWindow, LoadScriptNext, Marker, MarkerClusterer } from "@react-google-maps/api"
import Link from "next/link"
import { useEffect, useState } from "react"
import dayjs from 'dayjs'
import FilterUser from "@/components/tracking-map/FiltererUser"

const Page = () => {
    const { unitKerja } = useAppContext()
    const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const mapsLibraries = ['places']
    const [center, setCenter] = useState({ lat: -6.2088, lng: 106.8456 })
    const [zoom, setZoom] = useState(12)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [isSatelliteMode, setIsSatelliteMode] = useState(false)
    const [isClusteringEnabled, setIsClusteringEnabled] = useState(true)
    const [radius, setRadius] = useState(1000)
    const [person, setPerson] = useState([
        {
            Name: 'Asep',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/944629b983ed4d239d0ec968b01198f0.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Budi',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Caca',
            Phone: '628123456789',
            Role: 'SGA',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Dedi',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Euis',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Asep',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/944629b983ed4d239d0ec968b01198f0.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Budi',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Caca',
            Phone: '628123456789',
            Role: 'SGA',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Dedi',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Euis',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Asep',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/944629b983ed4d239d0ec968b01198f0.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Budi',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Caca',
            Phone: '628123456789',
            Role: 'SGA',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Dedi',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
        {
            Name: 'Euis',
            Phone: '628123456789',
            Role: 'AGP',
            Image: 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png',
            TimeStamp: { seconds: 1634414400 },
            position: { lat: -6.2088, lng: 106.8456 }
        },
    ])

    const actions = [
        {
            icon: <Icon icon={isSatelliteMode ? 'material-symbols:satellite-alt' : 'mdi:roadmap'} className="text-2xl" />,
            name: isSatelliteMode ? 'Satellite' : 'Roadmap',
            onClick: () => setIsSatelliteMode(!isSatelliteMode)
        },
        {
            icon: <Icon icon='vaadin:cluster' className="text-2xl" />,
            name: isClusteringEnabled ? 'Turn Off Clustering' : 'Turn On Clustering',
            onClick: () => setIsClusteringEnabled(!isClusteringEnabled)
        },
        {
            icon: <Icon icon='mdi:download' className="text-2xl" />,
            name: 'Export',
            // onClick: handleGetExportOnduty
        },
    ];

    const getIcon = (type) => {
        let icon = 'https://pai.agforce.co.id/assets/user/944629b983ed4d239d0ec968b01198f0.png'
        switch (type) {
            case 'AGP':
                icon = 'https://pai.agforce.co.id/assets/user/37d0001be4ba430e94ce4b125bd36271.png'
                break;
            default:
                break;
        }
        return icon
    }

    const handleMarkerClick = (marker) => {
        if (marker?.position) {
            setSelectedMarker(marker);
            setCenter({ lat: marker.position.lat, lng: marker.position.lng })
            setZoom(20)
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <div className="sr-only">
                <Layout></Layout>
            </div>
            <div className="relative w-screen h-screen text-sm overflow-clip">
                <div className="absolute inset-x-0 z-20 px-6 space-y-4 top-4">
                    <Header />
                </div>
                <SpeedDial
                    ariaLabel="SpeedDial basic"
                    icon={<SpeedDialIcon />}
                    direction="bottom"
                    className="absolute z-10 top-24 left-6"
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={action.onClick}
                        />
                    ))}
                </SpeedDial>
                <FilterUser
                    title={'User On Duty'}
                    handleClick={handleMarkerClick}
                    setZoom={setZoom}
                    setCenter={setCenter}
                    setRadius={setRadius}
                    person={person}
                />
                <LoadScriptNext googleMapsApiKey={mapKey} libraries={mapsLibraries}>
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
                    >
                        {isClusteringEnabled ? (
                            <MarkerClusterer options={{ imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }}>
                                {(clusterer) =>
                                    person.map((marker, index) => (
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
                            person.map((marker, index) => (
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
            <h1 className="font-semibold">{data.Name}</h1>
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