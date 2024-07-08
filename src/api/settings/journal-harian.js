import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const settingJournal = async (unitKerja) => {
    const signature = MakeSignatureHeader('/api/v1/settings/', 'GET', '{}')
    return await api.get('/v1/settings/', {
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

export const updateSettingJournal = async (unitKerja, body) => {
    const signature = MakeSignatureHeader('/api/v1/settings/', 'POST', JSON.stringify(body))
    return await api.post('/v1/settings/', body, {
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
