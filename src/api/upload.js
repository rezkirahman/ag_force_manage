import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const uploadFile = async (unitKerja, file, category) => {
    const formData = new FormData()
    formData.append('files', file)
    formData.append('category', category)
    const signature = MakeSignatureHeader(`/api/v1/users/upload`, 'POST', '{}')
    return await api.post(`/v1/users/upload`, formData, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja,
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        return response?.data?.data
    }).catch((error) => {
        console.error(error)
        return error
    })
}