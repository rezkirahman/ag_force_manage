import { Icon } from '@iconify/react'
import { Button } from '@mui/material'
import React from 'react'

const PrimaryButton = ({
    disabled = false,
    onClick = () => { },
    loading = false,
    children,
    className
}) => {
    return (
        <Button
            className={className}
            variant='contained'
            size='large'
            color='primary'
            disabled={disabled}
            fullWidth
            onClick={onClick}
        >
            {loading ? <Icon icon={'mdi:loading'} className='text-[26px] animate-spin' /> : children}
        </Button>
    )
}

export default PrimaryButton