import { useState, useEffect, useCallback } from 'react'
import ModalLayout from '../ModalLayout'
import { FormControl, InputLabel, MenuItem, Select, Slider, TextField } from '@mui/material'
import PrimaryButton from '../PrimaryButton'
import { Icon } from '@iconify/react'
import { createRoleManagement, updateRoleManagement } from '@/api/role-management/role-management'
import { useAppContext } from '@/context'

const ModalAddEditRole = ({ open, setOpen, refresh, role, edit = false }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [code, setCode] = useState('AGP')
    const [label, setLabel] = useState('')
    const [radius, setRadius] = useState(0)
    const [loading, setLoading] = useState(false)

    const handleAdd = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await createRoleManagement({
            unitKerja: unitKerja.id,
            body: {
                code: code,
                name: label,
                radius: radius
            }
        })
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menambahkan jabatan'
            })
            refresh()
            setOpen(false)
        }
        setLoading(false)
    }, [code, label, radius, refresh, setOpen, setOpenSnackbar, unitKerja])

    const updateRole = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await updateRoleManagement({
            unitKerja: unitKerja.id,
            body: {
                code: code,
                name: label,
                radius: radius,
                level: parseInt(role?.level),
                parent_id: role?.parent,
            },
            id: parseInt(role?.value)
        })
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah jabatan'
            })
            refresh()
            setOpen(false)
        }
        setLoading(false)
    }, [code, label, radius, refresh, role?.level, role?.parent, role?.value, setOpen, setOpenSnackbar, unitKerja])

    useEffect(() => {
        if (open) {
            if (edit) {
                setCode(role?.code)
                setLabel(role?.label)
                setRadius(role?.radius)
            } else {
                setCode('AGP')
                setLabel('')
                setRadius(0)
            }
        }
    }, [edit, open, role])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={edit ? 'Ubah Jabatan' : 'Tambah Jabatan'}
        >
            <div className='h-[40vh] overflow-y-auto py-2 space-y-4'>
                <FormControl fullWidth>
                    <InputLabel>Kode</InputLabel>
                    <Select
                        value={code}
                        label="Kode"
                        onChange={(e) => setCode(e.target.value)}
                    >
                        <MenuItem value={'AGP'}>AGP (Artha Graha Peduli)</MenuItem>
                        <MenuItem value={'SGA'}>SGA (Security Group Artha)</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    label="Nama Jabatan"
                    variant="outlined"
                    fullWidth
                />
                <div className='space-y-1'>
                    <h3>Radius</h3>
                    <div className='flex items-center gap-4'>
                        <Icon icon='mingcute:live-location-fill' className='text-2xl' />
                        <Slider
                            max={1000}
                            step={50}
                            value={radius}
                            onChange={(e, value) => setRadius(value)}
                            valueLabelDisplay='auto'
                        />
                        <h3 className='font-semibold'>{radius}</h3>
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <PrimaryButton
                    onClick={edit ? updateRole : handleAdd}
                    className={'md:w-1/4'}
                    loading={loading}
                >
                    {edit ? 'Ubah' : 'Tambahkan'}
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalAddEditRole