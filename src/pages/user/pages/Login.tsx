import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { authService } from '../../../services/Auth.Service';
import logoImg from '../../../assets/logo.png';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, loading: authLoading, login, isAdmin } = useUser();
  const navigate = useNavigate();

  // LOGIC: Nếu đã đăng nhập thì tự động chuyển hướng ra khỏi trang Login
  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, authLoading, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; 
    
    setLoading(true);
    setError(''); 

    try {
      const userData = await authService.handleLogin(userName, password);
      
      if (userData) {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token && refreshToken) {
          // 1. Cập nhật Context ngay lập tức
          login(token, refreshToken); 
          
          // 2. Ép buộc điều hướng ngay dựa trên role
          if (userData.role.toLowerCase() === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      }
    } catch (err: any) {
      console.warn("Đăng nhập thất bại:", err.message);
      setError(err.message || 'Tài khoản hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  // Nếu đang kiểm tra trạng thái đăng nhập, hiện màn hình trắng hoặc loading để tránh chớp giao diện
  if (authLoading || user) {
    return null; 
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh',
      padding: '40px 20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        background: 'var(--bg-secondary)', 
        padding: '40px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        textAlign: 'center',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Logo Section */}
        <div style={{ marginBottom: '30px' }}>
          <img src={logoImg} alt="Torano" style={{ height: '50px', marginBottom: '10px', objectFit: 'contain' }} />
          <h2 style={{ 
            fontSize: '1.2rem', 
            fontWeight: 700, 
            letterSpacing: '2px', 
            textTransform: 'uppercase',
            margin: '10px 0 5px' 
          }}>Đăng nhập</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Chào mừng bạn quay trở lại với Torano</p>
        </div>

        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'rgba(255, 77, 79, 0.1)', 
            border: '1px solid #ff4d4f', 
            padding: '12px', 
            color: '#ff4d4f', 
            marginBottom: '20px', 
            fontSize: '0.85rem',
            textAlign: 'left',
            borderRadius: 'var(--radius-sm)',
            animation: 'shake 0.5s'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Tài khoản</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Nhập tên đăng nhập"
                required
                disabled={loading}
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'var(--text-primary)', 
              color: 'var(--bg-primary)', 
              border: 'none', 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              textTransform: 'uppercase', 
              letterSpacing: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'opacity 0.2s',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {loading ? 'Đang xử lý...' : <>Đăng nhập ngay <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none' }}>Đăng ký ngay</Link></p>
          <div style={{ marginTop: '15px', padding: '10px', background: 'var(--bg-accent)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}>Tài khoản dùng thử: <strong>admin</strong> / <strong>admin</strong></div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
