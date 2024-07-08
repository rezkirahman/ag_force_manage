import { useState, useEffect, useCallback, use } from "react"
import { Switch, TextField, Button, Icon } from "@mui/material"
import { useAppContext } from "@/context"
import { listWorkDays, updateWorkDays } from "@/api/settings/work-days-shift"
import Container from "../Container"
import { AnimatePresence, motion } from "framer-motion"
import Transition from "../transition"

const WorkDays = () => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [senin, setSenin] = useState()
    const [selasa, setSelasa] = useState()
    const [rabu, setRabu] = useState()
    const [kamis, setKamis] = useState()
    const [jumat, setJumat] = useState()
    const [sabtu, setSabtu] = useState()
    const [minggu, setMinggu] = useState()
    const [workingDays, setWorkingDays] = useState([])
    const [isValueChanged, setIsValueChanged] = useState(false)
    const [loading, setLoading] = useState(false)
    const commonTdClasses = "py-3 text-sm font-medium tracking-wider text-left uppercase"

    const handleGetWorkdays = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        const { data } = await listWorkDays(unitKerja.id)
        if (data?.data) {
            setWorkingDays(data?.data)
            setSenin(data?.data[0])
            setSelasa(data?.data[1])
            setRabu(data?.data[2])
            setKamis(data?.data[3])
            setJumat(data?.data[4])
            setSabtu(data?.data[5])
            setMinggu(data?.data[6])
        }
        setLoading(false)
    }, [unitKerja])

    const handleUpdateWorkDays = useCallback(async () => {
        if (!unitKerja) return
        setLoading(true)
        let days = [senin, selasa, rabu, kamis, jumat, sabtu, minggu]
        days = days.map(({ name, ...rest }) => rest)
        const body = {
            data: days
        }
        const { data } = await updateWorkDays(unitKerja.id, body)
        if (data?.data) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mengubah jadwal kerja'
            })
            handleGetWorkdays()
        }
        setLoading(false)

    }, [unitKerja, senin, selasa, rabu, kamis, jumat, sabtu, minggu, setOpenSnackbar, handleGetWorkdays])

    useEffect(() => {
        let changedDays = [senin, selasa, rabu, kamis, jumat, sabtu, minggu];
        let isValueChanged = !arraysAreEqual(changedDays, workingDays);
        setIsValueChanged(isValueChanged);
    }, [senin, selasa, rabu, kamis, jumat, sabtu, minggu, workingDays]);

    useEffect(() => {
        handleGetWorkdays()
    }, [handleGetWorkdays])

    return (
        <Container>
            <div className='space-y-6'>
                <div className="flex items-center justify-between gap-2">
                    <div className="space-y-2">
                        <h3 className="font-semibold">Work Days Operasional</h3>
                        <h3 className="">Jadwal hari dan jam kerja yang berlaku di bisnis unit ( diluar jam shift )</h3>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className='space-y-3 overflow-x-auto overflow-clip'>
                        <table className="w-full ">
                            <thead>
                                <tr className=''>
                                    <td className={`${commonTdClasses} pr-2 md:pr-6`}>Hari</td>
                                    <td></td>
                                    <td className={`${commonTdClasses} px-2 md:px-6`}>Jam masuk</td>
                                    <td></td>
                                    <td className={`${commonTdClasses} pl-2 md:pl-6`}>Jam Pulang</td>
                                </tr>
                            </thead>
                            <tbody>
                                <TimeRow data={senin} setData={setSenin} />
                                <TimeRow data={selasa} setData={setSelasa} />
                                <TimeRow data={rabu} setData={setRabu} />
                                <TimeRow data={kamis} setData={setKamis} />
                                <TimeRow data={jumat} setData={setJumat} />
                                <TimeRow data={sabtu} setData={setSabtu} />
                                <TimeRow data={minggu} setData={setMinggu} />
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button
                        size='large'
                        variant="contained"
                        onClick={handleUpdateWorkDays}
                        disabled={loading || !isValueChanged}
                    >
                        {loading ? <Icon icon={'mingcute:loading-fill'} className='text-[27px] animate-spin' /> : 'Simpan'}
                    </Button>
                </div>
            </div>
        </Container>
    )
}

const TimeRow = ({
    data = {
        name: '',
        active: false,
        start: '',
        end: ''
    },
    setData
}) => {
    const baseTdClasses = "py-2 whitespace-nowrap"
    const firstTdClasses = `${baseTdClasses} pr-2 md:pr-6`
    const centerTdClasses = `${baseTdClasses} px-2 md:px-6`
    const endTdClasses = `${baseTdClasses} pl-2 md:pl-6`
    return (
        <tr>
            <td className={`${firstTdClasses} font-semibold ${data?.active ? '' : 'text-gray-400'}`}>{data?.name}</td>
            <td>
                <Switch checked={data?.active} onChange={() => setData({ ...data, active: !data?.active })} />
            </td>
            <td className={centerTdClasses}>
                <TextField
                    type='time'
                    value={data?.start}
                    onChange={(e) => setData({ ...data, start: e.target.value })}
                    disabled={!data?.active}
                    fullWidth
                />
            </td>
            <td>-</td>
            <td className={endTdClasses}>
                <TextField
                    type="time"
                    value={data?.end}
                    onChange={(e) => setData({ ...data, end: e.target.value })}
                    disabled={!data?.active}
                    fullWidth
                />
            </td>
        </tr>
    )
}

export default WorkDays

const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) return false;
    
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    
    if (keys1.length !== keys2.length) return false
    
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
}

const arraysAreEqual = (array1, array2) => {
    if (array1.length !== array2.length) return false
    for (let i = 0; i < array1.length; i++) {
        if (!deepEqual(array1[i], array2[i])) return false
    }
    return true
}