import { useState, useEffect, useCallback } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditOrganisasi from '../modal-edit/ModalEditOrganisasi'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { getProfilingData } from '@/api/users-management/profiling'
import dayjs from 'dayjs'

const OrganisasiTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja } = useAppContext()
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [data, setData] = useState({})

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'organisasi'
        })
        if (data?.data) {
            setData(data.data)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditOrganisasi
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                data={data}
            />
            {data?.length > 0 ?
                (data?.map((item, i) => (
                    <div key={i} className='space-y-3'>
                        <h3 className='text-xs font-semibold'>Riwayat Organisasi {i + 1}</h3>
                        <InformasiFormatting label='Nama Organisasi' value={item.name} />
                        <InformasiFormatting label='Lokasi' value={item.location} />
                        <InformasiFormatting label='Jabatan Keanggotaan' value={item.position} />
                        <InformasiFormatting label='Keterangan' value={item.detail} />
                        <InformasiFormatting label='Status Keanggotaan' value={item.status? 'Aktif' : 'Tidak Aktif'} />
                        <InformasiFormatting label='Bergabung Sejak' value={dayjs(item.start,'MM/YYYY').format('MMMM YYYY')} />
                        <InformasiFormatting label='Tidak Aktif Sejak' value={dayjs(item.end,'MM/YYYY').format('MMMM YYYY')} />
                        {i < data?.length - 1 && <hr />}
                    </div>
                ))) :
                <h3 className='text-center'>Tidak ada riwayat</h3>
            }
        </ProfilingContainer>
    )
}

export default OrganisasiTab