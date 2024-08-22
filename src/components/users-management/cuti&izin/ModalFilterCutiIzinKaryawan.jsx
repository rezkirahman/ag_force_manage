import ModalLayout from '@/components/ModalLayout'
import { Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState } from 'react'

const ModalFilterCutiIzinKaryawan = ({ open, setOpen, filter, setFilter }) => {
    const [start, setStart] = useState(dayjs().startOf('month'))
    const [end, setEnd] = useState(dayjs())
    const [type, setType] = useState(0)
    const [status, setStatus] = useState("")

    const handleSubmit = () => {
        setFilter({
            start: dayjs(start),
            end: dayjs(end),
            type: type,
            status: status
        })
        setOpen(false)
    }

    const handleReset = () => {
        setFilter({
            start: dayjs().startOf('month'),
            end: dayjs(),
            type: 0,
            status: ""
        })
        setStart(dayjs().startOf('month'))
        setEnd(dayjs())
        setType(0)
        setStatus("")
        setOpen(false)
    }
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Filter'}
        >
            <div className='h-[50vh] overflow-y-auto pr-2 py-1'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='flex items-center gap-4'>
                        <DatePicker
                            views={["month", "year"]}
                            label="Mulai"
                            value={start}
                            onChange={(newValue) => setStart(newValue) }
                            className='w-full'
                            format='MMM YYYY'
                            maxDate={end}
                        />
                        <h3>-</h3>
                        <DatePicker
                            views={["month", "year"]}
                            label="Selesai"
                            value={end}
                            onChange={(newValue) => { setEnd(newValue) }}
                            className='w-full'
                            format='MMM YYYY'
                            disableFuture
                            minDate={start}
                        />
                    </div>
                </LocalizationProvider>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <Button
                    variant='outlined'
                    size='large'
                    onClick={handleReset}
                >
                    Reset
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleSubmit}
                >
                    Terapkan
                </Button>
            </div>
        </ModalLayout>
    )
}

export default ModalFilterCutiIzinKaryawan