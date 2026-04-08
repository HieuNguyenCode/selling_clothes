import React from 'react';
import { useCart } from '../../../context/Cart.Context.tsx';
import { ShoppingCart, Zap, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    imageUrl?: string;
    priceSale?: number | null;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const getFullUrl = (path: string | undefined) => {
    if (!path) return '';
    // Nếu path đã là URL tuyệt đối của backend (ví dụ chứa :5267), ta chuyển nó thành tương đối
    if (path.includes(':5267')) {
      return path.split(':5267')[1]; 
    }
    // Đảm bảo đường dẫn bắt đầu bằng /images để khớp với Proxy
    if (path.startsWith('/images/')) return path;
    if (path.startsWith('images/')) return '/' + path;
    
    return path;
  };

  const displayImage = getFullUrl(product.image || product.imageUrl);

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Hình ảnh vuông với Fallback nếu lỗi */}
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Nếu ảnh lỗi (404), hiện icon thay thế
              (e.target as any).style.display = 'none';
              (e.target as any).parentElement.innerHTML = '<div style="color: #ccc; display: flex; flex-direction: column; align-items: center;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size: 0.7rem; margin-top: 8px;">Không có ảnh</span></div>';
            }}
          />
        ) : (
          <div style={{ color: '#ccc' }}><ImageOff size={40} strokeWidth={1} /></div>
        )}
      </div>
      
      <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
        <h3 style={{ fontSize: '0.95rem', minHeight: '2.4em', margin: '0 0 10px 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textAlign: 'center' }}>
          {product.name}
        </h3>
        
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <span className="product-price" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {product.price.toLocaleString('vi-VN')} đ
          </span>
          {product.priceSale && (
            <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#ff4d4f', marginLeft: '10px' }}>
              {product.priceSale.toLocaleString('vi-VN')} đ
            </span>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => addToCart(product as any)} 
            className="btn btn-secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem' }}
          >
            <ShoppingCart size={16} /> Thêm vào giỏ
          </button>
          
          <button 
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem' }}
          >
            <Zap size={16} fill="currentColor" /> Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
