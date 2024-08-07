import ModalLayout from "@/components/ModalLayout"
import { Icon } from "@iconify/react"
import { Button } from "@mui/material"
import deleteIcon from '../../public/icon/deleteIcon.json'
import Lottie from "lottie-react"


const ModalDeleteConfirmation = ({ open, setOpen, handleDelete, title, description, autoClose = false, loading, textButton = '' }) => {
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={title}
            className={'max-w-[400px]'}
            onClose={() => setOpen(false)}
        >
            <div className="flex flex-col gap-4">
                <Lottie
                    animationData={deleteIcon}
                    className="w-32 h-auto mx-auto"
                />
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
                        {loading ? <Icon icon='mdi:loading' className='text-[26px] animate-spin' /> : (textButton ? textButton : 'Hapus')}
                    </Button>
                </div>
            </div>
        </ModalLayout>
    )

}

export default ModalDeleteConfirmation