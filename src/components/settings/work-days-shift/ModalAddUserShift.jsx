import ModalLayout from "@/components/ModalLayout"
import { useAppContext } from "@/context"
import { Autocomplete, Button, Checkbox, TextField } from "@mui/material"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useCallback, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { addUserShift, suggestUserShift } from "@/api/settings/work-days-shift"

const ModalAddUserShift = ({ open, setOpen, refresh }) => {
    const { setOpenSnackbar, unitKerja } = useAppContext()
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = <CheckBoxIcon fontSize="small" />
    const [loadingGetSuggest, setLoadingGetSuggest] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [selectedUser, setSelectedUser] = useState([])
    const [groupChecked, setGroupChecked] = useState({})
    const [loadingAddUser, setLoadingAddUser] = useState(false)

    const handleGetSuggest = useCallback(async () => {
        setLoadingGetSuggest(true)
        const { data } = await suggestUserShift(unitKerja.id)
        if (data?.data) {
            setSuggestions(data?.data)
        }
        setLoadingGetSuggest(false)
    }, [unitKerja])

    const handleAddUserShift = useCallback(async () => {
        setLoadingAddUser(true)
        const body = {
            user_id: selectedUser.map((user) => user.user_id)
        }
        const { data } = await addUserShift(unitKerja.id, body)
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Karyawan berhasil ditambahkan ke shift'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal menambahkan karyawan ke shift'
            })
        }
        setLoadingAddUser(false)
    }, [refresh, selectedUser, setOpen, setOpenSnackbar, unitKerja.id])

    useEffect(() => {
        if (open) {
            setSelectedUser([])
            handleGetSuggest()
        }
    }, [handleGetSuggest, open])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title='Tambah Karyawan Shift'
        >
            <div className="h-[50vh] overflow-y-auto">
                <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={[...suggestions].sort((a, b) => a.role_name.localeCompare(b.role_name))}
                    renderInput={(params) => <TextField {...params} label="Pilih Karyawan" variant="outlined" />}
                    getOptionLabel={(option) => option.user_name}
                    groupBy={(option) => option.role_name}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                checked={selected || groupChecked[option.role_name] || false}
                            />
                            <div className='flex justify-start gap-2'>
                                <h3 className=''>{option.user_name}</h3>
                                <div className='px-2 py-1 text-xs text-gray-500 bg-gray-200 rounded-full'>
                                    <h3 className=''>{option.role_name}</h3>
                                </div>
                            </div>
                        </li>
                    )}
                    renderGroup={(params) => {
                        const groupOptions = suggestions.filter((option) => option.role_name === params.group)
                        const selectedGroupOptions = groupOptions.filter((option) => selectedUser.includes(option))
                        const isAllSelected = groupOptions.length === selectedGroupOptions.length
                        const isSomeSelected = selectedGroupOptions.length > 0 && !isAllSelected
                        return (
                            <li key={params.key}>
                                <ul className='flex items-center'>
                                    <Checkbox
                                        checked={isAllSelected}
                                        indeterminate={isSomeSelected}
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
                />
            </div>
            <div className="flex justify-end">
                <Button
                    variant="contained"
                    size="large"
                    disabled={loadingAddUser || selectedUser.length === 0}
                    onClick={handleAddUserShift}
                >
                    {loadingAddUser ? <Icon icon='mdi:loading' className='text-2xl animate-spin' /> : 'Tambahkan'}
                </Button>
            </div>
        </ModalLayout>
    )
}

export default ModalAddUserShift