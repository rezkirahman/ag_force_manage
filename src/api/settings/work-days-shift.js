import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const listWorkDays = async (unitKerja) => {
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/workdays/list', 'GET', '{}')
    return await api.get('/v1/settings/attendance/workdays/list', {
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

export const updateWorkDays = async (unitKerja, body) => {
    const bodyString = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/workdays/update', 'PUT', bodyString)
    return await api.put('/v1/settings/attendance/workdays/update', bodyString, {
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

export const listUserShifts = async (unitKerja, body) => {
    const bodyString = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/shift-user/list', 'POST', bodyString)
    return await api.post('/v1/settings/attendance/shift-user/list', bodyString, {
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

export const deleteUserShift = async (unitKerja, id) => {
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/shift-user/delete/${id}`, 'POST', '{}')
    return await api.post(`/v1/settings/attendance/shift-user/delete/${id}`, {}, {
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

export const suggestUserShift = async (unitKerja) => {
    const body = {
        search: ''
    }
    const bodyString = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/shift-user/suggest-user', 'POST', bodyString)
    return await api.post('/v1/settings/attendance/shift-user/suggest-user', bodyString, {
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

export const addUserShift = async (unitKerja, body) => {
    const bodyString = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/shift-user/create', 'POST', bodyString)
    return await api.post('/v1/settings/attendance/shift-user/create', bodyString, {
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