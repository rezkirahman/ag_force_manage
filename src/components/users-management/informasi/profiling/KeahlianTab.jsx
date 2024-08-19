import { useState, useCallback, useEffect } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditKeahlian from '../modal-edit/ModalEditKeahlian'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const KeahlianTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [data, setData] = useState({})

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'keahlian'
        })
        if (data?.data) {
            setData(data.data)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditKeahlian
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            <InformasiFormatting label='Keahlian Teknis (Hard Skill)' value={data?.hard_skill} />
            <InformasiFormatting label='Keahlian Non Teknis (Soft Skill)' value={data?.soft_skill} />
            <InformasiFormatting label='Kemampuan Berbahasa' value={data?.bahasa} />
            <InformasiFormatting label='Rekomendasi & Penilaian oleh Manajemen' value={data?.rekomendasi} />
        </ProfilingContainer>
    )
}

export default KeahlianTab