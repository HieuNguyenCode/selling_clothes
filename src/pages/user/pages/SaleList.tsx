import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saleService, Sale } from '../../../services/saleService';
import { Percent, ArrowRight, Calendar, Tag } from 'lucide-react';
import Loading from '../../../components/common/Loading';

const SaleList = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const res = await saleService.fetchSales('', 1, 50);
        setSales(res.data);
      } catch (error) {
        console.error("Failed to load sales", error);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <Percent size={40} color="#ff4d4f" /> Chương Trình Khuyến Mãi
        </h1>
        <p style={{ color: '#8c8c8c', maxWidth: '600px', margin: '0 auto' }}>
          Khám phá những ưu đãi hấp dẫn nhất đang diễn ra tại TORANO. Đừng bỏ lỡ cơ hội sở hữu những sản phẩm chất lượng với giá cực hời!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
        {sales.map(sale => (
          <Link 
            to={`/sale/${sale.id}`} 
            key={sale.id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="sale-card" style={{ 
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', 
              borderRadius: '16px', 
              padding: '30px', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(255, 77, 79, 0.2)',
              transition: 'transform 0.3s'
            }}>
              {/* Background pattern */}
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.15 }}>
                <Percent size={150} />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <Tag size={20} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Sự kiện đang diễn ra</span>
                </div>
                
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 20px 0', fontWeight: 800 }}>{sale.name}</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px', width: 'fit-content' }}>
                  <Calendar size={16} />
                  <span style={{ fontSize: '0.85rem' }}>Xem chi tiết ưu đãi</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
                  XEM NGAY <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sales.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#8c8c8c' }}>
          <p>Hiện tại chưa có chương trình khuyến mãi nào diễn ra.</p>
        </div>
      )}

      <style>{`
        .sale-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default SaleList;
