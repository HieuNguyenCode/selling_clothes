import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../api/authApi';

interface User {
  username: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Hàm giải mã JWT chính xác theo mẫu bạn cung cấp
const getUserFromJWT = (token: string | null): User | null => {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    // Lấy đúng trường role từ Token Microsoft Identity
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];
    const username = decoded["unique_name"] || decoded["sub"] || "User";
    
    if (!role) return null;
    return { username, role };
  } catch (err) {
    return null;
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Khởi tạo USER đồng bộ (Synchronous) - Fix lỗi nhảy trang khi F5
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('accessToken');
    return getUserFromJWT(token);
  });
  
  // 2. Khởi tạo LOADING: Chỉ Loading nếu có Refresh Token cần xác thực lại ngầm
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem('refreshToken');
  });

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // Luôn lấy Token mới nhất khi load trang
          const res = await authApi.refreshToken(refreshToken);
          if (res.data.status === 200) {
            const { accessToken: newAt, refreshToken: newRt } = res.data.data;
            localStorage.setItem('accessToken', newAt);
            localStorage.setItem('refreshToken', newRt);
            const newUser = getUserFromJWT(newAt);
            if (newUser) setUser(newUser);
          } else {
            // Refresh token hết hạn thật sự
            logout();
          }
        } catch (err) {
          console.warn("Silent refresh failed - keeping current session");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    const userData = getUserFromJWT(accessToken);
    if (userData) {
      setUser(userData);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // Kiểm tra Admin cực kỳ chính xác
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <UserContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
