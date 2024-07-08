import ModalLayout from "@/components/ModalLayout"
import { Icon } from "@iconify/react"
import { Button } from "@mui/material"

const ModalEditProfilingLayout = ({ open, setOpen, refresh, title, children, loading, handleClick = null }) => {
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={`Ubah Informasi ${title}`}
            refresh={refresh}
        >
            <div className="relative space-y-6">
                <div className='space-y-3 min-h-[50vh] max-h-[60vh] py-2 overflow-y-auto pr-1'>
                    {children}
                </div>
                <div className="flex justify-end">
                    <Button
                        variant='contained'
                        size='large'
                        onClick={handleClick}
                        disabled={loading}
                        className="w-full md:w-1/5"
                    >
                        {loading ? <Icon icon='mdi:loading' className='text-[27px] animate-spin' /> : 'Ubah'}
                    </Button>
                </div>
            </div>
        </ModalLayout>
    )
}

export default ModalEditProfilingLayout
