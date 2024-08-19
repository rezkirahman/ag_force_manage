import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const listLocationUnit = async (unitKerja, category) => {
    const signature = MakeSignatureHeader(`/api/v1/track/regions`, 'GET', '{}')
    return await api.get(`/v1/track/regions?category=${category}`, {
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

export const listLocationPenugasan = async (unitKerja, body) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/track/penugasan`, 'POST', stringBody)
    return await api.post(`/v1/track/penugasan`, body, {
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

export const listUnitBussiness = async ({unitKerja}) => {
    const signature = MakeSignatureHeader(`/api/v1/track/list-unit`, 'GET', '{}')
    return await api.get(`/v1/track/list-unit`, {
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