import axiosInstance from '../utils/Axios.Config';

export const brandApi = {
    getBrands: (search = '', page = 1, pageSize = 10) => {
        return axiosInstance.get(`/api/v1/Company`, {
            params: {search, page, pageSize}
        });
    },

    getBrandById: (id: string) => {
        return axiosInstance.get(`/v1/Company/${id}`);
    },

    createBrand: (name: string) => {
        return axiosInstance.post(`/v1/Company`, {name});
    },

    updateBrand: (id: string, name: string) => {
        return axiosInstance.put(`/v1/Company/${id}`, {name});
    },

    deleteBrand: (id: string) => {
        return axiosInstance.delete(`/v1/Company/${id}`);
    }
};
