import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../context/Product.Context.tsx';
import { paymentService } from '../../../services/paymentService';
import { DashboardStats } from '../../../api/paymentApi';
import { ShoppingBag, TrendingUp, Users, DollarSign, Edit, Trash2, RefreshCcw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import Loading from '../../../components/common/Loading';
import { getImageUrl } from '../../../utils/urlUtils';

const Dashboard = () => {
    const { products, deleteProduct } = useProducts();
    const { showToast } = useToast();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await paymentService.getDashboardStats();
            if (data) {
                setStatsData(data);
            }
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const stats = [
        { title: 'Doanh thu', value: `${(statsData?.totalRevenue || 0).toLocaleString('vi-VN')} đ`, icon: <DollarSign size={24} />, color: '#52c41a' },
        { title: 'Đơn hàng mới', value: (statsData?.newOrdersCount || 0).toString(), icon: <ShoppingBag size={24} />, color: '#1890ff' },
        { title: 'Khách hàng', value: (statsData?.totalCustomers || 0).toLocaleString('vi-VN'), icon: <Users size={24} />, color: '#faad14' },
        { title: 'Tăng trưởng', value: `${(statsData?.revenueGrowth || 0) >= 0 ? '+' : ''}${statsData?.revenueGrowth || 0}%`, icon: <TrendingUp size={24} />, color: '#eb2f96' },
    ];

    if (loading && !statsData) return <Loading />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header with Refresh */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Báo cáo tổng quan</h2>
                <button 
                    onClick={fetchStats} 
                    disabled={loading}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)',
                        background: 'var(--bg-primary)', cursor: 'pointer', fontSize: '0.9rem'
                    }}
                >
                    <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                    Làm mới
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            padding: '12px',
                            background: `${stat.color}15`,
                            color: stat.color,
                            borderRadius: '8px'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#8c8c8c' }}>{stat.title}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
                <div className="admin-card" style={{ padding: '0' }}>
                    <div style={{
                        padding: '24px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0 }}>Sản phẩm bán chạy</h3>
                        <Link to="/admin/products" className="btn btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none' }}>Quản lý kho</Link>
                    </div>

                    <table className="admin-table-v2">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Loại</th>
                                <th>Đã bán</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statsData?.topSellingItems && statsData.topSellingItems.length > 0 ? (
                                statsData.topSellingItems.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={getImageUrl(item.image)} alt={item.name} style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '4px',
                                                    objectFit: 'cover'
                                                }} />
                                                <span style={{ fontWeight: 500 }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                padding: '2px 6px', 
                                                borderRadius: '4px', 
                                                background: item.type === 'Combo' ? '#f9f0ff' : '#e6f7ff', 
                                                color: item.type === 'Combo' ? '#722ed1' : '#1890ff',
                                                fontWeight: 700
                                            }}>{item.type}</span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{item.totalSold}</td>
                                        <td style={{ fontWeight: 700, color: '#ff4d4f' }}>{item.revenue.toLocaleString('vi-VN')} đ</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#8c8c8c' }}>Chưa có dữ liệu bán hàng</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-card">
                    <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Đơn hàng gần đây</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {statsData?.recentOrders && statsData.recentOrders.length > 0 ? (
                            statsData.recentOrders.slice(0, 5).map((ord, idx) => {
                                const statusKey = ord.orderStatus.toLowerCase();
                                const statusLabel = statusKey === 'delivered' ? 'Giao xong' : statusKey === 'shipped' ? 'Đang giao' : statusKey === 'processing' ? 'Đang xử lý' : 'Chờ xử lý';
                                
                                return (
                                    <div key={ord.idorder} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingBottom: '12px',
                                        borderBottom: idx < statsData.recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ord.customerName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>#{ord.idorder.split('-')[0].toUpperCase()} • {new Date(ord.createAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                                        </div>
                                        <span className={`status-badge status-${statusKey}`} style={{ fontSize: '0.7rem' }}>
                                            {statusLabel}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px' }}>Chưa có đơn hàng nào</div>
                        )}
                    </div>
                    <Link to="/admin/orders" className="btn btn-secondary"
                        style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '20px', fontSize: '0.8rem', textDecoration: 'none' }}>
                        Xem tất cả đơn hàng
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
