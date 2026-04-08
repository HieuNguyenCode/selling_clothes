import React from 'react';
import { useCart } from '../../../context/Cart.Context.tsx';
import { ShoppingCart, Zap } from 'lucide-react';

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
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  const displayImage = getFullUrl(product.image || product.imageUrl);

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hình ảnh vuông (Aspect Ratio 1/1) */}
      <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
        <img 
          src={displayImage} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
      
      <div className="product-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
        <h3 style={{ fontSize: '0.95rem', minHeight: '2.4em', margin: '0 0 10px 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <span className="product-price" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            {product.price.toLocaleString('vi-VN')} đ
          </span>
          {product.priceSale && (
            <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: '#ff4d4f', marginLeft: '10px' }}>
              {product.priceSale.toLocaleString('vi-VN')} đ
            </span>
          )}
        </div>

        {/* Cụm nút bấm */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => addToCart(product as any)} 
            className="btn btn-secondary"
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              fontSize: '0.75rem',
              padding: '10px'
            }}
          >
            <ShoppingCart size={16} /> Thêm vào giỏ
          </button>
          
          <button 
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              fontSize: '0.75rem',
              padding: '10px'
            }}
          >
            <Zap size={16} fill="currentColor" /> Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
