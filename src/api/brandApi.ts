import axiosInstance from '../utils/Axios.Config';

const handleResponse = (res: any) => {
    if (res.data.status === 200 || res.data.status === 201) return res.data;
    throw new Error(res.data.message || 'Lỗi hệ thống');
};

export const brandApi = {
    getBrands: (search = null, page = null, pageSize = null) =>
        axiosInstance.get(`/api/v1/Company`, {params: {search, page, pageSize}}).then(handleResponse),

    createBrand: (name: string) =>
        axiosInstance.post(`/api/v1/Company`, {name}).then(handleResponse),

    updateBrand: (id: string, name: string) =>
        axiosInstance.put(`/api/v1/Company/${id}`, {name}).then(handleResponse),

    deleteBrand: (id: string) =>
        axiosInstance.delete(`/api/v1/Company/${id}`).then(handleResponse)
};
