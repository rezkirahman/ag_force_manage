'use client'
import Layout from "@/components/Layout"
import { IconButton, Tab, Tabs } from "@mui/material"
import Image from "next/image"
import { useState, useEffect, useCallback, use } from "react"
import InformasiTab from "@/components/users-management/informasi/InformasiTab"
import { useAppContext } from "@/context"
import { informationProfile } from "@/api/users-management/profiling"
import ModalChangePhotoProfiling from "@/components/users-management/informasi/modal-edit/ModalChangePhotoProfiling"

const Page = ({ params }) => {
    const userId = params.id
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [tab, setTab] = useState('informasi')
    const [isNotLoaded, setIsNotLoaded] = useState(false)
    const [selectedMenuInformasi, setSelectedMenuInformasi] = useState({
        id: 1,
        title: 'Profil',
        icon: 'fluent:document-person-16-filled'
    })
    const [name, setName] = useState('')
    const [photo, setPhoto] = useState('https://pai.agforce.co.id/assets/user/f35dca8d2f0a4bf6a0da0fc1a113f71d.png')
    const [jabatan, setJabatan] = useState([])
    const [profile, setProfile] = useState({})
    const [openModalChangePhoto, setOpenModalChangePhoto] = useState(false)


    const handleGetInformasiKaryawan = useCallback(async () => {
        if (!unitKerja) return
        setIsNotLoaded(false)
        const { data } = await informationProfile(unitKerja.id, userId)
        if (data?.data) {
            setProfile(data.data)
            setPhoto(data?.data?.data_profil_akun?.photo)
            setName(data?.data?.data_profil_akun?.full_name)
            const role = data?.data?.data_profil_akun?.role
            setJabatan(role?.map((role) => role?.role_name))
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mendapatkan data karyawan'
            })
            setProfile({})
            setPhoto('https://pai.agforce.co.id/assets/user/f35dca8d2f0a4bf6a0da0fc1a113f71d.png')
            setName('')
            setJabatan([])
            setIsNotLoaded(true)
        }
    }, [setOpenSnackbar, unitKerja, userId])

    useEffect(() => {
        handleGetInformasiKaryawan()
    }, [handleGetInformasiKaryawan])
    return (
        <Layout>
            <ModalChangePhotoProfiling
                open={openModalChangePhoto}
                setOpen={setOpenModalChangePhoto}
                image={photo}
                refresh={handleGetInformasiKaryawan}
            />
            <div className="text-sm bg-white bg-center rounded-2xl shadow-container overflow-clip">
                <div className="relative w-full h-20 md:h-40 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1552152370-fb05b25ff17d?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
                    <div className="absolute inset-x-auto flex items-center justify-center w-full -bottom-6">
                        <div
                            // style={{
                            //     padding: '4px',
                            //     borderRadius: '9999px',
                            //     background: 'linear-gradient(#e68a8a, #b266ff)'
                            // }}
                            className="relative p-1 rounded-full bg-gradient-to-t from-red-400 to-purple-400"
                        >
                            <IconButton
                                className="absolute inset-0"
                                onClick={() => setOpenModalChangePhoto(true)}
                            ></IconButton>
                            <Image
                                src={photo}
                                alt='profile'
                                width={500}
                                height={500}
                                priority
                                className="object-cover object-top w-20 h-20 p-[2px] rounded-full aspect-square bg-white"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 space-y-1 text-center">
                    <h3 className="font-semibold">{name}</h3>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {jabatan?.map((item, i) => (
                            <div key={i} className='px-2 py-1 bg-gray-200 rounded-full'>
                                <h3 className='text-xs font-medium'>{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-start">
                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        className="md:mt-4"
                    >
                        <Tab label='Informasi' value={'informasi'} />
                        <Tab label='Jurnal' value={'jurnal'} />
                        <Tab label='Kehadiran' value={'kehadiran'} />
                        <Tab label='Aktivitas' value={'aktivitas'} />
                        <Tab label='Cuti & Izin' value={'cuti & izin'} />
                    </Tabs>
                </div>
            </div>
            {isNotLoaded ? (
                <h3 className="text-center">Data tidak ditemukan</h3>
            ) :
                tab === 'informasi' && (
                    <InformasiTab
                        profile={profile}
                        refresh={handleGetInformasiKaryawan}
                        selectedMenu={selectedMenuInformasi}
                        setSelectedMenu={setSelectedMenuInformasi}
                    />
                )
            }
        </Layout>
    )
}

export default Page

