import { addressSuggestions } from '@/api/users-management/suggestion'
import { useAppContext } from '@/context'
import { Autocomplete, FormControl, InputLabel, Select, TextField } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'

const AddressForm = ({ setID, data }) => {
    const { unitKerja } = useAppContext()
    const [loadingFetchList, setLoadingFetchList] = useState(false)
    const [provinceCodeList, setProvinceCodeList] = useState([])
    const [cityCodeList, setCityCodeList] = useState([])
    const [districtCodeList, setDistrictCodeList] = useState([])
    const [urbanList, setUrbanList] = useState([])
    const [province, setProvince] = useState(0)
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [urban, setUrban] = useState('')

    const handleAddress = useCallback(async () => {
        if (!unitKerja) return
        setLoadingFetchList(true)
        const body = {
            province_code: province?.province_code || 0,
            city: city || '',
            sub_district: district || '',
            urban: urban || '',
        }
        const { data } = await addressSuggestions(unitKerja.id, body)
        const category = data?.data
        if (category?.province?.length > 0) {
            setProvinceCodeList(category.province)
        }
        if (category?.city?.length > 0) {
            setCityCodeList(category.city)
        }
        if (category?.sub_district?.length > 0) {
            setDistrictCodeList(category.sub_district)
        }
        if (category?.urban?.length > 0) {
            setUrbanList(category.urban)
        }
        if (category?.id > 0) {
            setID(category?.id)
        }
        setLoadingFetchList(false)
    }, [city, district, province?.province_code, setID, unitKerja, urban])

    const handleChangeAddress = (value, type) => {
        if (type === 'province') {
            setProvince(value)
            setCity(null)
            setDistrict(null)
            setUrban(null)
        } else if (type === 'city') {
            setCity(value)
            setDistrict(null)
            setUrban(null)
        } else if (type === 'district') {
            setDistrict(value)
            setUrban(null)
        } else if (type === 'urban') {
            setUrban(value)
        }
    }

    useEffect(() => {
        if (data) {
            setProvince(data?.Provinces || null)
            setCity(data?.city || null)
            setDistrict(data?.sub_district || null)
            setUrban(data?.urban || null)
        }
    }, [data])

    useEffect(() => {
        handleAddress()
    }, [handleAddress])

    return (
        <>
            <Autocomplete
                value={province}
                onChange={(event, newValue) => handleChangeAddress(newValue, 'province')}
                options={provinceCodeList}
                isOptionEqualToValue={(option, value) => option.province_code === value.province_code}
                getOptionLabel={(option) => option.province_name || ''}
                renderInput={(params) => <TextField {...params} label="Provinsi" />}
                loading={loadingFetchList}
            />
            {province && (
                <Autocomplete
                    value={city}
                    onChange={(event, newValue) => handleChangeAddress(newValue, 'city')}
                    options={cityCodeList}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <TextField {...params} label="Kota" />}
                    loading={loadingFetchList}
                />
            )}
            {(city && province) && (
                <Autocomplete
                    value={district}
                    onChange={(event, newValue) => handleChangeAddress(newValue, 'district')}
                    options={districtCodeList}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <TextField {...params} label="Kecamatan" />}
                    loading={loadingFetchList}
                />
            )}
            {(city && province && district) && (
                <Autocomplete
                    value={urban}
                    onChange={(event, newValue) => handleChangeAddress(newValue, 'urban')}
                    options={urbanList}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <TextField {...params} label="Kelurahan" />}
                    loading={loadingFetchList}
                />
            )}
        </>
    )
}

export default AddressForm