import { useCallback, useState, useEffect, useRef } from 'react'
import ModalEditProfilingLayout from '../profiling/ModalEditProfilingLayout'
import { useAppContext } from '@/context'
import { Autocomplete, Chip, FormControl, FormHelperText, InputAdornment, InputBase, InputLabel, MenuItem, TextField } from '@mui/material'
import { Icon } from '@iconify/react'
import TagsField from '@/components/TagsField'
import { updateProfilingData, updateUmumProfiling } from '@/api/users-management/profiling'
import { useParams } from 'next/navigation'
import { hobbySuggestions, interestSuggestions } from '@/api/users-management/suggestion'

const ModalEditUmum = ({ open, setOpen, refresh, title, data }) => {
    const params = useParams()
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [rencanaKerja, setRencanaKerja] = useState('')
    const [hobbySuggest, setHobbySuggest] = useState([])
    const [interestSuggest, setInterestSuggest] = useState([])
    const [hobby, setHobby] = useState([])
    const [interest, setInterest] = useState([])

    const handleUpdate = useCallback(async () => {
        if (!unitKerja) return
        setLoadingUpdate(true)
        const body = {
            rencana_kerja: Number(rencanaKerja),
            hobby: hobby,
            interest: interest,
        }
        const { data } = await updateProfilingData({
            type: title,
            unitKerja: unitKerja.id,
            id: params.id,
            body: body
        })
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah data umum'
            })
            refresh()
            setOpen(false)
        } else {
            setOpenSnackbar({
                open: true,
                severity: 'error',
                message: 'Gagal mengubah data umum'
            })
        }
        setLoadingUpdate(false)
    }, [hobby, interest, params.id, refresh, rencanaKerja, setOpen, setOpenSnackbar, title, unitKerja])

    const getHobbySuggestions = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await hobbySuggestions(unitKerja.id)
        if (data?.data) {
            setHobbySuggest(data?.data)
        }
    }, [unitKerja])

    const getInterestSuggestions = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await interestSuggestions(unitKerja.id)
        if (data?.data) {
            setInterestSuggest(data?.data)
        }
    }, [unitKerja])

    useEffect(() => {
        if (open) {
            getHobbySuggestions()
            getInterestSuggestions()
        }
    }, [getHobbySuggestions, getInterestSuggestions, open])

    useEffect(() => {
        if (open) {
            setRencanaKerja(data?.rencana_kerja)
            setHobby(data?.hobby || [])
            setInterest(data?.interest || [])
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
            edit
        >
            <TextField
                value={rencanaKerja}
                onChange={e => { if (e.target.value > 0) setRencanaKerja(e.target.value) }}
                label='Rencana Bekerja'
                fullWidth
                type='number'
                InputProps={{
                    endAdornment: <InputAdornment position="end">Tahun</InputAdornment>,
                }}
            />
            <TagsField
                chipData={hobby}
                setChipData={setHobby}
                title={'Hobi'}
                placeHolder='Masukkan hobi'
                helperText={'Pisahkan dengan koma (,) atau Enter'}
                suggestTags={hobbySuggest}
            />
            <TagsField
                chipData={interest}
                setChipData={setInterest}
                title={'Ketertarikan'}
                placeHolder='Masukkan ketertarikan'
                helperText={'Pisahkan dengan koma (,) atau Enter'}
                suggestTags={interestSuggest}
            />
        </ModalEditProfilingLayout>
    )
}

export default ModalEditUmum

