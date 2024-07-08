import { useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditKontakDarurat from '../modal-edit/ModalEditKontakDarurat'

const KontakDaruratTab = ({ MenuButton, title, data, refresh }) => {
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const image = 'https://images.unsplash.com/photo-1633171675586-3c6d4f6f8d9e'
    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalEdit}>
            <ModalEditKontakDarurat
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={refresh}
                data={data}
            />
            <InformasiFormatting label='Nama Lengkap' value={data?.full_name} />
        </ProfilingContainer>
    )
}

export default KontakDaruratTab