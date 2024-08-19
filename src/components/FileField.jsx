import { useAppContext } from '@/context'
import { Button, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

const FileField = ({ file, setFile, title, type = 'pdf' }) => {
    const {setOpenSnackbar}=useAppContext()
    const [fileType, setFileType] = useState('PDF')

    const getFileTypes = (type) => {
        let allowedTypes;
        let printedAllowedTypes;
        switch (type) {
            case 'pdf':
                allowedTypes = ['application/pdf'];
                printedAllowedTypes = 'PDF';
                break;
            case 'image':
                allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                printedAllowedTypes = 'JPEG,JPG, & PNG';
                break;
            case 'excel':
                allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                printedAllowedTypes = 'XLS & XLSX';
                break;
            default:
                allowedTypes = ['application/pdf'];
                printedAllowedTypes = 'PDF';
        }
        return { allowedTypes, printedAllowedTypes };
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const { allowedTypes, printedAllowedTypes } = getFileTypes(type);
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (selectedFile && allowedTypes.includes(selectedFile.type) && selectedFile.size <= maxSize) {
            setFile(selectedFile);
        } else {
            setOpenSnackbar({
                open: true,
                message: `File must be a ${printedAllowedTypes} and cannot be more than 2MB.`,
                severity: 'warning',
            })
        }
    };

    useEffect(() => {
        const { printedAllowedTypes } = getFileTypes(type);
        setFileType(printedAllowedTypes);
    }, [type]);

    return (
        <div className='space-y-1'>
            <input
                type="file"
                id="file"
                className="sr-only"
                onChange={handleFileChange}
            />
            <TextField
                label={title}
                variant="outlined"
                value={file ? (file?.name ? file.name : file) : 'tidak ada file yang dipilih'}
                fullWidth
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <label htmlFor="file">
                                <Button
                                    variant="contained"
                                    component="span"
                                    disableElevation
                                >
                                    Pilih file
                                </Button>
                            </label>
                        </InputAdornment>
                    )
                }}
                helperText={`*Gunakan file ${fileType} dengan ukuran maks 2MB.`}
            />
        </div>
    )
}

export default FileField