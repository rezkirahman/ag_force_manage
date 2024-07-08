import { useEffect, useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditPendidikan from '../modal-edit/ModalEditPendidikan'

const PendidikanTab = ({ MenuButton, title, data, refresh }) => {
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [riwayatPendidikan, setRiwayatPendidikan] = useState([])
    
    useEffect(() => {
        if (data?.riwayat_pendidikan) {
            setRiwayatPendidikan(data?.riwayat_pendidikan || [])
        }
    }, [data])
    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditPendidikan
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={refresh}
                data={data}
            />
            {riwayatPendidikan?.map((item, index) => (
                <>
                    <h3 className='text-xs font-semibold'>Riwayat Pendidikan {index + 1}</h3>
                    <InformasiFormatting label='Nama Sekolah' value={item?.nama_sekolah} />
                    <InformasiFormatting label='Lokasi Sekolah' value={item?.lokasi_sekolah} />
                    <InformasiFormatting label='Tahun Lulus' value={item?.tahun_lulus} />
                    <InformasiFormatting label='Tingkat Pendidikan' value={item?.tingkat_pendidikan} />
                    <InformasiFormatting label='Bidang Studi/Jurusan' value={item?.bidang_studi} />
                    <InformasiFormatting label='Gelar Pendidikan' value={item?.gelar_pendidikan} />
                    <InformasiFormatting label='Keterangan' value={item?.keterangan} />

                </>
            ))}
            <hr />
            <InformasiFormatting label='Rencana Pendidikan untuk Bersekolah lagi' value={data?.rencana_pendidikan?.rencana_sekolah ? 'Ya' : 'Tidak'} />
            <InformasiFormatting label='Nama Sekolah' value={data?.rencana_pendidikan?.nama_sekolah} />
        </ProfilingContainer>
    )
}

export default PendidikanTab