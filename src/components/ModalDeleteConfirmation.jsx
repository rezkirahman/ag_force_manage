import ModalLayout from "@/components/ModalLayout"
import { Icon } from "@iconify/react"
import { Button } from "@mui/material"

const ModalDeleteConfirmation = ({ open, setOpen, handleDelete, title, description, autoClose = false, loading }) => {
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={title}
            className={'max-w-[400px]'}
            onClose={() => setOpen(false)}
        >
            <div className="space-y-4" align='center'>
                <Icon icon='solar:trash-bin-2-bold-duotone' className='text-6xl text-red-600' />
                <div className="">{description}</div>
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
                        color="error"
                        size="large"
                        onClick={() => {
                            handleDelete()
                            if (autoClose) {
                                setOpen(false)
                            }
                        }}
                        component="span"
                        disabled={loading}
                    >
                        {loading ? <Icon icon='mdi:loading' className='text-[26px] animate-spin' /> : 'Hapus'}
                    </Button>
                </div>
            </div>
        </ModalLayout>
    )

}

export default ModalDeleteConfirmation