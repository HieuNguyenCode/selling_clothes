import {ReactNode} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import {
    BarChart3,
    Tag,
    Package,
    Layers,
    FolderTree,
    Building2,
    ShoppingCart,
    LogOut,
    Settings,
    Bell
} from 'lucide-react';
import '../../../Admin.css';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({children}: AdminLayoutProps) => {
    const {user, logout} = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        {name: 'Báo cáo', path: '/admin', icon: <BarChart3 size={20}/>},
        {name: 'Sale', path: '/admin/sale', icon: <Tag size={20}/>},
        {name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20}/>},
        {name: 'Combo', path: '/admin/combo', icon: <Layers size={20}/>},
        {name: 'Danh mục', path: '/admin/categories', icon: <FolderTree size={20}/>},
        {name: 'Hãng', path: '/admin/brands', icon: <Building2 size={20}/>},
        {name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20}/>},
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div style={{
                    padding: '30px 24px',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', color: '#1890ff'}}>
                        TORANO
                    </div>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
                    <button
                        onClick={handleLogout}
                        className="admin-nav-item"
                        style={{
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <LogOut size={20}/>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div style={{fontWeight: 600, fontSize: '1.1rem'}}>
                        {menuItems.find(i => i.path === location.pathname)?.name || 'Hệ thống quản lý'}
                    </div>

                    <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <div style={{display: 'flex', gap: '15px', color: '#666'}}>
                            <Bell size={20} cursor="pointer"/>
                            <Settings size={20} cursor="pointer"/>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderLeft: '1px solid #eee',
                            paddingLeft: '20px'
                        }}>
                            <div style={{textAlign: 'right'}}>
                                <div style={{fontWeight: 600, fontSize: '0.9rem'}}>{user?.username}</div>
                                <div style={{fontSize: '0.75rem', color: '#888'}}>Quản trị viên</div>
                            </div>
                            <div style={{
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                background: '#1890ff',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                <span style={{margin: 'auto'}}>A</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
