import { useState, useCallback, useEffect } from "react"
import ModalLayout from "../ModalLayout"
import { Button, TextField } from "@mui/material"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import PrimaryButton from "../PrimaryButton"
import { solveIncident } from "@/api/live-panic-incident/panic-incident"


const ModalSolve = ({ open, setOpen, id, setSelectedMarker }) => {
    const { setOpenSnackbar, unitKerja } = useAppContext()
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')

    const handleSolveIncident = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const response = await solveIncident({
            unitKerja: unitKerja.id,
            body: {
                unique_code: String(id),
                note: description,
            }
        })
        const { data } = response
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil Menyelesaikan Insiden'
            })
            setSelectedMarker(null)
            setOpen(false)
        } 
        setLoading(false)
    }, [description, id, setOpen, setOpenSnackbar, setSelectedMarker, unitKerja])

    useEffect(() => {
        if (open) {
            setDescription('')
        }
    }, [open])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            onClose={() => setOpen(false)}
            title="Tindak Lanjut"
            className={`max-w-[500px]`}
        >
            <div className="space-y-6 ">
                <TextField
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    label="Deskripsi"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                />
                <div className="flex justify-end">
                    <PrimaryButton
                        onClick={handleSolveIncident}
                        loading={loading}
                        disabled={loading}
                        className={`md:w-1/3`}
                    >
                        Selesaikan
                    </PrimaryButton>

                </div>
            </div>
        </ModalLayout>
    )
}

export default ModalSolve