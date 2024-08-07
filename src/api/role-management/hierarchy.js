import { getAPIServer } from "@/config/axiosInstance"
import { MakeSignatureHeader } from "@/libs/signatures"

const api = getAPIServer()

export const listHierarchy = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/role/diagram`, 'GET', '{}')
    return await api.get(`/v1/role/diagram`, {
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

export const addHierarchy = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/role/manage/hierarchy`, 'POST', stringBody)
    return await api.post(`/v1/role/manage/hierarchy`, stringBody, {
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

export const deleteHierarchy = async ({ unitKerja, id }) => {
    const signature = MakeSignatureHeader(`/api/v1/role/manage/${id}/keluarkan-hirearchy`, 'DELETE', '{}')
    return await api.delete(`/v1/role/manage/${id}/keluarkan-hirearchy`, {
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

export const resetHierarchy = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/role/manage/reset-hirearchy`, 'DELETE', '{}')
    return await api.delete(`/v1/role/manage/reset-hirearchy`, {
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