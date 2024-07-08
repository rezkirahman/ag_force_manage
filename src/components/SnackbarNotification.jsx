'use client'
import { useAppContext } from '@/context';
import { Alert, Slide, Snackbar } from '@mui/material'
import React from 'react'

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

const SnackbarNotification = () => {
    const { openSnackbar, setOpenSnackbar } = useAppContext()

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackbar({ ...openSnackbar, open: false })
    }
    return (
        <Snackbar
            open={openSnackbar.open}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            TransitionComponent={SlideTransition}
        >
            <Alert
                severity={openSnackbar.severity}
                variant="filled"
                className='rounded-xl'
                onClose={handleCloseSnackbar}
            >
               {openSnackbar.message}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarNotification