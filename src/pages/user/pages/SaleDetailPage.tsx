import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { saleService, SaleDetail } from '../../../services/saleService';
import { Percent, ArrowLeft, Package, Layers, Clock } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import ProductCard from '../components/ProductCard';

const SaleDetailPage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState<SaleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      try {
        const res = await saleService.getSaleDetail(id);
        setDetail(res.data);
      } catch (error) {
        console.error("Failed to load sale detail", error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) return <Loading />;
  if (!detail) return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Sự kiện không tồn tại.</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Link to="/sale" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8c8c8c', textDecoration: 'none', marginBottom: '30px', fontWeight: 600 }}>
        <ArrowLeft size={20} /> QUAY LẠI DANH SÁCH
      </Link>

      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '50px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: 800 }}>{detail.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#ff4d4f', fontWeight: 600 }}>
              <Percent size={20} /> CHƯƠNG TRÌNH ƯU ĐÃI ĐẶC BIỆT
            </div>
          </div>
          <div style={{ background: '#fff1f0', padding: '15px 25px', borderRadius: '12px', border: '1px dashed #ff4d4f' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff4d4f', fontWeight: 700 }}>
              <Clock size={20} /> ĐANG DIỄN RA
            </div>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM SALE */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#e6f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff' }}>
            <Package size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Sản Phẩm Khuyến Mãi</h2>
          <div style={{ height: '2px', flex: 1, background: '#f0f0f0', marginLeft: '20px' }}></div>
        </div>

        {detail.saleProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
            {detail.saleProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  priceSale: product.price, // API trả về price là giá đã sale
                  price: product.price * 1.2 // Giả lập giá gốc để test giao diện
                } as any} 
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px', color: '#8c8c8c' }}>
            Chưa có sản phẩm nào trong mục này.
          </div>
        )}
      </section>

      {/* COMBO SALE */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#722ed1' }}>
            <Layers size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Combo Tiết Kiệm</h2>
          <div style={{ height: '2px', flex: 1, background: '#f0f0f0', marginLeft: '20px' }}></div>
        </div>

        {detail.saleCombos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {detail.saleCombos.map(combo => (
              <div key={combo.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', minHeight: '2.4em' }}>{combo.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#ff4d4f', fontWeight: 800, fontSize: '1.2rem' }}>{combo.price.toLocaleString('vi-VN')} đ</div>
                      <div style={{ color: '#8c8c8c', fontSize: '0.8rem', textDecoration: 'line-through' }}>{(combo.price * 1.3).toLocaleString('vi-VN')} đ</div>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.85rem' }}>XEM CHI TIẾT</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '12px', color: '#8c8c8c' }}>
            Chưa có combo nào trong mục này.
          </div>
        )}
      </section>
    </div>
  );
};

export default SaleDetailPage;
