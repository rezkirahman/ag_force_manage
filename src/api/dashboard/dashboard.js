import { getAPIServer } from "@/config/axiosInstance"
import { MakeSignatureHeader } from "@/libs/signatures"

const api = getAPIServer()

export const dashboardHeader = async (unitKerja) => {
    const signature = MakeSignatureHeader('/api/v1/dashboard/', 'GET', '{}')
    return await api.get('/v1/dashboard/', {
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

export const dashboardChartDuty = async (unitKerja) => {
    const signature = MakeSignatureHeader('/api/v1/dashboard/statistic_duty', 'GET', '{}')
    return await api.get('/v1/dashboard/statistic_duty', {
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

export const dashboardChartActivity = async (unitKerja) => {
    const signature = MakeSignatureHeader('/api/v1/dashboard/statistic_activity', 'GET', '{}')
    return await api.get('/v1/dashboard/statistic_activity', {
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
