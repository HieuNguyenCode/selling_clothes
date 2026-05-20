import React, { useState, useEffect } from 'react';
import { productService, ProductList } from '../../../services/productService';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import ProductCard from '../components/ProductCard';
import Pagination from '../../../components/common/Pagination';

const UserProductList = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const pageSize = 12;

  const loadProducts = async (search = '', page = 1, sort = '', asc = false) => {
    setLoading(true);
    try {
      const res = await productService.fetchProducts(search, page, pageSize, sort, asc);
      setProducts(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(searchTerm, currentPage, sortBy, sortAsc);
  }, [currentPage, sortBy, sortAsc]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts(searchTerm, 1, sortBy, sortAsc);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCurrentPage(1);
    if (value === 'newest') {
      setSortBy('Date');
      setSortAsc(false);
    } else if (value === 'price-asc') {
      setSortBy('Price');
      setSortAsc(true);
    } else if (value === 'price-desc') {
      setSortBy('Price');
      setSortAsc(false);
    } else if (value === 'name-asc') {
      setSortBy('Name');
      setSortAsc(true);
    } else if (value === 'name-desc') {
      setSortBy('Name');
      setSortAsc(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0' }}>TẤT CẢ SẢN PHẨM</h1>
          <p style={{ color: '#8c8c8c', margin: 0 }}>Khám phá bộ sưu tập thời trang nam mới nhất từ TORANO</p>
        </div>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8c' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #d9d9d9', outline: 'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0 25px' }}>TÌM</button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Sidebar Filters - Placeholder */}
        <aside style={{ width: '250px', flexShrink: 0, display: 'none', '@media (min-width: 1024px)': { display: 'block' } } as any}>
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '1.1rem' }}>
              <Filter size={18} /> BỘ LỌC
            </h4>
            <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '20px' }}></div>
            {/* Thêm các bộ lọc ở đây */}
            <p style={{ color: '#8c8c8c', fontSize: '0.9rem' }}>Đang cập nhật bộ lọc...</p>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.9rem', color: '#8c8c8c' }}>Hiển thị {products.length} sản phẩm</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.9rem', color: '#8c8c8c', fontWeight: 600 }}>Sắp xếp:</label>
              <div style={{ position: 'relative' }}>
                <select 
                  onChange={handleSortChange}
                  style={{ 
                    appearance: 'none',
                    padding: '8px 35px 8px 15px', 
                    borderRadius: '6px', 
                    border: '1px solid #d9d9d9', 
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontWeight: 500
                  }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
                <SlidersHorizontal size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8c8c8c' }} />
              </div>
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#8c8c8c' }}>
                  Không tìm thấy sản phẩm nào phù hợp.
                </div>
              )}

              <div style={{ marginTop: '50px' }}>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProductList;
