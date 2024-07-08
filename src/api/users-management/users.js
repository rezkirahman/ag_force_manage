import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const listUsers = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/all`, 'POST', stringBody)
    return await api.post(`/v1/users/all`, stringBody, {
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

export const listUserDeleted = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/deleted`, 'POST', stringBody)
    return await api.post(`/v1/users/deleted`, stringBody, {
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

export const listUserBlocked = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/blocked`, 'POST', stringBody)
    return await api.post(`/v1/users/blocked`, stringBody, {
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

export const createUser = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/create`, 'POST', stringBody)
    return await api.post(`/v1/users/create`, stringBody, {
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

export const kickUser = async (unitKerja, id) => {
    const signature = MakeSignatureHeader(`/api/v1/users/${id}/kick`, 'DELETE', '{}')
    return await api.delete(`/v1/users/${id}/kick`, {
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

export const resetPINUsers = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/reset-pin`, 'POST', stringBody)
    return await api.post(`/v1/users/reset-pin`, stringBody, {
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


