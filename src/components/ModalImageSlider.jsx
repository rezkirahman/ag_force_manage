import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { IconButton, Modal } from '@mui/material'
import Image from 'next/image'
import { useHotkeys } from 'react-hotkeys-hook'

const ModalImageSlider = ({ list, open, setOpen, initialImage = "" }) => {
    const dummyImage = '/dummy-image.jpg'
    const [indexToShow, setIndexToShow] = useState(0)

    useEffect(() => {
        if (open) {
            setIndexToShow(list?.findIndex(image => image == initialImage))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialImage, open])

    const handlePrev = () => {
        if (indexToShow > 0) {
            setIndexToShow((prevValue) => prevValue - 1)
        }
    }

    const handleNext = () => {
        if (indexToShow < list.length - 1) {
            setIndexToShow((prevValue) => prevValue + 1)
        }
    }

    useHotkeys('left', handlePrev)
    useHotkeys('right', handleNext)

    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="flex items-center justify-center"
            >
                <div className="bg-white outline-none aspect-square rounded-2xl overflow-clip w-[96%] sm:w-[50%]">
                    <div className='relative'>
                        <div className="absolute z-20 top-4 right-4">
                            <IconButton
                                onClick={() => setOpen(false)}
                            >
                                <Icon icon='material-symbols:close' className='text-lg text-gray-600' />
                            </IconButton>
                        </div>
                        <Image
                            alt='photo'
                            src={list[indexToShow] ? list[indexToShow] : dummyImage}
                            width={1000}
                            height={1000}
                            className='object-contain h-full aspect-square bg-slate-100'
                            priority
                        />
                        <div className='absolute inset-0 flex items-center justify-between px-2'>
                            <IconButton
                                onClick={handlePrev}
                                className='rounded-full bg-black/40 hover:bg-black/60'
                            >
                                <Icon icon='ph:caret-left-bold' className='text-2xl text-white' />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                className='rounded-full bg-black/40 hover:bg-black/60'
                            >
                                <Icon icon='ph:caret-right-bold' className='text-2xl text-white' />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalImageSlider