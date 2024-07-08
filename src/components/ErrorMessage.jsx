import { Icon } from '@iconify/react'
import { IconButton } from '@mui/material'
import React from 'react'

const ErrorMessage = ({ message, setMessage }) => {
    if (message) {
        return (
            <div className='relative flex items-center w-full gap-2 px-3 py-4 text-red-600 bg-red-100 rounded-lg'>
                <IconButton
                    className='absolute top-0 right-0'
                    size='small'
                    onClick={() => setMessage('')}
                >
                    <Icon icon={'material-symbols:close'} />
                </IconButton>
                <div>
                    <Icon icon={'eva:alert-triangle-fill'} className='text-base' />
                </div>
                <h3>{message}</h3>
            </div>
        )
    }

}

export default ErrorMessage