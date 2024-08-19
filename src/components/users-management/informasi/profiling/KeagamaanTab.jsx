import { useState, useEffect, useCallback } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditKeagamaan from '../modal-edit/ModalEditKeagamaan'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const KeagamaanTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [data, setData] = useState([])

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'keagamaan'
        })
        if (data?.data) {
            setData(data.data)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditKeagamaan
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            {data?.length > 0 ?
                (data?.map((item, i) => (
                    <div key={i} className='space-y-3'>
                        <h3 className='text-xs font-semibold'>Riwayat Keagamaan {i + 1}</h3>
                        <InformasiFormatting label='Nama Kegiatan' value={item.organization} />
                        <InformasiFormatting label='Nama Tokoh / Guru Agama' value={item.figure} />
                        <InformasiFormatting label='Lokasi' value={item.location} />
                        <InformasiFormatting label='tanggal' value={item.date_event} />
                        {i < data?.length - 1 && <hr />}
                    </div>
                ))) :
                <h3 className='text-center'>Tidak ada riwayat</h3>
            }
        </ProfilingContainer>
    )
}

export default KeagamaanTab