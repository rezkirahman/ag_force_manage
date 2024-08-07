import { createGroupAttendance, oneGroupAttendance, suggestLocationAttendanceGroup, suggestUserAttendanceGroup, updateGroupAttendance } from '@/api/settings/attendance-group'
import ModalLayout from '@/components/ModalLayout'
import { useAppContext } from '@/context'
import { Icon } from '@iconify/react'
import { Autocomplete, Button, Checkbox, Chip, TextField } from '@mui/material'
import { useState, useCallback, useEffect } from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import PrimaryButton from '@/components/PrimaryButton'

const ModalAddEditGroupAttendance = ({ open, setOpen, edit, refresh, id }) => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = <CheckBoxIcon fontSize="small" />
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [name, setName] = useState('')
    const [suggestLocation, setSuggestLocation] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const [suggestUser, setSuggestUser] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    const [groupChecked, setGroupChecked] = useState({})
    const [loading, setLoading] = useState(false)
    const [isAllowSubmit, setIsAllowSubmit] = useState(false)

    const handleSuggestLocation = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await suggestLocationAttendanceGroup({ unitKerja: unitKerja.id })
        if (data?.data) {
            setSuggestLocation(data?.data)
        }
    }, [unitKerja])
    useEffect(() => { if (open) handleSuggestLocation() }, [open, handleSuggestLocation])

    const handleSuggestUser = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await suggestUserAttendanceGroup({ unitKerja: unitKerja.id })
        if (data?.data) {
            setSuggestUser(data?.data)
        }
    }, [unitKerja])
    useEffect(() => { if (open) handleSuggestUser() }, [open, handleSuggestUser])

    const handleOne = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await oneGroupAttendance({
            unitKerja: unitKerja.id,
            id: id
        })
        if (data?.data) {
            setName(data?.data?.title)
            setSelectedLocation(data?.data?.location)
            setSelectedUser(data?.data?.user)
        }
    }, [unitKerja, id])

    const handleAdd = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            title: name,
            location_id: selectedLocation.map(item => item.location_id),
            user_id: selectedUser.map(item => item.user_id)
        }
        const { data } = await createGroupAttendance({
            unitKerja: unitKerja.id,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menambahkan group'
            })
            setOpen(false)
            refresh()
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: `Gagal menambahkan group`
            })
        }
        setLoading(false)
    }, [name, refresh, selectedLocation, selectedUser, setOpen, setOpenSnackbar, unitKerja])

    const handleEdit = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            title: name,
            location_id: selectedLocation.map(item => item.location_id),
            user_id: selectedUser.map(item => item.user_id)
        }
        const { data } = await updateGroupAttendance({
            unitKerja: unitKerja.id,
            id: id,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah group'
            })
            setOpen(false)
            refresh()
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: `Gagal mengubah group`
            })
        }
        setLoading(false)
    }, [id, name, refresh, selectedLocation, selectedUser, setOpen, setOpenSnackbar, unitKerja])

    useEffect(() => {
        if (open) {
            if (edit) {
                handleOne()
            } else {
                setName('')
                setSelectedLocation([])
                setSelectedUser([])
                setGroupChecked({})
            }
        }
    }, [edit, handleOne, open])

    useEffect(() => {
        if (name && selectedLocation.length > 0) {
            setIsAllowSubmit(true)
        } else {
            setIsAllowSubmit(false)
        }
    }, [name, selectedLocation])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={edit ? 'Ubah Group' : 'Tambah Group'}
        >
            <div className='space-y-3 h-[50vh] overflow-y-auto py-2'>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="Nama Group"
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                />
                {suggestLocation.length > 0 && (
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        disablePortal
                        value={selectedLocation}
                        options={suggestLocation}
                        onChange={(e, newValue) => setSelectedLocation(newValue)}
                        getOptionLabel={(option) => option?.location_name}
                        isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Lokasi"
                                helperText="Dapat dipilih lebih dari satu"
                            />
                        }
                    />
                )}
                {suggestUser.length > 0 && (
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
            </div>
            <div className='flex justify-end'>
                <PrimaryButton
                    loading={loading}
                    disabled={!isAllowSubmit || loading}
                    onClick={edit ? handleEdit : handleAdd}
                    className={`md:w-1/4`}
                >
                    {edit ? 'Simpan' : 'Tambahkan'}
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalAddEditGroupAttendance
