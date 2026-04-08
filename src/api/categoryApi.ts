import axiosInstance from '../utils/Axios.Config';

export const categoryApi = {
    getCategories: (search = '', page = 1, pageSize = 10) => {
        return axiosInstance.get(`/api/v1/Type`, {
            params: {search, page, pageSize}
        });
    },

    createCategory: (name: string) => {
        return axiosInstance.post(`/api/v1/Type`, {name});
    },

    updateCategory: (id: string, name: string) => {
        return axiosInstance.put(`/api/v1/Type/${id}`, {name});
    },

    deleteCategory: (id: string) => {
        return axiosInstance.delete(`/api/v1/Type/${id}`);
    }
};
