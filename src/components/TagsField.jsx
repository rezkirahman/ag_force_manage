import { Chip, FormHelperText, InputBase, InputLabel, MenuItem } from "@mui/material"
import { useState, useEffect, useRef } from "react"

const TagsField = ({ chipData, setChipData, title, helperText, suggestTags = [], placeHolder = "" }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [value, setValue] = useState('')

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault()
            const value = event.target.value.trim()
            if (value) {
                setChipData([...chipData, value])
                setValue('')
            }
        }
    }

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete))
    }

    const divRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setValue('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [divRef])

    return (
        <div className='relative'>
            <InputLabel
                htmlFor={title}
                className={`px-1 text-xs bg-white absolute left-[10px]  ${isFocused || chipData.length > 0 ? '-top-2' : 'translate-y-[18px] scale-125'}  ${isFocused ? 'text-primary' : ''}`}
            >
                {title}
            </InputLabel>
            <div className={`rounded-[10px] flex w-full gap-1 items-center flex-wrap  ${isFocused ? 'ring-primary ring-2' : 'ring-1 ring-gray-300 hover:ring-black'}   ring-inset py-2 px-4 min-h-[56px]`}>
                {chipData.map((data, i) => (
                    <Chip
                        key={i}
                        label={data}
                        onDelete={handleDelete(data)}
                    />
                ))}
                <InputBase
                    id={title}
                    className='grow caret-primary'
                    placeholder={isFocused && chipData.length === 0 ? placeHolder : ''}
                    value={value}
                    onKeyDown={handleKeyDown}
                    onChange={(event) => setValue(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
            <div className="relative">
                {(value.length > 0) &&
                    <div className='max-h-[160px] overflow-y-auto absolute bg-white inset-x-0 top-0 z-10 shadow ring-inset ring-1 ring-gray-200' ref={divRef}>
                        {suggestTags?.filter(item => item?.toLowerCase().includes(value.toLowerCase())).map((data, i) => (
                            <MenuItem
                                key={i}
                                onClick={() => {
                                    setChipData([...chipData, data])
                                    setValue('')
                                }}
                                className={`${chipData.includes(data) && 'bg-gray-100'}`}
                            >
                                {data}
                            </MenuItem>
                        ))}
                    </div>
                }
            </div>
            <FormHelperText className='pl-2'>{helperText}</FormHelperText>
        </div>
    )
}

export default TagsField