import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Eye, Package, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { paymentService } from '../../../services/paymentService';
import { OrderAdminResponseDto } from '../../../api/paymentApi';
import { useUser } from '../../../context/UserContext';
import { useToast } from '../../../context/ToastContext';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';

const OrderHistory = () => {
  const { sessionId } = useUser();
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState<OrderAdminResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedOrder, setSelectedOrder] = useState<OrderAdminResponseDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result = await paymentService.getUserOrders(sessionId, page, 5);
      if (result) {
        setOrders(result.data || []);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || 1);
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [sessionId, showToast]);

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage, loadOrders]);

  const getStatusInfo = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return { text: 'Chờ xử lý', color: '#faad14', icon: Clock };
    if (s === 'processing') return { text: 'Đang xử lý', color: '#1890ff', icon: Package };
    if (s === 'shipped') return { text: 'Đang giao', color: '#722ed1', icon: Package };
    if (s === 'delivered') return { text: 'Đã giao', color: '#52c41a', icon: CheckCircle2 };
    if (s === 'cancelled') return { text: 'Đã hủy', color: '#ff4d4f', icon: CheckCircle2 };
    return { text: status, color: '#8c8c8c', icon: Clock };
  };

  const openDetails = (order: OrderAdminResponseDto) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading && orders.length === 0) return <Loading />;

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '70vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <ShoppingBag size={40} /> Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-secondary)', borderRadius: '24px' }}>
          <Package size={60} color="var(--text-secondary)" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: 'var(--text-primary)' }}>Bạn chưa có đơn hàng nào</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const status = getStatusInfo(order.orderStatus);
            return (
              <div key={order.idorder} style={{ background: 'var(--bg-primary)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', transition: 'transform 0.2s' }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                    <status.icon size={30} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '5px' }}>
                      ĐƠN HÀNG #{order.idorder.split('-')[0].toUpperCase()}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {order.totalPrice.toLocaleString('vi-VN')} đ
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                      Ngày đặt: {new Date(order.createAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '5px' }}>TRẠNG THÁI</div>
                    <div style={{ color: status.color, fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>{status.text}</div>
                  </div>
                  <button 
                    onClick={() => openDetails(order)}
                    style={{ background: 'var(--bg-secondary)', border: 'none', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--border)',
                    background: currentPage === i + 1 ? 'var(--accent-color)' : 'var(--bg-primary)',
                    color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Chi tiết đơn hàng: #${selectedOrder?.idorder.split('-')[0].toUpperCase()}`}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>NGƯỜI NHẬN</div>
                  <div style={{ fontWeight: 700 }}>{selectedOrder.customerName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>SỐ ĐIỆN THOẠI</div>
                  <div style={{ fontWeight: 700 }}>{selectedOrder.phoneNumber}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>ĐỊA CHỈ</div>
                  <div style={{ fontWeight: 700 }}>{selectedOrder.shippingAddress}</div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, marginBottom: '15px', color: 'var(--text-primary)' }}>SẢN PHẨM ĐÃ MUA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ paddingBottom: '15px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ fontWeight: 700 }}>
                        {item.itemName} 
                        <span style={{ marginLeft: '10px', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: item.itemType === 'Combo' ? '#f9f0ff' : '#e6f7ff', color: item.itemType === 'Combo' ? '#722ed1' : '#1890ff' }}>{item.itemType}</span>
                      </div>
                      <div style={{ fontWeight: 800 }}>{item.subTotal.toLocaleString('vi-VN')} đ</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {item.sizeName && <span>Size: {item.sizeName} | </span>}
                      {item.colorName && <span>Màu: {item.colorName} | </span>}
                      <span>SL: {item.quantity}</span>
                    </div>
                    {item.comboItems && item.comboItems.length > 0 && (
                      <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.8rem' }}>
                        {item.comboItems.map((c, ci) => (
                          <div key={ci}>• {c.productName} ({c.sizeName}/{c.colorName}) x{c.quantity}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>TỔNG CỘNG:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff4d4f' }}>{selectedOrder.totalPrice.toLocaleString('vi-VN')} đ</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
