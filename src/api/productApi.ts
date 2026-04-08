import axiosInstance from '../utils/Axios.Config';

export const productApi = {
    // Lấy danh sách sản phẩm
    getProducts: (search = '', page = 1, pageSize = 10) => {
        return axiosInstance.get(`/api/v1/Product`, {
            params: {search, page, pageSize}
        });
    },

    // Lấy chi tiết sản phẩm
    getProductById: (id: string) => {
        return axiosInstance.get(`/api/v1/Product/${id}`);
    },

    // Thêm mới sản phẩm (Sử dụng FormData)
    createProduct: (formData: FormData) => {
        return axiosInstance.post(`/api/v1/Product`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
    },

    // Cập nhật sản phẩm
    updateProduct: (id: string, formData: FormData) => {
        return axiosInstance.put(`api/v1/Product/${id}`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
    },

    // Xóa sản phẩm
    deleteProduct: (id: string) => {
        return axiosInstance.delete(`api/v1/Product/${id}`);
    }
};
