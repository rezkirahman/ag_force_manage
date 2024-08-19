import { useState, useCallback, useEffect } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditUmum from '../modal-edit/ModalEditUmum'
import { useAppContext } from '@/context'
import { useParams } from 'next/navigation'
import { getProfilingData } from '@/api/users-management/profiling'

const UmumTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [data, setData] = useState({})
    const [openModalEdit, setOpenModalEdit] = useState(false)

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'umum'
        })
        if (data?.data) {
            setData(data.data)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])
    
    return (
        <ProfilingContainer
            MenuButton={MenuButton}
            title={title}
            setOpenEdit={setOpenModalEdit}
        >
            <ModalEditUmum
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            <InformasiFormatting label='Rencana Tahun Bekerja' value={data?.rencana_kerja} />
            <InformasiFormatting label='Hobi' value={data?.hobby} />
            <InformasiFormatting label='Ketertarikan' value={data?.interest} />
        </ProfilingContainer>
    )
}

export default UmumTab