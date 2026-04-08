import { useCart } from '../../../context/Cart.Context.tsx';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  const getFullUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Giỏ hàng của bạn</h2>
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>
                  <img 
                    src={getFullUrl((item as any).image || item.imageUrl)} 
                    alt={item.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td>{item.price.toLocaleString('vi-VN')} đ</td>
                <td>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'right', padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)' }}>
        <h3 style={{ margin: 0 }}>Tổng tiền: <span className="product-price" style={{ fontSize: '1.5rem' }}>{totalPrice.toLocaleString('vi-VN')} đ</span></h3>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={clearCart} className="btn btn-secondary">Xóa giỏ hàng</button>
          <button className="btn btn-primary" style={{ padding: '12px 32px' }}>Thanh toán ngay</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
