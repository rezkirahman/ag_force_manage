"use client"
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { MenuItem, TextField } from '@mui/material';

const PlacesAutocomplete = ({ setSelected }) => {
    const {
        ready,
        value = '',
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        callbackName: "YOUR_CALLBACK_NAME"
    })

    return (
            <div className='absolute top-0 left-0 right-0 '>
                <div className='p-2'>
                    {ready &&
                        < TextField
                            fullWidth
                            className='bg-gray-100'
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            variant='standard'
                            placeholder="Enter your address"
                        />
                    }
                    <div className='bg-white'>
                        {status === 'OK' && data.map(({ place_id, description }) => (
                            <MenuItem
                                key={place_id}
                                className='text-wrap overflow-clip'
                                onClick={async () => {
                                    setValue(description, false);
                                    clearSuggestions();

                                    try {
                                        const results = await getGeocode({ address: description });
                                        const { lat, lng } = await getLatLng(results[0]);
                                        setSelected({ lat: lat, lng: lng });
                                    } catch (error) {
                                        console.log("Error: ", error);
                                    }
                                }}
                            >
                                <h3 className='text-sm'>{description}</h3>
                            </MenuItem>
                        ))}
                    </div>
                </div>
            </div>
    )
}

export default PlacesAutocomplete