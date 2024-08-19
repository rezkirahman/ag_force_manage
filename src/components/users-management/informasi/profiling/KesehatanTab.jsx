import React, { useState, useCallback, useEffect } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditKesehatan from '../modal-edit/ModalEditKesehatan'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const KesehatanTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [data, setData] = useState({})

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'kesehatan'
        })
        if (data?.data) {
            setData(data.data)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditKesehatan
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            <InformasiFormatting label={'Sering berolahraga'} value={data?.is_most_olahraga ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label={'Merokok'} value={data?.is_perokok ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label={'Social Drinker'} value={data?.is_most_alkohol ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label={'Tinggi Badan'} value={data?.tinggi_badan} />
            <InformasiFormatting label={'Berat Badan'} value={data?.berat_badan} />
            <InformasiFormatting label={'Golongan Darah'} value={data?.golongan_darah} />
            <hr />
            <InformasiFormatting label={'Dioptri Minus (Kiri)'} value={data?.dioptri_minus_kiri} />
            <InformasiFormatting label={'Dioptri Plus (Kiri'} value={data?.dioptri_plus_kiri} />
            <InformasiFormatting label={'Dioptri Silindris (Kiri)'} value={data?.dioptri_silindris_kiri} />
            <InformasiFormatting label={'Dioptri Minus (Kanan)'} value={data?.dioptri_minus_kanan} />
            <InformasiFormatting label={'Dioptri Plus (Kanan)'} value={data?.dioptri_plus_kanan} />
            <InformasiFormatting label={'Dioptri Silindris (Kanan)'} value={data?.dioptri_silindris_kanan} />
            <hr />
            <InformasiFormatting label={'Pernah Rawat Inap'} value={data?.is_rawat_inap ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label={'Jumlah Rawat Inap'} value={data?.jumlah_rawat_inap} />
            <InformasiFormatting label={'Penyebab Rawat Inap'} value={data?.reason_rawat_inap} />
            <hr />
            <InformasiFormatting label={'Riwayat Penyakit Pribadi'} value={data?.penyakit_pribadi} />
            <InformasiFormatting label={'Riwayat Penyakit Keluarga'} value={data?.penyakit_keluarga} />
            <InformasiFormatting label={'Obat Pribadi'} value={data?.obat_pribadi} />
            <InformasiFormatting label={'Alergi'} value={data?.alergi} />
            <hr />
            <InformasiFormatting label={'Kelemahan Pada Anggota Tubuh'} value={data?.is_kelemahan_tubuh ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label={'Bagian Lemah Anggota Tubuh'} value={data?.kelamahan_tubuh} />
            <hr />
            {data?.vaksins?.map((vaksin, index) => (
                <React.Fragment key={index}>
                    <InformasiFormatting label={'Vaksin ' + (index + 1)} value={vaksin?.vaksin} />
                    <InformasiFormatting label={'Tanggal Vaksin ' + (index + 1)} value={vaksin?.tanggal} />
                </React.Fragment>
            ))}
        </ProfilingContainer>
    )
}

export default KesehatanTab