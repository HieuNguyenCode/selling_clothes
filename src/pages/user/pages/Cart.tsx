import { useCart } from '../../../context/Cart.Context.tsx';
import { useUser } from '../../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { paymentService } from '../../../services/paymentService';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../../components/common/Modal';
import { ShoppingBag, CreditCard, User, Phone, MapPin, CheckCircle2, Trash2 } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateCartItem } = useCart();
  const { user, sessionId } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Checkout modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState({
    customerName: '',
    phoneNumber: '',
    shippingAddress: '',
    paymentMethod: 'COD'
  });

  // Sync selectedIds with cart when cart changes (remove ids that are no longer in cart)
  useEffect(() => {
    const currentCartIds = cart.map(item => item.id);
    setSelectedIds(prev => prev.filter(id => currentCartIds.includes(id)));
  }, [cart]);

  const getFullUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.includes(':5267')) {
      return path.split(':5267')[1]; 
    }
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map(item => item.id));
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      // Error handled by context toast
    }
  };

  const handleClear = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await clearCart();
      } catch (error) {
        // Error handled by context toast
      }
    }
  };

  const selectedItems = cart.filter(item => selectedIds.includes(item.id));
  const selectedTotalPrice = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleOpenCheckout = () => {
    if (selectedIds.length === 0) {
      showToast('Vui lòng chọn ít nhất một sản phẩm để thanh toán', 'info');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutLoading) return;

    setCheckoutLoading(true);
    try {
      const shoppingCart = selectedItems.map(item => ({
        isCombo: !!item.isCombo,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        products: (item.products || []).map(p => ({
          id: p.id,
          name: p.name,
          image: p.image || '',
          size: p.size,
          color: p.color,
          quantity: p.quantity
        }))
      }));

      const response = await paymentService.createPayment({
        ...checkoutInfo,
        session: sessionId,
        shoppingCart
      });

      if (checkoutInfo.paymentMethod === 'ONLINE' && response.data?.paymentUrl) {
        showToast('Đang chuyển hướng tới trang thanh toán...', 'info');
        window.location.href = response.data.paymentUrl;
        return;
      }

      showToast('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', 'success');
      
      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      for (const id of selectedIds) {
        await removeFromCart(id);
      }
      
      setIsCheckoutModalOpen(false);
      navigate('/');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)' }}>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Hãy tiếp tục khám phá các sản phẩm mới nhất của chúng tôi!</p>
        <Link to="/" className="btn btn-primary" style={{ padding: '15px 40px', borderRadius: '12px', fontWeight: 700 }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px', color: 'var(--text-primary)' }}>Giỏ hàng</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
        {/* LEFT: CART ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={selectedIds.length === cart.length && cart.length > 0} 
                onChange={handleSelectAll}
                style={{ width: '18px', height: '18px' }}
              />
              Chọn tất cả ({cart.length})
            </label>
            <button onClick={handleClear} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.9rem' }}>
              <Trash2 size={16} /> Làm trống giỏ hàng
            </button>
          </div>

          <div style={{ background: 'var(--bg-primary)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '20px', width: '40px' }}></th>
                  <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SẢN PHẨM</th>
                  <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SỐ LƯỢNG</th>
                  <th style={{ padding: '20px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TỔNG GIÁ</th>
                  <th style={{ padding: '20px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', background: selectedIds.includes(item.id) ? 'var(--bg-accent)' : 'transparent' }}>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)} 
                        onChange={() => handleToggleSelect(item.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '90px', height: '110px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                          <img src={getFullUrl(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '5px', color: 'var(--text-primary)' }}>{item.name}</div>
                          {(item.size || item.color) && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '10px' }}>
                              {item.size && <span>Size: <strong>{item.size}</strong></span>}
                              {item.color && <span>Màu: <strong>{item.color}</strong></span>}
                            </div>
                          )}
                          {item.isCombo && (
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, alignSelf: 'start' }}>COMBO</span>
                              <div style={{ paddingLeft: '10px', borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {item.products?.map((p, idx) => (
                                  <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    • {p.name}: <strong style={{ color: 'var(--text-primary)' }}>{p.size}</strong> - <strong style={{ color: 'var(--text-primary)' }}>{p.color}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                        <button 
                          onClick={() => updateCartItem(item.id, {...item, quantity: Math.max(1, item.quantity - 1)})}
                          style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '5px 12px', fontWeight: 800, minWidth: '30px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', fontSize: '0.95rem' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartItem(item.id, { ...item, quantity: item.quantity + 1 })}
                          style={{ padding: '5px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ff4d4f' }}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.price.toLocaleString('vi-VN')} đ / cái</div>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleRemove(item.id)} 
                        style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '25px', color: 'var(--text-primary)' }}>Tóm tắt đơn hàng</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Đã chọn</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedIds.length} sản phẩm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                <span>TỔNG CỘNG</span>
                <span style={{ color: '#ff4d4f' }}>{selectedTotalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                height: '55px', 
                borderRadius: '12px', 
                fontWeight: 800, 
                fontSize: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                opacity: selectedIds.length === 0 ? 0.6 : 1,
                cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer'
              }}
              onClick={handleOpenCheckout}
            >
              <ShoppingBag size={20} /> THANH TOÁN ({selectedIds.length})
            </button>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>Tiếp tục mua sắm</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal 
        isOpen={isCheckoutModalOpen} 
        onClose={() => setIsCheckoutModalOpen(false)} 
        title="Thông tin giao hàng"
      >
        <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>HỌ VÀ TÊN</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                required 
                value={checkoutInfo.customerName}
                onChange={e => setCheckoutInfo({...checkoutInfo, customerName: e.target.value})}
                placeholder="Nhập họ và tên người nhận"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>SỐ ĐIỆN THOẠI</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="tel" 
                required 
                value={checkoutInfo.phoneNumber}
                onChange={e => setCheckoutInfo({...checkoutInfo, phoneNumber: e.target.value})}
                placeholder="Nhập số điện thoại liên hệ"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>ĐỊA CHỈ GIAO HÀNG</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
              <textarea 
                required 
                value={checkoutInfo.shippingAddress}
                onChange={e => setCheckoutInfo({...checkoutInfo, shippingAddress: e.target.value})}
                placeholder="Nhập địa chỉ nhận hàng chi tiết"
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>PHƯƠNG THỨC THANH TOÁN</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px', 
                border: checkoutInfo.paymentMethod === 'COD' ? '2px solid var(--accent-color)' : '1px solid var(--border)', 
                borderRadius: '8px', 
                cursor: 'pointer',
                background: checkoutInfo.paymentMethod === 'COD' ? 'var(--bg-accent)' : 'transparent'
              }}>
                <input type="radio" name="paymentMethod" value="COD" checked={checkoutInfo.paymentMethod === 'COD'} onChange={() => setCheckoutInfo({...checkoutInfo, paymentMethod: 'COD'})} style={{ display: 'none' }} />
                <CheckCircle2 size={18} color={checkoutInfo.paymentMethod === 'COD' ? 'var(--accent-color)' : '#ccc'} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Tiền mặt (COD)</span>
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px', 
                border: checkoutInfo.paymentMethod === 'ONLINE' ? '2px solid var(--accent-color)' : '1px solid var(--border)', 
                borderRadius: '8px', 
                cursor: 'pointer',
                background: checkoutInfo.paymentMethod === 'ONLINE' ? 'var(--bg-accent)' : 'transparent'
              }}>
                <input type="radio" name="paymentMethod" value="ONLINE" checked={checkoutInfo.paymentMethod === 'ONLINE'} onChange={() => setCheckoutInfo({...checkoutInfo, paymentMethod: 'ONLINE'})} style={{ display: 'none' }} />
                <CreditCard size={18} color={checkoutInfo.paymentMethod === 'ONLINE' ? 'var(--accent-color)' : '#ccc'} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chuyển khoản</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={checkoutLoading}
            className="btn btn-primary" 
            style={{ width: '100%', height: '55px', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {checkoutLoading ? 'Đang xử lý...' : <>XÁC NHẬN ĐẶT HÀNG <CheckCircle2 size={20} /></>}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Cart;
