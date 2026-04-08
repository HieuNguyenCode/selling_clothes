import axiosInstance from '../utils/Axios.Config';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5267/api';

const handleResponse = (res: any) => {
    if (res.data.status === 200 || res.data.status === 201) return res.data;
    throw new Error(res.data.message || 'Lỗi hệ thống');
};

export const authApi = {
    login: (userName: string, password: string) => {
        return axiosInstance.post('/api/v1/Auth/Login', {userName, password}).then(handleResponse);
    },

    refreshToken: (token: string) => {
        // Gọi axios thuần vì header Authorization sử dụng refresh token theo logic đặc thù
        return axios.patch(`${API_URL}/api/v1/Auth/RefreshToken`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
