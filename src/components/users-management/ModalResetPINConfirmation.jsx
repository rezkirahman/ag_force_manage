import ModalLayout from "@/components/ModalLayout"
import { Icon } from "@iconify/react"
import { Alert, Button } from "@mui/material"

const ModalResetPINConfirmation = ({ open, setOpen, handle, description, loading }) => {
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Reset PIN'}
            className={'max-w-[400px]'}
            onClose={() => setOpen(false)}
        >
            <div className="space-y-4">
                <Alert severity="warning">
                    PIN yang telah direset akan kembali ke PIN default <span className="font-semibold">000000</span>.
                </Alert>
                <Icon icon='solar:key-bold-duotone' className='mx-auto text-6xl text-primary' />
                <div className="text-center">{description}</div>
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => {
                            setOpen(false)
                        }}
                    >
                        Batalkan
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => handle()}
                        component="span"
                        disabled={loading}
                    >
                        {loading ? <Icon icon='mdi:loading' className='text-[27px] animate-spin' /> : 'Reset'}
                    </Button>
                </div>
            </div>
        </ModalLayout>
    )

}

export default ModalResetPINConfirmation