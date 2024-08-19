import { useEffect, useState, useCallback } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditPendidikan from '../modal-edit/ModalEditPendidikan'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const PendidikanTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [data, setData] = useState({})
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [riwayatPendidikan, setRiwayatPendidikan] = useState([])

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'pendidikan'
        })
        if (data?.data) {
            setData(data.data)
            setRiwayatPendidikan(data?.data?.riwayat_pendidikan || [])
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditPendidikan
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            {riwayatPendidikan?.map((item, index) => (
                <div key={index} className='space-y-3'>
                    <h3 className='text-xs font-semibold'>Riwayat Pendidikan {index + 1}</h3>
                    <InformasiFormatting label='Nama Sekolah' value={item?.nama_sekolah} />
                    <InformasiFormatting label='Lokasi Sekolah' value={item?.lokasi_sekolah} />
                    <InformasiFormatting label='Tahun Lulus' value={item?.tahun_lulus} />
                    <InformasiFormatting label='Tingkat Pendidikan' value={item?.tingkat_pendidikan} />
                    <InformasiFormatting label='Bidang Studi/Jurusan' value={item?.bidang_studi} />
                    <InformasiFormatting label='Gelar Pendidikan' value={item?.gelar_pendidikan} />
                    <InformasiFormatting label='Keterangan' value={item?.keterangan} />

                </div>
            ))}
            <hr />
            <InformasiFormatting label='Rencana Pendidikan untuk Bersekolah lagi' value={data?.rencana_pendidikan?.rencana_sekolah ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label='Nama Sekolah' value={data?.rencana_pendidikan?.nama_sekolah} />
        </ProfilingContainer>
    )
}

export default PendidikanTab