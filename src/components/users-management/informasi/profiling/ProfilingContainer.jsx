import Container from '@/components/Container'
import Transition from '@/components/transition'
import { Icon } from '@iconify/react'
import { Button, IconButton, Tooltip } from '@mui/material'
import React from 'react'

const ProfilingContainer = ({ title, setOpenEdit = false, MenuButton, children, addButton = false }) => {
    return (
        <Container>
            <div className='flex flex-col h-full gap-4'>
                <div className='flex items-start justify-between gap-6'>
                    <h3 className='font-semibold'>{title}</h3>
                    <div className='flex items-center gap-2'>
                        {addButton ? (
                            <Tooltip arrow title='Tambah'>
                                <IconButton
                                    onClick={() => setOpenEdit(true)}
                                    size='medium'
                                    className='text-white bg-primary hover:bg-primary'
                                >
                                    <Icon icon='mdi:add' />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Button
                                variant='contained'
                                onClick={() => setOpenEdit(true)}
                            >
                                Ubah
                            </Button>
                        )}
                        <MenuButton />
                    </div>
                </div>
                <div className='flex flex-col pr-1 overflow-y-auto grow overflow-clip'>
                    <div className='space-y-3'>
                        {children}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ProfilingContainer