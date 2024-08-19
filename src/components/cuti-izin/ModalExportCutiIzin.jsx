import React from 'react'
import ModalLayout from '../ModalLayout'
import PrimaryButton from '../PrimaryButton'

const ModalExportCutiIzin = ({ open, setOpen }) => {
    const [allowSubmit, setAllowSubmit] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    return (
        <ModalLayout
            open={open}
            setOpen={setOpen}
            title={'Export Cuti & Izin'}
        >
             <div className='overflow-y-auto h-[40vh] pr-2 py-2 space-y-4'>
                
             </div>
             <div className='flex justify-end'>
                <PrimaryButton
                    loading={loading}
                    // onClick={handleImport}
                    className={'w-full md:w-1/4'}
                    disabled={loading || !allowSubmit}
                >
                    Export
                </PrimaryButton>
            </div>
        </ModalLayout>
    )
}

export default ModalExportCutiIzin