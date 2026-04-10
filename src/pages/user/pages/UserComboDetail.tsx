import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { comboService, ComboDetail } from '../../../services/comboService';
import { ArrowLeft, ShoppingBag, Package, CheckCircle2, Info, ChevronRight, Zap, TrendingDown } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { useCart } from '../../../context/Cart.Context.tsx';

const UserComboDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [combo, setCombo] = useState<ComboDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      comboService.fetchComboById(id)
        .then(setCombo)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Loading />;
  if (!combo) return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Combo không tồn tại.</div>;

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.includes(':5267')) return path.split(':5267')[1];
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleAddToCart = () => {
    addToCart({
      ...combo,
      price: combo.priceSale || combo.price,
      isCombo: true
    } as any);
  };

  const originalTotal = combo.price * 1.3; // Giả lập tổng giá lẻ
  const savings = originalTotal - combo.price;

  return (
    <div className="container" style={{ padding: '20px 20px 80px 20px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#8c8c8c', marginBottom: '30px' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/combos" style={{ color: 'inherit', textDecoration: 'none' }}>Combo ưu đãi</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{combo.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px' }}>
        
        {/* LEFT: COMBO MEDIA & HIGHLIGHTS */}
        <div>
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', border: '1px solid #f0f0f0' }}>
              <img src={getImageUrl(combo.image)} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '15px 25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid white' }}>
                <div style={{ background: '#52c41a', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingDown size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#8c8c8c', fontWeight: 600 }}>TIẾT KIỆM NGAY</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#52c41a' }}>{savings.toLocaleString('vi-VN')} đ</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '20px', background: '#fff7e6', borderRadius: '20px', border: '1px solid #ffe7ba' }}>
                <Zap size={24} color="#fa8c16" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Mua 1 được {combo.products?.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>Trọn bộ trang phục</div>
              </div>
              <div style={{ padding: '20px', background: '#f6ffed', borderRadius: '20px', border: '1px solid #b7eb8f' }}>
                <CheckCircle2 size={24} color="#52c41a" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Giá ưu đãi nhất</div>
                <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>Cam kết rẻ hơn mua lẻ</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INFO & LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f9f0ff', color: '#722ed1', padding: '6px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px' }}>
              <Package size={16} /> GÓI COMBO ĐẶC BIỆT
            </div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', fontWeight: 900, lineHeight: 1.1 }}>{combo.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 950, color: '#ff4d4f' }}>{combo.price.toLocaleString('vi-VN')} đ</span>
              <span style={{ fontSize: '1.5rem', color: '#bfbfbf', textDecoration: 'line-through' }}>{originalTotal.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <div style={{ background: '#fafafa', padding: '30px', borderRadius: '24px', border: '1px solid #f0f0f0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', fontSize: '1.25rem', fontWeight: 800 }}>
              <div style={{ width: '6px', height: '24px', background: '#1890ff', borderRadius: '3px' }}></div>
              Sản phẩm bao gồm
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {combo.products?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '15px', background: 'white', borderRadius: '16px', border: '1px solid #f0f0f0', transition: 'all 0.2s' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                    <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '5px' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#8c8c8c' }}>Số lượng: <strong>{item.quantity}</strong></span>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d9d9d9' }}></span>
                      <span style={{ fontSize: '0.85rem', color: '#52c41a', fontWeight: 600 }}>Có sẵn hàng</span>
                    </div>
                  </div>
                  <div style={{ background: '#e6f7ff', color: '#1890ff', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '25px', background: '#fffbe6', borderRadius: '20px', border: '1px solid #ffe58f', display: 'flex', gap: '15px' }}>
            <Info size={24} color="#faad14" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404', lineHeight: 1.6 }}>
              <strong>Hướng dẫn chọn size:</strong> Sau khi bạn đặt mua combo, đội ngũ chăm sóc khách hàng của TORANO sẽ liên hệ trực tiếp để tư vấn size và màu sắc phù hợp nhất cho từng sản phẩm trong gói.
            </p>
          </div>

          <div>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary" 
              style={{ width: '100%', height: '70px', borderRadius: '15px', fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', boxShadow: '0 15px 30px rgba(24,144,255,0.3)', transition: 'all 0.3s' }}
            >
              <ShoppingBag size={26} /> MUA TRỌN BỘ COMBO
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#8c8c8c' }}>
                <ShieldCheck size={16} /> Thanh toán an toàn
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#8c8c8c' }}>
                <Truck size={16} /> Giao hàng toàn quốc
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComboDetail;
