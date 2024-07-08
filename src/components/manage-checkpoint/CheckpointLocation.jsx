import { Icon } from '@iconify/react'
import Container from '../Container'
import dayjs from 'dayjs'

const CheckpointLocation = () => {
    return (
        <Container>
            <div className='space-y-6'>
                <h3 className='font-semibold'>Manage Checkpoint</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-disable">
                        <Icon icon='material-symbols:calendar-month' className="text-lg" />
                        <h3>{dayjs().format('dddd, D MMM YYYY')}</h3>
                    </div>
                    <div className="flex items-center justify-start gap-4">
                        <button
                            onClick={() => router.push('/manage-checkpoint/tambah-checkpoint')}
                            className="flex items-center gap-2 px-4 py-3 text-white transition-all rounded-lg bg-primary hover:bg-opacity-80 hover:shadow-xl"
                        >
                            <Icon icon={'material-symbols:add-box-rounded'} className="text-xl" />
                            <h3 className="">Tambah Checkpoint</h3>
                        </button>
                        <button
                            onClick={() => router.push('/manage-checkpoint/export-checkpoint')}
                            className="flex items-center gap-2 px-4 py-3 text-white transition-all rounded-lg bg-primary hover:bg-opacity-80 hover:shadow-xl"
                        >
                            <Icon icon={'fluent:document-header-arrow-down-20-filled'} className="text-xl" />
                            <h3 className="">Export Checkpoint</h3>
                        </button>

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default CheckpointLocation