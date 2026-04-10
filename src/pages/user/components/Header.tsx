import {Link, useNavigate} from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import {useCart} from '../../../context/Cart.Context.tsx';
import {useTheme} from '../../../context/Theme.Context.tsx';
import {Search, User, ShoppingBag, Sun, Moon} from 'lucide-react';
import logoImg from '../../../assets/logo.png';

const Header = () => {
    const {user, logout, isAdmin} = useUser();
    const {cartCount} = useCart();
    const {theme, toggleTheme} = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header>
                <Link to="/" className="header-logo">
                    <img src={logoImg} alt="TORANO" style={{height: '40px', objectFit: 'contain'}}/>
                </Link>

                <nav className="header-nav">
                    <Link to="/">Sản phẩm mới</Link>
                    <Link to="/sale">Sale</Link>
                    <Link to="/products">Sản phẩm</Link>
                    <Link to="/combos">Combo</Link>
                    <Link to="/">Phụ kiện</Link>
                    <Link to="/">Hệ thống cửa hàng</Link>
                </nav>

                <div className="header-actions">
                    <button className="icon-btn" title="Tìm kiếm">
                        <Search size={22}/>
                    </button>

                    <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                        <button className="icon-btn" onClick={() => !user && navigate('/login')}
                                title={user ? user.username : "Đăng nhập"}>
                            <User size={22}/>
                        </button>
                        {user && (
                            <div style={{
                                marginLeft: '5px',
                                fontSize: '0.8rem',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{fontWeight: '600'}}>{user.username}</span>
                                <button onClick={handleLogout} style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    textAlign: 'left'
                                }}>Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" className="icon-btn" title="Giỏ hàng">
                        <ShoppingBag size={22}/>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <button className="icon-btn" onClick={toggleTheme} title="Đổi giao diện">
                        {theme === 'light' ? <Moon size={22}/> : <Sun size={22}/>}
                    </button>

                    {isAdmin && (
                        <Link to="/admin" style={{
                            marginLeft: '10px',
                            color: 'var(--accent-color)',
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            border: '1px solid var(--border)',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}>
                            ADMIN
                        </Link>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
