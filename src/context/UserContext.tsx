import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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

const getUserFromJWT = (token: string | null): User | null => {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];
    const username = decoded["unique_name"] || decoded["sub"] || "User";
    return role ? { username, role } : null;
  } catch (err) {
    return null;
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('accessToken');
    return getUserFromJWT(token);
  });
  
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem('refreshToken');
  });

  // Hàm thực hiện refresh token
  const handleRefreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const res = await authApi.refreshToken(refreshToken);
      if (res.data.status === 200) {
        const { accessToken: newAt, refreshToken: newRt } = res.data.data;
        localStorage.setItem('accessToken', newAt);
        localStorage.setItem('refreshToken', newRt);
        const newUser = getUserFromJWT(newAt);
        if (newUser) setUser(newUser);
        console.log("Token đã được làm mới tự động (15 phút)");
        return true;
      }
    } catch (err) {
      console.error("Lỗi làm mới token tự động:", err);
    }
    return false;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await handleRefreshToken();
      }
      setLoading(false);
    };

    initAuth();
  }, [handleRefreshToken]);

  // THIẾT LẬP REFRESH ĐỊNH KỲ: 15 PHÚT (15 * 60 * 1000 = 900,000ms)
  useEffect(() => {
    let intervalId: any;

    if (user) {
      intervalId = setInterval(() => {
        handleRefreshToken();
      }, 15 * 60 * 1000); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, handleRefreshToken]);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(getUserFromJWT(accessToken));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

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
