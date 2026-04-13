import { useCart } from '../../../context/Cart.Context.tsx';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  const getFullUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.includes(':5267')) {
      return path.split(':5267')[1]; 
    }
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await clearCart();
      } catch (error) {
        alert('Lỗi khi xóa giỏ hàng');
      }
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
        <div style={{ background: 'var(--bg-primary)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SẢN PHẨM</th>
                <th style={{ padding: '20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SỐ LƯỢNG</th>
                <th style={{ padding: '20px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>TỔNG GIÁ</th>
                <th style={{ padding: '20px' }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
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
                        {item.isCombo && <span style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginTop: '8px', display: 'inline-block' }}>COMBO</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.quantity}</span>
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
          <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={handleClear} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Làm trống giỏ hàng
            </button>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '25px', color: 'var(--text-primary)' }}>Tóm tắt đơn hàng</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border)', margin: '5px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                <span>TỔNG CỘNG</span>
                <span style={{ color: '#ff4d4f' }}>{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', height: '55px', borderRadius: '12px', fontWeight: 800, fontSize: '1rem' }}>
              THANH TOÁN NGAY
            </button>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>Tiếp tục mua sắm</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
