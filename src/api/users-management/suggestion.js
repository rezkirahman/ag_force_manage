
import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const addressSuggestions = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/data-diri/suggest/alamat`, 'POST', stringBody)
    return await api.post(`/v1/users/profiling/data-diri/suggest/alamat`, stringBody, {
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

export const hobbySuggestions = async (unitKerja) => {
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/data-umum/suggest/hobby`, 'GET', '{}')
    return await api.get(`/v1/users/profiling/data-umum/suggest/hobby`, {
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


export const interestSuggestions = async (unitKerja) => {
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/data-umum/suggest/interest`, 'GET', '{}')
    return await api.get(`/v1/users/profiling/data-umum/suggest/interest`, {
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
