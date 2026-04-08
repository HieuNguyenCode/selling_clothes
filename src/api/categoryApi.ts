import axiosInstance from '../utils/Axios.Config';

const handleResponse = (res: any) => {
    if (res.data.status === 200 || res.data.status === 201) return res.data;
    throw new Error(res.data.message || 'Lỗi hệ thống');
};

export const categoryApi = {
    getCategories: (search = null, page = null, pageSize = null) =>
        axiosInstance.get(`/api/v1/Type`, {params: {search, page, pageSize}}).then(handleResponse),

    createCategory: (name: string) =>
        axiosInstance.post(`/api/v1/Type`, {name}).then(handleResponse),

    updateCategory: (id: string, name: string) =>
        axiosInstance.put(`/api/v1/Type/${id}`, {name}).then(handleResponse),

    deleteCategory: (id: string) =>
        axiosInstance.delete(`/api/v1/Type/${id}`).then(handleResponse)
};
