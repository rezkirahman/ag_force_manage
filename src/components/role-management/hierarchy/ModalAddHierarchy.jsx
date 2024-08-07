'use client'
import { roleSuggestion } from "@/api/role"
import { addHierarchy } from "@/api/role-management/hierarchy"
import ModalLayout from "@/components/ModalLayout"
import PrimaryButton from "@/components/PrimaryButton"
import { useAppContext } from "@/context"
import { Autocomplete, TextField } from "@mui/material"
import { set } from "lodash"
import { useState, useCallback, useEffect } from "react"

const ModalAddHierarchy = ({ open, setOpen, refresh, node }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [suggestRole, setSuggestRole] = useState([])
    const [selectedRole, setSelectedRole] = useState([])

    const handleSuggestRole = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await roleSuggestion(unitKerja.id, { search: '' })
        if (data?.data) {
            setSuggestRole(data.data.filter((item) => item.parent == 0))
        }
    }, [unitKerja])

    const handleAddRole = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const body = {
            parent_id: node.id == 0 ? 1 : node.id,
            role_id: selectedRole.map((item) => parseInt(item.value))
        }
        const { data } = await addHierarchy({
            unitKerja: unitKerja.id,
            body: body,
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menambahkan struktur jabatan'
            })
            refresh()
            setOpen(false)
        }
        setLoading(false)
    }, [node, refresh, selectedRole, setOpen, setOpenSnackbar, unitKerja])

    useEffect(() => {
        if (open) {
            setSuggestRole([])
            setSelectedRole([])
            handleSuggestRole()
            localStorage.setItem('isZoomActive', 'false')
        } else {
            localStorage.setItem('isZoomActive', 'true')
        }
    }, [handleSuggestRole, open])



    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title="Tambah Struktur Jabatan"
        >
            {suggestRole && (
                <div className="h-[40vh]">
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        disablePortal
                        value={selectedRole}
                        onChange={(event, newValue) => {
                            setSelectedRole(newValue)
                        }}
                        options={suggestRole}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Jabatan"
                                helperText="Dapat dipilih lebih dari satu."
                            />
                        }
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                    />
                </div>
            )}
            <div className="flex justify-end">
                <div className="w-full md:w-1/4">
                    <PrimaryButton
                        loading={loading}
                        disabled={loading}
                        onClick={handleAddRole}
                    >
                        Tambahkan
                    </PrimaryButton>
                </div>
            </div>
        </ModalLayout>
    )
}

export default ModalAddHierarchy