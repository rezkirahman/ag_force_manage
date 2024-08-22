import React, { useCallback, useEffect, useState } from 'react'
import ModalLayout from '../ModalLayout'
import { InformasiFormatting } from '../users-management/informasi/InformasiTab'
import { useAppContext } from '@/context'
import { detailCutiIzin } from '@/api/cuti&izin/cutiIzin'

const ModalDetailCutiIzin = ({ open, setOpen, data, id = null }) => {
    const { unitKerja } = useAppContext()
    const [detail, setDetail] = useState({})

    const handleDetail = useCallback(async () => {
        if (!unitKerja) return
        setDetail({})
        const { data } = await detailCutiIzin({
            unitKerja: unitKerja.id,
            id: id
        })
        if (data?.data) {
            setDetail(data.data)
        }
    }, [id, unitKerja])

    useEffect(() => {
        if (id) {
            handleDetail()
        } else {
            setDetail(data)
        }
    }, [data, handleDetail, id])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Rincian Pengajuan'}
            onClose={() => setOpen(false)}
        >
            <div className='flex flex-col gap-2 divide-y-2 h-[60vh] overflow-y-auto pr-2'>
                <RincianFormating label={'Pemohon'}>
                    <InformasiFormatting label='Nama' value={detail?.name} />
                    <InformasiFormatting label='Foto' value={detail?.photo} image />
                    <InformasiFormatting label='NIK' value={detail?.nik} />
                    <InformasiFormatting label='Divisi / Departemen' value={detail?.division} />
                    <InformasiFormatting label='jabatan' value={detail?.role} />
                    <InformasiFormatting label='No. Telepon' value={detail?.phone_number} />
                </RincianFormating>
                <RincianFormating label={'Pengajuan'}>
                    <InformasiFormatting label='Saldo Cuti' value={`${detail?.saldo} Hari`} />
                    <InformasiFormatting label='pengajuan' value={`${detail?.count_days} Hari`} />
                    <InformasiFormatting label='Kategori' value={detail?.category} />
                    <InformasiFormatting label='Keterangan' value={detail?.reason} />
                    <InformasiFormatting label='Tanggal Cuti / Izin' value={detail?.absence_date} />
                    <InformasiFormatting label='Tanggal Kembali Bekerja' value={detail?.back_to_work} />
                    <InformasiFormatting label='Pengajuan dibuat' value={detail?.submission} />
                    {detail?.Documents?.map((doc, i) => (
                        <InformasiFormatting key={i} label={`Dokumen ${i + 1}`} value={doc.document} link />
                    ))}
                </RincianFormating>
                {detail?.BackupPerson?.map((item, i) => (
                    <RincianFormating key={i} label={item.title}>
                        <InformasiFormatting label='Saldo Cuti' value={item.name} />
                        <InformasiFormatting label='NIK' value={item.nik} />
                        <InformasiFormatting label='Divisi / Departemen' value={item.division} />
                        <InformasiFormatting label='Jabatan' value={item.role} />
                        <InformasiFormatting label='No. Telepon' value={item.phone_number} />
                        <InformasiFormatting label='Disetujui' value={item.date} />
                    </RincianFormating>
                ))}
                {detail?.Superior?.map((item, i) => (
                    <RincianFormating key={i} label={item.title}>
                        <InformasiFormatting label='Saldo Cuti' value={item.name} />
                        <InformasiFormatting label='NIK' value={item.nik} />
                        <InformasiFormatting label='Divisi / Departemen' value={item.division} />
                        <InformasiFormatting label='Jabatan' value={item.role} />
                        <InformasiFormatting label='No. Telepon' value={item.phone_number} />
                        <InformasiFormatting label='Disetujui' value={item.date} />
                    </RincianFormating>
                ))}
            </div>
        </ModalLayout>
    )
}

export default ModalDetailCutiIzin

const RincianFormating = ({ label, children }) => {
    return (
        <div className='relative'>
            <div className='sticky z-30 py-1 bg-white -top-0'>
                <h3 className='text-sm font-semibold'>{label}</h3>
            </div>
            <div className='space-y-1'>
                {children}
            </div>
        </div>
    )
}