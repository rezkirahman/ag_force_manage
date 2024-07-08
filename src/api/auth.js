import { MakeSignatureHeader, signaturePIN } from "@/libs/signatures"
import moment from "moment"
import { getAPIServer } from "@/config/axiosInstance"

export const signIn = async (phone, pin) => {
    const api = getAPIServer()
    var timeStamp = moment().format("yyyyMDDhhmmss")
    const code = signaturePIN(pin, timeStamp)
    var body = JSON.stringify({
        phone: phone,
        code: code,
    })
    const signature = MakeSignatureHeader('/api/v1/login', 'POST', body, timeStamp)
    return await api.post('/v1/login', body, { headers: signature }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}

export const signOut = async () => {
    const api = getAPIServer()
    var timeStamp = moment().format("yyyyMDDhhmmss")
    const signature = MakeSignatureHeader('/api/v1/user/logout', 'POST', '{}', timeStamp)
    return await api.post('/v1/user/logout', {}, { headers: signature }).then((response) => {
        return response
    }).catch((error) => {
        return error
    })
}