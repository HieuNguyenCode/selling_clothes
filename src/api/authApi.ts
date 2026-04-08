import axiosInstance from '../utils/Axios.Config';
import axios from 'axios';

export const authApi = {
    login: (userName: string, password: string) => {
        return axiosInstance.post('/v1/Auth/Login', {userName, password});
    },

    refreshToken: (token: string) => {
        // Cập nhật: Sử dụng header tên là 'refreshToken' theo yêu cầu
        return axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5267'}/api/v1/Auth/RefreshToken`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
