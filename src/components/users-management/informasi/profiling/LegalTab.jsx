import { useState, useCallback, useEffect } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditLegal from '../modal-edit/ModalEditLegal'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'

const LegalTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [data, setData] = useState({})
    const [openModalEdit, setOpenModalEdit] = useState(false)

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'legal'
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
            <ModalEditLegal
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            <InformasiFormatting label='Status Pajak' value={data?.status_pajak ? 'Aktif' : 'Non Aktif'} />
            <InformasiFormatting label='Nomor NPWP' value={data?.npwp} />
            <InformasiFormatting label='Kartu NPWP' value={data?.kartu_npwp} link />
            <hr />
            <InformasiFormatting label='Nomor BPJS Kesehatan' value={data?.bpjs_kes} />
            <InformasiFormatting label='Kartu BPJS' value={data?.kartu_bpjs_kes} link />
            <hr />
            <InformasiFormatting label='Nomor BPJS Ketenagakerjaan' value={data?.bpjs_ket} />
            <InformasiFormatting label='Kartu BPJS' value={data?.kartu_bpjs_ket} link />
        </ProfilingContainer>
    )
}

export default LegalTab