import ModalLayout from "@/components/ModalLayout"
import PrimaryButton from "@/components/PrimaryButton"
import { Icon } from "@iconify/react"
import { Button } from "@mui/material"

const ModalEditProfilingLayout = ({ open, setOpen, refresh, title, children, loading, handleClick = null, edit = false }) => {
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={`${edit ? 'Ubah' : 'Tambah'} Informasi ${title}`}
            refresh={refresh}
        >
            <div className="relative space-y-6">
                <div className='space-y-3 min-h-[50vh] max-h-[60vh] py-2 overflow-y-auto pr-1'>
                    {children}
                </div>
                <div className="flex justify-end">
                    <PrimaryButton
                        onClick={handleClick}
                        disabled={loading}
                        loading={loading}
                        className={'w-full md:w-1/5'}
                    >
                        {edit ? 'Ubah' : 'Tambahkan'}
                    </PrimaryButton>
                </div>
            </div>
        </ModalLayout>
    )
}

export default ModalEditProfilingLayout
