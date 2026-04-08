import {Link} from 'react-router-dom';
import {useProducts} from '../../../context/Product.Context.tsx';
import {ShoppingBag, TrendingUp, Users, DollarSign, Edit, Trash2} from 'lucide-react';

const Dashboard = () => {
    const {products, deleteProduct} = useProducts();

    const stats = [
        {title: 'Doanh thu', value: '124,500,000 đ', icon: <DollarSign size={24}/>, color: '#52c41a'},
        {title: 'Đơn hàng mới', value: '48', icon: <ShoppingBag size={24}/>, color: '#1890ff'},
        {title: 'Khách hàng', value: '1,240', icon: <Users size={24}/>, color: '#faad14'},
        {title: 'Tăng trưởng', value: '+12.5%', icon: <TrendingUp size={24}/>, color: '#eb2f96'},
    ];

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {/* Stats Cards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'}}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="admin-card" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <div style={{
                            padding: '12px',
                            background: `${stat.color}15`,
                            color: stat.color,
                            borderRadius: '8px'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{fontSize: '0.85rem', color: '#8c8c8c'}}>{stat.title}</div>
                            <div style={{fontSize: '1.25rem', fontWeight: 700}}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
                <div className="admin-card" style={{padding: '0'}}>
                    <div style={{
                        padding: '24px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{margin: 0}}>Sản phẩm nổi bật</h3>
                        <Link to="/admin/add" className="btn btn-primary"
                              style={{fontSize: '0.8rem', padding: '6px 12px', borderRadius: '4px'}}>Thêm mới</Link>
                    </div>

                    <table className="admin-table-v2">
                        <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Tình trạng</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.slice(0, 5).map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <img src={product.imageUrl} alt={product.name} style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '4px',
                                            objectFit: 'cover'
                                        }}/>
                                        <span style={{fontWeight: 500}}>{product.name}</span>
                                    </div>
                                </td>
                                <td>{product.price.toLocaleString('vi-VN')} đ</td>
                                <td><span className="status-badge status-delivered">Còn hàng</span></td>
                                <td>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Link to={`/admin/edit/${product.id}`} style={{color: '#1890ff'}}><Edit
                                            size={16}/></Link>
                                        <button onClick={() => deleteProduct(product.id)} style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ff4d4f',
                                            cursor: 'pointer',
                                            padding: 0
                                        }}><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-card">
                    <h3 style={{marginTop: 0, marginBottom: '24px'}}>Đơn hàng gần đây</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        {[
                            {id: '#ORD-1001', time: '10 phút trước', status: 'delivered', user: 'Hoàng Hữu'},
                            {id: '#ORD-1002', time: '25 phút trước', status: 'pending', user: 'Minh Anh'},
                            {id: '#ORD-1003', time: '40 phút trước', status: 'shipped', user: 'Quốc Bảo'},
                            {id: '#ORD-1004', time: '1 giờ trước', status: 'pending', user: 'Thùy Linh'},
                        ].map((ord, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: '12px',
                                borderBottom: idx < 3 ? '1px solid #f5f5f5' : 'none'
                            }}>
                                <div>
                                    <div style={{fontWeight: 600, fontSize: '0.9rem'}}>{ord.user}</div>
                                    <div style={{fontSize: '0.75rem', color: '#8c8c8c'}}>{ord.id} • {ord.time}</div>
                                </div>
                                <span className={`status-badge status-${ord.status}`} style={{fontSize: '0.7rem'}}>
                  {ord.status === 'delivered' ? 'Giao xong' : ord.status === 'shipped' ? 'Đang giao' : 'Chờ xử lý'}
                </span>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary"
                            style={{width: '100%', marginTop: '20px', fontSize: '0.8rem'}}>Xem tất cả đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
