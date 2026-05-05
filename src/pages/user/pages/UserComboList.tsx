import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { comboService } from '../../../services/comboService';
import { Search, Layers, ChevronRight, ShoppingBag } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import { useCart } from '../../../context/Cart.Context.tsx';

const UserComboList = () => {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const pageSize = 9;

  const loadCombos = async (search = '', page = 1) => {
    setLoading(true);
    try {
      const res = await comboService.fetchCombos(search, page, pageSize);
      setCombos(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Failed to load combos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos(searchTerm, currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCombos(searchTerm, 1);
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--bg-accent)', color: 'var(--text-primary)', padding: '8px 20px', borderRadius: '30px', marginBottom: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
          <Layers size={18} /> SIÊU TIẾT KIỆM
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 15px 0', color: 'var(--text-primary)' }}>COMBO ƯU ĐÃI</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Sở hữu trọn bộ trang phục sành điệu với mức giá không thể hấp dẫn hơn. Tiết kiệm lên đến 30% khi mua theo Combo.</p>
      </div>

      <div style={{ marginBottom: '40px', display: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm gói combo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '30px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 30px', borderRadius: '30px' }}>TÌM KIẾM</button>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {combos.map(combo => (
              <div 
                key={combo.id} 
                className="combo-card" 
                style={{ background: 'var(--bg-primary)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border)', transition: 'all 0.3s', cursor: 'pointer' }}
                onClick={() => navigate(`/combos/${combo.id}`)}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  <img src={combo.image} alt={combo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--accent-color)', color: 'var(--bg-primary)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                    COMBO HOT
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 15px 0', fontWeight: 700, minHeight: '3em', color: 'var(--text-primary)' }}>{combo.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ color: '#ff4d4f', fontWeight: 900, fontSize: '1.5rem' }}>{(combo.priceSale || combo.price).toLocaleString('vi-VN')} đ</div>
                    {combo.priceSale && combo.priceSale < combo.price && (
                      <div style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', fontSize: '0.9rem' }}>{combo.price.toLocaleString('vi-VN')} đ</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1, height: '45px', borderRadius: '10px', fontSize: '0.85rem' }}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(`/combos/${combo.id}`);
                      }}
                    >
                      <ShoppingBag size={18} /> CHỌN OPTION
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, height: '45px', borderRadius: '10px', fontSize: '0.85rem' }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/combos/${combo.id}`); }}
                    >
                      CHI TIẾT <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {combos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '100px 0', color: '#8c8c8c' }}>
              Chưa có gói combo nào được hiển thị.
            </div>
          )}

          <div style={{ marginTop: '60px' }}>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </>
      )}

      <style>{`
        .combo-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
};

export default UserComboList;
