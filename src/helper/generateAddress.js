const mapKey = 'AIzaSyDLgIXFbG87JLU_-iY5tAuCZskD_VmgiIY'

export const GenerateAddress = async (lat, lng) => {
    if (!lat || !lng) {
        throw new Error('Latitude and longitude are required');
    }

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapKey}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error_message || 'Failed to fetch address');
        }
        return data.results[0].formatted_address;
    } catch (error) {
        console.error('Error fetching address:', error);
        throw error; // Re-throw the error if you want to handle it outside or just log it
    }
}