'use client'
import { useState } from 'react'
import { IconButton } from '@mui/material'
import { Icon } from '@iconify/react'
import InformasiNavigation from './InformasiNavigation'
import ImageView from '@/components/ImageView'
import ProfilTab from './profiling/ProfilTab'
import PribadiTab from './profiling/PribadiTab'
import UmumTab from './profiling/UmumTab'
import LegalTab from './profiling/LegalTab'
import Link from 'next/link'
import KesehatanTab from './profiling/KesehatanTab'
import PernikahanTab from './profiling/PernikahanTab'
import KeluargaTab from './profiling/KeluargaTab'
import KontakDaruratTab from './profiling/KontakDaruratTab'
import PelatihanTab from './profiling/PelatihanTab'
import KeahlianTab from './profiling/KeahlianTab'
import KeagamaanTab from './profiling/KeagamaanTab'
import PendidikanTab from './profiling/PendidikanTab'
import OrganisasiTab from './profiling/OrganisasiTab'
import KegiatanTab from './profiling/KegiatanTab'
import PenugasanTab from './profiling/PenugasanTab'
import AgpTab from './profiling/AgpTab'
import PekerjaanTab from './profiling/PekerjaanTab'

const InformasiTab = ({ profile, refresh, selectedMenu, setSelectedMenu }) => {
    const [openMenuNavbarInformasi, setOpenMenuNavbarInformasi] = useState(false)
    const menuComponents = {
        1: { Component: ProfilTab, dataKey: 'data_profil_akun' },
        2: { Component: PribadiTab, dataKey: 'data_diri' },
        3: { Component: UmumTab, dataKey: 'data_umum' },
        4: { Component: LegalTab, dataKey: 'data_legal' },
        5: { Component: KesehatanTab, dataKey: 'data_kesehatan' },
        6: { Component: PendidikanTab, dataKey: 'data_pendidikan' },
        7: { Component: KeluargaTab, dataKey: 'data_keluarga' },
        8: { Component: PernikahanTab, dataKey: 'data_pernikahan' },
        9: { Component: KontakDaruratTab, dataKey: 'data_kontak_darurat' },
        10: { Component: PelatihanTab, dataKey: 'data_pelatihan' },
        11: { Component: KeahlianTab, dataKey: 'data_keahlian' },
        12: { Component: KeagamaanTab, dataKey: 'data_riwayat_keagamaan' },
        13: { Component: OrganisasiTab, dataKey: 'data_organisasi' },
        14: { Component: PekerjaanTab, dataKey: 'data_pekerjaan' },
        15: { Component: KegiatanTab, dataKey: 'data_kegiatan' },
        16: { Component: PenugasanTab, dataKey: 'data_penugasan' },
        17: { Component: AgpTab, dataKey: 'data_agp' },
    }
    const { Component, dataKey } = menuComponents[selectedMenu.id] || {}

    const ButtonNavbarInformasi = () => {
        return (
            <div className='md:sr-only'>
                <IconButton
                    color='inherit'
                    className="ring-1 ring-inset ring-gray-500"
                    onClick={() => setOpenMenuNavbarInformasi(true)}
                >
                    <Icon icon='heroicons-solid:menu-alt-3' className='text-xl' />
                </IconButton>
            </div>
        )
    }

    return (
        <div className="gap-6 md:flex md:h-[70vh] items-stretch">
            <div className="max-h-full grow">
                {Component && (
                    <Component
                        MenuButton={ButtonNavbarInformasi}
                        title={selectedMenu.title}
                        data={profile?.[dataKey]}
                        refresh={refresh}
                        geotagging={profile?.user_group_profiling}
                    />
                )}
            </div>
            <InformasiNavigation
                selected={selectedMenu}
                setSelected={setSelectedMenu}
                openNavbar={openMenuNavbarInformasi}
                setOpenNavbar={setOpenMenuNavbarInformasi}
            />
        </div>
    )
}

export default InformasiTab

export const InformasiFormatting = ({ label, value, image = false, link = false }) => {
    return (
        <div className='group space-y-[2px]'>
            <div className='flex items-start justify-between text-xs'>
                <h3>{label}</h3>
                {value !== null && value !== undefined && value !== "" ? (
                    Array.isArray(value) ? (value.length > 1 ?
                        (<div className='flex flex-wrap justify-end items-center gap-1 w-[60%]'>
                            {value.map((item, index) => (
                                <div key={index} className='px-2 py-1 bg-gray-200 rounded-full w-fit'>
                                    <h3 className='text-xs'>{item}</h3>
                                </div>
                            ))}
                        </div>) : (
                            <div className='w-[60%] flex justify-end'>
                                <h3 className='font-medium text-right'>{value}</h3>
                            </div>
                        )
                    ) : image ? (
                        <div className='w-[20%] lg:w-[100px]'>
                            <ImageView photo={value} />
                        </div>
                    ) : link ? (
                        <Link href={value} target='_blank' className='font-semibold underline text-primary underline-offset-2'>
                            Unduh
                        </Link>

                    ) : (
                        <div className='w-[60%] flex justify-end'>
                            <h3 className='font-medium text-right'>{value}</h3>
                        </div>
                    )
                ) : (
                    <h3>-</h3>
                )}
            </div >
            <hr className='transition-all opacity-0 group-hover:opacity-100' />
        </div>
    )
}