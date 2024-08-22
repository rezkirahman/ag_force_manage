import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const saldoCutiUser = async ({ unitKerja, id }) => {
    const body = '{}'
    const signature = MakeSignatureHeader(`/api/v1/cisw/v2/detail-user/${id}`, 'POST', body)
    return await api.post(`/v1/cisw/v2/detail-user/${id}`, body, {
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

export const historyCutiIzin = async ({ unitKerja, body, id }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/cisw/v2/detail-history/${id}`, 'POST', stringBody)
    return await api.post(`/v1/cisw/v2/detail-history/${id}`, stringBody, {
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