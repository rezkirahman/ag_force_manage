import React, { useState, useCallback, useEffect } from 'react'
import ModalLayout from '../ModalLayout'
import { useAppContext } from '@/context'
import PrimaryButton from '../PrimaryButton'
import { Alert, Autocomplete, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { suggestUserCutiIzin, updateSaldoCuti } from '@/api/cuti&izin/cutiIzin'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const ModalSaldoCuti = ({ open, setOpen,refresh }) => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = <CheckBoxIcon fontSize="small" />
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [saldo, setSaldo] = useState(0)
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [suggestUser, setSuggestnUser] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    const [groupChecked, setGroupChecked] = useState({})
    const [appliedAllUser, setAppliedAllUser] = useState(true)
    const [allowSubmit, setAllowSubmit] = useState(false)

    const handleListUser = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await suggestUserCutiIzin({ unitKerja: unitKerja.id })
        if (data?.data) {
            setSuggestnUser(data.data)
        }
    }, [unitKerja])

    const handleUpdateSaldoCuti = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const user = (appliedAllUser ? suggestUser : selectedUser).map(item => item.user_id)
        const { data } = await updateSaldoCuti({
            unitKerja: unitKerja.id,
            body: {
                saldo: parseInt(saldo),
                user_id: user,
                description: description
            }
        })
        console.log(data)
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                message: 'Berhasil mengubah saldo cuti',
                severity: 'success'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                message: 'Gagal mengubah saldo cuti',
                severity: 'error'
            })
        }
        setLoading(false)
    }, [unitKerja, appliedAllUser, suggestUser, selectedUser, saldo, description, setOpenSnackbar, refresh, setOpen])

    useEffect(() => {
        if (open) {
            setSelectedUser([])
            setSuggestnUser([])
            setSaldo(0)
            setDescription('')
            setAppliedAllUser(true)
            handleListUser()
        }
    }, [handleListUser, open])

    useEffect(() => {
        setAllowSubmit(saldo > 0 && description && (appliedAllUser || selectedUser.length > 0))
    }, [saldo, description, appliedAllUser, selectedUser])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Saldo Cuti'}
        >
            <div className='overflow-y-auto h-[40vh] pr-2 py-2 space-y-4'>
                {(suggestUser.length > 0 && !appliedAllUser) && (
                    <Autocomplete
                        disablePortal
                        multiple
                        disableCloseOnSelect
                        options={[...suggestUser].sort((a, b) => a.role_name.localeCompare(b.role_name))}
                        getOptionLabel={(option) => `${option.user_name} - ${option.nik}`}
                        groupBy={(option) => option.role_name}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    checked={selected || groupChecked[option.role_name] || false}
                                />
                                <h3>{option.user_name} {option?.nik ? ` - ${option.nik}` : ''}</h3>
                            </li>
                        )}
                        renderGroup={(params) => {
                            const groupOptions = suggestUser.filter((option) => option.role_name === params.group)
                            const allSelected = groupOptions.every((option) => selectedUser.includes(option))
                            const someSelected = groupOptions.some((option) => selectedUser.includes(option))
                            const indeterminate = someSelected && !allSelected;
                            return (
                                <li key={params.key}>
                                    <ul className='flex items-center'>
                                        <Checkbox
                                            checked={allSelected}
                                            indeterminate={indeterminate}
                                            onChange={(event) => {
                                                const newCheckedState = event.target.checked
                                                setGroupChecked((prev) => ({ ...prev, [params.key]: newCheckedState }))
                                                const newSelectedUser = newCheckedState
                                                    ? [...selectedUser, ...groupOptions.filter((option) => !selectedUser.includes(option))]
                                                    : selectedUser.filter((option) => option.role_name !== params.group)
                                                setSelectedUser(newSelectedUser)
                                            }}
                                        />
                                        <h3>{params.group}</h3>
                                    </ul>
                                    <ul>{params.children}</ul>
                                </li>
                            )
                        }}
                        className='w-full'
                        value={selectedUser}
                        isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
                        onChange={(e, newValue) => setSelectedUser(newValue)}
                        renderInput={(params) =>
                            <TextField {...params}
                                label="Pilih Karyawan"
                                variant="outlined"
                                helperText="Dapat dipilih lebih dari satu"
                            />
                        }
                    />
                )}
                <div className='flex items-center gap-4'>
                    <TextField
                        type='number'
                        value={saldo}
                        onChange={(e) => setSaldo(e.target.value)}
                        label="Saldo"
                        className='w-[100px]'
                    />
                    <TextField
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        label="Deskripsi"
                        fullWidth
                    />
                </div>
            </div>
            <div className='flex flex-wrap justify-between gap-6'>
                <FormControlLabel
                    label="Terapkan ke semua karyawan"
                    control={
                        <Checkbox
                            checked={appliedAllUser}
                            onChange={(e) => setAppliedAllUser(e.target.checked)}
                        />
                    }
                />
                <PrimaryButton
                    loading={loading}
                    onClick={handleUpdateSaldoCuti}
                    className={'w-full md:w-1/4'}
                    disabled={loading || !allowSubmit}
                >
                    Terapkan
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalSaldoCuti