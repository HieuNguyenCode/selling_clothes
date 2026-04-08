import axiosInstance from '../utils/Axios.Config.ts';

export const authApi = {
    login: (userName: string, password: string) => {
        return axiosInstance.post('/api/v1/Auth/Login', {userName, password});
    },

    // Bạn có thể thêm các hàm API khác ở đây
    // register: (data) => axiosInstance.post('/v1/Auth/Register', data),
    // refreshToken: (token) => axiosInstance.post('/v1/Auth/RefreshToken', { token }),
};
