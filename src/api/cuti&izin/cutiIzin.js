import { getAPIServer } from "@/config/axiosInstance"
import { MakeSignatureHeader } from "@/libs/signatures"

const api = getAPIServer()

export const listUserRequest = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/cisw/v2/list-request`, 'GET', '{}')
    return await api.get(`/v1/cisw/v2/list-request`, {
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

export const suggestUserCutiIzin = async ({ unitKerja }) => {
    const body = JSON.stringify({ search: '' })
    const signature = MakeSignatureHeader(`/api/v1/settings/attendance/group/suggest-user`, 'POST', body)
    return await api.post(`/v1/settings/attendance/group/suggest-user`, body, {
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

export const updateSaldoCuti = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/cisw/v2/update-saldo`, 'POST', stringBody)
    return await api.post(`/v1/cisw/v2/update-saldo`, stringBody, {
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

export const templateSaldoCuti = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/cisw/v2/template-import-saldo`, 'GET', '{}')
    return await api.get(`/v1/cisw/v2/template-import-saldo`, {
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

export const importSaldoCuti =async ({unitKerja, file})=>{
    const formData = new FormData()
    formData.append('excel', file)
    const signature = MakeSignatureHeader(`/api/v1/cisw/v2/import-saldo`, 'POST', '{}')
    return await api.post(`/v1/cisw/v2/import-saldo`, formData, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja,
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}