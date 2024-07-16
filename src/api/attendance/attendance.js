import { getAPIServer } from "@/config/axiosInstance"
import { MakeSignatureHeader } from "@/libs/signatures"

const api = getAPIServer()

export const listAttendance = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/attendance/list`, 'POST', stringBody)
    return await api.post(`/v1/attendance/list`, stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}

export const exportAttendance = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/attendance/export`, 'POST', stringBody)
    return await api.post(`/v1/attendance/export`, stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}

export const userSuggestionsExport = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/activity/users`, 'GET', '{}')
    return await api.get(`/v1/activity/users`, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}

export const suggestLocationAttendance = async ({ unitKerja }) => {
    const stringBody = JSON.stringify({ search: "" })
    const signature = MakeSignatureHeader(`/api/v1/attendance/suggest-location`, 'POST', stringBody)
    return await api.post(`/v1/attendance/suggest-location`, stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}
