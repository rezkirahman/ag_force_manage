import { useState, useEffect, useCallback } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditPekerjaan from '../modal-edit/ModalEditPekerjaan'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const PekerjaanTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [pekerjaanAG, setPekerjaanAG] = useState({})
    const [riwayat, setRiwayat] = useState([])
    const [data, setData] = useState({})

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'pekerjaan'
        })
        if (data?.data) {
            setData(data.data)
            setPekerjaanAG(data?.data?.pekerjaan_ag)
            setRiwayat(data?.data?.pekerjaan_riwayat)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditPekerjaan
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            <h3 className='text-xs font-semibold'>Pekerjaan di AG Group</h3>
            <InformasiFormatting label='Tanggal Mulai' value={pekerjaanAG?.start_working} />
            <InformasiFormatting label='Bisnis Unit' value={pekerjaanAG?.bisnis_unit} />
            <InformasiFormatting label='Status' value={pekerjaanAG?.status_working} />
            <InformasiFormatting label='Durasi' value={pekerjaanAG?.duration_status} />
            <InformasiFormatting label='Jabatan' value={pekerjaanAG?.role?.map((item) => item.role_name)} />
            <InformasiFormatting label='Komitmen' value={pekerjaanAG?.commitment + ' Tahun'} />
            {riwayat?.map((item, i) => (
                <div key={i} className='space-y-3'>
                    <hr />
                    <h3 className='text-xs font-semibold'>Riwayat Pekerjaan {i + 1}</h3>
                    <InformasiFormatting label='Nama Perusahaan' value={item.company} />
                    <InformasiFormatting label='lokasi Perusahaan' value={item.location} />
                    <InformasiFormatting label='Jabatan' value={item.position} />
                    <InformasiFormatting label='Status' value={item.type} />
                    <InformasiFormatting label='Tanggal Mulai' value={item.start} />
                    <InformasiFormatting label='Tanggal Berhenti' value={item.end} />
                    <InformasiFormatting label='Keterangan Berhenti' value={item.reason} />
                    <InformasiFormatting label='Nama Pimpinan Langsung' value={item.higher_name} />
                </div>
            ))}
        </ProfilingContainer>
    )
}

export default PekerjaanTab