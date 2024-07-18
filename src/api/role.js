import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const roleSuggestion = async (unitKerja, body) => {
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
        console.error(error)
        return error
    })

}

export const divisionSuggestion = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/users/direktorat/suggest`, 'GET', '{}')
    return await api.get(`/v1/users/direktorat/suggest`, {
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