import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const listLocationAttendance = async (uniKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/location/list', 'POST', stringBody)
    return await api.post('/v1/settings/attendance/location/list', stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': uniKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        console.error(error)
        return error
    })
}

export const oneLocationAttendance = async (unitKerja, id) => {
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/location/read/${id}`, 'GET', '{}')
    return await api.get(`/v1/settings/attendance/location/read/${id}`, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        console.error(error)
        return error
    })
}

export const createLocationAttendance = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/location/create', 'POST', stringBody)
    return await api.post('/v1/settings/attendance/location/create', stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        console.error(error)
        return error
    })
}

export const updateLocationAttendance = async (unitKerja,id, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/location/update/${id}`, 'PUT', stringBody)
    return await api.put(`/v1/settings/attendance/location/update/${id}`, stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        console.error(error)
        return error
    })
}

export const deleteLocationAttendance = async (unitKerja, id) => {
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/location/delete/${id}`, 'POST', '{}')
    return await api.post(`/v1/settings/attendance/location/delete/${id}`, {}, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        console.error(error)
        return error
    })
}


