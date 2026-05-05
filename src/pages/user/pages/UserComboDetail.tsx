import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { comboService, ComboDetail } from '../../../services/comboService';
import { ArrowLeft, ShoppingBag, Package, CheckCircle2, Info, ChevronRight, Zap, TrendingDown, Check, ShieldCheck, Truck } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { useCart } from '../../../context/Cart.Context.tsx';

const UserComboDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [combo, setCombo] = useState<ComboDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<number, { size: string; color: string }>>({});
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      comboService.fetchComboById(id)
        .then(data => {
          setCombo(data);
          // Tự động chọn nếu chỉ có 1 option
          const initialSelections: Record<number, { size: string; color: string }> = {};
          data.products.forEach((p, idx) => {
            initialSelections[idx] = {
              size: p.size?.length === 1 ? p.size[0] : '',
              color: p.color?.length === 1 ? p.color[0] : ''
            };
          });
          setSelections(initialSelections);
        })
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

  const handleSelect = (index: number, type: 'size' | 'color', value: string) => {
    setSelections(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value
      }
    }));
    setShowError(false);
  };

  const handleAddToCart = async () => {
    const isAllSelected = combo.products.every((p, idx) => {
      const s = selections[idx];
      const hasSize = !p.size || p.size.length === 0 || (s && s.size);
      const hasColor = !p.color || p.color.length === 0 || (s && s.color);
      return hasSize && hasColor;
    });

    if (!isAllSelected) {
      setShowError(true);
      return alert('Vui lòng chọn đầy đủ kích thước và màu sắc cho tất cả sản phẩm');
    }

    try {
      await addToCart({
        isCombo: true,
        name: combo.name,
        quantity: quantity,
        price: combo.priceSale || combo.price,
        image: combo.image,
        products: combo.products.map((p, idx) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          size: selections[idx]?.size || '',
          color: selections[idx]?.color || '',
          quantity: p.quantity
        }))
      });
      alert('Đã thêm combo vào giỏ hàng');
    } catch (error) {
      alert('Lỗi khi thêm combo vào giỏ hàng');
    }
  };

  const hasSale = combo.priceSale && combo.priceSale < combo.price;
  const currentPrice = combo.priceSale || combo.price;
  const originalTotal = hasSale ? combo.price : combo.price * 1.3; // Giả lập tổng giá lẻ nếu không có sale
  const savings = originalTotal - currentPrice;

  return (
    <div className="container" style={{ padding: '20px 20px 80px 20px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
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
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
              <img src={getImageUrl(combo.image)} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '30px', left: '30px', background: 'var(--bg-primary)', opacity: 0.9, backdropFilter: 'blur(10px)', padding: '15px 25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid var(--border)' }}>
                <div style={{ background: '#52c41a', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingDown size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TIẾT KIỆM NGAY</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#52c41a' }}>{savings > 0 ? savings.toLocaleString('vi-VN') + ' đ' : 'GIÁ TỐT NHẤT'}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <Zap size={24} color="#fa8c16" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Mua 1 được {combo.products?.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Trọn bộ trang phục</div>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                <CheckCircle2 size={24} color="#52c41a" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Giá ưu đãi nhất</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cam kết rẻ hơn mua lẻ</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INFO & LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '6px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '20px' }}>
              <Package size={16} /> GÓI COMBO ĐẶC BIỆT
            </div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', fontWeight: 900, lineHeight: 1.1, color: 'var(--text-primary)' }}>{combo.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 950, color: '#ff4d4f' }}>{currentPrice.toLocaleString('vi-VN')} đ</span>
              {savings > 0 && (
                <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{originalTotal.toLocaleString('vi-VN')} đ</span>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <div style={{ width: '6px', height: '24px', background: 'var(--accent-color)', borderRadius: '3px' }}></div>
              Sản phẩm bao gồm
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {combo.products?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', background: 'var(--bg-primary)', borderRadius: '20px', border: showError && (!selections[idx]?.size || !selections[idx]?.color) ? '1.5px solid #ff4d4f' : '1px solid var(--border)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to={`/products/${item.id}`} style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0, display: 'block', cursor: 'pointer' }}>
                      <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                    <div style={{ flex: 1 }}>
                      <Link to={`/products/${item.id}`} style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '5px', color: 'var(--text-primary)', textDecoration: 'none', display: 'block' }}>{item.name}</Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Số lượng: <strong>{item.quantity}</strong></span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></span>
                        <span style={{ fontSize: '0.85rem', color: '#52c41a', fontWeight: 600 }}>Có sẵn hàng</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    {item.color?.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Màu sắc:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {item.color.map(c => (
                            <button
                              key={c}
                              onClick={() => handleSelect(idx, 'color', c)}
                              style={{
                                padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                border: selections[idx]?.color === c ? '2px solid var(--accent-color)' : '1px solid var(--border)',
                                background: selections[idx]?.color === c ? 'var(--bg-accent)' : 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {item.size?.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>Kích thước:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {item.size.map(s => (
                            <button
                              key={s}
                              onClick={() => handleSelect(idx, 'size', s)}
                              style={{
                                padding: '6px 12px', minWidth: '45px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                                border: selections[idx]?.size === s ? '2px solid var(--accent-color)' : '1px solid var(--border)',
                                background: selections[idx]?.size === s ? 'var(--bg-accent)' : 'var(--bg-primary)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '25px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', gap: '15px' }}>
            <Info size={24} color="var(--accent-color)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>Hướng dẫn mua hàng:</strong> Vui lòng chọn màu sắc và kích thước cho từng sản phẩm trong combo để chúng tôi chuẩn bị đơn hàng chính xác nhất cho bạn.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', background: 'var(--bg-primary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', height: '55px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '45px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>-</button>
              <div style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{quantity}</div>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '45px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary" 
              style={{ flex: 1, height: '55px', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}
            >
              <ShoppingBag size={24} /> MUA COMBO
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} /> Thanh toán an toàn
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Truck size={16} /> Giao hàng toàn quốc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComboDetail;
