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
        return error
    })
}

export const updateProfilingData = async ({ type, unitKerja, id, body, childId }) => {

    const stringBody = JSON.stringify(body)
    const endpointMap = {
        photo: '/update-photo/',
        profile: '/update-user/',
        pribadi: '/data-diri/create-edit/',
        umum: '/data-umum/create-edit/',
        legal: '/data-legal/create-edit/',
        kesehatan: '/data-kesehatan/create-edit/',
        pendidikan: '/data-pendidikan/create-edit/',
        keluarga: '/data-kerabat/create-edit-keluarga/',
        pernikahan: '/data-pernikahan/create-edit/',
        kontakDarurat: '/data-kontak-darurat/create-edit/',
        pelatihan: '/data-pelatihan/create-edit/',
        keahlian: '/data-keahlian/create-edit/',
        keagamaan: '/data-agama/create-edit/',
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
            return error
        })
}

export const getProfilingData = async ({ unitKerja, id, type }) => {
    const endpointMap = {
        pribadi: '/data-diri/show/',
        umum: '/data-umum/show/',
        legal: '/data-legal/show/',
        kesehatan: '/data-kesehatan/show/',
        pendidikan: '/data-pendidikan/show/',
        keluarga: '/data-kerabat/list/',
        pernikahan: '/data-pernikahan/show/',
        kontakDarurat: '/data-kontak-darurat/show/',
        pelatihan: '/data-pelatihan/show/',
        keahlian: '/data-keahlian/show/',
        keagamaan: '/data-agama/show/',
        organisasi: '/data-organisasi/show/',
        pekerjaan: '/data-pekerjaan/show/',
        kegiatan: '/data-kegiatan/show/',
        penugasan: '/data-penugasan/show/',
        agp: '/data-agp/show/'
    }
    const typeCamelCase = toCamelCase(type)
    const endpoint = endpointMap[typeCamelCase] + id
    const signature = MakeSignatureHeader(`/api/v1/users/profiling${endpoint}`, 'GET', '{}')
    return await api.get(`/v1/users/profiling${endpoint}`, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then(response => response)
        .catch(error => {
            return error
        })
}

export const createProfilingData = async ({ type, unitKerja, body, id }) => {
    const endpointMap = {
        pribadi: '/data-diri/create/',
        umum: '/data-umum/create/',
        legal: '/data-legal/create/',
        kesehatan: '/data-kesehatan/create/',
        pendidikan: '/data-pendidikan/create/',
        keluarga: '/data-kerabat/create/',
        pernikahan: '/data-kerabat/create/',
        kontakDarurat: '/data-kerabat/create/',
        pelatihan: '/data-pelatihan/create/',
        keahlian: '/data-keahlian/create/',
        keagamaan: '/data-agama/create/',
        organisasi: '/data-organisasi/create/',
        pekerjaan: '/data-pekerjaan/create/',
        kegiatan: '/data-kegiatan/create/',
        penugasan: '/data-penugasan/create/',
        agp: '/data-agp/create/'
    }
    const endpoint = endpointMap[type] + id
    const signature = MakeSignatureHeader(`/api/v1/users/profiling${endpoint}`, 'POST', JSON.stringify(body))
    return await api.post(`/v1/users/profiling${endpoint}`, JSON.stringify(body), {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then(response => response)
        .catch(error => {
            return error
        })
}

export const suggestRelationship = async ({ unitKerja }) => {
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/data-kerabat/suggest-relationship`, 'GET', '{}')
    return await api.get(`/v1/users/profiling/data-kerabat/suggest-relationship`, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then(response => response)
        .catch(error => {
            return error
        })
}

export const updateProfilingKeluarga = async ({ unitKerja, id, body, childId }) => {
    const stringBody = JSON.stringify(body)
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/data-kerabat/update/${id}`, 'PUT', stringBody)
    return await api.put(`/v1/users/profiling/data-kerabat/update/${id}?id=${childId}`, stringBody, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then(response => response)
        .catch(error => {
            return error
        })
}

export const deleteProfilingKeluarga = async ({ unitKerja, id, childId }) => {
    const signature = MakeSignatureHeader(`/api/v1/users/profiling/data-kerabat/delete/${id}`, 'DELETE', '{}')
    return await api.delete(`/v1/users/profiling/data-kerabat/delete/${id}?id=${childId}`, {
        headers: {
            ...signature,
            'X-Unit-Kerja': unitKerja
        }
    }).then(response => response)
        .catch(error => {
            return error
        })
}

const toCamelCase = (str) => {
    return str
        .split(' ')
        .map((word, index) =>
            index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
}


