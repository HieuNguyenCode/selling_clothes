import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/Cart.Context.tsx';
import { ShoppingCart, ImageOff } from 'lucide-react';

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
  const navigate = useNavigate();

  const getFullUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.includes(':5267')) {
      return path.split(':5267')[1]; 
    }
    if (path.startsWith('/images/')) return path;
    if (path.startsWith('images/')) return '/' + path;
    
    return path;
  };

  const displayImage = getFullUrl(product.image || product.imageUrl);

  const hasSale = product.priceSale !== undefined && product.priceSale !== null && product.priceSale > 0;
  const currentPrice = hasSale ? product.priceSale! : product.price;
  const originalPrice = product.price;
  const discountPercent = hasSale ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div 
      className="product-card" 
      style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', position: 'relative', cursor: 'pointer' }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {hasSale && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4f', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, zIndex: 10 }}>
          -{discountPercent}%
        </div>
      )}
      
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as any).style.display = 'none';
              (e.target as any).parentElement.innerHTML = '<div style="color: #ccc; display: flex; flex-direction: column; align-items: center;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size: 0.7rem; margin-top: 8px;">Không có ảnh</span></div>';
            }}
          />
        ) : (
          <div style={{ color: '#ccc' }}><ImageOff size={40} strokeWidth={1} /></div>
        )}
      </div>
      
      <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', minHeight: '2.4em', margin: '0 0 10px 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textAlign: 'left' }}>
          {product.name}
        </h3>
        
        <div style={{ marginBottom: '15px', textAlign: 'left' }}>
          <div className="product-price" style={{ fontSize: '1.1rem', fontWeight: 700, color: hasSale ? '#ff4d4f' : 'inherit' }}>
            {currentPrice.toLocaleString('vi-VN')} đ
          </div>
          {hasSale && (
            <div style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#8c8c8c' }}>
              {originalPrice.toLocaleString('vi-VN')} đ
            </div>
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart({ ...product, price: currentPrice } as any); }} 
            className="btn btn-secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', height: '38px' }}
          >
            <ShoppingCart size={16} /> Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
