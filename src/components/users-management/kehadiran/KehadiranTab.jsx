import Container from '@/components/Container'
import { useState } from 'react'
import dayjs from 'dayjs'
import { IconButton, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useAppContext } from '@/context'

const KehadiranTab = ({name}) => {
    const { unitKerja } = useAppContext()
    const [openModalFilter, setOpenModalFilter] = useState(false)
    const [filter, setFilter] = useState({
        startDate: dayjs(),
        endDate: dayjs(),
        location: [],
        status: 0,
    })

    return (
        <Container>
            <div className='flex items-start justify-between'>
                <h3 className='fonts'>Kehadiran</h3>
                <Tooltip title='Filter' arrow>
                    <IconButton
                        size='large'
                        onClick={() => setOpenModalFilter(true)}
                    >
                        <Icon icon="mage:filter-fill" />
                    </IconButton>
                </Tooltip>
            </div>
        </Container>
    )
}

export default KehadiranTab