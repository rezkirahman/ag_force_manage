import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const solveIncident = async ({ unitKerja, body }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/incident/solve-incident`, 'POST', stringBody)
    return await api.post(`/v1/incident/solve-incident`, body, {
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