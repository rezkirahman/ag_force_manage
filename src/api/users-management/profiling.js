import { getAPIServer } from "@/config/axiosInstance";
import { MakeSignatureHeader } from "@/libs/signatures";

const api = getAPIServer()

export const informationProfile = async (unitKerja, id) => {
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/show/${id}`, 'GET', '{}')
    return await api.get(`/v1/users/profiling/show/${id}`, {
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


export const updateProfilingData = async ({ type, unitKerja, id, body }) => {
    const toCamelCase = (str) => {
        return str
            .split(' ')
            .map((word, index) => 
                index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
    }
    const stringBody = JSON.stringify(body)
    const endpointMap = {
        photo: '/update-photo/',
        profile: '/update-user/',
        pribadi: '/data-diri/create-edit/',
        umum: '/data-umum/create-edit/',
        legal: '/data-legal/create-edit/',
        kesehatan: '/data-kesehatan/create-edit/',
        pendidikan: '/data-pendidikan/create-edit/',
        keluarga: '/data-keluarga/create-edit/',
        pernikahan: '/data-pernikahan/create-edit/',
        kontakDarurat: '/data-kontak-darurat/create-edit/',
        pelatihan: '/data-pelatihan/create-edit/',
        keahlian: '/data-keahlian/create-edit/',
        keagamaan: '/data-keagamaan/create-edit/',
        organisasi: '/data-organisasi/create-edit/',
        pekerjaan: '/data-pekerjaan/create-edit/',
        kegiatan: '/data-kegiatan/create-edit/',
        penugasan: '/data-penugasan/create-edit/',
        agp: '/data-agp/create-edit/'
    }
    const typeCamelCase = toCamelCase(type)
    const endpoint = endpointMap[typeCamelCase] + id
    const signature = MakeSignatureHeader(`/api/v1/users/profiling${endpoint}`, 'POST', stringBody)

    return await api.post(`/v1/users/profiling${endpoint}`, stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then(response => response)
        .catch(error => {
            console.error(error)
            return error
        })
}

// Usage example:
// updateProfilingData('kegiatan', 'UnitKerja1', '123', { name: 'Activity 1' })
// updateProfilingData('penugasan', 'UnitKerja2', '456', { task: 'Task 1' });
// updateProfilingData('agp', 'UnitKerja3', '789', { performance: 'AGP 1' });



