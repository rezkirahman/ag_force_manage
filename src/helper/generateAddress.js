// "use client"
const mapKey = 'AIzaSyDLgIXFbG87JLU_-iY5tAuCZskD_VmgiIY'; //process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export const GenerateAddress = async (lat, lng) => {
    if (!lat || !lng) {
        throw new Error('Latitude and longitude are required');
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapKey}`);
    const data = await response.json();
    return data.results[0].formatted_address;
}