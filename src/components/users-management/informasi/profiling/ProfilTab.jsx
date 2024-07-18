import { useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditProfil from '../modal-edit/ModalEditProfil'
import dayjs from 'dayjs'

const ProfilTab = ({ MenuButton, title, data, refresh, geotagging }) => {
    const [openModalEdit, setOpenModalEdit] = useState(false)
    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditProfil
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={refresh}
                data={data}
            />
            <InformasiFormatting label='Nama Lengkap' value={data?.full_name} />
            <InformasiFormatting label='Nomor Induk Karyawan' value={data?.nik} />
            <InformasiFormatting label='Jenis Kelamin' value={data?.gender} />
            <InformasiFormatting label='No. Telepon' value={data?.phone} />
            <InformasiFormatting label='Email' value={data?.email} />
            <InformasiFormatting label='Jabatan' value={data?.role?.map(item => item.role_name)} />
            <InformasiFormatting label='Bisnis Unit' value={data?.bisnis_unit} />
            <InformasiFormatting label='Direktorat' value={data?.divisi?.join_direktorat} />
            <InformasiFormatting label='Tanggal Bergabung' value={data?.join_date ? dayjs(data?.join_date, 'DD/MM/YYYY').format('DD MMMM YYYY') : ""} />
            <hr />
            <InformasiFormatting label='Grup Kehadiran' value={geotagging?.title} />
            <InformasiFormatting label='Akses Lokasi' value={geotagging?.group_geo.map((item) => item.place_name)} />
        </ProfilingContainer>
    )
}

export default ProfilTab
