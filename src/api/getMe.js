import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";
import nookies from 'nookies';

const api = getAPIServer()

export const getMe = async () => {
    const headers = MakeSignatureHeader('/api/v1/user/me', 'GET', '{}');
    return await api.get('/v1/user/me', { headers }).then((response) => {
        return response
    }).catch((error) => {
        nookies.destroy(null, 'access_token')
        localStorage.clear()
        return error
    })
}

export const getMeRole = async (unitKerja) => {
    const signature = MakeSignatureHeader('/api/v1/user/unit/role', 'GET', '{}');
    return await api.get('/v1/user/unit/role', {
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

export const changePIN = async({unitKerja,body})=>{
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/user/changepin`, 'POST', stringBody)
    return await api.post(`/v1/user/changepin`, stringBody, {
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
