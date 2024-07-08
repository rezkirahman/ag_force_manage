import { uploadFile } from "@/api/upload"
import { updateProfilingData } from "@/api/users-management/profiling"
import ImageField from "@/components/ImageField"
import ModalLayout from "@/components/ModalLayout"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { Button } from "@mui/material"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const ModalChangePhotoProfiling = ({ open, setOpen, image, refresh }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [profileImage, setProfileImage] = useState('https://cdn.agforce.co.id/warung-berkah-dev/default-picture/5d8d50103d1946b1b7fb533c7ab088a3..png')
    const [loading, setLoading] = useState(false)

    const handleChangeProfilePhoto = useCallback(async () => {
        if (!unitKerja) return
        if (!profileImage.type) return
        setLoading(true)
        const body = {
            photo: await uploadFile(unitKerja.id, profileImage, 'profile')
        }
        const { data } = await updateProfilingData({
            type: 'photo',
            unitKerja: unitKerja.id,
            id: params.id,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah foto profil'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah foto profil'
            })
        }
        setLoading(false)
    }, [params.id, profileImage, refresh, setOpen, setOpenSnackbar, unitKerja])

    useEffect(() => {
        if (open) {
            setProfileImage(image)
            setLoading(false)
        }
    }, [image, open])

    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title='Ubah Foto Profil'
            className={'md:max-w-[400px]'}
        >
            <div className="overflow-clip aspect-square">
                <ImageField
                    imageFile={profileImage}
                    setImageFile={setProfileImage}
                    label='Pilih foto profil'
                    imageKey="profile_image"
                />
            </div>
            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleChangeProfilePhoto}
                disabled={loading}
            >
                {loading ? <Icon icon='mdi:loading' className='text-[27px] animate-spin' /> : 'Ubah'}
            </Button>
        </ModalLayout>
    )
}

export default ModalChangePhotoProfiling