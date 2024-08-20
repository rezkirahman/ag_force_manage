import React from 'react'
import ModalLayout from '../ModalLayout'
import { InformasiFormatting } from '../users-management/informasi/InformasiTab'

const ModalDetailCutiIzin = ({ open, setOpen, data }) => {
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Rincian Pengajuan'}
            onClose={() => setOpen(false)}
        >
            <div className='flex flex-col gap-2 divide-y-2 h-[60vh] overflow-y-auto pr-2'>
                <RincianFormating label={'Pemohon'}>
                    <InformasiFormatting label='Nama' value={data?.name} />
                    <InformasiFormatting label='Foto' value={data?.photo} image />
                    <InformasiFormatting label='ID' value={data?.id} />
                    <InformasiFormatting label='NIK' value={data?.nik} />
                    <InformasiFormatting label='Divisi / Departemen' value={data?.division} />
                    <InformasiFormatting label='jabatan' value={data?.role} />
                    <InformasiFormatting label='No. Telepon' value={data?.phone_number} />
                </RincianFormating>
                <RincianFormating label={'Pengajuan'}>
                    <InformasiFormatting label='Saldo Cuti' value={`${data?.saldo} Hari`} />
                    <InformasiFormatting label='pengajuan' value={`${data?.count_days} Hari`} />
                    <InformasiFormatting label='Kategori' value={data?.category} />
                    <InformasiFormatting label='Keterangan' value={data?.reason} />
                    <InformasiFormatting label='Tanggal Cuti / Izin' value={data?.absence_date} />
                    <InformasiFormatting label='Tanggal Kembali Bekerja' value={data?.back_to_work} />
                    <InformasiFormatting label='Pengajuan dibuat' value={data?.submission} />
                    {data?.Documents?.map((doc, i) => (
                        <InformasiFormatting key={i} label={`Dokumen ${i + 1}`} value={doc.document} link />
                    ))}
                </RincianFormating>
                {data?.BackupPerson?.map((item, i) => (
                    <RincianFormating key={i} label={item.title}>
                        <InformasiFormatting label='Saldo Cuti' value={item.name} />
                        <InformasiFormatting label='NIK' value={item.nik} />
                        <InformasiFormatting label='Divisi / Departemen' value={item.division} />
                        <InformasiFormatting label='Jabatan' value={item.role} />
                        <InformasiFormatting label='No. Telepon' value={item.phone_number} />
                        <InformasiFormatting label='Disetujui' value={item.date} />
                    </RincianFormating>
                ))}
                {data?.Superior?.map((item, i) => (
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