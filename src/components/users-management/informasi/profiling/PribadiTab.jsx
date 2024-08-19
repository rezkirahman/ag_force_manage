import { useCallback, useEffect, useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import dayjs from 'dayjs'
import ModalEditPribadi from '../modal-edit/ModalEditPribadi'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'
import { useParams } from 'next/navigation'

const PribadiTab = ({ MenuButton, title }) => {
    const params =useParams()
    const { unitKerja } = useAppContext()
    const [data, setData] = useState({})
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [alamatKTP, setAlamatKTP] = useState('')
    const [alamatDomisili, setAlamatDomisili] = useState('')

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'pribadi'
        })
        if(data?.data){
            setData(data?.data)
            setAlamatKTP(data?.data?.postal_code_ktp)
            setAlamatDomisili(data?.data?.postal_code_domisili)
        }
    }, [params, unitKerja])
    useEffect(() => {handleData()}, [handleData])

    return (
        <ProfilingContainer
            MenuButton={MenuButton}
            title={title}
            setOpenEdit={setOpenModalEdit}
        >
            <ModalEditPribadi
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            <InformasiFormatting label='Jenis Identitas' value={data?.jenis_identitas} />
            <InformasiFormatting label='Nomor Identitas' value={data?.nomer_identitas} />
            <InformasiFormatting label='Tempat Lahir' value={data?.tempat_lahir} />
            <InformasiFormatting label='Tanggal Lahir' value={data?.tanggal_lahir} />
            <InformasiFormatting label='Shio' value={data?.shio} />
            <InformasiFormatting label='Agama' value={data?.agama} />
            <InformasiFormatting label='Status Perkawinan' value={data?.type_menikah} />
            <hr />
            <h3 className='text-xs font-semibold'>Alamat KTP</h3>
            <InformasiFormatting label='Provinsi' value={alamatKTP?.Provinces?.province_name} />
            <InformasiFormatting label='Kota' value={alamatKTP?.city} />
            <InformasiFormatting label='Kecamatan' value={alamatKTP?.sub_district} />
            <InformasiFormatting label='Kelurahan' value={alamatKTP?.urban} />
            <InformasiFormatting label='Alamat Lengkap' value={data?.alamat_ktp} />
            <hr />
            <h3 className='text-xs font-semibold'>Alamat Domisili</h3>
            <InformasiFormatting label='Provinsi' value={alamatDomisili?.Provinces?.province_name} />
            <InformasiFormatting label='Kota' value={alamatDomisili?.city} />
            <InformasiFormatting label='Kecamatan' value={alamatDomisili?.sub_district} />
            <InformasiFormatting label='Kelurahan' value={alamatDomisili?.urban} />
            <InformasiFormatting label='Alamat Lengkap' value={data?.alamat_domisili} />
            <hr />
            <h3 className='text-xs font-semibold'>Kepemilikan Kendaraan</h3>
            <InformasiFormatting label='Kendaraan Roda Dua' value={data?.roda_dua} />
            <InformasiFormatting label='Kendaraan Roda Empat' value={data?.roda_empat} />
            <hr />
            <h3 className='text-xs font-semibold'>Sosial Media</h3>
            <InformasiFormatting label='Facebook' value={data?.facebook} />
            <InformasiFormatting label='Twitter' value={data?.twitter} />
            <InformasiFormatting label='Instagram' value={data?.instagram} />
            <InformasiFormatting label='Linkedin' value={data?.linked_in} />
        </ProfilingContainer>
    )
}

export default PribadiTab
