import { useState, useCallback, useEffect } from 'react'
import ProfilingContainer from './ProfilingContainer'
import { InformasiFormatting } from '../InformasiTab'
import { useParams } from 'next/navigation'
import { useAppContext } from '@/context'
import { deleteProfilingKeluarga, getProfilingData } from '@/api/users-management/profiling'
import { IconButton, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import ModalDeleteConfirmation from '@/components/ModalDeleteConfirmation'
import { capitalizeFirstLetter } from '@/helper/capitalFirst'
import ModalAddEditKontakDarurat from '../modal-edit/ModalAddEditKontakDarurat'

const KontakDaruratTab = ({ MenuButton, title }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [data, setData] = useState([])
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [openModalEdit, setOpenModalEdit] = useState(false)
    const [selectedFamily, setSelectedFamily] = useState({})
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleData = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await getProfilingData({
            unitKerja: unitKerja?.id,
            id: params?.id,
            type: 'keluarga'
        })
        if (data?.data) {
            const family = data.data?.filter((item) => item?.is_emergency)
            setData(family)
        }
    }, [params, unitKerja])
    useEffect(() => { handleData() }, [handleData])

    const handleDelete = useCallback(async () => {
        if (!unitKerja) return
        setLoadingDelete(true)
        const { data } = await deleteProfilingKeluarga({
            unitKerja: unitKerja?.id,
            id: params?.id,
            childId: selectedFamily?.id
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menghapus data'
            })
            handleData()
            setOpenModalDelete(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal menghapus data'
            })
        }
        setLoadingDelete(false)
    }, [handleData, params, selectedFamily, setOpenSnackbar, unitKerja])

    return (
        <ProfilingContainer MenuButton={MenuButton} title={title} setOpenEdit={setOpenModalAdd} addButton>
            <ModalAddEditKontakDarurat
                open={openModalAdd}
                setOpen={setOpenModalAdd}
                title={title}
                refresh={handleData}
            />
            <ModalAddEditKontakDarurat
                open={openModalEdit}
                setOpen={setOpenModalEdit}
                title={title}
                refresh={handleData}
                family={selectedFamily}
                edit
            />
            <ModalDeleteConfirmation
                title={'Hapus ' + capitalizeFirstLetter(selectedFamily?.relationship)}
                open={openModalDelete}
                setOpen={setOpenModalDelete}
                handleDelete={handleDelete}
                loading={loadingDelete}
                description={<h3>Apakah anda yakin meghapus <span className='font-semibold'>{selectedFamily?.name}</span> ?</h3>}
            />
            {data?.length > 0 ? (
                data?.map((item, i) => (
                    <div key={i} className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-xs font-semibold' key={i}>{item.relationship}</h3>
                            <div className='flex items-center'>
                                <Tooltip arrow title='Ubah'>
                                    <IconButton
                                        size='small'
                                        color='primary'
                                        onClick={() => {
                                            setSelectedFamily(item)
                                            setOpenModalEdit(true)
                                        }}
                                    >
                                        <Icon icon='fluent:edit-48-filled' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow title='Hapus'>
                                    <IconButton
                                        size='small'
                                        color='error'
                                        onClick={() => {
                                            setSelectedFamily(item)
                                            setOpenModalDelete(true)
                                        }}
                                    >
                                        <Icon icon='mdi:delete' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <InformasiFormatting label='Nama' value={item.name} />
                        <InformasiFormatting label='Foto' value={item.photo} image />
                        <InformasiFormatting label='Tempat Lahir' value={item.place_birth} />
                        <InformasiFormatting label='Tanggal Lahir' value={item.date_birth} />
                        <InformasiFormatting label='Pendidikan Terakhir' value={item.last_education} />
                        <InformasiFormatting label='Status' value={item.alive ? 'Hidup' : 'Meninggal'} />
                        <InformasiFormatting label='No. Telp' value={item.phone} />
                        <InformasiFormatting label='Pekerjaan' value={item.work} />
                        {item?.postal_code_ktp && (
                            <>
                                <h3 className='text-xs font-medium'>Alamat KTP</h3>
                                <InformasiFormatting label='Provinsi' value={item.postal_code_ktp?.Provinces?.province_name} />
                                <InformasiFormatting label='Kabupaten/Kota' value={item.postal_code_ktp?.city} />
                                <InformasiFormatting label='Kecamatan' value={item.postal_code_ktp?.sub_district} />
                                <InformasiFormatting label='Kelurahan/Desa' value={item.postal_code_ktp?.urban} />
                                <InformasiFormatting label='Alamat Lengkap' value={item.alamat_ktp} />
                            </>
                        )}
                        {item?.postal_code_domisili && (
                            <>
                                <h3 className='text-xs font-medium'>Alamat Domisili</h3>
                                <InformasiFormatting label='Provinsi' value={item.postal_code_domisili?.Provinces?.province_name} />
                                <InformasiFormatting label='Kabupaten/Kota' value={item.postal_code_domisili?.city} />
                                <InformasiFormatting label='Kecamatan' value={item.postal_code_domisili?.sub_district} />
                                <InformasiFormatting label='Kelurahan/Desa' value={item.postal_code_domisili?.urban} />
                                <InformasiFormatting label='Alamat Lengkap' value={item.alamat_domisili} />
                            </>
                        )}
                        {i < data.length - 1 && <hr />}
                    </div>
                ))
            ) : <h3 className='w-full text-center'>Tidak ada data</h3>}
        </ProfilingContainer>
    )
}

export default KontakDaruratTab