import { useState } from 'react';
import { Icon } from '@iconify/react';
import { IconButton, Modal } from '@mui/material';
import Image from 'next/image';

const PhotoView = ({ photo }) => {
    const [open, setOpen] = useState(false)
    const preview = photo ? photo : 'https://pai.agforce.co.id/assets/user/f35dca8d2f0a4bf6a0da0fc1a113f71d.png'
    return (
        <div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                className="flex items-center justify-center select-none"
            >
                <div className="h-[50vh] aspect-square rounded-[15px] overflow-clip outline-none">
                    <div className='relative'>
                        <div className="absolute top-4 right-4 ">
                            <button
                                className="p-1 text-2xl transition-all rounded-full cursor-pointer group bg-black/50 hover:bg-black/80 "
                                onClick={() => setOpen(false)}
                            >
                                <Icon icon="material-symbols:close" className='text-slate-300 group-hover:text-slate-100' />
                            </button>
                        </div>
                        <Image
                            alt='photo'
                            src={preview}
                            width={1000}
                            height={1000}
                            className='object-contain w-full rounded-lg aspect-square bg-slate-100'
                            priority
                        />
                    </div>
                </div>
            </Modal>
            <div className='relative w-full group'>
                <Image
                    alt='photoview'
                    src={preview}
                    width={1000}
                    height={1000}
                    className='relative object-cover object-top w-full rounded-full aspect-square bg-slate-100'
                    priority
                />

                <IconButton
                    onClick={() => setOpen(true)}
                    className='absolute inset-0 z-10 opacity-0 group-hover:opacity-100'
                >
                    <Icon icon={'mdi-eye'} className='text-xl' />
                </IconButton>
            </div>
        </div>
    )
}

export default PhotoView