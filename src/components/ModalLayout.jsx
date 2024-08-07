"use client"
import { IconButton, Modal } from "@mui/material"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"

const ModalLayout = ({ open, setOpen, title, className, children, onClose = null, fit = false, disableCloseButton = false }) => {
    return (
        <Modal
            open={open}
            className="flex items-center justify-center"
            onClose={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                className={`${className} bg-white rounded-xl md:rounded-3xl outline-none space-y-4 shadow-container ${fit ? 'w-fit' : 'w-[94%] md:w-[80%] lg:w-[60%]'}`}
            >
                <div className="w-full h-auto p-4 space-y-3 text-sm text-gray-600 sm:p-6 md:p-8">
                    <div className={`flex items-center ${disableCloseButton ? 'justify-center' : 'justify-between'}`}>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        {!disableCloseButton && (
                            <IconButton
                                onClick={() => setOpen(false)}
                            >
                                <Icon icon='material-symbols:close' className='text-lg text-gray-600' />
                            </IconButton>
                        )}
                    </div>
                    {children}
                </div>
            </motion.div>
        </Modal>
    )
}



export default ModalLayout