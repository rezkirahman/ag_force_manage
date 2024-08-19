import { useEffect, useCallback, useState } from "react"
import ModalEditProfilingLayout from "../profiling/ModalEditProfilingLayout"
import { useParams } from "next/navigation"
import { useAppContext } from "@/context"
import TagsField from "@/components/TagsField"
import { updateProfilingData } from "@/api/users-management/profiling"

const ModalEditKeahlian = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [hardSkill, setHardSkill] = useState([])
    const [softSkill, setSoftSkill] = useState([])
    const [bahasa, setBahasa] = useState([])
    const [rekomendasi, setRekomendasi] = useState([])
    const [loadingUpdate, setLoadingUpdate] = useState(false)

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            hard_skill: hardSkill,
            soft_skill: softSkill,
            bahasa: bahasa,
            rekomendasi: rekomendasi
        }
        const { data } = await updateProfilingData({
            unitKerja: unitKerja?.id,
            id: params.id,
            type: 'keahlian',
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah data'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data'
            })
        }
        console.log(body);
        setLoadingUpdate(false)
    }, [bahasa, hardSkill, rekomendasi, softSkill, unitKerja, params, setOpenSnackbar, refresh, setOpen])

    useEffect(() => {
        if (open) {
            setHardSkill(data?.hard_skill || [])
            setSoftSkill(data?.soft_skill || [])
            setBahasa(data?.bahasa || [])
            setRekomendasi(data?.rekomendasi || [])
        }
    }, [data, open])

    return (
        <ModalEditProfilingLayout
            open={open}
            setOpen={setOpen}
            title={title}
            refresh={refresh}
            loading={loadingUpdate}
            handleClick={handleUpdate}
        >
            <TagsField
                chipData={hardSkill}
                setChipData={setHardSkill}
                title={"Keahlian Teknis (Hard Skill)"}
                helperText={"Tekan Enter atau Koma (,) untuk menambahkan."}
            />
            <TagsField
                chipData={softSkill}
                setChipData={setSoftSkill}
                title={"Keahlian Non Teknis (Soft Skill)"}
                helperText={"Tekan Enter atau Koma (,) untuk menambahkan."}
            />
            <TagsField
                chipData={bahasa}
                setChipData={setBahasa}
                title={"Bahasa"}
                helperText={"Tekan Enter atau Koma (,) untuk menambahkan."}
            />
            <TagsField
                chipData={rekomendasi}
                setChipData={setRekomendasi}
                title={"Rekomendasi"}
                helperText={"Tekan Enter atau Koma (,) untuk menambahkan."}
            />
        </ModalEditProfilingLayout>
    )
}

export default ModalEditKeahlian