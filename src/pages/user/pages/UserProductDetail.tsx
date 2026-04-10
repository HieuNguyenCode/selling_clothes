import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService, ProductDetail, ProductList } from '../../../services/productService';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw, 
  Heart, Star, Share2, Info, ChevronRight, Check
} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { useCart } from '../../../context/Cart.Context.tsx';
import ProductCard from '../components/ProductCard';

const UserProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeImg, setActiveImg] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productService.fetchProductById(id);
        setProduct(data);
        setActiveImg(data.image);
        
        // Load sản phẩm liên quan (giả lập lấy cùng danh mục)
        const related = await productService.fetchProducts('', 1, 4);
        setRelatedProducts(related.data.filter((p: any) => p.id !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <Loading />;
  if (!product) return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Sản phẩm không tồn tại.</div>;

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.includes(':5267')) return path.split(':5267')[1];
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) return alert('Vui lòng chọn kích thước');
    if (product.colors.length > 0 && !selectedColor) return alert('Vui lòng chọn màu sắc');
    
    addToCart({
      ...product,
      price: product.priceSale || product.price,
      selectedSize,
      selectedColor
    } as any);
  };

  const hasSale = product.priceSale && product.priceSale < product.price;
  const discountPercent = hasSale ? Math.round(((product.price - product.priceSale!) / product.price) * 100) : 0;

  return (
    <div className="container" style={{ padding: '20px 20px 80px 20px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#8c8c8c', marginBottom: '30px' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Sản phẩm</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'start' }}>
        
        {/* LEFT: MEDIA SECTION */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden', background: '#f5f5f5', border: '1px solid #f0f0f0', marginBottom: '20px' }}>
            <img src={getImageUrl(activeImg)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {hasSale && (
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#ff4d4f', color: 'white', padding: '6px 15px', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', boxShadow: '0 4px 10px rgba(255,77,79,0.3)' }}>
                -{discountPercent}%
              </div>
            )}
            <button style={{ position: 'absolute', top: '20px', right: '20px', width: '45px', height: '45px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <Share2 size={20} color="#595959" />
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
            {[product.image, ...(product.images || [])].map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImg(img)}
                style={{ 
                  width: '80px', height: '80px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', 
                  border: activeImg === img ? '2px solid #1890ff' : '1px solid #e8e8e8', 
                  cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                <img src={getImageUrl(img)} alt="sub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CONTENT SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ background: 'var(--bg-accent)', color: '#1890ff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{product.companyName}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fadb14' }}>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span style={{ color: '#8c8c8c', fontSize: '0.85rem', marginLeft: '5px' }}>(128 đánh giá)</span>
              </div>
            </div>
            
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '0 0 20px 0', lineHeight: 1.1 }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ff4d4f' }}>{(product.priceSale || product.price).toLocaleString('vi-VN')} đ</span>
              {hasSale && (
                <span style={{ fontSize: '1.4rem', color: '#bfbfbf', textDecoration: 'line-through' }}>{product.price.toLocaleString('vi-VN')} đ</span>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f0f0f0' }}></div>

          {/* Variants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {product.colors.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, marginBottom: '15px', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}>
                  MÀU SẮC: <span style={{ color: '#1890ff' }}>{selectedColor || 'Chưa chọn'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {product.colors.map(c => (
                    <button 
                      key={c} onClick={() => setSelectedColor(c)}
                      style={{ 
                        padding: '12px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        border: selectedColor === c ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        background: selectedColor === c ? '#e6f7ff' : 'white',
                        color: selectedColor === c ? '#1890ff' : 'inherit'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, marginBottom: '15px', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}>
                  KÍCH THƯỚC: <span style={{ color: '#1890ff' }}>{selectedSize || 'Chưa chọn'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {product.sizes.map(s => (
                    <button 
                      key={s} onClick={() => setSelectedSize(s)}
                      style={{ 
                        minWidth: '60px', height: '50px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        border: selectedSize === s ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        background: selectedSize === s ? '#e6f7ff' : 'white',
                        color: selectedSize === s ? '#1890ff' : 'inherit'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', gap: '15px', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', border: '1px solid #d9d9d9', borderRadius: '10px', overflow: 'hidden', height: '55px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '45px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>-</button>
              <div style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>{quantity}</div>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '45px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary" 
              style={{ flex: 1, borderRadius: '10px', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 8px 15px rgba(24,144,255,0.25)' }}
            >
              <ShoppingCart size={22} /> THÊM VÀO GIỎ HÀNG
            </button>
            <button style={{ width: '55px', height: '55px', borderRadius: '10px', border: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
              <Heart size={24} color="#ff4d4f" />
            </button>
          </div>

          {/* Policy List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {[
              { icon: Truck, text: "Giao hàng từ 2-4 ngày", sub: "Miễn phí đơn từ 500k" },
              { icon: RotateCcw, text: "7 ngày đổi trả", sub: "Dễ dàng, nhanh chóng" },
              { icon: ShieldCheck, text: "Bảo hành 6 tháng", sub: "Lỗi do nhà sản xuất" },
              { icon: Info, text: "Kiểm tra hàng", sub: "Trước khi thanh toán" }
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '15px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                <p.icon size={20} color="#1890ff" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.text}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div style={{ marginTop: '80px' }}>
        <div style={{ display: 'flex', gap: '40px', borderBottom: '2px solid #f0f0f0', marginBottom: '40px' }}>
          {[
            { id: 'description', label: 'MÔ TẢ CHI TIẾT' },
            { id: 'specs', label: 'THÔNG SỐ KỸ THUẬT' },
            { id: 'reviews', label: 'ĐÁNH GIÁ (128)' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '15px 0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                color: activeTab === tab.id ? '#1890ff' : '#8c8c8c',
                borderBottom: activeTab === tab.id ? '3px solid #1890ff' : '3px solid transparent',
                marginBottom: '-2px', transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ minHeight: '200px', lineHeight: '1.8', color: '#595959' }}>
          {activeTab === 'description' && (
            <div style={{ maxWidth: '800px' }}>
              <p>{product.description}</p>
              <ul style={{ paddingLeft: '20px', marginTop: '20px' }}>
                <li>Chất liệu cao cấp, thoáng mát, thấm hút mồ hôi tốt.</li>
                <li>Thiết kế hiện đại, phù hợp cho cả đi làm và đi chơi.</li>
                <li>Đường may tinh tế, tỉ mỉ, độ bền cao.</li>
                <li>Giữ form dáng tốt sau nhiều lần giặt.</li>
              </ul>
            </div>
          )}
          {activeTab === 'specs' && (
            <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600 }}>Thương hiệu</span>
                <span>{product.companyName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px' }}>
                <span style={{ fontWeight: 600 }}>Loại sản phẩm</span>
                <span>{product.typeName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600 }}>Mã sản phẩm</span>
                <span>{product.id.split('-')[0].toUpperCase()}</span>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fafafa', borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '10px' }}>4.9/5</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', color: '#fadb14', marginBottom: '20px' }}>
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
              </div>
              <p>Hơn 98% khách hàng hài lòng về sản phẩm này.</p>
              <button className="btn btn-secondary" style={{ marginTop: '20px' }}>Viết đánh giá của bạn</button>
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div style={{ marginTop: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>SẢN PHẨM LIÊN QUAN</h2>
          <div style={{ flex: 1, height: '2px', background: '#f0f0f0' }}></div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProductDetail;
