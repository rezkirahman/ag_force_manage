import { useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditProfil from '../modal-edit/ModalEditProfil'

const ProfilTab = ({ MenuButton, title, data, refresh }) => {
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const image = 'https://images.unsplash.com/photo-1633171675586-3c6d4f6f8d9e'
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
        </ProfilingContainer>
    )
}

export default ProfilTab
