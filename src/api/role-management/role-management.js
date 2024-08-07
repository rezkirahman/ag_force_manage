import { getAPIServer } from "@/config/axiosInstance"
import { MakeSignatureHeader } from "@/libs/signatures"

const api = getAPIServer()

export const listRoleManagement = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/role/all`, 'POST', stringBody)
    return await api.post(`/v1/role/all`, stringBody, {
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

export const createRoleManagement = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/role/manage/create`, 'POST', stringBody)
    return await api.post(`/v1/role/manage/create`, stringBody, {
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

export const updateRoleManagement = async ({ unitKerja, body, id }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/role/manage/${id}/update`, 'PUT', stringBody)
    return await api.put(`/v1/role/manage/${id}/update`, stringBody, {
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

export const deleteRoleManagement = async ({ unitKerja, id }) => {
    const signature = MakeSignatureHeader(`/api/v1/role/manage/${id}/delete`, 'DELETE', '{}')
    return await api.delete(`/v1/role/manage/${id}/delete`, {
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