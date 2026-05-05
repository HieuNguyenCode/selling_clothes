import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Eye, RotateCw } from 'lucide-react';
import { paymentService } from '../../../services/paymentService';
import { OrderAdminResponseDto, OrderDetailAdminDto } from '../../../api/paymentApi';
import Table, { Column } from '../../../components/common/Table';
import AdminHeader from '../components/AdminHeader';
import AdminToolbar from '../components/AdminToolbar';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import AdminButton from '../components/AdminButton';
import { useToast } from '../../../context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState<OrderAdminResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { showToast } = useToast();
  
  // Modal states for View Detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderAdminResponseDto | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');

  const loadOrders = useCallback(async (page = 1, size = 10, status = '') => {
    setLoading(true);
    try {
      const result = await paymentService.getAllOrders(page, size, status || undefined);
      if (result) {
        setOrders(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.totalItems || 0);
        setCurrentPage(result.currentPage || 1);
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders(currentPage, pageSize, statusFilter);
  }, [currentPage, pageSize, statusFilter, loadOrders]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const openDetailModal = (order: OrderAdminResponseDto) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdateLoading(true);
    try {
      await paymentService.updateOrderStatus(selectedOrder.idorder, newOrderStatus, newPaymentStatus);
      showToast('Cập nhật trạng thái đơn hàng thành công!', 'success');
      loadOrders(currentPage, pageSize, statusFilter);
      closeDetailModal();
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'chờ xử lý': 
        return { color: '#faad14', bg: '#fffbe6', border: '#ffe58f' };
      case 'processing':
      case 'đang xử lý':
        return { color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff' };
      case 'shipped':
      case 'đang giao':
        return { color: '#722ed1', bg: '#f9f0ff', border: '#d3adf7' };
      case 'delivered':
      case 'đã giao':
        return { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' };
      case 'cancelled':
      case 'đã hủy':
        return { color: '#ff4d4f', bg: '#fff1f0', border: '#ffa39e' };
      default: return { color: '#8c8c8c', bg: '#f5f5f5', border: '#d9d9d9' };
    }
  };

  const translateOrderStatus = (status: string) => {
    const mapping: Record<string, string> = {
      'Pending': 'Chờ xử lý',
      'Processing': 'Đang xử lý',
      'Shipped': 'Đang giao',
      'Delivered': 'Đã giao',
      'Cancelled': 'Đã hủy'
    };
    return mapping[status] || status;
  };

  const translatePaymentStatus = (status: string) => {
    const mapping: Record<string, string> = {
      'Unpaid': 'Chưa thanh toán',
      'Paid': 'Đã thanh toán',
      'Refunded': 'Đã hoàn tiền'
    };
    return mapping[status] || status;
  };

  const columns: Column<OrderAdminResponseDto>[] = [
    {
      title: 'Mã Đơn',
      key: 'idorder',
      render: (record) => <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{record.idorder.split('-')[0].toUpperCase()}</span>
    },
    {
      title: 'Khách hàng',
      key: 'customerName',
      render: (record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.customerName}</div>
          <div style={{ fontSize: '0.8rem', color: '#8c8c8c' }}>{record.phoneNumber}</div>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      key: 'totalPrice',
      render: (record) => <span style={{ fontWeight: 700, color: '#ff4d4f' }}>{record.totalPrice.toLocaleString('vi-VN')} đ</span>
    },
    {
      title: 'Trạng thái',
      key: 'orderStatus',
      render: (record) => {
        const style = getStatusColor(record.orderStatus);
        return (
          <span style={{ 
            padding: '4px 10px', 
            borderRadius: '4px', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            color: style.color,
            background: style.bg,
            border: `1px solid ${style.border}`,
            textTransform: 'uppercase'
          }}>
            {translateOrderStatus(record.orderStatus)}
          </span>
        );
      }
    },
    {
      title: 'Thanh toán',
      key: 'paymentStatus',
      render: (record) => (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{record.paymentMethod}</div>
          <div style={{ fontSize: '0.75rem', color: record.paymentStatus === 'Paid' ? '#52c41a' : '#faad14' }}>{translatePaymentStatus(record.paymentStatus)}</div>
        </div>
      )
    },
    {
      title: 'Ngày đặt',
      key: 'createAt',
      render: (record) => <span style={{ fontSize: '0.85rem', color: '#525252' }}>{new Date(record.createAt).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '100px',
      align: 'right',
      render: (record) => (
        <AdminButton 
          variant="icon"
          onClick={() => openDetailModal(record)}
          icon={Eye}
          style={{ color: '#1890ff', background: '#e6f7ff' }}
          title="Xem chi tiết"
        />
      )
    }
  ];

  return (
    <div className="admin-card">
      <AdminHeader 
        title="Quản lý Đơn hàng"
        subtitle={`Hiển thị ${orders.length} / ${totalItems} đơn hàng`}
        icon={ShoppingCart}
        onRefresh={() => loadOrders(currentPage, pageSize, statusFilter)}
        refreshLoading={loading}
      />

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <AdminToolbar 
            searchTerm={''}
            onSearchChange={() => {}}
            onSearchSubmit={(e) => e.preventDefault()}
            searchPlaceholder="Tìm kiếm đơn hàng (đang phát triển)..."
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          style={{ 
            padding: '10px 15px', 
            borderRadius: '8px', 
            border: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Processing">Đang xử lý</option>
          <option value="Shipped">Đang giao</option>
          <option value="Delivered">Đã giao</option>
          <option value="Cancelled">Đã hủy</option>
        </select>
      </div>

      <Table columns={columns} dataSource={orders} loading={loading} rowKey="idorder" />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />

      {/* Modal View Detail */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title={`Chi tiết đơn hàng: #${selectedOrder?.idorder.split('-')[0].toUpperCase()}`}
        maxWidth="900px"
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                <h4 style={{ marginBottom: '15px', color: '#1890ff', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>Thông tin khách hàng</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8c8c8c' }}>Tên:</span> <strong>{selectedOrder.customerName}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8c8c8c' }}>SĐT:</span> <strong>{selectedOrder.phoneNumber}</strong></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ color: '#8c8c8c' }}>Địa chỉ giao hàng:</span>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #eee', fontSize: '0.9rem' }}>{selectedOrder.shippingAddress}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                <h4 style={{ marginBottom: '15px', color: '#722ed1', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>Thông tin thanh toán</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8c8c8c' }}>Phương thức:</span> <strong>{selectedOrder.paymentMethod}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8c8c8c' }}>Trạng thái:</span> <strong style={{ color: selectedOrder.paymentStatus === 'Paid' ? '#52c41a' : '#faad14' }}>{selectedOrder.paymentStatus}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8c8c8c' }}>Ngày đặt:</span> <strong>{new Date(selectedOrder.createAt).toLocaleString('vi-VN')}</strong></div>
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #d9d9d9', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                    <span>Tổng cộng:</span>
                    <strong style={{ color: '#ff4d4f' }}>{selectedOrder.totalPrice.toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '4px', height: '18px', background: '#faad14', borderRadius: '2px' }}></div>
                Sản phẩm trong đơn ({selectedOrder.items.length})
              </h4>
              <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <tr>
                      <th style={{ padding: '12px 15px', textAlign: 'left', fontSize: '0.85rem' }}>Sản phẩm</th>
                      <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: '0.85rem' }}>Phân loại</th>
                      <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: '0.85rem' }}>Đơn giá</th>
                      <th style={{ padding: '12px 15px', textAlign: 'center', fontSize: '0.85rem' }}>SL</th>
                      <th style={{ padding: '12px 15px', textAlign: 'right', fontSize: '0.85rem' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <tr style={{ borderBottom: (item.itemType === 'Combo' && item.comboItems && item.comboItems.length > 0) ? 'none' : (idx < selectedOrder.items.length - 1 ? '1px solid #f0f0f0' : 'none') }}>
                          <td style={{ padding: '12px 15px' }}>
                            <div style={{ fontWeight: 600 }}>{item.itemName}</div>
                            <span style={{ fontSize: '0.7rem', color: item.itemType === 'Combo' ? '#722ed1' : '#1890ff', background: item.itemType === 'Combo' ? '#f9f0ff' : '#e6f7ff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>{item.itemType}</span>
                          </td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', fontSize: '0.85rem' }}>
                            {item.sizeName || item.colorName ? (
                              <>
                                {item.sizeName && <div>Size: <strong>{item.sizeName}</strong></div>}
                                {item.colorName && <div>Màu: <strong>{item.colorName}</strong></div>}
                              </>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', fontSize: '0.85rem' }}>{item.unitPrice.toLocaleString('vi-VN')} đ</td>
                          <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                          <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 700, color: '#ff4d4f' }}>{item.subTotal.toLocaleString('vi-VN')} đ</td>
                        </tr>
                        {item.itemType === 'Combo' && item.comboItems && item.comboItems.length > 0 && (
                          <tr>
                            <td colSpan={5} style={{ padding: '0 15px 15px 40px' }}>
                              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px 15px', borderLeft: '3px solid #722ed1' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase' }}>Sản phẩm trong combo:</div>
                                {item.comboItems.map((comboProd, cIdx) => (
                                  <div key={cIdx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr', gap: '10px', fontSize: '0.8rem', padding: '5px 0', borderBottom: cIdx < item.comboItems!.length - 1 ? '1px dashed #e8e8e8' : 'none' }}>
                                    <div style={{ fontWeight: 600 }}>{comboProd.productName}</div>
                                    <div>Size: <strong>{comboProd.sizeName}</strong></div>
                                    <div>Màu: <strong>{comboProd.colorName}</strong></div>
                                    <div style={{ textAlign: 'right' }}>x{comboProd.quantity}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                        {item.itemType === 'Combo' && idx < selectedOrder.items.length - 1 && (
                          <tr style={{ borderBottom: '1px solid #f0f0f0' }}><td colSpan={5}></td></tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '4px', height: '18px', background: '#1890ff', borderRadius: '2px' }}></div>
                Cập nhật trạng thái đơn hàng
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '20px', alignItems: 'end' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>TRẠNG THÁI ĐƠN HÀNG</label>
                  <select 
                    value={newOrderStatus} 
                    onChange={(e) => setNewOrderStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Shipped">Đang giao</option>
                    <option value="Delivered">Đã giao</option>
                    <option value="Cancelled">Đã hủy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>TRẠNG THÁI THANH TOÁN</label>
                  <select 
                    value={newPaymentStatus} 
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="Unpaid">Chưa thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                    <option value="Refunded">Đã hoàn tiền</option>
                  </select>
                </div>
                <AdminButton 
                  onClick={handleUpdateStatus} 
                  loading={updateLoading}
                  style={{ height: '42px', width: '100%' }}
                >
                  Lưu thay đổi
                </AdminButton>
              </div>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <AdminButton variant="secondary" onClick={closeDetailModal}>Đóng</AdminButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
