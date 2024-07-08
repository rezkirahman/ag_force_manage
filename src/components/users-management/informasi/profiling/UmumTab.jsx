import { useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditUmum from '../modal-edit/ModalEditUmum'

const UmumTab = ({ MenuButton, title, data, refresh }) => {
    const [openModalEdit, setOpenModalEdit] = useState(false)
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
                refresh={refresh}
                data={data}
            />
            <InformasiFormatting label='Rencana Tahun Bekerja' value={data?.rencana_kerja} />
            <InformasiFormatting label='Hobi' value={data?.hobby} />
            <InformasiFormatting label='Ketertarikan' value={data?.interest} />
        </ProfilingContainer>
    )
}

export default UmumTab