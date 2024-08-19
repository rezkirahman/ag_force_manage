import { useState, useEffect, useCallback } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditKegiatan from '../modal-edit/ModalEditKegiatan'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const KegiatanTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [data, setData] = useState({})

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'kegiatan'
        })
        if (data?.data) {
            setData(data.data)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])


    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditKegiatan
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
             {data?.length > 0 ? (
                data?.map((item, i) => (
                    <div key={i} className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-xs font-semibold' key={i}>{item.relationship}</h3>
                        </div>
                        <InformasiFormatting label='Nama' value={item.name} />
                        <InformasiFormatting label='Jenis' value={item.type}/>
                        <InformasiFormatting label='Lokasi' value={item.location} />
                        <InformasiFormatting label='Posisi' value={item.position} />
                        <InformasiFormatting label='Periode Mulai' value={item.start} />
                        <InformasiFormatting label='Periode Berakhir' value={item.end} />
                        <InformasiFormatting label='Keterangan / Pencapaian' value={item.detail} />
                        {i < data.length - 1 && <hr />}
                    </div>
                ))
            ) : <h3 className='w-full text-center'>Tidak ada data</h3>}
        </ProfilingContainer>
    )
}

export default KegiatanTab