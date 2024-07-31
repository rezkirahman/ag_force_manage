import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const listGroupAttendance = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/group/list', 'POST', stringBody)
    return await api.post('/v1/settings/attendance/group/list', stringBody, {
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

export const oneGroupAttendance = async ({ unitKerja, id }) => {
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/group/read/${id}`, 'GET', '{}')
    return await api.get(`/v1/settings/attendance/group/read/${id}`, {
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

export const suggestLocationAttendanceGroup = async ({ unitKerja }) => {
    const stringBody = JSON.stringify({ search: '' })
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/group/suggest-location', 'POST', stringBody)
    return await api.post('/v1/settings/attendance/group/suggest-location', stringBody, {
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

export const suggestUserAttendanceGroup = async ({ unitKerja }) => {
    const stringBody = JSON.stringify({ search: '' })
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/group/suggest-user', 'POST', stringBody)
    return await api.post('/v1/settings/attendance/group/suggest-user', stringBody, {
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

export const createGroupAttendance = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader('/api/v1/settings/attendance/group/create', 'POST', stringBody)
    return await api.post('/v1/settings/attendance/group/create', stringBody, {
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

export const updateGroupAttendance = async ({ unitKerja, id, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/group/update/${id}`, 'PUT', stringBody)
    return await api.put(`/v1/settings/attendance/group/update/${id}`, stringBody, {
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

export const deleteGroupAttendance = async ({ unitKerja, id }) => {
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/group/delete/${id}`, 'POST', '{}')
    return await api.post(`/v1/settings/attendance/group/delete/${id}`, {}, {
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




