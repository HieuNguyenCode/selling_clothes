import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { authService } from '../../../services/Auth.Service';
import logoImg from '../../../assets/logo.png';
import { User, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setLoading(true);
    setError(''); 

    try {
      const isSuccess = await authService.handleRegister(userName, password);
      if (isSuccess) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return null; 
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
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
          }}>Đăng ký</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tạo tài khoản mới tại Torano</p>
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
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'rgba(82, 196, 26, 0.1)', 
            border: '1px solid #52c41a', 
            padding: '12px', 
            color: '#52c41a', 
            marginBottom: '20px', 
            fontSize: '0.85rem',
            textAlign: 'left',
            borderRadius: 'var(--radius-sm)',
          }}>
            <CheckCircle size={18} />
            Đăng ký thành công! Đang chuyển hướng...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Nhập tên đăng nhập"
                required
                disabled={loading || success}
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Nhập mật khẩu"
                required
                disabled={loading || success}
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Xác nhận mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Nhập lại mật khẩu"
                required
                disabled={loading || success}
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || success}
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
            {loading ? 'Đang xử lý...' : <>Đăng ký ngay <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '30px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Đã có tài khoản? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập ngay</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
