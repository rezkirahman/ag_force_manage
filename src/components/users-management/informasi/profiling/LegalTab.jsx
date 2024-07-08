import React, { useState } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import ModalEditLegal from '../modal-edit/ModalEditLegal'

const LegalTab = ({ MenuButton, title, data, refresh }) => {
    const [openModalEdit, setOpenModalEdit] = useState(false)
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
                refresh={refresh}
                data={data}
            />
            <InformasiFormatting label='Status Pajak' value={data?.status_pajak ? 'Aktif' : 'Non Aktif'} />
            <InformasiFormatting label='Nomor NPWP' value={data?.npwp} />
            <InformasiFormatting label='Kartu NPWP' value={data?.kartu_npwp} link />
            <hr />
            <InformasiFormatting label='Nomor BPJS Kesehatan' value={data?.bpjs_kes} />
            <InformasiFormatting label='Kartu BPJS' value={data?.kartu_bpjs_kes} link/>
            <hr />
            <InformasiFormatting label='Nomor BPJS Ketenagakerjaan' value={data?.bpjs_ket} />
            <InformasiFormatting label='Kartu BPJS' value={data?.kartu_bpjs_ket} link/>
        </ProfilingContainer>
    )
}

export default LegalTab