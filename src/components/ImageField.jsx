import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'


const ImageField = ({ imageFile, setImageFile, imageKey = 'image' }) => {
    const [previewUrl, setPreviewUrl] = useState(null)
    const FILE_FORMATS = ['image/jpeg', 'image/png'];
    const MAX_IMAGE_FILE = 2 * 1024 * 1024
    const [alert, setAlert] = useState({
        open: false,
        message: 'invalid',
    });

    const handleFile = (file) => {
        if (FILE_FORMATS.includes(file?.type)) {
            if (file && file.size <= MAX_IMAGE_FILE) {
                setPreviewUrl(URL.createObjectURL(file))
                setImageFile(file)
                setAlert({ ...alert, open: false })
            } else {
                setAlert({ ...alert, open: true, message: 'Ukuran file melebihi 2MB.' })
            }
        } else {
            setAlert({ ...alert, open: true, message: 'Format file harus JPG, JPEG, PNG.' })
        }
    }

    const NullAndHoverField = () => {
        return (
            <div className='flex flex-col items-center gap-3'>
                <Icon icon={'uim:image-v'} className='text-4xl text-primary' />
                <div className='flex flex-col items-center gap-1'>
                    <div className="flex items-center justify-center gap-2">
                        <h3 className=""><span className='font-semibold text-primary'>Klik untuk Unggah </span>atau seret dan lepas</h3>
                    </div>
                    <h3 className="text-xs">(Maks. Ukuran file: 2MB)</h3>
                </div>
            </div>
        )
    }

    const handleFileInputChange = event => {
        const file = event.target.files[0]
        handleFile(file)
    }

    const handleDrop = event => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        handleFile(file)
    }

    const handleDragOver = event => {
        event.preventDefault();
    };

    useEffect(() => {
        if (!imageFile?.name) {
            setPreviewUrl(imageFile)
        }
    }, [imageFile])

    return (
        <div className="h-full space-y-2">
            {alert.open &&
                <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600">
                        <Icon icon={'carbon:warning'} className="text-xl" />
                        <h3 className="font-medium text-red-600">{alert.message}</h3>
                    </div>
                    <Icon
                        icon={'ic:outline-close'}
                        className="text-xl cursor-pointer text-slate-500"
                        onClick={() => setAlert({ ...alert, open: false })}
                    />
                </div>
            }
            <input
                id={imageKey}
                type="file"
                accept="image/"
                onChange={handleFileInputChange}
                className="sr-only"
            />
            <label
                htmlFor={imageKey}
                className={`bg-slate-50 group relative w-full flex items-center justify-center h-full border-2 border-dashed border-slate-300 rounded-lg overflow-clip cursor-pointer hover:bg-slate-200 transition-all drop:bg-red-200`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {previewUrl != null ? (
                    <Image
                        src={previewUrl}
                        alt="preview"
                        width={500}
                        height={500}
                        priority
                        className="object-contain w-full h-full"
                    />
                ) : (
                    <div className='flex items-center justify-center'>
                        <NullAndHoverField />
                    </div>
                )}
                <div
                    className={`${previewUrl ? 'opacity-0' : 'sr-only'} space-y-4 absolute inset-0 group-hover:opacity-100 bg-white/60 flex items-center justify-center backdrop-blur-md transition-all duration-150`}
                    align='center'
                >
                    <NullAndHoverField />
                </div>
            </label>
        </div>
    )
}

export default ImageField