import { authApi } from '../api/Auth.Api.ts';
import { jwtDecode } from 'jwt-decode';

export interface UserInfo {
  username: string;
  role: 'user' | 'admin';
}

export const authService = {
  /**
   * Nghiệp vụ đăng nhập: Gọi API, xử lý kết quả, lưu Token, trả về thông tin User
   */
  handleLogin: async (userName: string, password: string): Promise<UserInfo | null> => {
    try {
      // 1. Chỉ gọi API để lấy dữ liệu thô
      const response = await authApi.login(userName, password);
      
      // 2. Kiểm tra trạng thái từ phản hồi của Server bạn
      if (response.data.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        
        // 3. Xử lý Side Effects (Lưu trữ)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // 4. Giải mã dữ liệu và trả về kết quả đã được xử lý cho UI
        return authService.getUserFromToken(accessToken);
      } else {
        throw new Error(response.data.message || 'Đăng nhập không thành công');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi hệ thống');
    }
  },

  /**
   * Logic giải mã Token để lấy thông tin User
   */
  getUserFromToken: (token: string): UserInfo | null => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        username: decoded["unique_name"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Logic đăng xuất
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
  }
};
