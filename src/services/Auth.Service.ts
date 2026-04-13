import { authApi } from '../api/authApi';
import { jwtDecode } from 'jwt-decode';

export interface UserInfo {
  username: string;
  role: string;
}

export const authService = {
  /**
   * Logic xử lý đăng nhập
   */
  handleLogin: async (userName: string, password: string): Promise<UserInfo | null> => {
    try {
      // 1. Gọi API
      const response = await authApi.login(userName, password);
      
      // 2. Kiểm tra status từ Server bạn (200)
      if (response.status === 200) {
        // Lưu ý: data của bạn chứa { accessToken, refreshToken }
        const { accessToken, refreshToken } = response.data;
        
        // 3. Lưu trữ vào LocalStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // 4. Giải mã lấy thông tin User trả về cho UI
        return authService.getUserFromToken(accessToken);
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Tài khoản hoặc mật khẩu không chính xác');
    }
  },

  /**
   * Logic xử lý đăng ký
   */
  handleRegister: async (userName: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.register(userName, password);
      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      throw new Error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  },

  /**
   * Giải mã Token
   */
  getUserFromToken: (token: string | null): UserInfo | null => {
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];
      const username = decoded["unique_name"] || decoded["sub"] || "User";
      return role ? { username, role } : null;
    } catch (err) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};
